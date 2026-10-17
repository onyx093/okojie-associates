<?php

namespace Database\Factories;

use App\Enums\ReturnStatus;
use App\Models\StatusEvent;
use App\Models\TaxReturn;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StatusEvent>
 */
class StatusEventFactory extends Factory
{
    protected $model = StatusEvent::class;

    public function definition(): array
    {
        return [
            'tax_return_id' => TaxReturn::factory(),
            'from' => null,
            'to' => ReturnStatus::IntakeReceived,
            'by_user_id' => null,
            'reason' => null,
        ];
    }
}
