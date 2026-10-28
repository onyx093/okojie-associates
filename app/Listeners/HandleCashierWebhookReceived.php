<?php

namespace App\Listeners;

use App\Enums\InvoiceStatus;
use App\Mail\PaymentReceipt;
use App\Models\AuditLog;
use App\Models\Invoice;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Events\WebhookReceived;
use Throwable;

class HandleCashierWebhookReceived
{
    /**
     * Handle the Cashier WebhookReceived event.
     */
    public function handle(WebhookReceived $event): void
    {
        if (($event->payload['type'] ?? '') === 'checkout.session.completed') {
            $session = $event->payload['data']['object'] ?? [];
            $invoiceId = $session['metadata']['invoice_id'] ?? null;

            if (! $invoiceId) {
                return;
            }

            /** @var Invoice|null $invoice */
            $invoice = Invoice::query()->with('taxReturn.user')->whereKey($invoiceId)->first();

            if (! $invoice) {
                return;
            }

            // Idempotency check: process payment only once
            if ($invoice->status !== InvoiceStatus::Paid) {
                $invoice->update([
                    'status' => InvoiceStatus::Paid,
                    'paid_at' => now(),
                    'stripe_session_id' => $session['id'] ?? null,
                ]);

                $invoice->ensureReceiptNumber();
                $this->capturePaymentMethodDetails($invoice, $session);

                $client = $invoice->taxReturn?->user;

                AuditLog::record(
                    action: 'invoice.paid',
                    entity: 'Invoice',
                    meta: [
                        'amount_cents' => $invoice->amount_cents,
                        'stripe_session_id' => $session['id'] ?? null,
                    ],
                    entityId: $invoice->id,
                    actorId: $client?->id,
                );

                if ($client) {
                    Mail::to($client)->queue(new PaymentReceipt($invoice, $client));
                }
            }
        }
    }

    /**
     * Best-effort retrieval of the PaymentIntent's card brand and last4 from Stripe.
     *
     * @param  array<string, mixed>  $session
     */
    private function capturePaymentMethodDetails(Invoice $invoice, array $session): void
    {
        $paymentIntentId = $session['payment_intent'] ?? null;
        if (is_array($paymentIntentId)) {
            $paymentIntentId = $paymentIntentId['id'] ?? null;
        }

        if (! is_string($paymentIntentId) || $paymentIntentId === '') {
            return;
        }

        try {
            $stripe = Cashier::stripe();
            $paymentIntent = $stripe->paymentIntents->retrieve($paymentIntentId, [
                'expand' => ['payment_method'],
            ]);

            $paymentMethod = $paymentIntent->payment_method;
            if (is_string($paymentMethod) && $paymentMethod !== '') {
                $paymentMethod = $stripe->paymentMethods->retrieve($paymentMethod);
            }

            $card = is_object($paymentMethod) ? ($paymentMethod->card ?? null) : null;
            $brandRaw = is_object($card) ? ($card->brand ?? null) : null;
            $last4Raw = is_object($card) ? ($card->last4 ?? null) : null;

            $brand = $brandRaw !== null && $brandRaw !== ''
                ? ucfirst($brandRaw)
                : null;
            $last4 = $last4Raw !== null && $last4Raw !== ''
                ? substr($last4Raw, 0, 4)
                : null;

            if ($brand !== null || $last4 !== null) {
                $invoice->update([
                    'payment_method_brand' => $brand,
                    'payment_method_last4' => $last4,
                ]);
            }
        } catch (Throwable) {
            // Never fail the webhook or payment when Stripe lookup throws
        }
    }
}
