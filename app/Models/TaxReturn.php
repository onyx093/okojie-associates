<?php

namespace App\Models;

use App\Enums\ReferralStatus;
use App\Enums\ReturnStatus;
use App\Enums\Tier;
use Carbon\CarbonInterface as Carbon;
use Database\Factories\TaxReturnFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property string $id
 * @property int $user_id
 * @property int $tax_year
 * @property Tier|null $tier
 * @property ReturnStatus $status
 * @property int|null $preparer_id
 * @property Carbon|null $signed_at
 * @property Carbon|null $filed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User|null $preparer
 * @property User $user
 * @property Invoice|null $invoice
 */
#[Fillable(['user_id', 'tax_year', 'tier', 'status', 'preparer_id', 'signed_at', 'filed_at'])]
class TaxReturn extends Model
{
    /** @use HasFactory<TaxReturnFactory> */
    use HasFactory, HasUlids;

    protected static function booted(): void
    {
        static::updated(function (TaxReturn $return) {
            if ($return->wasChanged('status') && $return->status === ReturnStatus::EFiled) {
                $user = $return->user;
                Referral::where(function ($query) use ($user) {
                    $query->where('friend_user_id', $user->id)
                        ->orWhere('friend_email', strtolower($user->email));
                })
                    ->where('status', '!=', ReferralStatus::Rewarded)
                    ->update(['status' => ReferralStatus::Filed]);
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tax_year' => 'integer',
            'tier' => Tier::class,
            'status' => ReturnStatus::class,
            'signed_at' => 'datetime',
            'filed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function preparer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'preparer_id');
    }

    /**
     * @return HasMany<StatusEvent, $this>
     */
    public function statusEvents(): HasMany
    {
        return $this->hasMany(StatusEvent::class);
    }

    /**
     * @return HasOne<Invoice, $this>
     */
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    /**
     * @return HasMany<Document, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
