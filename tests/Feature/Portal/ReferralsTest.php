<?php

use App\Enums\ReferralStatus;
use App\Enums\ReturnStatus;
use App\Enums\Tier;
use App\Mail\ReferralInvite;
use App\Models\Referral;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('guests are redirected to login from referrals page', function () {
    $response = $this->get(route('portal.referrals'));

    $response->assertRedirect(route('login'));
});

test('unverified users are redirected to email verification from referrals page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('portal.referrals'));

    $response->assertRedirect(route('verification.notice'));
});

test('users without 2fa are redirected to portal security from referrals page', function () {
    $user = User::factory()->create([
        'two_factor_confirmed_at' => null,
    ]);

    $response = $this->actingAs($user)->get(route('portal.referrals'));

    $response->assertRedirect(route('portal.security'));
});

test('authenticated user can view empty referrals page with exact copy', function () {
    $user = User::factory()->withTwoFactor()->create();

    $response = $this->actingAs($user)->get(route('portal.referrals'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/referrals')
        ->has('referrals', 0)
        ->where('referralCode', $user->referral_code)
        ->where('rewardRange', '$25–$50')
        ->has('referralLink')
    );
});

test('authenticated user sees their existing referrals in the list', function () {
    $user = User::factory()->withTwoFactor()->create();

    $ref1 = Referral::factory()->create([
        'referrer_id' => $user->id,
        'friend_name' => 'Alice Smith',
        'friend_email' => 'alice@example.com',
        'status' => ReferralStatus::Sent,
        'reward_cents' => null,
        'created_at' => now()->subDay(),
    ]);

    $ref2 = Referral::factory()->create([
        'referrer_id' => $user->id,
        'friend_name' => 'Bob Jones',
        'friend_email' => 'bob@example.com',
        'status' => ReferralStatus::Rewarded,
        'reward_cents' => 5000,
        'created_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('portal.referrals'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/referrals')
        ->has('referrals', 2)
        ->where('referrals.0.id', $ref2->id)
        ->where('referrals.0.status', 'rewarded')
        ->where('referrals.0.reward_formatted', '$50')
        ->where('referrals.1.id', $ref1->id)
        ->where('referrals.1.status', 'sent')
        ->where('referrals.1.reward_formatted', '—')
    );
});

test('user can submit referral invitation and mail is queued', function () {
    Mail::fake();

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->actingAs($user)->post(route('portal.referrals.store'), [
        'friend_name' => 'Sarah Connor',
        'friend_email' => 'sarah@example.com',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('referrals', [
        'referrer_id' => $user->id,
        'friend_name' => 'Sarah Connor',
        'friend_email' => 'sarah@example.com',
        'status' => 'sent',
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => $user->id,
        'action' => 'referral.sent',
        'entity' => 'Referral',
    ]);

    Mail::assertQueued(ReferralInvite::class, function ($mail) use ($user) {
        return $mail->hasTo('sarah@example.com')
            && str_contains($mail->referralLink, $user->referral_code);
    });
});

test('self referral is rejected with validation error', function () {
    Mail::fake();

    $user = User::factory()->withTwoFactor()->create([
        'email' => 'myself@example.com',
    ]);

    $response = $this->actingAs($user)->post(route('portal.referrals.store'), [
        'friend_name' => 'Myself',
        'friend_email' => 'myself@example.com',
    ]);

    $response->assertSessionHasErrors(['friend_email' => 'You cannot refer yourself.']);
    $this->assertDatabaseMissing('referrals', [
        'referrer_id' => $user->id,
        'friend_email' => 'myself@example.com',
    ]);

    Mail::assertNothingQueued();
});

test('duplicate referral to same friend email is rejected', function () {
    Mail::fake();

    $user = User::factory()->withTwoFactor()->create();

    Referral::factory()->create([
        'referrer_id' => $user->id,
        'friend_email' => 'friend@example.com',
    ]);

    $response = $this->actingAs($user)->post(route('portal.referrals.store'), [
        'friend_name' => 'Friend Again',
        'friend_email' => 'friend@example.com',
    ]);

    $response->assertSessionHasErrors(['friend_email' => 'You have already referred this email address.']);
    expect(Referral::where('referrer_id', $user->id)->count())->toBe(1);

    Mail::assertNothingQueued();
});

test('cookie attribution through registration links referred user and updates status to SignedUp', function () {
    $referrer = User::factory()->create([
        'referral_code' => 'OKJ-TEST99',
    ]);

    // Pre-existing referral invite
    $referral = Referral::factory()->create([
        'referrer_id' => $referrer->id,
        'friend_name' => 'New Friend',
        'friend_email' => 'newfriend@example.com',
        'status' => ReferralStatus::Sent,
    ]);

    // User visits with referral query, getting cookie
    $response = $this->get(route('contact', ['ref' => 'OKJ-TEST99']));
    $response->assertPlainCookie('okojie_referral', 'OKJ-TEST99');

    // User registers with the cookie
    $registerResponse = $this->withUnencryptedCookie('okojie_referral', 'OKJ-TEST99')
        ->post(route('register.store'), [
            'name' => 'New Friend',
            'email' => 'newfriend@example.com',
            'password' => 'CorrectHorseBattery99!',
            'tier' => 'hybrid',
        ]);

    $registerResponse->assertRedirect();

    $newUser = User::where('email', 'newfriend@example.com')->first();
    expect($newUser)->not->toBeNull();
    expect($newUser->referred_by_code)->toBe('OKJ-TEST99');

    $referral->refresh();
    expect($referral->status)->toBe(ReferralStatus::SignedUp);
    expect($referral->friend_user_id)->toBe($newUser->id);
});

test('status progression: when referred user return reaches EFiled, referral is marked Filed', function () {
    $referrer = User::factory()->create();
    $friend = User::factory()->create([
        'tier' => Tier::Hybrid,
        'referred_by_code' => $referrer->referral_code,
    ]);

    $referral = Referral::factory()->create([
        'referrer_id' => $referrer->id,
        'friend_user_id' => $friend->id,
        'friend_email' => $friend->email,
        'status' => ReferralStatus::SignedUp,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $friend->id,
        'tier' => Tier::Hybrid,
        'status' => ReturnStatus::InPreparation,
    ]);

    expect($referral->status)->toBe(ReferralStatus::SignedUp);

    // Update tax return to EFiled
    $taxReturn->update([
        'status' => ReturnStatus::EFiled,
    ]);

    $referral->refresh();
    expect($referral->status)->toBe(ReferralStatus::Filed);
});

test('status progression: staff sets Rewarded with reward_cents from config by tier', function () {
    $referrer = User::factory()->create();
    $friend = User::factory()->create();

    TaxReturn::factory()->create([
        'user_id' => $friend->id,
        'tier' => Tier::Hybrid,
        'status' => ReturnStatus::EFiled,
    ]);

    $referral = Referral::factory()->create([
        'referrer_id' => $referrer->id,
        'friend_user_id' => $friend->id,
        'friend_email' => $friend->email,
        'status' => ReferralStatus::Filed,
        'reward_cents' => null,
    ]);

    // Mark rewarded for Hybrid tier (5000 cents = $50)
    $referral->markRewarded(Tier::Hybrid);

    $referral->refresh();
    expect($referral->status)->toBe(ReferralStatus::Rewarded);
    expect($referral->reward_cents)->toBe(5000);

    // Another referral with Upload & Go (2500 cents = $25)
    $referral2 = Referral::factory()->create([
        'referrer_id' => $referrer->id,
        'friend_email' => 'friend2@example.com',
        'status' => ReferralStatus::Filed,
    ]);

    $referral2->markRewarded(Tier::UploadAndGo);

    $referral2->refresh();
    expect($referral2->status)->toBe(ReferralStatus::Rewarded);
    expect($referral2->reward_cents)->toBe(2500);
});

test('IDOR: user A only sees their own referrals on index', function () {
    $userA = User::factory()->withTwoFactor()->create();
    $userB = User::factory()->withTwoFactor()->create();

    $refA = Referral::factory()->create([
        'referrer_id' => $userA->id,
        'friend_name' => 'Friend of A',
    ]);

    $refB = Referral::factory()->create([
        'referrer_id' => $userB->id,
        'friend_name' => 'Friend of B',
    ]);

    $response = $this->actingAs($userA)->get(route('portal.referrals'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/referrals')
        ->has('referrals', 1)
        ->where('referrals.0.id', $refA->id)
        ->where('referrals.0.friend_name', 'Friend of A')
    );
});

test('referrals index and invite mail use the short referral.redirect link', function () {
    Mail::fake();

    $user = User::factory()->withTwoFactor()->create([
        'referral_code' => 'OKJ-674SU5',
    ]);

    $expectedLink = route('referral.redirect', ['code' => 'OKJ-674SU5']);
    expect($expectedLink)->toEndWith('/r/OKJ-674SU5');

    $this->actingAs($user)
        ->get(route('portal.referrals'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('portal/referrals')
            ->where('referralCode', 'OKJ-674SU5')
            ->where('referralLink', $expectedLink)
            ->where('rewardRange', '$25–$50')
        );

    $this->actingAs($user)
        ->post(route('portal.referrals.store'), [
            'friend_name' => 'Devon Miles',
            'friend_email' => 'devon@example.com',
        ])
        ->assertRedirect();

    Mail::assertQueued(ReferralInvite::class, function (ReferralInvite $mail) use ($expectedLink): bool {
        return $mail->hasTo('devon@example.com')
            && $mail->referralLink === $expectedLink;
    });
});

test('referral redirect route redirects valid and unknown codes identically while preserving extra query params and setting attribution cookie', function () {
    $referrer = User::factory()->create([
        'referral_code' => 'OKJ-674SU5',
    ]);

    // 1. Existing referral code redirects 302 to /contact?ref=OKJ-674SU5
    $knownResponse = $this->get(route('referral.redirect', ['code' => $referrer->referral_code]));
    $knownResponse->assertRedirect(route('contact', ['ref' => 'OKJ-674SU5']));

    // Following the redirect sets the 30-day attribution cookie on /contact
    $contactResponse = $this->get($knownResponse->headers->get('Location'));
    $contactResponse->assertOk();
    $contactResponse->assertPlainCookie('okojie_referral', 'OKJ-674SU5');

    // 2. Unknown referral code with valid shape redirects identically (no enumeration)
    $unknownResponse = $this->get(route('referral.redirect', ['code' => 'OKJ-999ZZZ']));
    $unknownResponse->assertRedirect(route('contact', ['ref' => 'OKJ-999ZZZ']));

    // 3. Extra query parameters (e.g. utm_*) are preserved
    $utmResponse = $this->get(route('referral.redirect', [
        'code' => 'OKJ-674SU5',
        'utm_source' => 'email',
        'utm_campaign' => 'spring-tax',
    ]));
    $utmResponse->assertRedirect(route('contact', [
        'ref' => 'OKJ-674SU5',
        'utm_source' => 'email',
        'utm_campaign' => 'spring-tax',
    ]));
});

test('referral redirect route strips ref when code shape is invalid', function (string $invalidCode) {
    $response = $this->get("/r/{$invalidCode}?utm_source=social&ref=INJECTED");

    $response->assertRedirect(route('contact', ['utm_source' => 'social']));
})->with([
    'too short' => ['ab'],
    'too long' => [str_repeat('A', 31)],
    'special chars' => ['OKJ!123'],
    'underscore' => ['OKJ_123456'],
]);
