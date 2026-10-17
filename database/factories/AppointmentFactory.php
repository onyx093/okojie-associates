<?php

namespace Database\Factories;

use App\Enums\ApptFormat;
use App\Enums\ApptStatus;
use App\Enums\TimeWindow;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'preferred_date' => now()->addDays(3)->toDateString(),
            'time_window' => TimeWindow::Morning,
            'format' => ApptFormat::Video,
            'topic' => 'Return review',
            'notes' => fake()->sentence(),
            'status' => ApptStatus::Requested,
            'confirmed_at' => null,
        ];
    }
}
