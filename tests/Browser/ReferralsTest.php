<?php

use App\Enums\ReferralStatus;
use App\Enums\Tier;
use App\Models\Referral;
use App\Models\TaxReturn;
use App\Models\User;

it('renders portal referrals on desktop with hero card, copy button, referral code, 3-step explainer, invite form, and referrals table', function () {
    $user = User::factory()->create([
        'name' => 'Denise Robinson',
        'email' => 'denise.refs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'referral_code' => 'DENISE-R',
        'tier' => Tier::Hybrid,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    // 1. Rewarded referral ($50 reward)
    Referral::factory()->create([
        'referrer_id' => $user->id,
        'friend_name' => 'Marcus Thompson',
        'friend_email' => 'marcus.t@example.com',
        'status' => ReferralStatus::Rewarded,
        'reward_cents' => 5000,
        'created_at' => now()->subDays(5),
    ]);

    // 2. Signed up referral (When they file)
    Referral::factory()->create([
        'referrer_id' => $user->id,
        'friend_name' => 'Priya Shah',
        'friend_email' => 'priya.shah@example.com',
        'status' => ReferralStatus::SignedUp,
        'reward_cents' => null,
        'created_at' => now()->subDays(3),
    ]);

    // 3. Sent invite (—)
    Referral::factory()->create([
        'referrer_id' => $user->id,
        'friend_name' => 'Terrence Wallace',
        'friend_email' => 't.wallace@example.com',
        'status' => ReferralStatus::Sent,
        'reward_cents' => null,
        'created_at' => now()->subDay(),
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.refs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/referrals')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Referrals')
        ->assertSeeIn('main#main header', 'Account')
        ->assertSeeIn('main#main', 'Earn a reward for every friend who files with us.')
        ->assertSeeIn('#ref-title', 'Earn $25–$50 for every friend you refer')
        ->assertSeeIn('section[aria-labelledby="ref-title"]', 'Your personal referral link')
        ->assertSeeIn('section[aria-labelledby="ref-title"] b', 'DENISE-R')
        ->assertPresent('section[aria-labelledby="ref-title"] button:has-text("Copy")')
        ->assertPresent('main#main b:has-text("Share your link")')
        ->assertPresent('main#main b:has-text("They sign up")')
        ->assertPresent('main#main b:has-text("They file, you earn")')
        ->assertSeeIn('main#main', '$25–$50 once their return is filed.')
        ->assertSeeIn('#inv-title', 'Send an invite')
        ->assertPresent('#fname')
        ->assertPresent('#femail')
        ->assertSeeIn('main#main button[type="submit"]', 'Send invite')
        ->assertSeeIn('main#main', 'We send one email with your link.')
        ->assertSeeIn('#list-title', 'Your referrals')
        ->assertSeeIn('[data-slot="shell-head"]', '$50 earned so far')
        ->assertSeeIn('main#main table', 'Marcus Thompson')
        ->assertSeeIn('main#main table', 'marcus.t@example.com')
        ->assertSeeIn('main#main table', 'Rewarded')
        ->assertSeeIn('main#main table', '$50')
        ->assertSeeIn('main#main table', 'Priya Shah')
        ->assertSeeIn('main#main table', 'priya.shah@example.com')
        ->assertSeeIn('main#main table', 'Signed up')
        ->assertSeeIn('main#main table', 'When they file')
        ->assertSeeIn('main#main table', 'Terrence Wallace')
        ->assertSeeIn('main#main table', 't.wallace@example.com')
        ->assertSeeIn('main#main table', 'Invite sent')
        ->assertSeeIn('main#main table', '—');
});

it('renders empty referrals state with call to action', function () {
    $user = User::factory()->create([
        'email' => 'empty.refs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'referral_code' => 'EMPTY-REF',
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'empty.refs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/referrals')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'No referrals yet')
        ->assertSeeIn('main#main', 'Share your link or send an invite, and your friends will show up here.')
        ->assertSeeIn('main#main button', 'Copy my link');
});

it('allows submitting an invite from the referral form and displays success', function () {
    $user = User::factory()->create([
        'email' => 'sender.refs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'sender.refs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/referrals')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#fname', 'David Mitchell')
        ->fill('#femail', 'david.m@example.com')
        ->click('button[type="submit"]:has-text("Send invite")')
        ->assertSee('David Mitchell')
        ->assertSee('david.m@example.com')
        ->assertSee('Invite sent');

    expect(Referral::where('referrer_id', $user->id)->where('friend_email', 'david.m@example.com')->exists())->toBeTrue();
});

it('displays inline validation errors when submitting invalid email or self-referral', function () {
    $user = User::factory()->create([
        'email' => 'self.refs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'self.refs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/referrals')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#fname', 'Myself')
        ->fill('#femail', 'self.refs@example.com')
        ->click('button[type="submit"]:has-text("Send invite")')
        ->assertSeeIn('main#main', 'You cannot refer yourself.');
});

it('renders portal referrals properly on mobile viewport', function () {
    $user = User::factory()->create([
        'email' => 'mobile.refs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'referral_code' => 'MOB-REF',
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    Referral::factory()->create([
        'referrer_id' => $user->id,
        'friend_name' => 'Alice Parker',
        'friend_email' => 'alice.p@example.com',
        'status' => ReferralStatus::SignedUp,
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.refs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/referrals')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Referrals')
        ->assertSeeIn('#ref-title', 'Earn $25–$50 for every friend you refer')
        ->assertSeeIn('#inv-title', 'Send an invite')
        ->assertSeeIn('#list-title', 'Your referrals')
        ->assertSeeIn('main#main', 'Alice Parker');
});

it('renders styleguide referrals fixtures cleanly across all states', function () {
    visit('/dev/styleguide?fixture=page-portal-referrals&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Referrals')
        ->assertSeeIn('#ref-title', 'Earn $25–$50 for every friend you refer')
        ->assertSeeIn('main#main table', 'Marcus Thompson')
        ->assertSeeIn('main#main table', 'Priya Shah')
        ->assertSeeIn('main#main table', 'Terrence Wallace');

    visit('/dev/styleguide?fixture=page-portal-referrals&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'No referrals yet')
        ->assertSeeIn('main#main button', 'Copy my link');

    visit('/dev/styleguide?fixture=page-portal-referrals&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('[data-slot="shell-head"]', '$75 earned so far')
        ->assertSeeIn('main#main table', 'Alicia Keys')
        ->assertSeeIn('main#main table', '$25');
});
