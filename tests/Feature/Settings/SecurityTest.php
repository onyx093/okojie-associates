<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('security page is displayed', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    Features::passkeys([
        'confirmPassword' => true,
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security')
            ->where('canManagePasskeys', true)
            ->where('passkeys', [])
            ->where('canManageTwoFactor', true)
            ->where('twoFactorEnabled', false),
        );
});

test('security page requires password confirmation when enabled', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    $user = User::factory()->create();

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $response = $this->actingAs($user)
        ->get(route('security.edit'));

    $response->assertRedirect(route('password.confirm'));
});

test('security page renders without two factor when feature is disabled', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    config(['fortify.features' => []]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security')
            ->where('canManagePasskeys', false)
            ->where('passkeys', [])
            ->where('canManageTwoFactor', false)
            ->missing('twoFactorEnabled')
            ->missing('requiresConfirmation'),
        );
});

test('password can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('security.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('security.edit'));

    $user->refresh();
    expect(Hash::check('new-password', $user->password))->toBeTrue()
        ->and($user->password_changed_at)->not->toBeNull();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security')
            ->where('passwordChangedAt', $user->password_changed_at?->toIso8601String())
        );
});

test('correct password must be provided to update password', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('security.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect(route('security.edit'));
});

test('security page lists only the authenticated users sessions with device and isCurrent flag', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $currentSessionId = str_repeat('a', 40);
    $otherSessionId = str_repeat('b', 40);
    $anotherUsersSessionId = str_repeat('c', 40);

    DB::table('sessions')->insert([
        [
            'id' => $currentSessionId,
            'user_id' => $user->id,
            'ip_address' => '192.0.2.10',
            'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'payload' => base64_encode(serialize([])),
            'last_activity' => time(),
        ],
        [
            'id' => $otherSessionId,
            'user_id' => $user->id,
            'ip_address' => '198.51.100.25',
            'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
            'payload' => base64_encode(serialize([])),
            'last_activity' => time() - 7200,
        ],
        [
            'id' => $anotherUsersSessionId,
            'user_id' => $otherUser->id,
            'ip_address' => '203.0.113.99',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
            'payload' => base64_encode(serialize([])),
            'last_activity' => time() - 60,
        ],
    ]);

    $this->actingAs($user)
        ->withCookie((string) config('session.cookie'), $currentSessionId)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('security.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/security')
            ->has('sessions', 2)
            ->where('sessions.0.id', $currentSessionId)
            ->where('sessions.0.ip', '192.0.2.10')
            ->where('sessions.0.device', 'Chrome on macOS')
            ->where('sessions.0.isCurrent', true)
            ->where('sessions.1.id', $otherSessionId)
            ->where('sessions.1.ip', '198.51.100.25')
            ->where('sessions.1.device', 'Safari on iPhone')
            ->where('sessions.1.isCurrent', false)
        );
});

test('destroying other sessions removes only the authenticated users non-current sessions and validates password', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    // Unauthenticated request is blocked
    $this->delete(route('settings.security.sessions.destroy'))
        ->assertRedirect(route('login'));

    $currentSessionId = str_repeat('d', 40);
    $userSecondSessionId = str_repeat('e', 40);
    $otherUserSessionId = str_repeat('f', 40);

    DB::table('sessions')->insert([
        [
            'id' => $currentSessionId,
            'user_id' => $user->id,
            'ip_address' => '192.0.2.10',
            'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/122.0.0.0',
            'payload' => base64_encode(serialize([])),
            'last_activity' => time(),
        ],
        [
            'id' => $userSecondSessionId,
            'user_id' => $user->id,
            'ip_address' => '198.51.100.25',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/122.0.0.0',
            'payload' => base64_encode(serialize([])),
            'last_activity' => time() - 3600,
        ],
        [
            'id' => $otherUserSessionId,
            'user_id' => $otherUser->id,
            'ip_address' => '203.0.113.99',
            'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) Firefox/123.0',
            'payload' => base64_encode(serialize([])),
            'last_activity' => time() - 1800,
        ],
    ]);

    // Wrong password rejected
    $this->actingAs($user)
        ->withCookie((string) config('session.cookie'), $currentSessionId)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->from(route('security.edit'))
        ->delete(route('settings.security.sessions.destroy'), [
            'current_password' => 'wrong-password',
        ])
        ->assertSessionHasErrors('current_password')
        ->assertRedirect(route('security.edit'));

    expect(DB::table('sessions')->where('id', $userSecondSessionId)->exists())->toBeTrue();

    // Correct password removes only user's other session
    $this->actingAs($user)
        ->withCookie((string) config('session.cookie'), $currentSessionId)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->from(route('security.edit'))
        ->delete(route('settings.security.sessions.destroy'), [
            'current_password' => 'password',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('security.edit'));

    expect(DB::table('sessions')->where('id', $currentSessionId)->exists())->toBeTrue()
        ->and(DB::table('sessions')->where('id', $userSecondSessionId)->exists())->toBeFalse()
        ->and(DB::table('sessions')->where('id', $otherUserSessionId)->exists())->toBeTrue();
});
