<?php

use App\Enums\Tier;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PragmaRX\Google2FA\Google2FA;

it('renders portal security in OFF state with gate alert, Required chip, apps list, and setup CTA', function () {
    $user = User::factory()->create([
        'email' => 'mfa.off@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => null,
        'two_factor_secret' => null,
        'tier' => Tier::Hybrid,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'mfa.off@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/security')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Security & 2FA')
        ->assertSeeIn('main#main header', 'Account')
        ->assertSeeIn('main#main', 'Keep your tax documents safe.')
        ->assertPresent('[role="alert"]:has-text("Turn on two-factor authentication to continue.")')
        ->assertSeeIn('#mfa-title', 'Two-factor authentication')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Required')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Google Authenticator')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Microsoft Authenticator')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', '1Password')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Apple Passwords')
        ->assertPresent('button:has-text("Set up two-factor authentication")')
        ->assertSeeIn('#pw-title', 'Password')
        ->assertPresent('#cur')
        ->assertPresent('#new')
        ->assertPresent('#conf')
        ->assertPresent('button[type="submit"]:has-text("Update password")');
});

it('renders portal security in ON state with green On chip, success header, recovery codes, and relative password update time', function () {
    $user = User::factory()->withTwoFactor()->create([
        'email' => 'mfa.on@example.com',
        'password' => 'CorrectHorseBattery99!',
        'password_changed_at' => now()->subMonths(3),
        'tier' => Tier::Hybrid,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'mfa.on@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")')
        ->click('button:has-text("Use a recovery code")')
        ->fill('#recovery_code', 'recovery-code-1')
        ->click('button[type="submit"]:has-text("Continue")');

    visit('/portal/security')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Security & 2FA')
        ->assertNotPresent('[role="alert"]:has-text("Turn on two-factor authentication to continue.")')
        ->assertSeeIn('#mfa-title', 'Two-factor authentication')
        ->assertPresent('section[aria-labelledby="mfa-title"] [data-slot="badge"]:has-text("On")')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Two-factor authentication is on')
        ->assertPresent('section[aria-labelledby="mfa-title"] p:has-text("Recovery codes")')
        ->assertPresent('button:has-text("Turn off two-factor authentication")')
        ->assertSeeIn('#pw-title', 'Password')
        ->assertSeeIn('section[aria-labelledby="pw-title"]', 'Changed 3 months ago');
});

it('allows client to complete the full 2fa enable flow using a generated valid TOTP code', function () {
    $user = User::factory()->create([
        'email' => 'mfa.flow@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => null,
        'two_factor_secret' => null,
        'tier' => Tier::Hybrid,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'mfa.flow@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/user/confirm-password')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Confirm password")');

    visit('/portal/security')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('button:has-text("Set up two-factor authentication")')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Step 2 of 2')
        ->assertPresent('[role="img"][aria-label="QR code for your authenticator app"]')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', '1. Scan the QR code')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', '2. Enter the 6-digit code');

    $user->refresh();
    expect($user->two_factor_secret)->not->toBeNull();

    $secret = decrypt($user->two_factor_secret);
    $otp = app(Google2FA::class)->getCurrentOtp($secret);

    visit('/portal/security')
        ->on()->desktop()
        ->fill('input[name="code"]', $otp)
        ->click('button[type="submit"]:has-text("Turn on 2FA")')
        ->assertSee('Two-factor authentication is on');

    $user->refresh();
    expect($user->two_factor_confirmed_at)->not->toBeNull();
});

it('allows client to update their password from the password form', function () {
    $user = User::factory()->create([
        'email' => 'pw.update@example.com',
        'password' => 'OldPassword1234!',
        'two_factor_confirmed_at' => now(),
        'two_factor_secret' => null,
        'tier' => Tier::Hybrid,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'pw.update@example.com')
        ->fill('#password', 'OldPassword1234!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/security')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#cur', 'OldPassword1234!')
        ->fill('#new', 'NewStrongPassword2026!')
        ->fill('#conf', 'NewStrongPassword2026!')
        ->click('button[type="submit"]:has-text("Update password")')
        ->assertSee('Password updated');

    $user->refresh();
    expect(Hash::check('NewStrongPassword2026!', $user->password))->toBeTrue();
});

it('renders portal security cleanly on mobile viewport', function () {
    $user = User::factory()->create([
        'email' => 'mfa.mob@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => null,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mfa.mob@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/security')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Security & 2FA')
        ->assertPresent('[role="alert"]:has-text("Turn on two-factor authentication to continue.")')
        ->assertSeeIn('#mfa-title', 'Two-factor authentication')
        ->assertSeeIn('#pw-title', 'Password');
});

it('renders styleguide portal security fixture states cleanly', function () {
    visit('/dev/styleguide?fixture=page-portal-security&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Security & 2FA')
        ->assertPresent('[role="alert"]:has-text("Turn on two-factor authentication to continue.")')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Required')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Google Authenticator');

    visit('/dev/styleguide?fixture=page-portal-security&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Security & 2FA')
        ->assertPresent('[role="alert"]:has-text("Turn on two-factor authentication to continue.")')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Step 2 of 2')
        ->assertPresent('[role="img"][aria-label="QR code for your authenticator app"]')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', '1. Scan the QR code');

    visit('/dev/styleguide?fixture=page-portal-security&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Security & 2FA')
        ->assertNotPresent('[role="alert"]:has-text("Turn on two-factor authentication to continue.")')
        ->assertPresent('section[aria-labelledby="mfa-title"] [data-slot="badge"]:has-text("On")')
        ->assertSeeIn('section[aria-labelledby="mfa-title"]', 'Two-factor authentication is on')
        ->assertSeeIn('section[aria-labelledby="pw-title"]', 'Changed 3 months ago');
});
