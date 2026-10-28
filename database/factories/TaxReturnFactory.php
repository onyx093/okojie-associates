<?php

namespace Database\Factories;

use App\Enums\ReturnStatus;
use App\Enums\Tier;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TaxReturn>
 */
class TaxReturnFactory extends Factory
{
    protected $model = TaxReturn::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tax_year' => 2024,
            'tier' => fake()->randomElement(Tier::cases()),
            'status' => ReturnStatus::IntakeReceived,
            'preparer_id' => null,
            'signed_at' => null,
            'filed_at' => null,
            'return_summary' => null,
        ];
    }
}
