<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $preparer = User::firstOrCreate(
            ['email' => 'preparer@example.com'],
            [
                'name' => 'Staff Preparer',
                'phone' => '(215) 555-0178',
                'password' => Hash::make('Passw0rd!ChangeMe'),
                'email_verified_at' => now(),
                'role' => Role::Preparer,
                'tier' => null,
                'referral_code' => UserFactory::generateReferralCode(),
            ]
        );
        if (! $preparer->hasVerifiedEmail()) {
            $preparer->markEmailAsVerified();
        }

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Admin',
                'phone' => '(215) 555-0193',
                'password' => Hash::make('Passw0rd!ChangeMe'),
                'email_verified_at' => now(),
                'role' => Role::Admin,
                'tier' => null,
                'referral_code' => UserFactory::generateReferralCode(),
            ]
        );
        if (! $admin->hasVerifiedEmail()) {
            $admin->markEmailAsVerified();
        }
    }
}
