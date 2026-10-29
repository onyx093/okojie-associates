<?php

use App\Models\User;

it('renders the forgot password screen with split layout, eyebrow, and sign in link', function () {
    visit('/forgot-password')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Account recovery')
        ->assertSeeIn('main#main h1', 'Forgot your password?')
        ->assertSeeIn('main#main p', 'Enter your email and we’ll send you a link to choose a new one.')
        ->assertPresent('main#main input#email')
        ->assertSeeIn('main#main button[type="submit"]', 'Send reset link')
        ->assertSeeIn('main#main', 'Remembered it?')
        ->assertSeeIn('main#main a[href*="/login"]', 'Back to sign in')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Encrypted portal')
        ->assertSeeIn('aside[aria-hidden="true"]', '2FA on every account')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Your 2026 return');
});

it('renders the forgot password screen cleanly on mobile viewport', function () {
    visit('/forgot-password')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Forgot your password?')
        ->assertPresent('main#main input#email')
        ->assertSeeIn('main#main button[type="submit"]', 'Send reset link')
        ->assertSeeIn('main#main a[href*="/login"]', 'Back to sign in');
});

it('requests password reset link and renders the sent confirmation state', function () {
    $user = User::factory()->create([
        'email' => 'denise.r@example.com',
    ]);

    visit('/forgot-password')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.r@example.com')
        ->click('button[type="submit"]:has-text("Send reset link")')
        ->assertSeeIn('main#main h1', 'Check your email')
        ->assertSeeIn('main#main', 'denise.r@example.com')
        ->assertSeeIn('main#main', 'It expires in 60 minutes.')
        ->assertSeeIn('main#main button[type="submit"]', 'Send again')
        ->assertSeeIn('main#main a[href*="/login"]', 'Back to sign in');
});

it('renders styleguide page-forgot-password fixture states cleanly', function () {
    // State 0: Form (empty)
    visit('/dev/styleguide?fixture=page-forgot-password&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Forgot your password?')
        ->assertPresent('main#main input#email');

    // State 1: Form (filled)
    visit('/dev/styleguide?fixture=page-forgot-password&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertValue('main#main input#email', 'denise.r@example.com');

    // State 2: Sent (link sent)
    visit('/dev/styleguide?fixture=page-forgot-password&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Check your email')
        ->assertSeeIn('main#main', 'denise.r@example.com')
        ->assertSeeIn('main#main button[type="submit"]', 'Send again');

    // State 3: Validation error
    visit('/dev/styleguide?fixture=page-forgot-password&state=3')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main #email-error', 'Please enter a valid email address.');

    // State 4: Throttled
    visit('/dev/styleguide?fixture=page-forgot-password&state=4')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main [role="alert"]', 'Too many password reset attempts');

    // State 5: Submitting
    visit('/dev/styleguide?fixture=page-forgot-password&state=5')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main button[type="submit"]', 'Sending reset link…');
});
