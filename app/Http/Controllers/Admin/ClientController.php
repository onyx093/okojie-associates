<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\InviteClient;
use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Enums\Role;
use App\Enums\Tier;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\InviteClientRequest;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\StatusEvent;
use App\Models\TaxReturn;
use App\Models\User;
use App\Support\CsvSanitizer;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ClientController extends Controller
{
    /**
     * Display a listing of clients with filters, scope counts, and season metrics.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $user = $request->user();
        $filters = $this->resolveIndexFilters($request, $user);

        $query = $this->buildClientsQuery(
            user: $user,
            search: $filters['search'],
            status: $filters['statusEnum'],
            tier: $filters['tierEnum'],
            scope: $filters['scope'],
        );

        $clients = $query
            ->with(['taxReturns' => function ($q) {
                $q->latest('tax_year')->latest('created_at')->with('preparer', 'invoice');
            }])
            ->latest()
            ->paginate(25)
            ->withQueryString()
            ->through(fn (User $client): array => $this->formatClientRow($client));

        $mineCount = User::query()
            ->where('role', Role::Client)
            ->whereHas('taxReturns', function ($q) use ($user) {
                $q->whereIn('id', $this->latestReturnIdsSubquery())
                    ->where('preparer_id', $user->id);
            })
            ->count();

        $allCount = $user->role === Role::Preparer
            ? $mineCount
            : User::query()->where('role', Role::Client)->count();

        return Inertia::render('admin/clients', [
            'clients' => $clients,
            'filters' => [
                'search' => $filters['search'],
                'status' => $filters['status'],
                'tier' => $filters['tier'],
                'scope' => $filters['scope'],
            ],
            'scopeCounts' => [
                'mine' => $mineCount,
                'all' => $allCount,
            ],
            'statuses' => array_map(fn (ReturnStatus $s): array => [
                'value' => $s->value,
                'label' => $s->label(),
            ], ReturnStatus::cases()),
            'tiers' => array_map(fn (Tier $t): array => [
                'value' => $t->value,
                'label' => $t->label(),
            ], Tier::cases()),
            'metrics' => $this->computeClientMetrics($user),
            'isPreparer' => $user->role === Role::Preparer,
        ]);
    }

    /**
     * Stream a CSV export of the filtered clients visible to the actor.
     */
    public function export(Request $request): StreamedResponse
    {
        Gate::authorize('viewAny', User::class);

        $user = $request->user();
        $filters = $this->resolveIndexFilters($request, $user);

        $clients = $this->buildClientsQuery(
            user: $user,
            search: $filters['search'],
            status: $filters['statusEnum'],
            tier: $filters['tierEnum'],
            scope: $filters['scope'],
        )
            ->with(['taxReturns' => function ($q) {
                $q->latest('tax_year')->latest('created_at')->with('preparer', 'invoice');
            }])
            ->latest()
            ->get();

        $filename = 'clients-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($clients): void {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                return;
            }

            fputcsv($handle, [
                'Name',
                'Email',
                'Phone',
                'Tier',
                'Status',
                'Preparer',
                'Invoice Amount',
                'Invoice Status',
                'Created',
            ]);

            foreach ($clients as $client) {
                $row = $this->formatClientRow($client);

                fputcsv($handle, CsvSanitizer::sanitizeRow([
                    $row['name'],
                    $row['email'],
                    $row['phone'] ?? '',
                    $row['tierLabel'],
                    $row['returnStatusLabel'],
                    $row['preparerName'],
                    $row['invoiceAmount'],
                    $row['invoiceStatus'] ?? 'awaiting_quote',
                    $row['createdAt'] ?? '',
                ]));
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Invite a new client, creating their User, current-year TaxReturn, and Invoice,
     * and dispatching a queued ClientInvitation notification.
     */
    public function invite(InviteClientRequest $request, InviteClient $action): RedirectResponse
    {
        /** @var array{name: string, email: string, tier?: string|null, preparer_id?: int|string|null} $validated */
        $validated = $request->validated();

        $tier = isset($validated['tier'])
            ? Tier::tryFrom($validated['tier'])
            : null;
        $preparerId = isset($validated['preparer_id']) ? (int) $validated['preparer_id'] : null;

        $result = $action->execute(
            name: $validated['name'],
            email: $validated['email'],
            byUser: $request->user(),
            tier: $tier,
            preparerId: $preparerId,
            sendInvitation: true,
        );

        $user = $result['user'];
        $taxReturn = $result['taxReturn'];

        AuditLog::record(
            action: 'admin.client_invited',
            entity: 'User',
            meta: [
                'client_id' => $user->id,
                'email' => $user->email,
                'tax_return_id' => $taxReturn->id,
                'tier' => $user->tier?->value,
                'preparer_id' => $taxReturn->preparer_id,
            ],
            entityId: (string) $user->id,
        );

        return redirect()->route('admin.clients.show', $user)
            ->with('success', "Invitation sent to {$user->name}.");
    }

    /**
     * Display a specific client's workspace.
     */
    public function show(Request $request, User $client): Response
    {
        Gate::authorize('view', $client);

        // Every admin read of client data writes an AuditLog entry
        AuditLog::record(
            action: 'admin.client_viewed',
            entity: 'User',
            meta: [
                'client_id' => $client->id,
                'email' => $client->email,
            ],
            entityId: (string) $client->id,
        );

        $taxYear = (int) date('Y');
        $taxReturn = $client->taxReturns()
            ->with(['statusEvents.byUser', 'invoice', 'preparer'])
            ->latest('tax_year')
            ->first();

        // If no tax return exists yet, create one for current tax year
        if (! $taxReturn) {
            $taxReturn = TaxReturn::create([
                'user_id' => $client->id,
                'tax_year' => $taxYear,
                'tier' => $client->tier ?? Tier::UploadAndGo,
                'status' => ReturnStatus::IntakeReceived,
                'preparer_id' => $request->user()->role === Role::Preparer ? $request->user()->id : null,
            ]);
            $taxReturn->load(['statusEvents.byUser', 'invoice', 'preparer']);
        }

        $documents = Document::where('user_id', $client->id)
            ->latest()
            ->get()
            ->map(fn (Document $d): array => [
                'id' => $d->id,
                'fileName' => $d->filename,
                'docType' => $d->type->value,
                'docTypeLabel' => $d->type->label(),
                'fileSizeBytes' => $d->size_bytes,
                'formattedSize' => $d->formattedSize(),
                'scanStatus' => $d->scan_status->value,
                'scanStatusLabel' => $d->scan_status->label(),
                'createdAt' => $d->created_at?->format('M j, Y g:i A'),
                'downloadUrl' => route('portal.documents.download', $d),
            ]);

        $appointments = Appointment::where('user_id', $client->id)
            ->latest('preferred_date')
            ->get()
            ->map(fn (Appointment $a): array => [
                'id' => $a->id,
                'preferredDate' => $a->preferred_date->format('M j, Y'),
                'timeWindow' => $a->time_window->label(),
                'format' => $a->format->label(),
                'topic' => $a->topic,
                'notes' => $a->notes,
                'status' => $a->status->value,
                'statusLabel' => $a->status->label(),
                'createdAt' => $a->created_at?->format('M j, Y g:i A'),
            ]);

        $messages = Message::where(function ($q) use ($client) {
            $q->where('to_user_id', $client->id)
                ->orWhere('from_user_id', $client->id);
        })
            ->with(['fromUser', 'toUser', 'attachments'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn (Message $m): array => [
                'id' => $m->id,
                'fromUserId' => $m->from_user_id,
                'toUserId' => $m->to_user_id,
                'fromName' => $m->from_user_id === $client->id ? $client->name : ($m->fromUser?->name ?: 'Staff'),
                'isFromStaff' => $m->from_user_id !== $client->id,
                'body' => $m->body,
                'readAt' => $m->read_at?->toISOString(),
                'formattedDate' => $m->created_at?->format('M j, Y g:i A') ?? '',
                'attachments' => $m->attachments->map(fn (MessageAttachment $a): array => [
                    'id' => $a->id,
                    'filename' => $a->filename,
                    'size_formatted' => $a->formattedSize(),
                    'download_url' => route('admin.messages.attachments.download', $a),
                ])->values()->all(),
            ]);

        $referrals = $client->referrals()
            ->with('friendUser')
            ->latest()
            ->get()
            ->map(fn ($r): array => [
                'id' => $r->id,
                'friendName' => $r->friend_name,
                'friendEmail' => $r->friend_email,
                'status' => $r->status->value,
                'statusLabel' => $r->status->label(),
                'reward' => $r->reward_cents ? '$'.number_format($r->reward_cents / 100, 2) : 'Pending',
                'createdAt' => $r->created_at?->format('M j, Y'),
            ]);

        $preparers = User::whereIn('role', [Role::Preparer, Role::Admin])
            ->get(['id', 'name', 'email', 'role'])
            ->map(fn (User $u): array => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role->label(),
            ]);

        $allStatuses = array_map(fn (ReturnStatus $s): array => [
            'value' => $s->value,
            'label' => $s->label(),
            'order' => $s->order(),
        ], ReturnStatus::cases());

        $allTiers = array_map(fn (Tier $t): array => [
            'value' => $t->value,
            'label' => $t->label(),
        ], Tier::cases());

        return Inertia::render('admin/client-show', [
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
                'tier' => $client->tier?->value,
                'tierLabel' => $client->tier?->label() ?? 'No tier selected',
                'referralCode' => $client->referral_code,
                'referredByCode' => $client->referred_by_code,
                'createdAt' => $client->created_at?->format('M j, Y'),
            ],
            'taxReturn' => [
                'id' => $taxReturn->id,
                'taxYear' => $taxReturn->tax_year,
                'status' => $taxReturn->status->value,
                'statusLabel' => $taxReturn->status->label(),
                'statusOrder' => $taxReturn->status->order(),
                'preparerId' => $taxReturn->preparer_id,
                'preparerName' => $taxReturn->preparer->name ?? 'Unassigned',
                'signedAt' => $taxReturn->signed_at?->format('M j, Y g:i A'),
                'filedAt' => $taxReturn->filed_at?->format('M j, Y g:i A'),
                'returnSummary' => $taxReturn->return_summary,
                'invoice' => $taxReturn->invoice ? [
                    'id' => $taxReturn->invoice->id,
                    'amountCents' => $taxReturn->invoice->amount_cents,
                    'amountDollars' => $taxReturn->invoice->amount_cents ? number_format($taxReturn->invoice->amount_cents / 100, 2, '.', '') : '',
                    'formattedAmount' => $taxReturn->invoice->amount_cents ? '$'.number_format($taxReturn->invoice->amount_cents / 100, 2) : 'Awaiting quote',
                    'status' => $taxReturn->invoice->status->value,
                    'statusLabel' => $taxReturn->invoice->status->label(),
                    'isPaid' => $taxReturn->invoice->status === InvoiceStatus::Paid,
                    'paidAt' => $taxReturn->invoice->paid_at?->format('M j, Y g:i A'),
                ] : null,
                'statusEvents' => $taxReturn->statusEvents->sortByDesc('created_at')->values()->map(fn ($e): array => [
                    'id' => $e->id,
                    'from' => $e->from?->label(),
                    'to' => $e->to->label(),
                    'byUserName' => $e->byUser->name ?? 'System',
                    'reason' => $e->reason,
                    'createdAt' => $e->created_at?->format('M j, Y g:i A'),
                ]),
            ],
            'documents' => $documents,
            'appointments' => $appointments,
            'messages' => $messages,
            'referrals' => $referrals,
            'preparers' => $preparers,
            'allStatuses' => $allStatuses,
            'allTiers' => $allTiers,
            'returnSummary' => $taxReturn->return_summary,
            'summaryOptions' => TaxReturn::summaryOptionLists(),
        ]);
    }

    /**
     * Update client tier.
     */
    public function updateTier(Request $request, User $client): RedirectResponse
    {
        Gate::authorize('update', $client);

        $validated = $request->validate([
            'tier' => ['required', Rule::enum(Tier::class)],
        ]);

        $newTier = Tier::from($validated['tier']);
        $client->update(['tier' => $newTier]);

        // Also update latest tax return tier
        $taxReturn = $client->taxReturns()->latest('tax_year')->first();
        if ($taxReturn) {
            $taxReturn->update(['tier' => $newTier]);
        }

        AuditLog::record(
            action: 'admin.client_tier_updated',
            entity: 'User',
            meta: ['tier' => $newTier->value],
            entityId: (string) $client->id,
        );

        return back()->with('success', "Client tier updated to {$newTier->label()}.");
    }

    /**
     * Assign or reassign preparer to the client's tax return.
     */
    public function assignPreparer(Request $request, User $client): RedirectResponse
    {
        Gate::authorize('update', $client);

        $validated = $request->validate([
            'preparer_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $taxReturn = $client->taxReturns()->latest('tax_year')->first();
        if ($taxReturn) {
            $taxReturn->update(['preparer_id' => $validated['preparer_id']]);

            AuditLog::record(
                action: 'admin.preparer_assigned',
                entity: 'TaxReturn',
                meta: ['preparer_id' => $validated['preparer_id']],
                entityId: $taxReturn->id,
            );
        }

        return back()->with('success', 'Preparer assignment updated.');
    }

    /**
     * Normalize and validate index/export query parameters.
     *
     * @return array{
     *     search: string,
     *     status: string,
     *     statusEnum: ReturnStatus|null,
     *     tier: string,
     *     tierEnum: Tier|null,
     *     scope: 'mine'|'all'
     * }
     */
    private function resolveIndexFilters(Request $request, User $user): array
    {
        $search = is_string($request->query('search')) ? trim($request->query('search')) : '';

        $statusParam = is_string($request->query('status')) ? $request->query('status') : '';
        $statusEnum = ReturnStatus::tryFrom($statusParam);

        $tierParam = is_string($request->query('tier')) ? $request->query('tier') : '';
        $tierEnum = Tier::tryFrom($tierParam);

        $defaultScope = $user->role === Role::Preparer ? 'mine' : 'all';
        $requestedScope = is_string($request->query('scope')) ? $request->query('scope') : $defaultScope;
        $scope = $user->role === Role::Preparer
            ? 'mine'
            : ($requestedScope === 'mine' ? 'mine' : 'all');

        return [
            'search' => $search,
            'status' => $statusEnum !== null ? $statusEnum->value : '',
            'statusEnum' => $statusEnum,
            'tier' => $tierEnum !== null ? $tierEnum->value : '',
            'tierEnum' => $tierEnum,
            'scope' => $scope,
        ];
    }

    /**
     * Build the filtered client query respecting actor visibility and filter parameters.
     *
     * @return Builder<User>
     */
    private function buildClientsQuery(
        User $user,
        string $search,
        ?ReturnStatus $status,
        ?Tier $tier,
        string $scope,
    ): Builder {
        $query = User::query()->where('role', Role::Client);

        if ($user->role === Role::Preparer || $scope === 'mine') {
            $query->whereHas('taxReturns', function ($q) use ($user) {
                $q->whereIn('id', $this->latestReturnIdsSubquery())
                    ->where('preparer_id', $user->id);
            });
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        if ($status !== null) {
            $query->whereHas('taxReturns', function ($q) use ($status) {
                $q->whereIn('id', $this->latestReturnIdsSubquery())
                    ->where('status', $status);
            });
        }

        if ($tier !== null) {
            $query->where(function (Builder $q) use ($tier) {
                $q->where('tier', $tier)
                    ->orWhere(function (Builder $q2) use ($tier) {
                        $q2->whereNull('tier')
                            ->whereHas('taxReturns', fn (Builder $tr) => $tr
                                ->whereIn('id', $this->latestReturnIdsSubquery())
                                ->where('tier', $tier)
                            );
                    });
            });
        }

        return $query;
    }

    /**
     * Subquery returning the ID of each client's most recent tax return.
     *
     * @return Builder<TaxReturn>
     */
    private function latestReturnIdsSubquery(): Builder
    {
        return TaxReturn::query()
            ->selectRaw('DISTINCT ON (user_id) id')
            ->orderBy('user_id')
            ->orderByDesc('tax_year')
            ->orderByDesc('created_at');
    }

    /**
     * Format a single client row for the table or CSV export.
     *
     * @return array{
     *     id: int,
     *     name: string,
     *     email: string,
     *     phone: string|null,
     *     tier: string|null,
     *     tierLabel: string,
     *     returnStatus: string|null,
     *     returnStatusLabel: string,
     *     preparerName: string,
     *     preparerId: int|null,
     *     invoiceStatus: string|null,
     *     invoiceAmount: string,
     *     createdAt: string|null
     * }
     */
    private function formatClientRow(User $client): array
    {
        /** @var TaxReturn|null $latestReturn */
        $latestReturn = $client->taxReturns->first();
        $effectiveTier = $client->tier ?? $latestReturn?->tier;

        return [
            'id' => $client->id,
            'name' => $client->name,
            'email' => $client->email,
            'phone' => $client->phone,
            'tier' => $effectiveTier?->value,
            'tierLabel' => $effectiveTier?->label() ?? 'No tier selected',
            'returnStatus' => $latestReturn?->status->value,
            'returnStatusLabel' => $latestReturn?->status->label() ?? 'None',
            'preparerName' => $latestReturn?->preparer->name ?? 'Unassigned',
            'preparerId' => $latestReturn?->preparer_id,
            'invoiceStatus' => $latestReturn?->invoice?->status->value,
            'invoiceAmount' => $latestReturn?->invoice?->amount_cents
                ? '$'.number_format($latestReturn->invoice->amount_cents / 100, 2)
                : 'Awaiting quote',
            'createdAt' => $client->created_at?->format('M j, Y'),
        ];
    }

    /**
     * Compute season metrics within the actor's visibility.
     *
     * @return array{
     *     inPreparation: array{count: int, deltaWeek: int},
     *     waitingSignature: array{count: int, oldestDays: int},
     *     unpaid: array{amountCents: int, amountFormatted: string, count: int},
     *     eFiled: array{count: int, deltaWeek: int}
     * }
     */
    private function computeClientMetrics(User $user): array
    {
        $visibleReturns = TaxReturn::query()
            ->whereIn('id', $this->latestReturnIdsSubquery())
            ->whereHas('user', fn ($q) => $q->where('role', Role::Client))
            ->when($user->role === Role::Preparer, fn ($q) => $q->where('preparer_id', $user->id))
            ->with(['statusEvents', 'invoice'])
            ->get();

        $now = now();
        $thisWeekStart = $now->copy()->subDays(7);
        $prevWeekStart = $now->copy()->subDays(14);

        $inPrepReturns = $visibleReturns->where('status', ReturnStatus::InPreparation);
        $inPrepThisWeek = $inPrepReturns->filter(function (TaxReturn $return) use ($thisWeekStart): bool {
            $ts = $this->stageTimestamp($return, ReturnStatus::InPreparation);

            return $ts !== null && $ts->greaterThanOrEqualTo($thisWeekStart);
        })->count();
        $inPrepPrevWeek = $inPrepReturns->filter(function (TaxReturn $return) use ($thisWeekStart, $prevWeekStart): bool {
            $ts = $this->stageTimestamp($return, ReturnStatus::InPreparation);

            return $ts !== null && $ts->greaterThanOrEqualTo($prevWeekStart) && $ts->lessThan($thisWeekStart);
        })->count();

        $waitingReturns = $visibleReturns->where('status', ReturnStatus::ReadyForReview);
        $oldestDays = 0;
        foreach ($waitingReturns as $waitingReturn) {
            $ts = $this->stageTimestamp($waitingReturn, ReturnStatus::ReadyForReview);
            if ($ts !== null) {
                $days = (int) max(0, floor($ts->diffInDays($now)));
                if ($days > $oldestDays) {
                    $oldestDays = $days;
                }
            }
        }

        $unpaidCount = 0;
        $unpaidAmountCents = 0;
        foreach ($visibleReturns as $visibleReturn) {
            $invoice = $visibleReturn->invoice;
            if ($invoice instanceof Invoice && $invoice->status === InvoiceStatus::Open) {
                $unpaidCount++;
                $unpaidAmountCents += (int) ($invoice->amount_cents ?? 0);
            }
        }
        $unpaidDecimals = $unpaidAmountCents % 100 === 0 ? 0 : 2;
        $unpaidFormatted = '$'.number_format($unpaidAmountCents / 100, $unpaidDecimals);

        $eFiledReturns = $visibleReturns->where('status', ReturnStatus::EFiled);
        $eFiledThisWeek = $eFiledReturns->filter(function (TaxReturn $return) use ($thisWeekStart): bool {
            $ts = $return->filed_at ?? $this->stageTimestamp($return, ReturnStatus::EFiled);

            return $ts !== null && $ts->greaterThanOrEqualTo($thisWeekStart);
        })->count();
        $eFiledPrevWeek = $eFiledReturns->filter(function (TaxReturn $return) use ($thisWeekStart, $prevWeekStart): bool {
            $ts = $return->filed_at ?? $this->stageTimestamp($return, ReturnStatus::EFiled);

            return $ts !== null && $ts->greaterThanOrEqualTo($prevWeekStart) && $ts->lessThan($thisWeekStart);
        })->count();

        return [
            'inPreparation' => [
                'count' => $inPrepReturns->count(),
                'deltaWeek' => $inPrepThisWeek - $inPrepPrevWeek,
            ],
            'waitingSignature' => [
                'count' => $waitingReturns->count(),
                'oldestDays' => $oldestDays,
            ],
            'unpaid' => [
                'amountCents' => $unpaidAmountCents,
                'amountFormatted' => $unpaidFormatted,
                'count' => $unpaidCount,
            ],
            'eFiled' => [
                'count' => $eFiledReturns->count(),
                'deltaWeek' => $eFiledThisWeek - $eFiledPrevWeek,
            ],
        ];
    }

    /**
     * Resolve the timestamp when a return entered the given status.
     */
    private function stageTimestamp(TaxReturn $return, ReturnStatus $status): ?CarbonInterface
    {
        /** @var StatusEvent|null $event */
        $event = $return->statusEvents
            ->where('to', $status)
            ->sortByDesc('created_at')
            ->first();

        return ($event !== null ? $event->created_at : null) ?? $return->updated_at ?? $return->created_at;
    }
}
