<?php

use App\Models\Message;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('client can view messages page with empty state', function () {
    $client = User::factory()->withTwoFactor()->create();

    $response = $this->actingAs($client)->get(route('portal.messages'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/messages')
        ->has('messages', 0)
    );
});

test('client sees messages from preparer and viewing marks them as read', function () {
    $staff = User::factory()->preparer()->withTwoFactor()->create(['name' => 'Jane Preparer']);
    $client = User::factory()->withTwoFactor()->create();

    $unreadMessage = Message::factory()->create([
        'from_user_id' => $staff->id,
        'to_user_id' => $client->id,
        'body' => 'Please upload your 1099-INT form.',
        'read_at' => null,
    ]);

    $response = $this->actingAs($client)->get(route('portal.messages'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/messages')
        ->has('messages', 1)
        ->where('messages.0.id', $unreadMessage->id)
        ->where('messages.0.body', 'Please upload your 1099-INT form.')
        ->where('messages.0.fromName', 'Jane Preparer')
        ->where('messages.0.isFromStaff', true)
    );

    // Assert that the message was marked as read in the database
    expect($unreadMessage->fresh()->read_at)->not->toBeNull();
});

test('client can mark messages as read via post endpoint', function () {
    $staff = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();

    $unreadMessage = Message::factory()->create([
        'from_user_id' => $staff->id,
        'to_user_id' => $client->id,
        'body' => 'Your draft is ready.',
        'read_at' => null,
    ]);

    expect($unreadMessage->read_at)->toBeNull();

    $response = $this->actingAs($client)->post(route('portal.messages.read'));

    $response->assertRedirect();
    expect($unreadMessage->fresh()->read_at)->not->toBeNull();
});

test('unauthenticated or unverified user cannot view messages', function () {
    $this->get(route('portal.messages'))->assertRedirect(route('login'));

    if (Features::enabled(Features::emailVerification())) {
        $unverified = User::factory()->unverified()->create();
        $this->actingAs($unverified)->get(route('portal.messages'))->assertRedirect(route('verification.notice'));
    }
});
