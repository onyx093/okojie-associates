<?php

use App\Models\User;

test('guests accessing portal are redirected to login', function () {
    $response = $this->get(route('portal.overview'));

    $response->assertRedirect(route('login'));
});

test('unverified users accessing portal are redirected to email verification', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertRedirect(route('verification.notice'));
});

test('verified users without two-factor confirmed are redirected to portal security', function () {
    $user = User::factory()->create([
        'two_factor_confirmed_at' => null,
    ]);

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertRedirect(route('portal.security'));
    $response->assertSessionHas('error', 'Two-factor authentication is required to access your client portal.');
});

test('verified users without two-factor can access portal security page', function () {
    $user = User::factory()->create([
        'two_factor_confirmed_at' => null,
    ]);

    $response = $this->actingAs($user)->get(route('portal.security'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('portal/security'));
});

test('verified users with two-factor confirmed can access portal overview', function () {
    $user = User::factory()->withTwoFactor()->create();

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('portal/overview'));
});
