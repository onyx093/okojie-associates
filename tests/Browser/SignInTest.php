<?php

it('renders the sign in screen with split layout, form, passkey button, and trust badges with no smoke errors', function () {
    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Secure client portal')
        ->assertSeeIn('main#main h1', 'Sign in to Okojie Online')
        ->assertSeeIn('main#main p', 'Upload documents, check your return, e-sign and pay, all in one place.')
        ->assertSeeIn('main#main label[for="email"]', 'Email address')
        ->assertSeeIn('main#main label[for="password"]', 'Password')
        ->assertSeeIn('main#main label[for="remember"]', 'Keep me signed in on this device')
        ->assertSeeIn('main#main a', 'Forgot password?')
        ->assertSeeIn('main#main button[type="submit"]', 'Sign in')
        ->assertSeeIn('main#main', 'Start your return')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Encrypted portal')
        ->assertSeeIn('aside[aria-hidden="true"]', '2FA on every account')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Your 2026 return');
});

it('renders the sign in screen on mobile viewport cleanly with single column and no smoke errors', function () {
    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Sign in to Okojie Online')
        ->assertSeeIn('main#main button[type="submit"]', 'Sign in')
        ->assertSeeIn('main#main', 'Start your return');
});

it('displays an alert note when invalid credentials are submitted', function () {
    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'unknown@example.com')
        ->fill('#password', 'wrong-password')
        ->click('button[type="submit"]:has-text("Sign in")')
        ->assertSeeIn('[role="alert"]', 'Incorrect email or password.');
});

it('carries over query parameters to the register switch link', function () {
    visit('/login?tier=hybrid&next=%2Fportal%2Foverview')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript(
            'document.querySelector(\'main#main a[href*="/register"]\')?.getAttribute("href")?.includes("tier=hybrid")',
            true
        )
        ->assertScript(
            'document.querySelector(\'main#main a[href*="/register"]\')?.getAttribute("href")?.includes("next=%2Fportal%2Foverview") || document.querySelector(\'main#main a[href*="/register"]\')?.getAttribute("href")?.includes("next=/portal/overview")',
            true
        );
});

it('renders styleguide page-sign-in fixture states cleanly', function () {
    visit('/dev/styleguide?fixture=page-sign-in&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Sign in to Okojie Online');

    visit('/dev/styleguide?fixture=page-sign-in&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#email")?.value', 'denise.r@example.com');

    visit('/dev/styleguide?fixture=page-sign-in&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('[role="alert"]', "That email and password don't match. Check them and try again.");
});
