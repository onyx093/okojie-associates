<?php

namespace App\Models;

use App\Enums\ReferralStatus;
use App\Enums\Tier;
use Database\Factories\ReferralFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property int $referrer_id
 * @property string $friend_name
 * @property string $friend_email
 * @property ReferralStatus $status
 * @property int|null $reward_cents
 * @property string $source
 * @property int|null $friend_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['referrer_id', 'friend_name', 'friend_email', 'status', 'reward_cents', 'source', 'friend_user_id'])]
class Referral extends Model
{
    /** @use HasFactory<ReferralFactory> */
    use HasFactory, HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ReferralStatus::class,
            'reward_cents' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function friendUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'friend_user_id');
    }

    /**
     * Mark the referral as Filed (when friend's return is e-filed).
     */
    public function markFiled(): void
    {
        if ($this->status !== ReferralStatus::Rewarded) {
            $this->update(['status' => ReferralStatus::Filed]);
        }
    }

    /**
     * Mark the referral as Rewarded with reward_cents from site config by tier.
     */
    public function markRewarded(?Tier $tier = null): void
    {
        $friendReturn = $this->friendUser?->taxReturns()->latest('tax_year')->first();

        $effectiveTier = $tier
            ?? ($friendReturn ? $friendReturn->tier : null)
            ?? ($this->friendUser ? $this->friendUser->tier : null)
            ?? Tier::UploadAndGo;

        $tierKey = $effectiveTier->value;
        $rewardCents = (int) config("site.referral.reward_cents.{$tierKey}", 2500);

        $this->update([
            'status' => ReferralStatus::Rewarded,
            'reward_cents' => $rewardCents,
        ]);
    }
}
