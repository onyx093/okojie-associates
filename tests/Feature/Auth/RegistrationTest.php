<?php

use App\Enums\InvoiceStatus;
use App\Enums\ReferralStatus;
use App\Enums\ReturnStatus;
use App\Enums\Tier;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered with access page in signup mode', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('auth/access')
        ->where('mode', 'signup')
    );
});

test('new users can register and redirect to portal overview', function () {
    Notification::fake();

    $response = $this->post(route('register.store'), [
        'email' => 'newclient@example.com',
        'password' => 'CorrectHorseBattery99!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('portal.overview'));

    $user = User::where('email', 'newclient@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->referral_code)->toMatch('/^OKJ-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/');

    if (Features::enabled(Features::emailVerification())) {
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    $this->assertDatabaseHas('tax_returns', [
        'user_id' => $user->id,
        'tax_year' => (int) date('Y'),
        'status' => ReturnStatus::IntakeReceived->value,
    ]);

    $taxReturn = TaxReturn::where('user_id', $user->id)->first();
    $invoice = Invoice::where('tax_return_id', $taxReturn->id)->first();
    expect($invoice)->not->toBeNull();
    expect($invoice->amount_cents)->toBeNull();
    expect($invoice->status)->toBe(InvoiceStatus::Draft);

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'user.registered',
        'entity' => 'User',
        'actor_id' => $user->id,
    ]);
});

test('registration applies tier and links referral from param', function () {
    Notification::fake();

    $referrer = User::factory()->create();

    $response = $this->post(route('register.store'), [
        'email' => 'referred1@example.com',
        'password' => 'CorrectHorseBattery99!',
        'tier' => 'premium_remote',
        'ref' => $referrer->referral_code,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('portal.overview'));

    $user = User::where('email', 'referred1@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->tier)->toBe(Tier::PremiumRemote);
    expect($user->referred_by_code)->toBe($referrer->referral_code);

    $taxReturn = TaxReturn::where('user_id', $user->id)->first();
    expect($taxReturn->tier)->toBe(Tier::PremiumRemote);

    $this->assertDatabaseHas('referrals', [
        'referrer_id' => $referrer->id,
        'friend_user_id' => $user->id,
        'friend_email' => 'referred1@example.com',
        'status' => ReferralStatus::SignedUp->value,
    ]);
});

test('registration applies referral from cookie when param is absent', function () {
    Notification::fake();

    $referrer = User::factory()->create();

    $response = $this->withUnencryptedCookie('okojie_referral', $referrer->referral_code)
        ->post(route('register.store'), [
            'email' => 'referred2@example.com',
            'password' => 'CorrectHorseBattery99!',
            'tier' => 'hybrid',
        ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('portal.overview'));

    $user = User::where('email', 'referred2@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->tier)->toBe(Tier::Hybrid);
    expect($user->referred_by_code)->toBe($referrer->referral_code);

    $this->assertDatabaseHas('referrals', [
        'referrer_id' => $referrer->id,
        'friend_user_id' => $user->id,
        'friend_email' => 'referred2@example.com',
        'status' => ReferralStatus::SignedUp->value,
    ]);
});

test('duplicate email shows friendly message without enumeration', function () {
    $existing = User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->post(route('register.store'), [
        'email' => 'existing@example.com',
        'password' => 'CorrectHorseBattery99!',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors([
        'email' => 'An account may already exist for this email. Try signing in.',
    ]);
});

test('registration rejects password shorter than 12 characters', function () {
    $response = $this->post(route('register.store'), [
        'email' => 'shortpass@example.com',
        'password' => 'Short1!',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors([
        'password' => 'Password must be at least 12 characters.',
    ]);
});
