<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Enums\Role;
use App\Enums\Tier;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\Message;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of clients.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $user = $request->user();
        $search = $request->query('search');

        $query = User::query()->where('role', Role::Client);

        // Preparers see assigned clients only; Admins see all
        if ($user->role === Role::Preparer) {
            $query->whereHas('taxReturns', function ($q) use ($user) {
                $q->where('preparer_id', $user->id);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        $clients = $query->with(['taxReturns' => function ($q) {
            $q->latest('tax_year')->with('preparer', 'invoice');
        }])->latest()->paginate(25)->through(function (User $client): array {
            $latestReturn = $client->taxReturns->first();

            return [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
                'tier' => $client->tier?->value,
                'tierLabel' => $client->tier?->label() ?? 'No tier selected',
                'returnStatus' => $latestReturn?->status->value,
                'returnStatusLabel' => $latestReturn?->status->label() ?? 'None',
                'preparerName' => $latestReturn?->preparer->name ?? 'Unassigned',
                'preparerId' => $latestReturn?->preparer_id,
                'invoiceStatus' => $latestReturn?->invoice?->status->value,
                'invoiceAmount' => $latestReturn?->invoice?->amount_cents ? '$'.number_format($latestReturn->invoice->amount_cents / 100, 2) : 'Awaiting quote',
                'createdAt' => $client->created_at?->format('M j, Y'),
            ];
        });

        return Inertia::render('admin/clients', [
            'clients' => $clients,
            'filters' => [
                'search' => $search ?? '',
            ],
            'isPreparer' => $user->role === Role::Preparer,
        ]);
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
            ->with(['fromUser', 'toUser'])
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
}
