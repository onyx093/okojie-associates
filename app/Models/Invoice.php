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

/**
 * @property string $id
 * @property string $tax_return_id
 * @property int|null $amount_cents
 * @property string $currency
 * @property InvoiceStatus $status
 * @property string|null $stripe_session_id
 * @property Carbon|null $paid_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property TaxReturn|null $taxReturn
 */
#[Fillable(['tax_return_id', 'amount_cents', 'currency', 'status', 'stripe_session_id', 'paid_at'])]
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
}
