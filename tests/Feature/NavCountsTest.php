<?php

use App\Enums\LeadStatus;
use App\Models\Document;
use App\Models\Lead;
use App\Models\Message;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

test('guest receives null navCounts and triggers no nav count queries', function () {
    DB::enableQueryLog();
    DB::flushQueryLog();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('navCounts', null)
        );

    $queries = DB::getQueryLog();
    expect(count($queries))->toBeLessThanOrEqual(2);
});

test('client receives own documents and unreadMessages in navCounts without N+1 queries', function () {
    $client = User::factory()->withTwoFactor()->create();
    $otherClient = User::factory()->withTwoFactor()->create();
    $staff = User::factory()->preparer()->withTwoFactor()->create();

    TaxReturn::factory()->create(['user_id' => $client->id, 'preparer_id' => $staff->id]);

    Document::factory()->count(4)->create(['user_id' => $client->id]);
    Document::factory()->count(3)->create(['user_id' => $otherClient->id]);

    Message::factory()->count(2)->create([
        'from_user_id' => $staff->id,
        'to_user_id' => $client->id,
        'read_at' => null,
    ]);
    Message::factory()->create([
        'from_user_id' => $staff->id,
        'to_user_id' => $client->id,
        'read_at' => now(),
    ]);
    Message::factory()->count(5)->create([
        'from_user_id' => $staff->id,
        'to_user_id' => $otherClient->id,
        'read_at' => null,
    ]);

    DB::enableQueryLog();
    DB::flushQueryLog();

    $this->actingAs($client)
        ->get(route('portal.overview'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('navCounts.documents', 4)
            ->where('navCounts.unreadMessages', 2)
        );

    $queries = DB::getQueryLog();
    expect(count($queries))->toBeLessThanOrEqual(12);
});

test('preparer receives assigned client count and newLeads count while admin receives all client count', function () {
    $preparer1 = User::factory()->preparer()->withTwoFactor()->create();
    $preparer2 = User::factory()->preparer()->withTwoFactor()->create();
    $admin = User::factory()->admin()->withTwoFactor()->create();

    $assignedClient1 = User::factory()->withTwoFactor()->create();
    $assignedClient2 = User::factory()->withTwoFactor()->create();
    $otherClient = User::factory()->withTwoFactor()->create();
    $unassignedClient = User::factory()->withTwoFactor()->create();

    TaxReturn::factory()->create(['user_id' => $assignedClient1->id, 'preparer_id' => $preparer1->id]);
    TaxReturn::factory()->create(['user_id' => $assignedClient2->id, 'preparer_id' => $preparer1->id]);
    TaxReturn::factory()->create(['user_id' => $otherClient->id, 'preparer_id' => $preparer2->id]);
    TaxReturn::factory()->create(['user_id' => $unassignedClient->id, 'preparer_id' => null]);

    Lead::factory()->count(3)->create(['status' => LeadStatus::New]);
    Lead::factory()->count(2)->create(['status' => LeadStatus::Contacted]);
    Lead::factory()->create(['status' => LeadStatus::Converted]);

    // Preparer sees only their 2 assigned clients + 3 new leads
    $this->actingAs($preparer1)
        ->get(route('admin.clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('navCounts.clients', 2)
            ->where('navCounts.newLeads', 3)
        );

    // Admin sees all 4 clients + 3 new leads
    DB::enableQueryLog();
    DB::flushQueryLog();

    $this->actingAs($admin)
        ->get(route('admin.clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('navCounts.clients', 4)
            ->where('navCounts.newLeads', 3)
        );

    $queries = DB::getQueryLog();
    expect(count($queries))->toBeLessThanOrEqual(14);
});
