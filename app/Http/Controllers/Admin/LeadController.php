<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\InviteClient;
use App\Enums\LeadKind;
use App\Enums\LeadStatus;
use App\Enums\Role;
use App\Enums\Tier;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\User;
use App\Support\CsvSanitizer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadController extends Controller
{
    /**
     * Display a listing of leads with filters, status counts, and preparers list.
     */
    public function index(Request $request): Response
    {
        $filters = $this->resolveFilters($request);

        $query = $this->buildLeadsQuery(
            kind: $filters['kindEnum'],
            status: $filters['statusEnum'],
            search: $filters['search'],
        );

        $leads = $query
            ->paginate(25)
            ->withQueryString()
            ->through(fn (Lead $lead): array => $this->formatLeadRow($lead));

        $rawCounts = Lead::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $newCount = (int) ($rawCounts[LeadStatus::New->value] ?? 0);
        $contactedCount = (int) ($rawCounts[LeadStatus::Contacted->value] ?? 0);
        $convertedCount = (int) ($rawCounts[LeadStatus::Converted->value] ?? 0);
        $closedCount = (int) ($rawCounts[LeadStatus::Closed->value] ?? 0);

        $preparers = User::query()
            ->whereIn('role', [Role::Preparer, Role::Admin])
            ->get(['id', 'name', 'email', 'role'])
            ->map(fn (User $u): array => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role->label(),
            ])
            ->values()
            ->all();

        return Inertia::render('admin/leads', [
            'leads' => $leads,
            'filters' => [
                'kind' => $filters['kind'],
                'status' => $filters['status'],
                'search' => $filters['search'],
            ],
            'counts' => [
                'new' => $newCount,
                'contacted' => $contactedCount,
                'converted' => $convertedCount,
                'closed' => $closedCount,
                'all' => $newCount + $contactedCount + $convertedCount + $closedCount,
            ],
            'preparers' => $preparers,
            'kinds' => array_map(fn (LeadKind $k): array => [
                'value' => $k->value,
                'label' => $k->label(),
            ], LeadKind::cases()),
            'statuses' => array_map(fn (LeadStatus $s): array => [
                'value' => $s->value,
                'label' => $s->label(),
            ], LeadStatus::cases()),
        ]);
    }

    /**
     * Stream a CSV export of the filtered leads.
     */
    public function export(Request $request): StreamedResponse
    {
        $filters = $this->resolveFilters($request);

        $leads = $this->buildLeadsQuery(
            kind: $filters['kindEnum'],
            status: $filters['statusEnum'],
            search: $filters['search'],
        )->get();

        $filename = 'leads-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($leads): void {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                return;
            }

            fputcsv($handle, [
                'Name',
                'Email',
                'Phone',
                'Kind',
                'Tier Interest',
                'Situation',
                'Preferred Date',
                'Time Window',
                'Format',
                'Ref Code',
                'Status',
                'Notes',
                'Created',
            ]);

            foreach ($leads as $lead) {
                $row = $this->formatLeadRow($lead);

                fputcsv($handle, CsvSanitizer::sanitizeRow([
                    $row['name'],
                    $row['email'],
                    $row['phone'] ?? '',
                    $row['kindLabel'],
                    $row['tierInterest'] ?? '',
                    $row['situation'] ?? '',
                    $row['preferredDate'] ?? '',
                    $row['timeWindow'] ?? '',
                    $row['format'] ?? '',
                    $row['refCode'] ?? '',
                    $row['statusLabel'],
                    $row['notes'] ?? '',
                    $row['createdAt'] ?? '',
                ]));
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Update the lead's status.
     */
    public function updateStatus(Request $request, Lead $lead): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::enum(LeadStatus::class)],
        ]);

        $newStatus = LeadStatus::from($validated['status']);
        $oldStatus = $lead->status;
        $lead->update(['status' => $newStatus]);

        AuditLog::record(
            action: 'admin.lead_status_updated',
            entity: 'Lead',
            meta: [
                'from' => $oldStatus->value,
                'to' => $newStatus->value,
            ],
            entityId: $lead->id,
        );

        return back()->with('success', "Lead marked as {$newStatus->label()}.");
    }

    /**
     * Update internal notes for a lead.
     */
    public function updateNotes(Request $request, Lead $lead): RedirectResponse
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $lead->update(['notes' => $validated['notes'] ?? null]);

        AuditLog::record(
            action: 'admin.lead_notes_updated',
            entity: 'Lead',
            meta: ['has_notes' => ! empty($validated['notes'])],
            entityId: $lead->id,
        );

        return back()->with('success', 'Notes saved.');
    }

    /**
     * Convert lead into a client user with an active tax return and invoice,
     * and send a queued ClientInvitation notification.
     */
    public function convert(Request $request, Lead $lead, InviteClient $inviteClient): RedirectResponse
    {
        if ($lead->status === LeadStatus::Converted) {
            return back()->withErrors([
                'lead' => 'This lead has already been converted.',
            ]);
        }

        $actor = $request->user();
        $preparerRule = $actor->role === Role::Preparer
            ? Rule::in([$actor->id])
            : Rule::exists('users', 'id')->whereIn('role', [Role::Preparer->value, Role::Admin->value]);

        /** @var array{preparer_id?: int|string|null} $validated */
        $validated = $request->validate([
            'preparer_id' => ['nullable', 'integer', $preparerRule],
        ]);

        $preparerId = isset($validated['preparer_id']) ? (int) $validated['preparer_id'] : null;

        $result = $inviteClient->execute(
            name: $lead->name,
            email: $lead->email,
            byUser: $actor,
            tier: Tier::tryFrom($lead->tier_interest ?? '') ?? Tier::UploadAndGo,
            preparerId: $preparerId,
            phone: $lead->phone,
            referredByCode: $lead->ref_code,
            sendInvitation: true,
        );

        $user = $result['user'];
        $taxReturn = $result['taxReturn'];

        $lead->update(['status' => LeadStatus::Converted]);

        AuditLog::record(
            action: 'admin.lead_converted',
            entity: 'Lead',
            meta: [
                'client_id' => $user->id,
                'tax_return_id' => $taxReturn->id,
                'preparer_id' => $taxReturn->preparer_id,
            ],
            entityId: $lead->id,
        );

        return redirect()->route('admin.clients.show', $user)->with('success', "Lead converted to client {$user->name}.");
    }

    /**
     * Normalize and validate lead filter query parameters.
     *
     * @return array{
     *     kind: string,
     *     kindEnum: LeadKind|null,
     *     status: string,
     *     statusEnum: LeadStatus|null,
     *     search: string
     * }
     */
    private function resolveFilters(Request $request): array
    {
        $kindParam = is_string($request->query('kind')) ? $request->query('kind') : '';
        $kindEnum = LeadKind::tryFrom($kindParam);

        $statusParam = is_string($request->query('status')) ? $request->query('status') : '';
        $statusEnum = LeadStatus::tryFrom($statusParam);

        $search = is_string($request->query('search')) ? trim($request->query('search')) : '';

        return [
            'kind' => $kindEnum !== null ? $kindEnum->value : '',
            'kindEnum' => $kindEnum,
            'status' => $statusEnum !== null ? $statusEnum->value : '',
            'statusEnum' => $statusEnum,
            'search' => $search,
        ];
    }

    /**
     * Build the filtered leads query with LIKE-safe search.
     *
     * @return Builder<Lead>
     */
    private function buildLeadsQuery(
        ?LeadKind $kind,
        ?LeadStatus $status,
        string $search,
    ): Builder {
        $query = Lead::query()->latest();

        if ($kind !== null) {
            $query->where('kind', $kind);
        }

        if ($status !== null) {
            $query->where('status', $status);
        }

        if ($search !== '') {
            $escaped = addcslashes($search, '%_\\');
            $pattern = "%{$escaped}%";

            $query->where(function (Builder $q) use ($pattern) {
                $q->whereRaw('name ILIKE ? ESCAPE \'\\\'', [$pattern])
                    ->orWhereRaw('email ILIKE ? ESCAPE \'\\\'', [$pattern])
                    ->orWhereRaw('phone ILIKE ? ESCAPE \'\\\'', [$pattern])
                    ->orWhereRaw('ref_code ILIKE ? ESCAPE \'\\\'', [$pattern]);
            });
        }

        return $query;
    }

    /**
     * Format a lead model for the Inertia table or CSV export.
     *
     * @return array{
     *     id: string,
     *     kind: string,
     *     kindLabel: string,
     *     name: string,
     *     email: string,
     *     phone: string|null,
     *     tierInterest: string|null,
     *     situation: string|null,
     *     preferredDate: string|null,
     *     timeWindow: string|null,
     *     format: string|null,
     *     notes: string|null,
     *     refCode: string|null,
     *     status: string,
     *     statusLabel: string,
     *     createdAt: string|null
     * }
     */
    private function formatLeadRow(Lead $lead): array
    {
        return [
            'id' => $lead->id,
            'kind' => $lead->kind->value,
            'kindLabel' => $lead->kind->label(),
            'name' => $lead->name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'tierInterest' => $lead->tier_interest,
            'situation' => $lead->situation,
            'preferredDate' => $lead->preferred_date?->format('Y-m-d'),
            'timeWindow' => $lead->time_window?->label(),
            'format' => $lead->format?->label(),
            'notes' => $lead->notes,
            'refCode' => $lead->ref_code,
            'status' => $lead->status->value,
            'statusLabel' => $lead->status->label(),
            'createdAt' => $lead->created_at?->format('M j, Y g:i A'),
        ];
    }
}
