<?php

use App\Models\User;

it('renders the verify email screen with split layout, mail icon tile, and unverified user email in lead', function () {
    $user = User::factory()->unverified()->create([
        'email' => 'denise.r@example.com',
        'password' => 'CorrectHorseBattery99!',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.r@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/email/verify')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'One more step')
        ->assertSeeIn('main#main h1', 'Verify your email')
        ->assertSeeIn('main#main p', 'We sent a link to denise.r@example.com. Click it to finish creating your account.')
        ->assertSeeIn('main#main button[type="submit"]', 'Send the link again')
        ->assertSeeIn('main#main button:has-text("Log out")', 'Log out')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Encrypted portal')
        ->assertSeeIn('aside[aria-hidden="true"]', '2FA on every account')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Your 2026 return');
});

it('renders the verify email screen on mobile viewport cleanly with single column', function () {
    $user = User::factory()->unverified()->create([
        'email' => 'mobile.unverified@example.com',
        'password' => 'CorrectHorseBattery99!',
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.unverified@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/email/verify')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Verify your email')
        ->assertSeeIn('main#main button[type="submit"]', 'Send the link again')
        ->assertSeeIn('main#main button:has-text("Log out")', 'Log out');
});

it('resends verification email and displays the status note', function () {
    $user = User::factory()->unverified()->create([
        'email' => 'resend.test@example.com',
        'password' => 'CorrectHorseBattery99!',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'resend.test@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/email/verify')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('button[type="submit"]:has-text("Send the link again")')
        ->assertSeeIn('[role="status"]', 'A new link is on its way. Check your spam folder if it’s not there in a few minutes.');
});

it('renders styleguide page-verify-email fixture states cleanly', function () {
    visit('/dev/styleguide?fixture=page-verify-email&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Verify your email')
        ->assertSeeIn('main#main', 'denise.r@example.com')
        ->assertSeeIn('main#main button[type="submit"]', 'Send the link again');

    visit('/dev/styleguide?fixture=page-verify-email&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('[role="status"]', 'A new link is on its way. Check your spam folder if it’s not there in a few minutes.');

    visit('/dev/styleguide?fixture=page-verify-email&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main button[type="submit"]', 'Sending…');
});
