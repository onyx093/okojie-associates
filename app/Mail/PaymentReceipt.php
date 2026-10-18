<?php

namespace App\Mail;

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentReceipt extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Invoice $invoice,
        public User $client,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $taxYear = $this->invoice->taxReturn?->tax_year ?? (int) date('Y');

        return new Envelope(
            subject: "Payment Receipt: Tax Year {$taxYear} Preparation Fee",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $amountDollars = number_format(($this->invoice->amount_cents ?? 0) / 100, 2);
        $taxYear = $this->invoice->taxReturn?->tax_year ?? (int) date('Y');

        return new Content(
            markdown: 'mail.payment-receipt',
            with: [
                'clientName' => $this->client->name ?: 'Valued Client',
                'amount' => '$'.$amountDollars,
                'taxYear' => $taxYear,
                'paidAt' => $this->invoice->paid_at?->format('F j, Y g:i A') ?? now()->format('F j, Y g:i A'),
                'invoiceId' => $this->invoice->id,
                'portalUrl' => route('portal.overview'),
            ],
        );
    }
}
