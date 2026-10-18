<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LeadKind;
use App\Enums\LeadStatus;
use App\Enums\ReturnStatus;
use App\Enums\Role;
use App\Enums\Tier;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\TaxReturn;
use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    /**
     * Display a listing of leads with filters.
     */
    public function index(Request $request): Response
    {
        $kind = $request->query('kind');
        $status = $request->query('status');

        $query = Lead::query()->latest();

        if ($kind && LeadKind::tryFrom($kind)) {
            $query->where('kind', $kind);
        }

        if ($status && LeadStatus::tryFrom($status)) {
            $query->where('status', $status);
        }

        $leads = $query->paginate(25)->through(fn (Lead $lead): array => [
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
        ]);

        return Inertia::render('admin/leads', [
            'leads' => $leads,
            'filters' => [
                'kind' => $kind ?? '',
                'status' => $status ?? '',
            ],
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
     * Convert lead into a client user with an active tax return.
     */
    public function convert(Request $request, Lead $lead): RedirectResponse
    {
        $email = strtolower(trim($lead->email));

        $user = User::where('email', $email)->first();

        if (! $user) {
            $user = new User([
                'name' => $lead->name,
                'email' => $email,
                'phone' => $lead->phone,
                'password' => Hash::make(Str::random(32)),
                'role' => Role::Client,
                'tier' => Tier::tryFrom($lead->tier_interest ?? '') ?? Tier::UploadAndGo,
                'referral_code' => UserFactory::generateReferralCode(),
                'referred_by_code' => $lead->ref_code,
            ]);
            $user->email_verified_at = now();
            $user->save();
        }

        $taxYear = (int) date('Y');
        $taxReturn = TaxReturn::firstOrCreate(
            [
                'user_id' => $user->id,
                'tax_year' => $taxYear,
            ],
            [
                'tier' => $user->tier ?? Tier::UploadAndGo,
                'status' => ReturnStatus::IntakeReceived,
                'preparer_id' => $request->user()->role === Role::Preparer ? $request->user()->id : null,
            ]
        );

        $lead->update(['status' => LeadStatus::Converted]);

        AuditLog::record(
            action: 'admin.lead_converted',
            entity: 'Lead',
            meta: [
                'client_id' => $user->id,
                'tax_return_id' => $taxReturn->id,
            ],
            entityId: $lead->id,
        );

        return redirect()->route('admin.clients.show', $user)->with('success', "Lead converted to client {$user->name}.");
    }
}
