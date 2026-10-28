<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when updating appearance preferences', function () {
    $this->patch(route('appearance.preferences.update'), [
        'compact_tables' => true,
    ])->assertRedirect(route('login'));
});

test('authenticated user can update compact_tables and reduce_motion preferences individually and together', function () {
    $user = User::factory()->create();

    expect($user->compact_tables)->toBeFalse()
        ->and($user->reduce_motion)->toBeFalse();

    // Update compact_tables only
    $this->actingAs($user)
        ->from(route('appearance.edit'))
        ->patch(route('appearance.preferences.update'), [
            'compact_tables' => true,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('appearance.edit'));

    $user->refresh();
    expect($user->compact_tables)->toBeTrue()
        ->and($user->reduce_motion)->toBeFalse();

    // Update reduce_motion only
    $this->actingAs($user)
        ->from(route('appearance.edit'))
        ->patch(route('appearance.preferences.update'), [
            'reduce_motion' => true,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('appearance.edit'));

    $user->refresh();
    expect($user->compact_tables)->toBeTrue()
        ->and($user->reduce_motion)->toBeTrue();

    // Update both back to false
    $this->actingAs($user)
        ->from(route('appearance.edit'))
        ->patch(route('appearance.preferences.update'), [
            'compact_tables' => false,
            'reduce_motion' => false,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('appearance.edit'));

    $user->refresh();
    expect($user->compact_tables)->toBeFalse()
        ->and($user->reduce_motion)->toBeFalse();
});

test('non-boolean values are rejected when updating appearance preferences', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('appearance.edit'))
        ->patch(route('appearance.preferences.update'), [
            'compact_tables' => 'not-a-bool',
            'reduce_motion' => ['invalid'],
        ])
        ->assertRedirect(route('appearance.edit'))
        ->assertSessionHasErrors(['compact_tables', 'reduce_motion']);

    $user->refresh();
    expect($user->compact_tables)->toBeFalse()
        ->and($user->reduce_motion)->toBeFalse();
});

test('user cannot modify another users preferences', function () {
    $actor = User::factory()->create();
    $other = User::factory()->create([
        'compact_tables' => false,
        'reduce_motion' => false,
    ]);

    $this->actingAs($actor)
        ->from(route('appearance.edit'))
        ->patch(route('appearance.preferences.update'), [
            'id' => $other->id,
            'user_id' => $other->id,
            'compact_tables' => true,
            'reduce_motion' => true,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('appearance.edit'));

    $other->refresh();
    $actor->refresh();

    expect($other->compact_tables)->toBeFalse()
        ->and($other->reduce_motion)->toBeFalse()
        ->and($actor->compact_tables)->toBeTrue()
        ->and($actor->reduce_motion)->toBeTrue();
});

test('shared inertia props expose saved appearance preferences under auth.user.preferences', function () {
    $user = User::factory()->create([
        'compact_tables' => true,
        'reduce_motion' => false,
    ]);

    $this->actingAs($user)
        ->get(route('appearance.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/appearance')
            ->where('auth.user.preferences', [
                'compactTables' => true,
                'reduceMotion' => false,
            ])
        );
});
