<?php

namespace Database\Factories;

use App\Enums\ApptFormat;
use App\Enums\LeadKind;
use App\Enums\LeadStatus;
use App\Enums\TimeWindow;
use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'kind' => LeadKind::Quote,
            'name' => fake()->name(),
            'phone' => '(215) 555-0142',
            'email' => fake()->safeEmail(),
            'tier_interest' => 'hybrid',
            'situation' => 'W-2 employee with side consulting business.',
            'preferred_date' => null,
            'time_window' => null,
            'format' => null,
            'notes' => null,
            'ref_code' => null,
            'status' => LeadStatus::New,
        ];
    }

    public function consult(): static
    {
        return $this->state(fn (array $attributes) => [
            'kind' => LeadKind::Consult,
            'tier_interest' => null,
            'situation' => null,
            'preferred_date' => now()->addDays(5)->toDateString(),
            'time_window' => TimeWindow::Morning,
            'format' => ApptFormat::Video,
            'notes' => 'Need help with prior-year state return.',
        ]);
    }
}
