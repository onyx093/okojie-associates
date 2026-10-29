<?php

it('renders the register screen with split layout, form fields, password strength meter, terms link, and trust badges with no smoke errors', function () {
    visit('/register')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Start your return')
        ->assertSeeIn('main#main h1', 'Create your account')
        ->assertSeeIn('main#main p', 'It takes a minute. You’ll set up two-factor authentication next to keep your documents safe.')
        ->assertSeeIn('main#main label[for="name"]', 'Full name')
        ->assertSeeIn('main#main label[for="email"]', 'Email address')
        ->assertSeeIn('main#main label[for="password"]', 'Password')
        ->assertSeeIn('main#main label[for="password_confirmation"]', 'Confirm password')
        ->assertSeeIn('main#main', 'I agree to the')
        ->assertSeeIn('main#main a', 'Terms')
        ->assertSeeIn('main#main a', 'Privacy Policy')
        ->assertSeeIn('main#main button[type="submit"]', 'Create account')
        ->assertSeeIn('main#main', 'Already have an account?')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Encrypted portal')
        ->assertSeeIn('aside[aria-hidden="true"]', '2FA on every account')
        ->assertSeeIn('aside[aria-hidden="true"]', 'Your 2026 return');
});

it('renders the register screen on mobile viewport cleanly with single column and no smoke errors', function () {
    visit('/register')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Create your account')
        ->assertSeeIn('main#main button[type="submit"]', 'Create account')
        ->assertSeeIn('main#main', 'Already have an account?');
});

it('validates client-side constraints for empty name, password mismatch, and unchecked terms', function () {
    visit('/register')
        ->on()->desktop()
        ->assertNoSmoke()
        ->click('button[type="submit"]:has-text("Create account")')
        ->assertSeeIn('main#main', 'Please enter your full name.')
        ->fill('#name', 'Test User')
        ->fill('#email', 'test@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->fill('#password_confirmation', 'DifferentPass123!')
        ->click('button[type="submit"]:has-text("Create account")')
        ->assertSeeIn('main#main', "Passwords don't match.")
        ->fill('#password_confirmation', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Create account")')
        ->assertSeeIn('#terms-error', 'You must agree to the Terms and Privacy Policy.');
});

it('carries over query parameters to the sign in switch link', function () {
    visit('/register?tier=hybrid&next=%2Fportal%2Foverview&ref=OKJ-123456')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript(
            'document.querySelector(\'main#main a[href*="/login"]\')?.getAttribute("href")?.includes("tier=hybrid")',
            true
        )
        ->assertScript(
            'document.querySelector(\'main#main a[href*="/login"]\')?.getAttribute("href")?.includes("next=%2Fportal%2Foverview") || document.querySelector(\'main#main a[href*="/login"]\')?.getAttribute("href")?.includes("next=/portal/overview")',
            true
        )
        ->assertScript(
            'document.querySelector(\'main#main a[href*="/login"]\')?.getAttribute("href")?.includes("ref=OKJ-123456")',
            true
        );
});

it('renders styleguide page-register fixture states cleanly', function () {
    visit('/dev/styleguide?fixture=page-register&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Create your account');

    visit('/dev/styleguide?fixture=page-register&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertScript('document.querySelector("#email")?.value', 'denise.r@example.com');

    visit('/dev/styleguide?fixture=page-register&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'An account may already exist for this email. Try signing in.');

    visit('/dev/styleguide?fixture=page-register&state=3')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Password must be at least 12 characters.');

    visit('/dev/styleguide?fixture=page-register&state=4')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', "Passwords don't match.");

    visit('/dev/styleguide?fixture=page-register&state=5')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('#terms-error', 'You must agree to the Terms and Privacy Policy.');
});
