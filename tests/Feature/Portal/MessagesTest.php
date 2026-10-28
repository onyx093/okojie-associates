<?php

use App\Models\AuditLog;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
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

test('portal messages exposes preparer prop when assigned and null when unassigned', function () {
    $client = User::factory()->withTwoFactor()->create();

    // Unassigned return -> preparer is null
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => null,
    ]);

    $this->actingAs($client)
        ->get(route('portal.messages'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('portal/messages')
            ->where('preparer', null)
        );

    // Assigned preparer -> preparer details included
    $preparer = User::factory()->preparer()->create([
        'name' => 'Adaeze Okojie',
        'title' => 'Enrolled Agent',
        'office' => 'germantown-ave',
    ]);
    $taxReturn->update(['preparer_id' => $preparer->id]);

    $this->actingAs($client)
        ->get(route('portal.messages'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('portal/messages')
            ->where('preparer', [
                'name' => 'Adaeze Okojie',
                'title' => 'Enrolled Agent',
                'office' => 'germantown-ave',
                'officeLabel' => '5601 Germantown Ave, Philadelphia',
                'avatarUrl' => null,
            ])
        );
});

test('client can view and download their own message attachment while another client is forbidden', function () {
    Storage::fake('private');

    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();
    $otherClient = User::factory()->withTwoFactor()->create();

    $message = Message::factory()->create([
        'from_user_id' => $preparer->id,
        'to_user_id' => $client->id,
        'body' => 'Here is your 2026 document checklist.',
    ]);

    Storage::disk('private')->put('message-attachments/checklist.pdf', '%PDF-1.4 checklist content');

    $attachment = MessageAttachment::factory()->create([
        'message_id' => $message->id,
        'filename' => '2026 document checklist.pdf',
        'mime' => 'application/pdf',
        'size_bytes' => 2048,
        'storage_key' => 'message-attachments/checklist.pdf',
    ]);

    $this->actingAs($client)
        ->get(route('portal.messages'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('portal/messages')
            ->has('messages.0.attachments', 1)
            ->where('messages.0.attachments.0', [
                'id' => $attachment->id,
                'filename' => '2026 document checklist.pdf',
                'size_formatted' => '2 KB',
                'download_url' => route('portal.messages.attachments.download', $attachment),
            ])
        );

    // Recipient client can download and audit log is recorded
    $this->actingAs($client)
        ->get(route('portal.messages.attachments.download', $attachment))
        ->assertRedirect();

    expect(AuditLog::where('action', 'message_attachment.downloaded')
        ->where('entity_id', $attachment->id)
        ->where('actor_id', $client->id)
        ->exists()
    )->toBeTrue();

    // Another client is forbidden (IDOR protection)
    $this->actingAs($otherClient)
        ->get(route('portal.messages.attachments.download', $attachment))
        ->assertForbidden();
});
