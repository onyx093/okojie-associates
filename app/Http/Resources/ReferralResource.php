<?php

namespace App\Http\Resources;

use App\Models\Referral;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Referral
 */
class ReferralResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $rewardFormatted = $this->reward_cents !== null
            ? '$'.number_format($this->reward_cents / 100, 0)
            : '—';

        return [
            'id' => $this->id,
            'friend_name' => $this->friend_name,
            'friend_email' => $this->friend_email,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'reward_cents' => $this->reward_cents,
            'reward_formatted' => $rewardFormatted,
            'source' => $this->source,
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->format('M j, Y'),
        ];
    }
}
