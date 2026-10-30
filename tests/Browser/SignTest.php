<?php

use App\Enums\ReturnStatus;
use App\Enums\Tier;
use App\Models\TaxReturn;
use App\Models\User;

it('enforces the sign button enablement rule strictly (disabled until consent checked and name > 3 chars)', function () {
    $user = User::factory()->create([
        'name' => 'Denise Robinson',
        'email' => 'denise.sign@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::ReadyForReview,
        'return_summary' => [
            'federal' => [
                'result' => 'refund',
                'amount_cents' => 241800,
            ],
            'state' => [
                'code' => 'PA',
                'result' => 'even',
                'amount_cents' => 0,
            ],
            'bank_last4' => '4471',
            'filing_status' => 'head_of_household',
            'filing_method' => 'e-file',
            'forms' => [
                [
                    'name' => 'Form 1040 · U.S. Individual Income Tax Return',
                    'pages' => 14,
                    'document_id' => null,
                ],
            ],
        ],
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.sign@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/sign/{$taxReturn->id}")
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Review and e-sign your return')
        ->assertSeeIn('main#main header', 'Step 3 of 5 · Ready for review')
        ->assertSeeIn('#sum-title', 'Your prepared return')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', 'Federal refund')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', '$2,418')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', 'Pennsylvania')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', '$0')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', 'Form 1040')
        ->assertSeeIn('#sign-title', 'Sign Form 8879')
        ->assertPresent('button#sign-btn:disabled')
        // Check only consent box -> still disabled
        ->check('#consent_7216')
        ->assertPresent('button#sign-btn:disabled')
        // Fill name with <= 3 characters -> still disabled
        ->fill('#typed_signature', 'Joe')
        ->assertPresent('button#sign-btn:disabled')
        // Fill name with > 3 characters -> enabled
        ->fill('#typed_signature', 'Denise Robinson')
        ->assertNotPresent('button#sign-btn:disabled')
        // Uncheck consent box -> disabled again
        ->uncheck('#consent_7216')
        ->assertPresent('button#sign-btn:disabled')
        // Re-check consent box -> enabled again
        ->check('#consent_7216')
        ->assertNotPresent('button#sign-btn:disabled');
});

it('blocks access to sign page for ineligible returns not in ReadyForReview status', function () {
    $user = User::factory()->create([
        'name' => 'Ineligible User',
        'email' => 'ineligible.sign@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::InPreparation,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'ineligible.sign@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/sign/{$taxReturn->id}")
        ->on()->desktop()
        ->assertSee('403');
});

it('completes the full e-signature flow, updates status to ESigned, and redirects to overview', function () {
    $user = User::factory()->create([
        'name' => 'Marcus Signer',
        'email' => 'marcus.sign@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'marcus.sign@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/sign/{$taxReturn->id}")
        ->on()->desktop()
        ->assertNoSmoke()
        ->check('#consent_7216')
        ->fill('#typed_signature', 'Marcus Signer')
        ->click('button#sign-btn')
        ->assertNoSmoke()
        ->assertSee('Return signed successfully!');

    $taxReturn->refresh();
    expect($taxReturn->status)->toBe(ReturnStatus::ESigned);
    expect($taxReturn->signed_at)->not->toBeNull();
});

it('renders neutral note when return summary has not yet been added by preparer', function () {
    $user = User::factory()->create([
        'name' => 'No Summary User',
        'email' => 'nosummary@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::ReadyForReview,
        'return_summary' => null,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'nosummary@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/sign/{$taxReturn->id}")
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee("Your preparer hasn't added the summary yet")
        ->assertSeeIn('#sum-title', 'Your prepared return')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', 'Taxpayer')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', 'No Summary User')
        ->assertSeeIn('#sign-title', 'Sign Form 8879');
});

it('renders the portal sign page cleanly on mobile viewport', function () {
    $user = User::factory()->create([
        'name' => 'Mobile Signer',
        'email' => 'mobile.sign@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.sign@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/sign/{$taxReturn->id}")
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Review and e-sign your return')
        ->assertSeeIn('#sum-title', 'Your prepared return')
        ->assertSeeIn('#after-title', 'After you sign')
        ->assertSeeIn('#q-title', 'Something look wrong?');
});

it('renders styleguide portal sign fixture states cleanly', function () {
    // State 0: Ready for review (Not signed)
    visit('/dev/styleguide?fixture=page-portal-sign&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Review and e-sign your return')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', 'Federal refund')
        ->assertSeeIn('section[aria-labelledby="sum-title"]', '$2,418')
        ->assertSeeIn('#sign-title', 'Sign Form 8879')
        ->assertPresent('button#sign-btn:disabled');

    // State 1: Ready for review without return summary
    visit('/dev/styleguide?fixture=page-portal-sign&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee("Your preparer hasn't added the summary yet")
        ->assertSeeIn('#sign-title', 'Sign Form 8879');

    // State 2: Signed (Done card)
    visit('/dev/styleguide?fixture=page-portal-sign&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('#done-title', 'Signed. We’re e-filing your return.')
        ->assertNotPresent('#sign-title')
        ->assertSeeIn('#page', 'Back to overview')
        ->assertSeeIn('#page', 'View documents');
});
