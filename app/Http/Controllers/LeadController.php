<?php

namespace App\Http\Controllers;

use App\Enums\ApptFormat;
use App\Enums\LeadKind;
use App\Enums\LeadStatus;
use App\Enums\TimeWindow;
use App\Http\Requests\LeadConsultRequest;
use App\Http\Requests\LeadQuoteRequest;
use App\Mail\LeadConfirmation;
use App\Mail\LeadReceived;
use App\Models\AuditLog;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class LeadController extends Controller
{
    /**
     * Store a new quote request lead.
     */
    public function quote(LeadQuoteRequest $request): RedirectResponse
    {
        /** @var string|null $cookieRef */
        $cookieRef = $request->cookie('okojie_referral');
        /** @var string|null $inputRef */
        $inputRef = $request->input('ref');
        $refCode = $inputRef ?: $cookieRef;

        /** @var string $name */
        $name = $request->validated('name');
        /** @var string $email */
        $email = $request->validated('email');
        /** @var string|null $phone */
        $phone = $request->validated('phone');
        /** @var string|null $tierInterest */
        $tierInterest = $request->validated('tier_interest');
        /** @var string|null $situation */
        $situation = $request->validated('situation');

        $lead = Lead::create([
            'kind' => LeadKind::Quote,
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'tier_interest' => $tierInterest,
            'situation' => $situation,
            'ref_code' => $refCode,
            'status' => LeadStatus::New,
        ]);

        AuditLog::record(
            action: 'lead.quote_submitted',
            entity: 'Lead',
            meta: [
                'lead_id' => $lead->id,
                'email' => $lead->email,
                'tier_interest' => $lead->tier_interest,
            ],
            entityId: $lead->id
        );

        $staffEmail = (string) config('site.contact.staff_email', 'staff@okojieonline.com');
        Mail::to($staffEmail)->queue(new LeadReceived($lead));
        Mail::to($lead->email)->queue(new LeadConfirmation($lead));

        $firstName = explode(' ', trim($lead->name))[0];

        return back()->with('success', "Thanks, {$firstName}! A preparer will follow up within one business day.");
    }

    /**
     * Store a new consultation request lead.
     */
    public function consult(LeadConsultRequest $request): RedirectResponse
    {
        /** @var string|null $cookieRef */
        $cookieRef = $request->cookie('okojie_referral');
        /** @var string|null $inputRef */
        $inputRef = $request->input('ref');
        $refCode = $inputRef ?: $cookieRef;

        /** @var string $name */
        $name = $request->validated('name');
        /** @var string $email */
        $email = $request->validated('email');
        /** @var string|null $phone */
        $phone = $request->validated('phone');
        /** @var string $preferredDate */
        $preferredDate = $request->validated('preferred_date');
        /** @var TimeWindow|string $timeWindow */
        $timeWindow = $request->validated('time_window');
        /** @var ApptFormat|string $format */
        $format = $request->validated('format');
        /** @var string|null $notes */
        $notes = $request->validated('notes');

        $lead = Lead::create([
            'kind' => LeadKind::Consult,
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'preferred_date' => $preferredDate,
            'time_window' => $timeWindow,
            'format' => $format,
            'notes' => $notes,
            'ref_code' => $refCode,
            'status' => LeadStatus::New,
        ]);

        AuditLog::record(
            action: 'lead.consult_submitted',
            entity: 'Lead',
            meta: [
                'lead_id' => $lead->id,
                'email' => $lead->email,
                'preferred_date' => (string) $lead->preferred_date,
            ],
            entityId: $lead->id
        );

        $staffEmail = (string) config('site.contact.staff_email', 'staff@okojieonline.com');
        Mail::to($staffEmail)->queue(new LeadReceived($lead));
        Mail::to($lead->email)->queue(new LeadConfirmation($lead));

        return back()->with('success', "Request received. We'll confirm your consultation by email shortly.");
    }
}
