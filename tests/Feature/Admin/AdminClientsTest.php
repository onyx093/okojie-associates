<?php

use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Enums\Role;
use App\Enums\Tier;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;
use App\Notifications\ClientInvitation;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

test('admin clients index applies search, status, tier, and scope filters with role-based scope defaults', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $preparer = User::factory()->preparer()->withTwoFactor()->create();

    $clientA = User::factory()->withTwoFactor()->create([
        'name' => 'Denise Robinson',
        'email' => 'denise@example.com',
        'phone' => '267-555-0118',
        'tier' => Tier::Hybrid,
    ]);
    TaxReturn::factory()->create([
        'user_id' => $clientA->id,
        'tax_year' => 2026,
        'tier' => Tier::Hybrid,
        'status' => ReturnStatus::ReadyForReview,
        'preparer_id' => $preparer->id,
    ]);

    $clientB = User::factory()->withTwoFactor()->create([
        'name' => 'Marcus Thompson',
        'email' => 'marcus@example.com',
        'phone' => '215-555-0199',
        'tier' => Tier::UploadAndGo,
    ]);
    TaxReturn::factory()->create([
        'user_id' => $clientB->id,
        'tax_year' => 2026,
        'tier' => Tier::UploadAndGo,
        'status' => ReturnStatus::EFiled,
        'preparer_id' => $admin->id,
    ]);

    $clientC = User::factory()->withTwoFactor()->create([
        'name' => 'Priya Shah',
        'email' => 'priya@example.com',
        'phone' => '410-555-0144',
        'tier' => Tier::PremiumRemote,
    ]);
    TaxReturn::factory()->create([
        'user_id' => $clientC->id,
        'tax_year' => 2026,
        'tier' => Tier::PremiumRemote,
        'status' => ReturnStatus::InPreparation,
        'preparer_id' => null,
    ]);

    // Admin default scope is 'all', scopeCounts { mine: 1, all: 3 }
    $this->actingAs($admin)
        ->get(route('admin.clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/clients')
            ->where('filters.scope', 'all')
            ->where('scopeCounts.mine', 1)
            ->where('scopeCounts.all', 3)
            ->has('clients.data', 3)
            ->has('statuses', 5)
            ->has('tiers', 3)
        );

    // Admin with scope=mine sees only clientB
    $this->actingAs($admin)
        ->get(route('admin.clients.index', ['scope' => 'mine']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.scope', 'mine')
            ->has('clients.data', 1)
            ->where('clients.data.0.id', $clientB->id)
        );

    // Admin filtering by status + tier + search
    $this->actingAs($admin)
        ->get(route('admin.clients.index', [
            'search' => 'Denise',
            'status' => ReturnStatus::ReadyForReview->value,
            'tier' => Tier::Hybrid->value,
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.search', 'Denise')
            ->where('filters.status', ReturnStatus::ReadyForReview->value)
            ->where('filters.tier', Tier::Hybrid->value)
            ->has('clients.data', 1)
            ->where('clients.data.0.id', $clientA->id)
        );

    // Preparer default scope is 'mine' and cannot see others' clients even when passing scope=all
    $this->actingAs($preparer)
        ->get(route('admin.clients.index', ['scope' => 'all']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.scope', 'mine')
            ->where('scopeCounts.mine', 1)
            ->where('scopeCounts.all', 1)
            ->has('clients.data', 1)
            ->where('clients.data.0.id', $clientA->id)
        );
});

test('admin clients metrics compute counts, weekly deltas, oldest waiting days, and unpaid invoice totals within visibility', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $preparer = User::factory()->preparer()->withTwoFactor()->create();

    // 2 InPreparation this week (assigned to preparer), 1 InPreparation previous week (unassigned)
    $inPrepRecent1 = TaxReturn::factory()->create([
        'status' => ReturnStatus::InPreparation,
        'preparer_id' => $preparer->id,
        'updated_at' => now()->subDays(2),
    ]);
    $inPrepRecent2 = TaxReturn::factory()->create([
        'status' => ReturnStatus::InPreparation,
        'preparer_id' => $preparer->id,
        'updated_at' => now()->subDays(3),
    ]);
    TaxReturn::factory()->create([
        'status' => ReturnStatus::InPreparation,
        'preparer_id' => null,
        'updated_at' => now()->subDays(10),
    ]);

    // 2 ReadyForReview returns: 6 days old (assigned to preparer) and 2 days old (unassigned)
    $readyOld = TaxReturn::factory()->create([
        'status' => ReturnStatus::ReadyForReview,
        'preparer_id' => $preparer->id,
        'updated_at' => now()->subDays(6)->subHours(2),
    ]);
    TaxReturn::factory()->create([
        'status' => ReturnStatus::ReadyForReview,
        'preparer_id' => null,
        'updated_at' => now()->subDays(2),
    ]);

    // Open invoices: $275 on inPrepRecent1 (assigned to preparer), $195 on unassigned return, plus $300 Paid
    Invoice::factory()->create([
        'tax_return_id' => $inPrepRecent1->id,
        'amount_cents' => 27500,
        'status' => InvoiceStatus::Open,
    ]);
    Invoice::factory()->create([
        'tax_return_id' => $inPrepRecent2->id,
        'amount_cents' => 30000,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
    ]);
    Invoice::factory()->create([
        'tax_return_id' => $readyOld->id,
        'amount_cents' => 19500,
        'status' => InvoiceStatus::Open,
    ]);

    // EFiled returns: 2 filed this week (1 assigned to preparer), 1 filed 9 days ago (assigned to preparer)
    TaxReturn::factory()->create([
        'status' => ReturnStatus::EFiled,
        'preparer_id' => $preparer->id,
        'filed_at' => now()->subDay(),
    ]);
    TaxReturn::factory()->create([
        'status' => ReturnStatus::EFiled,
        'preparer_id' => null,
        'filed_at' => now()->subDays(2),
    ]);
    TaxReturn::factory()->create([
        'status' => ReturnStatus::EFiled,
        'preparer_id' => $preparer->id,
        'filed_at' => now()->subDays(9),
    ]);

    // Admin sees all: inPreparation { count: 3, deltaWeek: 2 - 1 = 1 }, waitingSignature { count: 2, oldestDays: 6 }, unpaid { count: 2, amountCents: 47000, amountFormatted: '$470' }, eFiled { count: 3, deltaWeek: 2 - 1 = 1 }
    $this->actingAs($admin)
        ->get(route('admin.clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('metrics.inPreparation.count', 3)
            ->where('metrics.inPreparation.deltaWeek', 1)
            ->where('metrics.waitingSignature.count', 2)
            ->where('metrics.waitingSignature.oldestDays', 6)
            ->where('metrics.unpaid.count', 2)
            ->where('metrics.unpaid.amountCents', 47000)
            ->where('metrics.unpaid.amountFormatted', '$470')
            ->where('metrics.eFiled.count', 3)
            ->where('metrics.eFiled.deltaWeek', 1)
        );

    // Preparer sees only assigned returns: inPreparation { count: 2, deltaWeek: 2 }, waitingSignature { count: 1, oldestDays: 6 }, unpaid { count: 2, amountCents: 47000 }, eFiled { count: 2, deltaWeek: 1 - 1 = 0 }
    $this->actingAs($preparer)
        ->get(route('admin.clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('metrics.inPreparation.count', 2)
            ->where('metrics.inPreparation.deltaWeek', 2)
            ->where('metrics.waitingSignature.count', 1)
            ->where('metrics.waitingSignature.oldestDays', 6)
            ->where('metrics.unpaid.count', 2)
            ->where('metrics.unpaid.amountCents', 47000)
            ->where('metrics.eFiled.count', 2)
            ->where('metrics.eFiled.deltaWeek', 0)
        );
});

test('admin clients CSV export respects filters, enforces authorization, and neutralizes CSV formula injection', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $regularClient = User::factory()->withTwoFactor()->create();

    $injectedClient = User::factory()->withTwoFactor()->create([
        'name' => '=SUM(A1:A2)',
        'email' => 'safe@example.com',
        'phone' => '+12155550100',
        'tier' => Tier::Hybrid,
    ]);
    TaxReturn::factory()->create([
        'user_id' => $injectedClient->id,
        'preparer_id' => $preparer->id,
        'status' => ReturnStatus::InPreparation,
    ]);

    $otherClient = User::factory()->withTwoFactor()->create([
        'name' => 'Unassigned Taxpayer',
        'email' => 'unassigned@example.com',
        'tier' => Tier::UploadAndGo,
    ]);
    TaxReturn::factory()->create([
        'user_id' => $otherClient->id,
        'preparer_id' => null,
        'status' => ReturnStatus::IntakeReceived,
    ]);

    // Regular client is forbidden
    $this->actingAs($regularClient)
        ->get(route('admin.clients.export'))
        ->assertForbidden();

    // Preparer export only includes assigned client and prefixes '=SUM(A1:A2)' and '+12155550100' with "'"
    $response = $this->actingAs($preparer)
        ->get(route('admin.clients.export'));

    $response->assertOk();
    $csv = $response->streamedContent();

    expect($csv)->toContain('Name,Email,Phone,Tier,Status,Preparer,"Invoice Amount","Invoice Status",Created')
        ->and($csv)->toContain("'=SUM(A1:A2)")
        ->and($csv)->toContain("'+12155550100")
        ->and($csv)->not->toContain('Unassigned Taxpayer');

    // Admin export with status filter only includes matching row
    $filteredResponse = $this->actingAs($admin)
        ->get(route('admin.clients.export', ['status' => ReturnStatus::IntakeReceived->value]));

    $filteredCsv = $filteredResponse->streamedContent();
    expect($filteredCsv)->toContain('Unassigned Taxpayer')
        ->and($filteredCsv)->not->toContain('safe@example.com');
});

test('staff can invite a client, creating verified User, TaxReturn, and Invoice and sending ClientInvitation notification', function () {
    Notification::fake();

    $admin = User::factory()->admin()->withTwoFactor()->create();
    $preparer = User::factory()->preparer()->withTwoFactor()->create();

    $response = $this->actingAs($admin)
        ->post(route('admin.clients.invite'), [
            'name' => 'Invited Taxpayer',
            'email' => 'Invited.Taxpayer@Example.com',
            'tier' => Tier::PremiumRemote->value,
            'preparer_id' => $preparer->id,
        ]);

    $invitedUser = User::where('email', 'invited.taxpayer@example.com')->first();
    expect($invitedUser)->not->toBeNull()
        ->and($invitedUser->role)->toBe(Role::Client)
        ->and($invitedUser->tier)->toBe(Tier::PremiumRemote)
        ->and($invitedUser->email_verified_at)->not->toBeNull();

    $response->assertRedirect(route('admin.clients.show', $invitedUser));

    $taxReturn = $invitedUser->taxReturns()->first();
    expect($taxReturn)->not->toBeNull()
        ->and($taxReturn->tax_year)->toBe((int) date('Y'))
        ->and($taxReturn->tier)->toBe(Tier::PremiumRemote)
        ->and($taxReturn->preparer_id)->toBe($preparer->id)
        ->and($taxReturn->invoice)->not->toBeNull()
        ->and($taxReturn->invoice->status)->toBe(InvoiceStatus::Draft);

    Notification::assertSentTo($invitedUser, ClientInvitation::class, function (ClientInvitation $notification) use ($invitedUser): bool {
        return $notification->token !== ''
            && str_contains($notification->setupUrl, 'reset-password')
            && str_contains($notification->setupUrl, urlencode($invitedUser->email))
            && str_contains($notification->setupUrl, 'signature=');
    });

    // Duplicate email rejected with validation error
    $this->actingAs($admin)
        ->post(route('admin.clients.invite'), [
            'name' => 'Duplicate Person',
            'email' => 'INVITED.TAXPAYER@example.com',
        ])
        ->assertSessionHasErrors('email');
});
