<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Invoice;
use App\Models\TaxReturn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class InvoiceController extends Controller
{
    /**
     * Update the invoice amount or mark paid offline.
     */
    public function update(Request $request, TaxReturn $taxReturn): RedirectResponse
    {
        Gate::authorize('update', $taxReturn);

        $validated = $request->validate([
            'amount_dollars' => ['nullable', 'numeric', 'min:0', 'max:50000'],
            'amount_cents' => ['nullable', 'integer', 'min:0', 'max:5000000'],
            'mark_paid_offline' => ['nullable', 'boolean'],
        ]);

        $invoice = Invoice::firstOrCreate(
            ['tax_return_id' => $taxReturn->id],
            [
                'currency' => 'usd',
                'status' => InvoiceStatus::Draft,
            ]
        );

        if ($request->boolean('mark_paid_offline')) {
            $invoice->status = InvoiceStatus::Paid;
            $invoice->paid_at = $invoice->paid_at ?? now();
        } else {
            if (isset($validated['amount_dollars'])) {
                $invoice->amount_cents = (int) round((float) $validated['amount_dollars'] * 100);
            } elseif (isset($validated['amount_cents'])) {
                $invoice->amount_cents = (int) $validated['amount_cents'];
            }

            if ($invoice->status === InvoiceStatus::Draft && $invoice->amount_cents > 0) {
                $invoice->status = InvoiceStatus::Open;
            }
        }

        $invoice->save();

        if ($request->boolean('mark_paid_offline')) {
            $invoice->ensureReceiptNumber();
        }

        AuditLog::record(
            action: 'admin.invoice_updated',
            entity: 'Invoice',
            meta: [
                'amount_cents' => $invoice->amount_cents,
                'status' => $invoice->status->value,
                'paid_at' => $invoice->paid_at?->toISOString(),
            ],
            entityId: $invoice->id,
        );

        $msg = $request->boolean('mark_paid_offline')
            ? 'Invoice marked as paid offline.'
            : 'Invoice amount updated.';

        return back()->with('success', $msg);
    }
}
