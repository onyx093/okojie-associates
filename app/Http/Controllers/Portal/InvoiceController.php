<?php

namespace App\Http\Controllers\Portal;

use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends Controller
{
    /**
     * Initiate a Stripe Checkout session for a tax preparation invoice.
     */
    public function checkout(Request $request, Invoice $invoice): Response
    {
        Gate::authorize('checkout', $invoice);

        $user = $request->user();

        // Guard rails: 409 Conflict if amount is null or already paid
        if ($invoice->amount_cents === null || $invoice->status === InvoiceStatus::Paid) {
            abort(409, 'Invoice cannot be checked out because it is already paid or awaiting a quote.');
        }

        $taxReturn = $invoice->taxReturn;
        $title = "Tax Preparation Fee — Tax Year {$taxReturn->tax_year}";

        $checkout = $user->checkoutCharge(
            $invoice->amount_cents,
            $title,
            1,
            [
                'success_url' => route('portal.overview', ['payment' => 'success']),
                'cancel_url' => route('portal.overview', ['payment' => 'cancelled']),
                'metadata' => [
                    'invoice_id' => $invoice->id,
                    'user_id' => (string) $user->id,
                    'tax_year' => (string) $taxReturn->tax_year,
                ],
            ]
        );

        return Inertia::location((string) $checkout->asStripeCheckoutSession()->url);
    }

    /**
     * View or download an invoice receipt.
     */
    public function receipt(Request $request, Invoice $invoice): \Inertia\Response
    {
        Gate::authorize('view', $invoice);

        if ($invoice->status !== InvoiceStatus::Paid) {
            abort(404, 'Receipt is only available for paid invoices.');
        }

        $taxReturn = $invoice->taxReturn;

        return Inertia::render('portal/receipt', [
            'invoice' => [
                'id' => $invoice->id,
                'amountCents' => $invoice->amount_cents,
                'amountFormatted' => '$'.number_format(($invoice->amount_cents ?? 0) / 100, 2),
                'paidAt' => $invoice->paid_at?->format('M j, Y g:i A') ?? 'Paid',
                'taxYear' => $taxReturn->tax_year,
                'clientName' => $taxReturn->user->name ?: $taxReturn->user->email,
                'clientEmail' => $taxReturn->user->email,
                'stripeSessionId' => $invoice->stripe_session_id,
            ],
        ]);
    }
}
