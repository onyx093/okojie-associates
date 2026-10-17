<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('login screen can be rendered with access page in signin mode', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('auth/access')
        ->where('mode', 'signin')
    );
});

test('/login with mode=signup 301 redirects to /register', function () {
    $response = $this->get('/login?mode=signup');

    $response->assertStatus(301);
    $response->assertRedirect('/register');
});

test('/login with mode=signup preserves query params', function () {
    $response = $this->get('/login?mode=signup&tier=hybrid&next=%2Fportal');

    $response->assertStatus(301);
    $response->assertRedirect('/register?tier=hybrid&next=%2Fportal');
});

test('users can authenticate using the login screen and land on portal overview', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/portal/overview');
});

test('login honors stored intended URL', function () {
    $user = User::factory()->create();

    // Guest tries to access protected page
    $this->get('/portal/overview');

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/portal/overview');
});

test('authenticated users are redirected away from login and register to portal overview', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/login')->assertRedirect('/portal/overview');
    $this->actingAs($user)->get('/register')->assertRedirect('/portal/overview');
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password and receive generic error', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors([
        'email' => 'Incorrect email or password.',
    ]);
});

test('users are rate limited with generic throttle message after 5 attempts', function () {
    $user = User::factory()->create();

    for ($i = 0; $i < 5; $i++) {
        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);
    }

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors([
        'email' => 'Too many attempts. Please wait a few minutes.',
    ]);
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));
    $this->assertGuest();
});

test('users with legacy bcrypt password can authenticate and are seamlessly rehashed to argon2id', function () {
    $user = User::factory()->create();

    // Directly set legacy bcrypt hash in DB
    $bcryptHash = password_hash('Passw0rd!ChangeMe', PASSWORD_BCRYPT);
    DB::table('users')
        ->where('id', $user->id)
        ->update(['password' => $bcryptHash]);

    $user->refresh();
    expect(password_get_info($user->password)['algoName'])->toBe('bcrypt');

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'Passw0rd!ChangeMe',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/portal/overview');

    $user->refresh();
    expect(password_get_info($user->password)['algoName'])->toBe('argon2id');
});
