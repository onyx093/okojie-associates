<?php

use App\Enums\InvoiceStatus;
use App\Enums\LeadKind;
use App\Enums\LeadStatus;
use App\Enums\ReferralStatus;
use App\Enums\ReturnStatus;
use App\Enums\Role;
use App\Enums\Tier;
use App\Models\AuditLog;
use App\Models\Lead;
use App\Models\Message;
use App\Models\Referral;
use App\Models\StatusEvent;
use App\Models\TaxReturn;
use App\Models\User;
use App\Notifications\ReturnStatusUpdated;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

test('regular client is forbidden from staff console', function () {
    $client = User::factory()->withTwoFactor()->create();

    $this->actingAs($client)->get(route('admin.clients.index'))->assertForbidden();
    $this->actingAs($client)->get(route('admin.leads.index'))->assertForbidden();
    $this->actingAs($client)->get(route('admin.referrals.index'))->assertForbidden();
});

test('guest is redirected to login from admin routes', function () {
    $this->get(route('admin.clients.index'))->assertRedirect(route('login'));
});

test('staff scoping: preparer sees only assigned clients while admin sees all', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $preparer = User::factory()->preparer()->withTwoFactor()->create();

    $assignedClient = User::factory()->withTwoFactor()->create(['name' => 'Assigned Client']);
    TaxReturn::factory()->create([
        'user_id' => $assignedClient->id,
        'preparer_id' => $preparer->id,
    ]);

    $unassignedClient = User::factory()->withTwoFactor()->create(['name' => 'Unassigned Client']);
    TaxReturn::factory()->create([
        'user_id' => $unassignedClient->id,
        'preparer_id' => null,
    ]);

    // Preparer only sees assigned client in list
    $response = $this->actingAs($preparer)->get(route('admin.clients.index'));
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/clients')
        ->has('clients.data', 1)
        ->where('clients.data.0.id', $assignedClient->id)
    );

    // Preparer cannot view unassigned client detail (403)
    $this->actingAs($preparer)->get(route('admin.clients.show', $unassignedClient))->assertForbidden();

    // Preparer can view assigned client detail (200)
    $this->actingAs($preparer)->get(route('admin.clients.show', $assignedClient))->assertOk();

    // Admin sees all clients in list
    $adminResponse = $this->actingAs($admin)->get(route('admin.clients.index'));
    $adminResponse->assertOk();
    $adminResponse->assertInertia(fn (Assert $page) => $page
        ->component('admin/clients')
        ->has('clients.data', 2)
    );

    // Admin can view unassigned client detail
    $this->actingAs($admin)->get(route('admin.clients.show', $unassignedClient))->assertOk();
});

test('viewing client detail records an audit log entry', function () {
    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();
    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
    ]);

    $this->actingAs($preparer)->get(route('admin.clients.show', $client))->assertOk();

    expect(AuditLog::where('action', 'admin.client_viewed')
        ->where('entity_id', (string) $client->id)
        ->where('actor_id', $preparer->id)
        ->exists()
    )->toBeTrue();
});

test('preparer can advance return status from intake received to e-filed with notifications', function () {
    Notification::fake();

    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $client->id,
        'status' => ReturnStatus::IntakeReceived,
        'preparer_id' => $preparer->id,
    ]);

    // Initial state on client portal
    $portalResponse = $this->actingAs($client)->get(route('portal.overview'));
    $portalResponse->assertInertia(fn (Assert $page) => $page
        ->where('taxReturn.status', ReturnStatus::IntakeReceived->value)
    );

    // 1. Advance to InPreparation
    $this->actingAs($preparer)
        ->patch(route('admin.returns.status', $taxReturn), [
            'status' => ReturnStatus::InPreparation->value,
        ])
        ->assertRedirect();

    expect($taxReturn->fresh()->status)->toBe(ReturnStatus::InPreparation);
    Notification::assertSentTo($client, ReturnStatusUpdated::class, function ($notification) {
        return $notification->status === ReturnStatus::InPreparation;
    });

    // Client portal reflects InPreparation
    $this->actingAs($client)->get(route('portal.overview'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('taxReturn.status', ReturnStatus::InPreparation->value)
        );

    // 2. Advance to ReadyForReview
    $this->actingAs($preparer)
        ->patch(route('admin.returns.status', $taxReturn), [
            'status' => ReturnStatus::ReadyForReview->value,
        ])
        ->assertRedirect();

    expect($taxReturn->fresh()->status)->toBe(ReturnStatus::ReadyForReview);

    // 3. Advance to ESigned
    $this->actingAs($preparer)
        ->patch(route('admin.returns.status', $taxReturn), [
            'status' => ReturnStatus::ESigned->value,
        ])
        ->assertRedirect();

    expect($taxReturn->fresh()->status)->toBe(ReturnStatus::ESigned);
    expect($taxReturn->fresh()->signed_at)->not->toBeNull();

    // 4. Advance to EFiled
    $this->actingAs($preparer)
        ->patch(route('admin.returns.status', $taxReturn), [
            'status' => ReturnStatus::EFiled->value,
        ])
        ->assertRedirect();

    expect($taxReturn->fresh()->status)->toBe(ReturnStatus::EFiled);
    expect($taxReturn->fresh()->filed_at)->not->toBeNull();

    // Check client portal reflects E-Filed
    $this->actingAs($client)->get(route('portal.overview'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('taxReturn.status', ReturnStatus::EFiled->value)
        );

    // Check status events were created
    expect(StatusEvent::where('tax_return_id', $taxReturn->id)->count())->toBe(4);

    // Check audit logs were written
    expect(AuditLog::where('action', 'tax_return.status_changed')
        ->where('entity_id', $taxReturn->id)
        ->count()
    )->toBe(4);
});

