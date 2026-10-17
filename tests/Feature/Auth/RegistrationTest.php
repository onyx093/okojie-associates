<?php

use App\Enums\ReturnStatus;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registration triggers email verification notification and domain entities', function () {
    Notification::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'Verify User',
        'email' => 'verify@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'verify@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->referral_code)->toStartWith('OKJ-');

    Notification::assertSentTo($user, VerifyEmail::class);

    $this->assertDatabaseHas('tax_returns', [
        'user_id' => $user->id,
        'tax_year' => (int) date('Y'),
        'status' => ReturnStatus::IntakeReceived->value,
    ]);

    $taxReturn = TaxReturn::where('user_id', $user->id)->first();
    $this->assertDatabaseHas('invoices', [
        'tax_return_id' => $taxReturn->id,
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'user.registered',
        'entity' => 'User',
    ]);
});
