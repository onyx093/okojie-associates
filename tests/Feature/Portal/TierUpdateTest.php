<?php

use App\Enums\Tier;
use App\Models\User;

test('guests cannot update service tier and are redirected to login', function () {
    $response = $this->patch(route('portal.tier.update'), [
        'tier' => Tier::Hybrid->value,
    ]);

    $response->assertRedirect(route('login'));
});

test('authenticated user can update their service tier', function () {
    $user = User::factory()->create([
        'tier' => null,
    ]);

    $this->actingAs($user);

    $response = $this->patch(route('portal.tier.update'), [
        'tier' => Tier::Hybrid->value,
    ]);

    $response->assertRedirect(route('portal.overview'));
    $response->assertSessionHas('success');

    expect($user->fresh()->tier)->toBe(Tier::Hybrid);
});

test('updating service tier requires a valid tier enum', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->patch(route('portal.tier.update'), [
        'tier' => 'invalid_tier_value',
    ]);

    $response->assertSessionHasErrors(['tier']);
});
