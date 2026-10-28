<?php

use App\Enums\ApptStatus;
use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Models\Appointment;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\Message;
use App\Models\StatusEvent;
use App\Models\TaxReturn;
use App\Models\User;
use Database\Seeders\DemoClientSeeder;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

test('portal overview renders with tax return, invoice, and counts props', function () {
    $user = User::factory()->withTwoFactor()->create();

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => (int) date('Y'),
        'status' => ReturnStatus::IntakeReceived,
    ]);

    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/overview')
        ->has('taxReturn', fn (Assert $prop) => $prop
            ->where('id', $taxReturn->id)
            ->where('tax_year', (int) date('Y'))
            ->where('status', ReturnStatus::IntakeReceived->value)
            ->where('status_label', 'Intake received')
            ->where('next_step_text', "A preparer will look over your details within one business day. Upload anything that's missing so we can start sooner.")
            ->etc()
        )
        ->has('invoice', fn (Assert $prop) => $prop
            ->where('id', $invoice->id)
            ->where('amount_cents', 22500)
            ->where('amount_formatted', '$225')
            ->where('status', InvoiceStatus::Open->value)
            ->etc()
        )
        ->has('counts', fn (Assert $prop) => $prop
            ->where('documents', 0)
            ->where('referrals', 0)
        )
    );
});

test('portal overview displays awaiting quote when invoice amount is null', function () {
    $user = User::factory()->withTwoFactor()->create();

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::IntakeReceived,
    ]);

    Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => null,
    ]);

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/overview')
        ->where('invoice.amount_cents', null)
        ->where('invoice.amount_formatted', null)
    );
});

test('demo client seeder seeds client with 225 invoice and intake received status', function () {
    $this->seed(DemoClientSeeder::class);

    $client = User::where('email', 'client@example.com')->first();
    expect($client)->not->toBeNull()
        ->and($client->name)->toBe('Demo Client')
        ->and($client->two_factor_confirmed_at)->toBeNull();

    $taxReturn = $client->taxReturns()->latest('tax_year')->first();
    expect($taxReturn)->not->toBeNull()
        ->and($taxReturn->status)->toBe(ReturnStatus::IntakeReceived);

    $invoice = $taxReturn->invoice;
    expect($invoice)->not->toBeNull()
        ->and($invoice->amount_cents)->toBe(22500);

    expect($client->documents()->count())->toBe(0)
        ->and($client->referrals()->count())->toBe(0);
});

test('return status nextStep returns structured copy and tone for every stage', function () {
    expect(ReturnStatus::IntakeReceived->nextStep())->toBe([
        'key' => 'intake_received',
        'title' => 'We have your intake',
        'text' => "A preparer will look over your details within one business day. Upload anything that's missing so we can start sooner.",
        'cta' => ['label' => 'Upload documents', 'target' => 'documents'],
        'tone' => 'default',
    ]);

    expect(ReturnStatus::InPreparation->nextStep())->toBe([
        'key' => 'in_preparation',
        'title' => 'Your preparer is working on your return',
        'text' => "Nothing for you to do right now. We'll message you here as soon as it's ready to review.",
        'cta' => ['label' => 'Open messages', 'target' => 'messages'],
        'tone' => 'default',
    ]);

    expect(ReturnStatus::ReadyForReview->nextStep())->toBe([
        'key' => 'ready_for_review',
        'title' => 'Your return is ready to review',
        'text' => "Look it over, ask anything you're unsure about, then sign Form 8879 so we can e-file.",
        'cta' => ['label' => 'Review and e-sign', 'target' => 'sign'],
        'tone' => 'action',
    ]);

    expect(ReturnStatus::ESigned->nextStep())->toBe([
        'key' => 'e_signed',
        'title' => "Signed. We're e-filing your return",
        'text' => "We'll confirm here as soon as it's filed. You don't need to do anything else.",
        'cta' => null,
        'tone' => 'default',
    ]);

    expect(ReturnStatus::EFiled->nextStep())->toBe([
        'key' => 'e_filed',
        'title' => 'Your return has been e-filed',
        'text' => 'Thank you for filing with Okojie. Most IRS refunds arrive within about 21 days of e-filing.',
        'cta' => ['label' => 'View documents', 'target' => 'documents'],
        'tone' => 'done',
    ]);
});

