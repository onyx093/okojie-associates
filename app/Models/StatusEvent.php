<?php

namespace App\Models;

use App\Enums\ReturnStatus;
use Carbon\CarbonInterface as Carbon;
use Database\Factories\StatusEventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $tax_return_id
 * @property ReturnStatus|null $from
 * @property ReturnStatus $to
 * @property int|null $by_user_id
 * @property string|null $reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User|null $byUser
 */
#[Fillable(['tax_return_id', 'from', 'to', 'by_user_id', 'reason'])]
class StatusEvent extends Model
{
    /** @use HasFactory<StatusEventFactory> */
    use HasFactory, HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'from' => ReturnStatus::class,
            'to' => ReturnStatus::class,
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
     * @return BelongsTo<User, $this>
     */
    public function byUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'by_user_id');
    }
}
