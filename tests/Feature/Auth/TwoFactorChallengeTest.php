<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());
});

test('two factor challenge redirects to login when not authenticated', function () {
    $response = $this->get(route('two-factor.login'));

    $response->assertRedirect(route('login'));
});

test('two factor challenge can be rendered', function () {
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->get(route('two-factor.login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/two-factor-challenge'),
        );
});

test('user can authenticate using two factor recovery code', function () {
    $user = User::factory()->withTwoFactor()->create();

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response = $this->post(route('two-factor.login.store'), [
        'recovery_code' => 'recovery-code-1',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('portal.overview'));
});

test('user cannot authenticate with invalid two factor code', function () {
    $user = User::factory()->withTwoFactor()->create();

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response = $this->post(route('two-factor.login.store'), [
        'code' => '000000',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('code');
});

test('user cannot authenticate with invalid two factor recovery code', function () {
    $user = User::factory()->withTwoFactor()->create();

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response = $this->post(route('two-factor.login.store'), [
        'recovery_code' => 'invalid-recovery-code',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('recovery_code');
});