test('portal overview includes unreadMessages, nextAppointment, recentDocuments, stageDates, and next_step', function () {
    $user = User::factory()->withTwoFactor()->create();
    $staff = User::factory()->preparer()->create();

    $intakeTime = Carbon::parse('2026-02-01T10:00:00Z');
    $prepFirstTime = Carbon::parse('2026-02-02T12:00:00Z');
    $prepSecondTime = Carbon::parse('2026-02-04T12:00:00Z');
    $reviewTime = Carbon::parse('2026-02-05T15:30:00Z');

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => (int) date('Y'),
        'status' => ReturnStatus::ReadyForReview,
        'created_at' => $intakeTime,
    ]);

    StatusEvent::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'from' => ReturnStatus::IntakeReceived,
        'to' => ReturnStatus::InPreparation,
        'created_at' => $prepFirstTime,
    ]);

    // Second event for same status should not overwrite the first stage date
    StatusEvent::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'from' => ReturnStatus::ReadyForReview,
        'to' => ReturnStatus::InPreparation,
        'created_at' => $prepSecondTime,
    ]);

    StatusEvent::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'from' => ReturnStatus::InPreparation,
        'to' => ReturnStatus::ReadyForReview,
        'created_at' => $reviewTime,
    ]);

    // 2 unread incoming messages, 1 read incoming message, 1 outgoing message
    Message::factory()->count(2)->create([
        'to_user_id' => $user->id,
        'from_user_id' => $staff->id,
        'read_at' => null,
    ]);
    Message::factory()->create([
        'to_user_id' => $user->id,
        'from_user_id' => $staff->id,
        'read_at' => now(),
    ]);
    Message::factory()->create([
        'to_user_id' => $staff->id,
        'from_user_id' => $user->id,
        'read_at' => null,
    ]);

    // Appointments: past confirmed (ignored), cancelled future (ignored), later confirmed, earliest requested
    Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Confirmed,
        'preferred_date' => now()->subDay()->toDateString(),
    ]);
    Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Cancelled,
        'preferred_date' => now()->toDateString(),
    ]);
    Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Confirmed,
        'preferred_date' => now()->addDays(5)->toDateString(),
    ]);
    $earliestAppt = Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Requested,
        'preferred_date' => now()->addDays(2)->toDateString(),
        'topic' => 'Earliest consultation',
    ]);

    // 4 documents: only latest 3 should be returned in descending order
    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'doc-1-oldest.pdf',
        'created_at' => Carbon::parse('2026-02-01T08:00:00Z'),
    ]);
    $doc2 = Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'doc-2.pdf',
        'created_at' => Carbon::parse('2026-02-02T08:00:00Z'),
    ]);
    $doc3 = Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'doc-3.pdf',
        'created_at' => Carbon::parse('2026-02-03T08:00:00Z'),
    ]);
    $doc4 = Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'doc-4-newest.pdf',
        'created_at' => Carbon::parse('2026-02-04T08:00:00Z'),
    ]);

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/overview')
        ->where('unreadMessages', 2)
        ->where('nextAppointment.id', $earliestAppt->id)
        ->where('nextAppointment.topic', 'Earliest consultation')
        ->has('recentDocuments', 3)
        ->where('recentDocuments.0.id', $doc4->id)
        ->where('recentDocuments.1.id', $doc3->id)
        ->where('recentDocuments.2.id', $doc2->id)
        ->where('taxReturn.next_step', ReturnStatus::ReadyForReview->nextStep())
        ->where('stageDates', [
            'intake_received' => $intakeTime->toIso8601String(),
            'in_preparation' => $prepFirstTime->toIso8601String(),
            'ready_for_review' => $reviewTime->toIso8601String(),
            'e_signed' => null,
            'e_filed' => null,
        ])
    );
});

test('portal overview returns null nextAppointment and never leaks another users data (IDOR)', function () {
    $user = User::factory()->withTwoFactor()->create();
    $otherUser = User::factory()->withTwoFactor()->create();
    $staff = User::factory()->preparer()->create();

    // Other user has unread messages, upcoming appointments, documents, and return status events
    $otherReturn = TaxReturn::factory()->create([
        'user_id' => $otherUser->id,
        'status' => ReturnStatus::EFiled,
    ]);
    StatusEvent::factory()->create([
        'tax_return_id' => $otherReturn->id,
        'from' => ReturnStatus::IntakeReceived,
        'to' => ReturnStatus::InPreparation,
    ]);
    Message::factory()->count(3)->create([
        'to_user_id' => $otherUser->id,
        'from_user_id' => $staff->id,
        'read_at' => null,
    ]);
    Appointment::factory()->create([
        'user_id' => $otherUser->id,
        'status' => ApptStatus::Confirmed,
        'preferred_date' => now()->addDay()->toDateString(),
    ]);
    Document::factory()->count(2)->create([
        'user_id' => $otherUser->id,
    ]);

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/overview')
        ->where('taxReturn', null)
        ->where('invoice', null)
        ->where('unreadMessages', 0)
        ->where('nextAppointment', null)
        ->has('recentDocuments', 0)
        ->where('stageDates', [
            'intake_received' => null,
            'in_preparation' => null,
            'ready_for_review' => null,
            'e_signed' => null,
            'e_filed' => null,
        ])
    );
});
