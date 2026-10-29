<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

it('renders the reset password screen with split layout, eyebrow, and read-only email', function () {
    visit('/reset-password/sample-token?email=denise.r@example.com')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Account recovery')
        ->assertSeeIn('main#main h1', 'Choose a new password')
        ->assertSeeIn('main#main p', 'Use at least 12 characters, and don’t reuse a password from another site.')
        ->assertValue('main#main input#email', 'denise.r@example.com')
        ->assertAttribute('main#main input#email', 'readonly', '')
        ->assertPresent('main#main input#password')
        ->assertPresent('main#main input#password_confirmation')
        ->assertSeeIn('main#main button[type="submit"]', 'Reset password')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Encrypted portal')
        ->assertSeeIn('aside[aria-hidden="true"]', '2FA on every account')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Your 2026 return');
});

it('renders the reset password screen cleanly on mobile viewport', function () {
    visit('/reset-password/sample-token?email=denise.r@example.com')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Choose a new password')
        ->assertValue('main#main input#email', 'denise.r@example.com')
        ->assertSeeIn('main#main button[type="submit"]', 'Reset password');
});

it('resets password successfully and redirects to login', function () {
    Notification::fake();

    $user = User::factory()->create([
        'email' => 'reset.user@example.com',
    ]);

    $this->post(route('password.email'), ['email' => $user->email]);

    $token = null;
    Notification::assertSentTo($user, ResetPassword::class, function ($notification) use (&$token) {
        $token = $notification->token;

        return true;
    });

    expect($token)->not->toBeNull();

    visit("/reset-password/{$token}?email=".urlencode($user->email))
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#password', 'CorrectHorseBattery99!')
        ->fill('#password_confirmation', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Reset password")')
        ->assertPathIs('/login');
});

it('renders styleguide page-reset-password fixture states cleanly', function () {
    // State 0: Default
    visit('/dev/styleguide?fixture=page-reset-password&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Choose a new password')
        ->assertValue('main#main input#email', 'denise.r@example.com');

    // State 1: Invalid token
    visit('/dev/styleguide?fixture=page-reset-password&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main [role="alert"]', 'This password reset token is invalid.')
        ->assertSeeIn('main#main [role="alert"] a', 'Request a new reset link');

    // State 2: Mismatch
    visit('/dev/styleguide?fixture=page-reset-password&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main #password_confirmation-error', "Passwords don't match.");

    // State 3: Weak
    visit('/dev/styleguide?fixture=page-reset-password&state=3')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main #password-error', 'The password must be at least 12 characters.');

    // State 4: Submitting
    visit('/dev/styleguide?fixture=page-reset-password&state=4')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main button[type="submit"]', 'Resetting password…');
});
