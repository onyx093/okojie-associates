<?php

namespace App\Listeners;

use App\Enums\InvoiceStatus;
use App\Mail\PaymentReceipt;
use App\Models\AuditLog;
use App\Models\Invoice;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Events\WebhookReceived;

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

            $invoice = Invoice::with('taxReturn.user')->find($invoiceId);

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
}
