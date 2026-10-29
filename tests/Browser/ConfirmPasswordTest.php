<?php

use App\Models\User;

it('renders the confirm password screen with split layout, lock icon tile, and eyebrow', function () {
    $user = User::factory()->create([
        'email' => 'denise.r@example.com',
        'password' => 'CorrectHorseBattery99!',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.r@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/user/confirm-password')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Secure area')
        ->assertSeeIn('main#main h1', 'Confirm it’s you')
        ->assertSeeIn('main#main p', 'You’re about to change a security setting. Enter your password to continue.')
        ->assertPresent('main#main input#password')
        ->assertSeeIn('main#main button[type="submit"]', 'Confirm password')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Encrypted portal')
        ->assertSeeIn('aside[aria-hidden="true"]', '2FA on every account')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Your 2026 return');
});

it('renders the confirm password screen cleanly on mobile viewport', function () {
    $user = User::factory()->create([
        'email' => 'mobile.confirm@example.com',
        'password' => 'CorrectHorseBattery99!',
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.confirm@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/user/confirm-password')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Confirm it’s you')
        ->assertPresent('main#main input#password')
        ->assertSeeIn('main#main button[type="submit"]', 'Confirm password');
});

it('confirms password successfully for authenticated user', function () {
    $user = User::factory()->create([
        'email' => 'auth.confirm@example.com',
        'password' => 'CorrectHorseBattery99!',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'auth.confirm@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/user/confirm-password')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Confirm password")');
});

it('renders styleguide page-confirm-password fixture states cleanly', function () {
    // State 0: Default
    visit('/dev/styleguide?fixture=page-confirm-password&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Confirm it’s you')
        ->assertPresent('main#main input#password');

    // State 1: Wrong password
    visit('/dev/styleguide?fixture=page-confirm-password&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main #password-error', 'This password does not match our records.');

    // State 2: Submitting
    visit('/dev/styleguide?fixture=page-confirm-password&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main button[type="submit"]', 'Confirming…');
});
