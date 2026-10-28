<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use Carbon\CarbonInterface as Carbon;
use Database\Factories\InvoiceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

/**
 * @property string $id
 * @property string $tax_return_id
 * @property int|null $amount_cents
 * @property string $currency
 * @property InvoiceStatus $status
 * @property string|null $stripe_session_id
 * @property string|null $receipt_number
 * @property string|null $payment_method_brand
 * @property string|null $payment_method_last4
 * @property Carbon|null $paid_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property TaxReturn|null $taxReturn
 */
#[Fillable(['tax_return_id', 'amount_cents', 'currency', 'status', 'stripe_session_id', 'receipt_number', 'payment_method_brand', 'payment_method_last4', 'paid_at'])]
class Invoice extends Model
{
    /** @use HasFactory<InvoiceFactory> */
    use HasFactory, HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount_cents' => 'integer',
            'status' => InvoiceStatus::class,
            'paid_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<TaxReturn, $this>
     */
    public function taxReturn(): BelongsTo
    {
        return $this->belongsTo(TaxReturn::class);
    }

    /**
     * Get the structured payment method summary when brand and last4 are available.
     *
     * @return array{brand: string, last4: string}|null
     */
    public function paymentMethodSummary(): ?array
    {
        if (
            $this->payment_method_brand === null
            || $this->payment_method_brand === ''
            || $this->payment_method_last4 === null
            || $this->payment_method_last4 === ''
        ) {
            return null;
        }

        return [
            'brand' => $this->payment_method_brand,
            'last4' => $this->payment_method_last4,
        ];
    }

    /**
     * Ensure a paid invoice has a unique sequential receipt number for its paid year.
     * Idempotent: never renumbers an invoice that already has a receipt_number.
     */
    public function ensureReceiptNumber(): string
    {
        if ($this->receipt_number !== null && $this->receipt_number !== '') {
            return $this->receipt_number;
        }

        return DB::transaction(function (): string {
            /** @var Invoice|null $locked */
            $locked = static::query()->whereKey($this->id)->lockForUpdate()->first();

            if ($locked && $locked->receipt_number !== null && $locked->receipt_number !== '') {
                $this->receipt_number = $locked->receipt_number;

                return $locked->receipt_number;
            }

            $paidAt = ($locked !== null ? $locked->paid_at : null) ?? $this->paid_at ?? now();
            $year = (int) $paidAt->format('Y');
            $prefix = "RCPT-{$year}-";

            /** @var string|null $latestReceiptNumber */
            $latestReceiptNumber = static::query()
                ->where('receipt_number', 'like', "{$prefix}%")
                ->lockForUpdate()
                ->orderByDesc('receipt_number')
                ->value('receipt_number');

            $nextSequence = 1;
            if (is_string($latestReceiptNumber) && str_starts_with($latestReceiptNumber, $prefix)) {
                $suffix = substr($latestReceiptNumber, strlen($prefix));
                if (ctype_digit($suffix)) {
                    $nextSequence = ((int) $suffix) + 1;
                }
            }

            $receiptNumber = sprintf('%s%05d', $prefix, $nextSequence);

            if ($locked) {
                $locked->update(['receipt_number' => $receiptNumber]);
            }
            $this->receipt_number = $receiptNumber;

            return $receiptNumber;
        });
    }
}
