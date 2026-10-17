<?php

namespace Database\Factories;

use App\Enums\ReferralStatus;
use App\Models\Referral;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Referral>
 */
class ReferralFactory extends Factory
{
    protected $model = Referral::class;

    public function definition(): array
    {
        return [
            'referrer_id' => User::factory(),
            'friend_name' => fake()->name(),
            'friend_email' => fake()->unique()->safeEmail(),
            'status' => ReferralStatus::Sent,
            'reward_cents' => null,
            'source' => 'email',
            'friend_user_id' => null,
        ];
    }
}