test('reversing return status requires a reason', function () {
    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $client->id,
        'status' => ReturnStatus::InPreparation,
        'preparer_id' => $preparer->id,
    ]);

    // Attempting reversal without reason fails validation
    $response = $this->actingAs($preparer)
        ->patch(route('admin.returns.status', $taxReturn), [
            'status' => ReturnStatus::IntakeReceived->value,
            'reason' => '',
        ]);

    $response->assertSessionHasErrors('reason');
    expect($taxReturn->fresh()->status)->toBe(ReturnStatus::InPreparation);

    // Reversing with a reason succeeds
    $successResponse = $this->actingAs($preparer)
        ->patch(route('admin.returns.status', $taxReturn), [
            'status' => ReturnStatus::IntakeReceived->value,
            'reason' => 'Missing Schedule C documentation from client.',
        ]);

    $successResponse->assertRedirect();
    expect($taxReturn->fresh()->status)->toBe(ReturnStatus::IntakeReceived);

    // Verify reason recorded in StatusEvent and AuditLog
    $latestEvent = StatusEvent::where('tax_return_id', $taxReturn->id)->latest()->first();
    expect($latestEvent->reason)->toBe('Missing Schedule C documentation from client.');

    $latestAudit = AuditLog::where('action', 'tax_return.status_changed')
        ->where('entity_id', $taxReturn->id)
        ->latest('created_at')
        ->first();
    expect($latestAudit->meta['reason'])->toBe('Missing Schedule C documentation from client.');
});

test('staff can update invoice amount and mark paid offline', function () {
    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
    ]);

    // Update fee amount
    $this->actingAs($preparer)
        ->patch(route('admin.invoices.update', $taxReturn), [
            'amount_dollars' => 350.00,
        ])
        ->assertRedirect();

    $invoice = $taxReturn->invoice()->first();
    expect($invoice->amount_cents)->toBe(35000);
    expect($invoice->status)->toBe(InvoiceStatus::Open);

    // Mark paid offline
    $this->actingAs($preparer)
        ->patch(route('admin.invoices.update', $taxReturn), [
            'mark_paid_offline' => true,
        ])
        ->assertRedirect();

    expect($invoice->fresh()->status)->toBe(InvoiceStatus::Paid);
    expect($invoice->fresh()->paid_at)->not->toBeNull();
});

test('staff can post a message to the client', function () {
    $preparer = User::factory()->preparer()->withTwoFactor()->create(['name' => 'Michael CPA']);
    $client = User::factory()->withTwoFactor()->create();
    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
    ]);

    $this->actingAs($preparer)
        ->post(route('admin.clients.messages.store', $client), [
            'body' => 'Your return has been prepared and is ready for your signature.',
        ])
        ->assertRedirect();

    expect(Message::where('to_user_id', $client->id)
        ->where('from_user_id', $preparer->id)
        ->where('body', 'Your return has been prepared and is ready for your signature.')
        ->exists()
    )->toBeTrue();
});

test('staff can manage leads inbox and convert lead to client', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();

    $lead = Lead::factory()->create([
        'kind' => LeadKind::Quote,
        'name' => 'Prospective Taxpayer',
        'email' => 'prospect@example.com',
        'status' => LeadStatus::New,
        'notes' => null,
    ]);

    // View leads list
    $response = $this->actingAs($admin)->get(route('admin.leads.index'));
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/leads')
        ->has('leads.data', 1)
    );

    // Update notes
    $this->actingAs($admin)
        ->patch(route('admin.leads.notes', $lead), [
            'notes' => 'Spoke by phone; needs Schedule E for rental property.',
        ])
        ->assertRedirect();

    expect($lead->fresh()->notes)->toBe('Spoke by phone; needs Schedule E for rental property.');

    // Convert lead to client
    $convertResponse = $this->actingAs($admin)->post(route('admin.leads.convert', $lead));
    $convertResponse->assertRedirect();

    $convertedClient = User::where('email', 'prospect@example.com')->first();
    expect($convertedClient)->not->toBeNull();
    expect($convertedClient->role)->toBe(Role::Client);
    expect($convertedClient->taxReturns()->exists())->toBeTrue();
    expect($lead->fresh()->status)->toBe(LeadStatus::Converted);
});

test('staff can view referrals and mark reward', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $referrer = User::factory()->withTwoFactor()->create(['tier' => Tier::Hybrid]);

    $referral = Referral::factory()->create([
        'referrer_id' => $referrer->id,
        'friend_name' => 'Alice Friend',
        'friend_email' => 'alice@example.com',
        'status' => ReferralStatus::Filed,
        'reward_cents' => null,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.referrals.index'));
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/referrals')
        ->has('referrals.data', 1)
    );

    // Mark rewarded
    $this->actingAs($admin)
        ->post(route('admin.referrals.reward', $referral))
        ->assertRedirect();

    $referral->refresh();
    expect($referral->status)->toBe(ReferralStatus::Rewarded);
    expect($referral->reward_cents)->toBeGreaterThan(0);
});
