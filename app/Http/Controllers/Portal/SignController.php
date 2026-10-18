<?php

namespace App\Http\Controllers\Portal;

use App\Actions\Admin\AdvanceReturnStatus;
use App\Enums\DocType;
use App\Enums\ReturnStatus;
use App\Enums\ScanStatus;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\TaxReturn;
use App\Services\Signature\SignedPdfGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller managing taxpayer e-signature and Form 7216 consent.
 *
 * NOTE FOR COMPLIANCE:
 * Real IRS Form 8879 wording, Practitioner/Self-Select PIN handling, identity verification,
 * and electronic filing rules (IRS Publication 1345: Handbook for Authorized IRS e-file Providers)
 * must be reviewed and certified by qualified legal counsel and your Authorized IRS e-file Provider.
 */
class SignController extends Controller
{
    /**
     * Display the e-signature page. Available ONLY when return status is ReadyForReview.
     */
    public function show(Request $request, TaxReturn $taxReturn): Response|RedirectResponse
    {
        $user = $request->user();

        // Must belong to user
        if ($taxReturn->user_id !== $user->id) {
            abort(403);
        }

        // Available ONLY at ReadyForReview
        if ($taxReturn->status !== ReturnStatus::ReadyForReview) {
            abort(403, 'This return is not currently ready for review and signature.');
        }

        return Inertia::render('portal/sign', [
            'taxReturn' => [
                'id' => $taxReturn->id,
                'taxYear' => $taxReturn->tax_year,
                'tier' => $taxReturn->tier?->value,
                'tierLabel' => $taxReturn->tier?->label() ?? 'Standard Filing',
                'status' => $taxReturn->status->value,
                'statusLabel' => $taxReturn->status->label(),
                'preparerName' => $taxReturn->preparer?->name ?? 'Okojie & Associates Preparer',
            ],
            'clientName' => $user->name ?: $user->email,
            'clientEmail' => $user->email,
            'form7216ConsentText' => __('legal.form_7216_consent'),
            'form8879DeclarationText' => __('legal.form_8879_authorization'),
        ]);
    }

    /**
     * Process the e-signature, generate signed PDF, and advance status to ESigned.
     */
    public function sign(
        Request $request,
        TaxReturn $taxReturn,
        AdvanceReturnStatus $advanceAction,
        SignedPdfGenerator $pdfGenerator,
    ): RedirectResponse {
        $user = $request->user();

        // Must belong to user
        if ($taxReturn->user_id !== $user->id) {
            abort(403);
        }

        // Available ONLY at ReadyForReview
        if ($taxReturn->status !== ReturnStatus::ReadyForReview) {
            abort(403, 'This return is not currently ready for review and signature.');
        }

        $validated = $request->validate([
            'consent_7216' => ['accepted'],
            'typed_signature' => ['required', 'string', 'min:2', 'max:255'],
        ], [
            'consent_7216.accepted' => 'You must check the box agreeing to the Form 7216 disclosure consent.',
            'typed_signature.required' => 'Please type your full legal name as your electronic signature.',
        ]);

        $timestamp = now();
        $ip = (string) $request->ip();
        $userAgent = (string) ($request->userAgent() ?: 'Unknown');
        $typedSignature = trim($validated['typed_signature']);

        // Generate signed PDF record
        $pdfBytes = $pdfGenerator->generate(
            taxReturn: $taxReturn,
            user: $user,
            typedSignature: $typedSignature,
            timestamp: $timestamp,
            ip: $ip,
            userAgent: $userAgent,
        );

        $safeYear = (string) $taxReturn->tax_year;
        $uniqueKey = Str::random(24);
        $storagePath = "signatures/{$taxReturn->id}/signed_form_8879_{$safeYear}_{$uniqueKey}.pdf";

        // Store signed PDF on private disk
        Storage::disk('private')->put($storagePath, $pdfBytes);

        // Record as an internal client document
        Document::create([
            'user_id' => $user->id,
            'tax_return_id' => $taxReturn->id,
            'filename' => "Form 8879 & 7216 Signed - {$safeYear}.pdf",
            'type' => DocType::Other,
            'mime' => 'application/pdf',
            'size_bytes' => strlen($pdfBytes),
            'storage_key' => $storagePath,
            'scan_status' => ScanStatus::Clean,
            'uploaded_by' => $user->id,
        ]);

        // Specific e-signature AuditLog record
        AuditLog::record(
            action: 'tax_return.e_signed',
            entity: 'TaxReturn',
            meta: [
                'tax_year' => $taxReturn->tax_year,
                'typed_signature' => $typedSignature,
                'consent_7216' => true,
                'storage_key' => $storagePath,
                'ip' => $ip,
                'user_agent' => $userAgent,
                'signed_at' => $timestamp->toISOString(),
            ],
            entityId: $taxReturn->id,
            actorId: $user->id,
            ip: $ip,
        );

        // Advance return status to ESigned
        $advanceAction->execute(
            taxReturn: $taxReturn,
            toStatus: ReturnStatus::ESigned,
            byUser: $user,
            reason: 'Taxpayer completed electronic signature and Form 7216 consent.',
        );

        return redirect()->route('portal.overview')->with('success', 'Return signed successfully! We have recorded your electronic signature.');
    }
}
