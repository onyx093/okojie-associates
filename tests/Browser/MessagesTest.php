<?php

use App\Enums\Tier;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

it('renders portal messages on desktop with day-grouped thread, preparer card, and staying safe card', function () {
    $preparer = User::factory()->preparer()->create([
        'name' => 'Adaeze Okojie, EA',
        'title' => 'Enrolled Agent',
        'office' => 'germantown-ave',
    ]);

    $client = User::factory()->create([
        'name' => 'Denise Robinson',
        'email' => 'denise.msgs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
    ]);

    // Create messages on different dates
    Message::factory()->create([
        'from_user_id' => $preparer->id,
        'to_user_id' => $client->id,
        'body' => 'Welcome to Okojie Online! I will be your preparer this year.',
        'created_at' => now()->subDays(5),
    ]);

    Message::factory()->create([
        'from_user_id' => $preparer->id,
        'to_user_id' => $client->id,
        'body' => 'Thanks for uploading everything so quickly. I have started your review.',
        'created_at' => now(),
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.msgs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/messages')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Messages')
        ->assertSeeIn('main#main', 'Encrypted and private')
        ->assertSeeIn('main#main', 'Updates from your preparer about your return.')
        ->assertSeeIn('#thread-title', 'From your preparer')
        ->assertSeeIn('[data-slot="day-group"]', 'Today')
        ->assertSeeIn('[data-slot="message-article"]:has-text("Adaeze Okojie")', 'Thanks for uploading everything so quickly')
        ->assertSeeIn('#prep-title', 'Your preparer')
        ->assertSeeIn('section[aria-labelledby="prep-title"]', 'Adaeze Okojie, EA')
        ->assertSeeIn('section[aria-labelledby="prep-title"]', 'Within 1 business day')
        ->assertSeeIn('section[aria-labelledby="prep-title"]', 'Mon–Fri 9am–6pm')
        ->assertPresent('section[aria-labelledby="prep-title"] a:has-text("Book a call")')
        ->assertSeeIn('#safe-title', 'Staying safe')
        ->assertSeeIn('section[aria-labelledby="safe-title"]', 'We’ll never ask for your password or full SSN')
        ->assertSeeIn('main#main', 'Need to reply?')
        ->assertSeeIn('main#main', '(215) 555-0142')
        ->assertPresent('main#main a[href="tel:+12155550142"]')
        ->assertPresent('main#main a:has-text("book a call")');
});

it('renders attachments as download links with file badge and formatted size', function () {
    Storage::fake('private');

    $preparer = User::factory()->preparer()->create([
        'name' => 'Adaeze Okojie, EA',
    ]);

    $client = User::factory()->create([
        'email' => 'attach.msgs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
    ]);

    $message = Message::factory()->create([
        'from_user_id' => $preparer->id,
        'to_user_id' => $client->id,
        'body' => 'Here is the 2026 checklist we discussed.',
    ]);

    Storage::disk('private')->put('message-attachments/checklist.pdf', '%PDF-1.4 sample content');

    MessageAttachment::factory()->create([
        'message_id' => $message->id,
        'filename' => '2026 document checklist.pdf',
        'mime' => 'application/pdf',
        'size_bytes' => 2048,
        'storage_key' => 'message-attachments/checklist.pdf',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'attach.msgs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/messages')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('[data-slot="message-article"]', '2026 document checklist.pdf')
        ->assertPresent('[data-slot="file-badge"]:has-text("PDF")')
        ->assertPresent('a[download][href*="messages/attachments"]');
});

it('renders unread message styling with New chip, unread counter, and mark all as read action', function () {
    visit('/dev/styleguide?fixture=page-portal-messages&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('[data-slot="shell-head"]', '1 unread')
        ->assertSeeIn('[data-slot="message-article"][data-unread="true"]', 'New')
        ->assertPresent('#mark-read')
        ->click('#mark-read')
        ->assertSee('All messages marked as read')
        ->assertMissing('#mark-read');
});

it('renders generic preparer side card when client has no assigned preparer', function () {
    $client = User::factory()->create([
        'email' => 'generic.msgs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => null,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'generic.msgs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/messages')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('#prep-title', 'Your preparer')
        ->assertSeeIn('section[aria-labelledby="prep-title"] small', 'Okojie & Associates')
        ->assertPresent('section[aria-labelledby="prep-title"] a:has-text("Book a call")');
});

it('renders empty messages state with clean illustration and copy', function () {
    $client = User::factory()->create([
        'email' => 'empty.msgs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $client->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'empty.msgs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/messages')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'No messages yet')
        ->assertSeeIn('main#main', 'Your preparer will post updates here as your return moves along.');
});

it('renders portal messages on mobile viewport cleanly with stacked side cards', function () {
    $preparer = User::factory()->preparer()->create([
        'name' => 'Adaeze Okojie, EA',
    ]);

    $client = User::factory()->create([
        'email' => 'mobile.msgs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
    ]);

    Message::factory()->create([
        'from_user_id' => $preparer->id,
        'to_user_id' => $client->id,
        'body' => 'Mobile message body check.',
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.msgs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/messages')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Messages')
        ->assertSeeIn('#thread-title', 'From your preparer')
        ->assertSeeIn('#prep-title', 'Your preparer')
        ->assertSeeIn('#safe-title', 'Staying safe');
});

it('renders styleguide portal messages fixture states with no smoke errors', function () {
    visit('/dev/styleguide?fixture=page-portal-messages&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Encrypted and private')
        ->assertSee('Adaeze Okojie, EA')
        ->assertSee('2026 document checklist.pdf')
        ->assertSee('Mark all as read');

    visit('/dev/styleguide?fixture=page-portal-messages&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertMissing('#mark-read');

    visit('/dev/styleguide?fixture=page-portal-messages&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('No messages yet');

    visit('/dev/styleguide?fixture=page-portal-messages&state=3')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Okojie & Associates');
});
