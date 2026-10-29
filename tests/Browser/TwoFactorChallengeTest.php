<?php

it('renders the two factor challenge code screen with split layout, shield icon tile, 6 OTP boxes, and trust badges', function () {
    visit('/dev/styleguide?fixture=page-two-factor&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Enter your 6-digit code')
        ->assertSeeIn('main#main p', 'Open your authenticator app and type the code for Okojie Online.')
        ->assertPresent('main#main [role="group"]')
        ->assertSeeIn('main#main button[type="submit"]', 'Continue')
        ->assertSeeIn('main#main', 'Lost your phone?')
        ->assertSeeIn('main#main button', 'Use a recovery code')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Encrypted portal')
        ->assertSeeIn('aside[aria-hidden="true"]', '2FA on every account')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Your 2026 return');
});

it('toggles between code view and recovery view interactively', function () {
    visit('/dev/styleguide?fixture=page-two-factor&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Enter your 6-digit code')
        ->click('button:has-text("Use a recovery code")')
        ->assertSeeIn('main#main h1', 'Use a recovery code')
        ->assertSeeIn('main#main p', 'Enter one of the recovery codes you saved when you set up two-factor authentication. Each code works once.')
        ->assertSeeIn('main#main label[for="recovery_code"]', 'Recovery code')
        ->click('button:has-text("Use your authenticator app instead")')
        ->assertSeeIn('main#main h1', 'Enter your 6-digit code');
});

it('renders the two factor challenge screen on mobile viewport cleanly with single column', function () {
    visit('/dev/styleguide?fixture=page-two-factor&state=0')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Enter your 6-digit code')
        ->assertSeeIn('main#main button[type="submit"]', 'Continue');
});

it('renders styleguide page-two-factor fixture states cleanly', function () {
    visit('/dev/styleguide?fixture=page-two-factor&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Enter your 6-digit code');

    visit('/dev/styleguide?fixture=page-two-factor&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#code")?.value', '123456');

    visit('/dev/styleguide?fixture=page-two-factor&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('#code-error', 'The provided two factor authentication code was invalid.');

    visit('/dev/styleguide?fixture=page-two-factor&state=3')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Use a recovery code');

    visit('/dev/styleguide?fixture=page-two-factor&state=4')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#recovery_code")?.value', 'ABCD-EFGH');

    visit('/dev/styleguide?fixture=page-two-factor&state=5')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'The provided two factor recovery code was invalid.');

    visit('/dev/styleguide?fixture=page-two-factor&state=6')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main button[type="submit"]', 'Verifying…');
});
