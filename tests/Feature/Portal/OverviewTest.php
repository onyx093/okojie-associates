<?php

use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;
use Database\Seeders\DemoClientSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('portal overview renders with tax return, invoice, and counts props', function () {
    $user = User::factory()->withTwoFactor()->create();

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => (int) date('Y'),
        'status' => ReturnStatus::IntakeReceived,
    ]);

    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/overview')
        ->has('taxReturn', fn (Assert $prop) => $prop
            ->where('id', $taxReturn->id)
            ->where('tax_year', (int) date('Y'))
            ->where('status', ReturnStatus::IntakeReceived->value)
            ->where('status_label', 'Intake received')
            ->where('next_step_text', "We're moving to: In preparation. We'll keep you posted here.")
            ->etc()
        )
        ->has('invoice', fn (Assert $prop) => $prop
            ->where('id', $invoice->id)
            ->where('amount_cents', 22500)
            ->where('amount_formatted', '$225')
            ->where('status', InvoiceStatus::Open->value)
            ->etc()
        )
        ->has('counts', fn (Assert $prop) => $prop
            ->where('documents', 0)
            ->where('referrals', 0)
        )
    );
});

test('portal overview displays awaiting quote when invoice amount is null', function () {
    $user = User::factory()->withTwoFactor()->create();

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::IntakeReceived,
    ]);

    Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => null,
    ]);

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/overview')
        ->where('invoice.amount_cents', null)
        ->where('invoice.amount_formatted', null)
    );
});

test('demo client seeder seeds client with 225 invoice and intake received status', function () {
    $this->seed(DemoClientSeeder::class);

    $client = User::where('email', 'client@example.com')->first();
    expect($client)->not->toBeNull()
        ->and($client->name)->toBe('Demo Client')
        ->and($client->two_factor_confirmed_at)->toBeNull();

    $taxReturn = $client->taxReturns()->latest('tax_year')->first();
    expect($taxReturn)->not->toBeNull()
        ->and($taxReturn->status)->toBe(ReturnStatus::IntakeReceived);

    $invoice = $taxReturn->invoice;
    expect($invoice)->not->toBeNull()
        ->and($invoice->amount_cents)->toBe(22500);

    expect($client->documents()->count())->toBe(0)
        ->and($client->referrals()->count())->toBe(0);
});
