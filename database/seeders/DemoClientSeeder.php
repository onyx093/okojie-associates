<?php

namespace Database\Seeders;

use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Enums\Role;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Demo Client',
                'phone' => '(215) 555-0142',
                'password' => Hash::make('Passw0rd!ChangeMe'),
                'email_verified_at' => now(),
                'role' => Role::Client,
                'tier' => null,
                'referral_code' => 'OKJ-674SU5',
                'two_factor_secret' => null,
                'two_factor_recovery_codes' => null,
                'two_factor_confirmed_at' => null,
            ]
        );

        $taxReturn = TaxReturn::firstOrCreate(
            [
                'user_id' => $user->id,
                'tax_year' => (int) date('Y'),
            ],
            [
                'tier' => null,
                'status' => ReturnStatus::IntakeReceived,
                'preparer_id' => null,
            ]
        );

        Invoice::firstOrCreate(
            ['tax_return_id' => $taxReturn->id],
            [
                'amount_cents' => 22500,
                'currency' => 'usd',
                'status' => InvoiceStatus::Open,
            ]
        );
    }
}
