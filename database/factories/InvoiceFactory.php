<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\TaxReturn;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        return [
            'tax_return_id' => TaxReturn::factory(),
            'amount_cents' => 22500,
            'currency' => 'usd',
            'status' => InvoiceStatus::Draft,
            'stripe_session_id' => null,
            'paid_at' => null,
        ];
    }
}
