<?php

use App\Models\User;

test('security headers are present on web responses', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertHeader('X-Frame-Options', 'DENY');
    $response->assertHeader('X-Content-Type-Options', 'nosniff');
    $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    expect($response->headers->get('Permissions-Policy'))->toContain('camera=()');
    expect($response->headers->get('Permissions-Policy'))->toContain('payment=(self "https://js.stripe.com")');

    $csp = $response->headers->get('Content-Security-Policy');
    expect($csp)->not->toBeNull();
    expect($csp)->toContain("default-src 'self'");
    expect($csp)->toContain('https://js.stripe.com');
    expect($csp)->toContain('https://challenges.cloudflare.com');
    expect($csp)->toContain('nonce-');
});

test('x-robots-tag noindex is set on auth, portal, and admin routes', function () {
    // Public home route does not have noindex header
    $homeResponse = $this->get(route('home'));
    expect($homeResponse->headers->has('X-Robots-Tag'))->toBeFalse();

    // Login page
    $loginResponse = $this->get(route('login'));
    $loginResponse->assertHeader('X-Robots-Tag', 'noindex, nofollow');

    // Register page
    $registerResponse = $this->get(route('register'));
    $registerResponse->assertHeader('X-Robots-Tag', 'noindex, nofollow');

    // Portal route
    $user = User::factory()->withTwoFactor()->create();
    $portalResponse = $this->actingAs($user)->get(route('portal.overview'));
    $portalResponse->assertHeader('X-Robots-Tag', 'noindex, nofollow');

    // Admin route
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $adminResponse = $this->actingAs($admin)->get(route('admin.clients.index'));
    $adminResponse->assertHeader('X-Robots-Tag', 'noindex, nofollow');
});
