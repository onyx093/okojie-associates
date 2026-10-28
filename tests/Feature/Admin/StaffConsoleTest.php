<?php

use App\Enums\ApptFormat;
use App\Enums\ApptStatus;
use App\Enums\InvoiceStatus;
use App\Enums\LeadKind;
use App\Enums\LeadStatus;
use App\Enums\ReferralStatus;
use App\Enums\ReturnStatus;
use App\Enums\Role;
use App\Enums\Tier;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\Lead;
use App\Models\Message;
use App\Models\Referral;
use App\Models\StatusEvent;
use App\Models\TaxReturn;
use App\Models\User;
use App\Notifications\ClientInvitation;
use App\Notifications\ReturnStatusUpdated;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
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

test('staff can confirm appointment with or without scheduled_at and join_url', function () {
    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();
    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
    ]);

    $apptWithDetails = Appointment::factory()->create([
        'user_id' => $client->id,
        'format' => ApptFormat::Video,
        'status' => ApptStatus::Requested,
    ]);

    $futureTime = now()->addDays(3)->setTime(16, 30, 0)->toIso8601String();

    $this->actingAs($preparer)
        ->patch(route('admin.appointments.status', $apptWithDetails), [
            'status' => ApptStatus::Confirmed->value,
            'scheduled_at' => $futureTime,
            'join_url' => 'https://meet.google.com/abc-defg-hij',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $apptWithDetails->refresh();
    expect($apptWithDetails->status)->toBe(ApptStatus::Confirmed)
        ->and($apptWithDetails->confirmed_at)->not->toBeNull()
        ->and($apptWithDetails->scheduled_at?->toIso8601String())->toBe($futureTime)
        ->and($apptWithDetails->join_url)->toBe('https://meet.google.com/abc-defg-hij');

    // Confirming without scheduled_at or join_url keeps existing behavior working
    $apptWithoutDetails = Appointment::factory()->create([
        'user_id' => $client->id,
        'format' => ApptFormat::Phone,
        'status' => ApptStatus::Requested,
    ]);

    $this->actingAs($preparer)
        ->patch(route('admin.appointments.status', $apptWithoutDetails), [
            'status' => ApptStatus::Confirmed->value,
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $apptWithoutDetails->refresh();
    expect($apptWithoutDetails->status)->toBe(ApptStatus::Confirmed)
        ->and($apptWithoutDetails->confirmed_at)->not->toBeNull()
        ->and($apptWithoutDetails->scheduled_at)->toBeNull()
        ->and($apptWithoutDetails->join_url)->toBeNull();
});

test('admin appointment confirmation validates future scheduled_at and https join_url', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();

    $appointment = Appointment::factory()->create([
        'user_id' => $client->id,
        'status' => ApptStatus::Requested,
    ]);

    // http:// join_url is rejected
    $this->actingAs($admin)
        ->patch(route('admin.appointments.status', $appointment), [
            'status' => ApptStatus::Confirmed->value,
            'join_url' => 'http://meet.google.com/abc-defg-hij',
        ])
        ->assertSessionHasErrors('join_url');

    // Past scheduled_at when confirming is rejected
    $this->actingAs($admin)
        ->patch(route('admin.appointments.status', $appointment), [
            'status' => ApptStatus::Confirmed->value,
            'scheduled_at' => now()->subHour()->toIso8601String(),
        ])
        ->assertSessionHasErrors('scheduled_at');

    // URL > 2048 chars is rejected
    $this->actingAs($admin)
        ->patch(route('admin.appointments.status', $appointment), [
            'status' => ApptStatus::Confirmed->value,
            'join_url' => 'https://meet.google.com/'.str_repeat('a', 2030),
        ])
        ->assertSessionHasErrors('join_url');

    expect($appointment->fresh()->status)->toBe(ApptStatus::Requested);
});

test('preparer can only confirm appointments for assigned clients', function () {
    $assignedPreparer = User::factory()->preparer()->withTwoFactor()->create();
    $otherPreparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();

    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $assignedPreparer->id,
    ]);

    $appointment = Appointment::factory()->create([
        'user_id' => $client->id,
        'status' => ApptStatus::Requested,
    ]);

    // Unassigned preparer gets 403
    $this->actingAs($otherPreparer)
        ->patch(route('admin.appointments.status', $appointment), [
            'status' => ApptStatus::Confirmed->value,
            'scheduled_at' => now()->addDay()->toIso8601String(),
            'join_url' => 'https://meet.google.com/assigned-only',
        ])
        ->assertForbidden();

    expect($appointment->fresh()->status)->toBe(ApptStatus::Requested);

    // Assigned preparer succeeds
    $this->actingAs($assignedPreparer)
        ->patch(route('admin.appointments.status', $appointment), [
            'status' => ApptStatus::Confirmed->value,
            'scheduled_at' => now()->addDay()->toIso8601String(),
            'join_url' => 'https://meet.google.com/assigned-only',
        ])
        ->assertRedirect();

    expect($appointment->fresh()->status)->toBe(ApptStatus::Confirmed);
});

test('staff can post message with attachments and validation enforces count, type, and size limits', function () {
    Storage::fake('private');

    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $otherPreparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();

    TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
    ]);

    $pdf1 = UploadedFile::fake()->createWithContent('checklist.pdf', '%PDF-1.4 valid pdf 1');
    $pdf2 = UploadedFile::fake()->createWithContent('worksheet.pdf', '%PDF-1.4 valid pdf 2');

    $this->actingAs($preparer)
        ->post(route('admin.clients.messages.store', $client), [
            'body' => 'Attached are your checklist and worksheet.',
            'attachments' => [$pdf1, $pdf2],
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $message = Message::where('to_user_id', $client->id)->latest()->first();
    expect($message)->not->toBeNull()
        ->and($message->attachments()->count())->toBe(2);

    $attachment = $message->attachments()->first();
    Storage::disk('private')->assertExists($attachment->storage_key);

    // Assigned preparer can download attachment; unassigned preparer gets 403
    $this->actingAs($preparer)
        ->get(route('admin.messages.attachments.download', $attachment))
        ->assertRedirect();

    $this->actingAs($otherPreparer)
        ->get(route('admin.messages.attachments.download', $attachment))
        ->assertForbidden();

    // Validation: > 3 files rejected
    $fourFiles = [
        UploadedFile::fake()->createWithContent('1.pdf', '%PDF-1.4 1'),
        UploadedFile::fake()->createWithContent('2.pdf', '%PDF-1.4 2'),
        UploadedFile::fake()->createWithContent('3.pdf', '%PDF-1.4 3'),
        UploadedFile::fake()->createWithContent('4.pdf', '%PDF-1.4 4'),
    ];
    $this->actingAs($preparer)
        ->post(route('admin.clients.messages.store', $client), [
            'body' => 'Too many files.',
            'attachments' => $fourFiles,
        ])
        ->assertSessionHasErrors('attachments');

    // Validation: invalid file type / magic bytes rejected
    $exeFile = UploadedFile::fake()->createWithContent('malware.exe', 'MZ-executable');
    $this->actingAs($preparer)
        ->post(route('admin.clients.messages.store', $client), [
            'body' => 'Invalid file.',
            'attachments' => [$exeFile],
        ])
        ->assertSessionHasErrors('attachments.0');

    // Validation: file > 25 MB rejected
    $hugePdf = UploadedFile::fake()->create('huge.pdf', 26000, 'application/pdf');
    $this->actingAs($preparer)
        ->post(route('admin.clients.messages.store', $client), [
            'body' => 'Oversized file.',
            'attachments' => [$hugePdf],
        ])
        ->assertSessionHasErrors('attachments.0');
});

test('staff can save valid return summary, view it on admin client page, and audit log is recorded', function () {
    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $preparer->id,
        'status' => ReturnStatus::InPreparation,
    ]);

    $doc = Document::factory()->create([
        'user_id' => $client->id,
        'tax_return_id' => $taxReturn->id,
        'filename' => 'Form_1040.pdf',
    ]);

    $payload = [
        'federal' => [
            'result' => 'refund',
            'amount_cents' => 241800,
        ],
        'state' => [
            'code' => 'PA',
            'result' => 'even',
            'amount_cents' => 0,
        ],
        'bank_last4' => '4471',
        'filing_status' => 'head_of_household',
        'filing_method' => 'e-file',
        'forms' => [
            [
                'name' => 'Form 1040 · U.S. Individual Income Tax Return',
                'pages' => 14,
                'document_id' => $doc->id,
            ],
            [
                'name' => 'PA-40 · Pennsylvania Income Tax Return',
                'pages' => 4,
                'document_id' => null,
            ],
        ],
    ];

    $this->actingAs($preparer)
        ->patch(route('admin.returns.summary', $taxReturn), $payload)
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $taxReturn->refresh();
    expect($taxReturn->return_summary)->toMatchArray($payload);

    expect(AuditLog::where('action', 'admin.return_summary_updated')
        ->where('entity_id', $taxReturn->id)
        ->where('actor_id', $preparer->id)
        ->exists()
    )->toBeTrue();

    // Admin client page includes raw returnSummary and summaryOptions
    $this->actingAs($preparer)
        ->get(route('admin.clients.show', $client))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/client-show')
            ->where('returnSummary.federal.amount_cents', 241800)
            ->where('returnSummary.bank_last4', '4471')
            ->has('summaryOptions.results', 3)
            ->has('summaryOptions.states', 4)
            ->has('summaryOptions.filingStatuses', 5)
            ->has('summaryOptions.filingMethods', 1)
        );
});

test('return summary validation rejects invalid shapes, full bank account numbers, >12 forms, and another clients document_id', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();
    $otherClient = User::factory()->withTwoFactor()->create();

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $client->id,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    $otherDocument = Document::factory()->create([
        'user_id' => $otherClient->id,
    ]);

    // Invalid result, invalid state code, full bank account number, invalid filing_status, document_id belonging to another client
    $this->actingAs($admin)
        ->patch(route('admin.returns.summary', $taxReturn), [
            'federal' => [
                'result' => 'invalid_result',
                'amount_cents' => -100,
            ],
            'state' => [
                'code' => 'NY',
                'result' => 'refund',
                'amount_cents' => 5000,
            ],
            'bank_last4' => '123456789',
            'filing_status' => 'invalid_status',
            'filing_method' => 'paper',
            'forms' => [
                [
                    'name' => 'Form 1040',
                    'pages' => 0,
                    'document_id' => $otherDocument->id,
                ],
            ],
        ])
        ->assertSessionHasErrors([
            'federal.result',
            'federal.amount_cents',
            'state.code',
            'bank_last4',
            'filing_status',
            'filing_method',
            'forms.0.pages',
            'forms.0.document_id',
        ]);

    // > 12 forms rejected
    $thirteenForms = array_fill(0, 13, [
        'name' => 'Schedule X',
        'pages' => 1,
        'document_id' => null,
    ]);

    $this->actingAs($admin)
        ->patch(route('admin.returns.summary', $taxReturn), [
            'federal' => ['result' => 'even', 'amount_cents' => 0],
            'state' => null,
            'bank_last4' => null,
            'filing_status' => 'single',
            'filing_method' => 'e-file',
            'forms' => $thirteenForms,
        ])
        ->assertSessionHasErrors(['forms']);

    expect($taxReturn->fresh()->return_summary)->toBeNull();
});

test('return summary update is forbidden after e_signed and enforces preparer scoping', function () {
    $assignedPreparer = User::factory()->preparer()->withTwoFactor()->create();
    $otherPreparer = User::factory()->preparer()->withTwoFactor()->create();
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();

    $validPayload = [
        'federal' => ['result' => 'refund', 'amount_cents' => 150000],
        'state' => null,
        'bank_last4' => '9876',
        'filing_status' => 'single',
        'filing_method' => 'e-file',
        'forms' => [],
    ];

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $client->id,
        'preparer_id' => $assignedPreparer->id,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    // Unassigned preparer gets 403
    $this->actingAs($otherPreparer)
        ->patch(route('admin.returns.summary', $taxReturn), $validPayload)
        ->assertForbidden();

    // Regular client gets 403
    $this->actingAs($client)
        ->patch(route('admin.returns.summary', $taxReturn), $validPayload)
        ->assertForbidden();

    // Once status is ESigned or EFiled, even admin and assigned preparer get 403
    $taxReturn->update(['status' => ReturnStatus::ESigned]);

    $this->actingAs($assignedPreparer)
        ->patch(route('admin.returns.summary', $taxReturn), $validPayload)
        ->assertForbidden();

    $this->actingAs($admin)
        ->patch(route('admin.returns.summary', $taxReturn), $validPayload)
        ->assertForbidden();

    $taxReturn->update(['status' => ReturnStatus::EFiled]);

    $this->actingAs($admin)
        ->patch(route('admin.returns.summary', $taxReturn), $validPayload)
        ->assertForbidden();
});

test('admin leads index returns status counts, LIKE-safe search filter, and preparers list', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create(['name' => 'Admin Staff']);
    $preparer = User::factory()->preparer()->withTwoFactor()->create(['name' => 'Adaeze Preparer']);

    $leadNew1 = Lead::factory()->create([
        'kind' => LeadKind::Quote,
        'name' => 'Kwame Asante',
        'email' => 'kwame@example.com',
        'phone' => '215-555-0190',
        'ref_code' => 'OKJ-100%SAFE',
        'status' => LeadStatus::New,
    ]);
    Lead::factory()->create([
        'kind' => LeadKind::Consult,
        'name' => 'Grace Mensah',
        'email' => 'grace@example.com',
        'status' => LeadStatus::New,
    ]);
    Lead::factory()->create(['status' => LeadStatus::Contacted]);
    Lead::factory()->create(['status' => LeadStatus::Converted]);
    Lead::factory()->create(['status' => LeadStatus::Closed]);

    $this->actingAs($admin)
        ->get(route('admin.leads.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/leads')
            ->where('counts.new', 2)
            ->where('counts.contacted', 1)
            ->where('counts.converted', 1)
            ->where('counts.closed', 1)
            ->where('counts.all', 5)
            ->has('preparers', 2)
            ->has('leads.data', 5)
        );

    // Search by literal '%' in ref_code (LIKE-safe escaping)
    $this->actingAs($admin)
        ->get(route('admin.leads.index', ['search' => '100%SAFE']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.search', '100%SAFE')
            ->has('leads.data', 1)
            ->where('leads.data.0.id', $leadNew1->id)
        );
});

test('admin leads CSV export respects filters, enforces authorization, and neutralizes CSV injection', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $client = User::factory()->withTwoFactor()->create();

    Lead::factory()->create([
        'name' => '=HYPERLINK("http://evil.test")',
        'email' => 'injected-lead@example.com',
        'phone' => '+12675550111',
        'status' => LeadStatus::New,
    ]);
    Lead::factory()->create([
        'name' => 'Closed Lead',
        'email' => 'closed-lead@example.com',
        'status' => LeadStatus::Closed,
    ]);

    // Client forbidden
    $this->actingAs($client)
        ->get(route('admin.leads.export'))
        ->assertForbidden();

    // Admin export filtered by status=new
    $response = $this->actingAs($admin)
        ->get(route('admin.leads.export', ['status' => LeadStatus::New->value]));

    $response->assertOk();
    $csv = $response->streamedContent();

    expect($csv)->toContain('Name,Email,Phone,Kind,"Tier Interest",Situation,"Preferred Date","Time Window",Format,"Ref Code",Status,Notes,Created')
        ->and($csv)->toContain("'=HYPERLINK")
        ->and($csv)->toContain("'+12675550111")
        ->and($csv)->not->toContain('Closed Lead');
});

test('converting a lead supports optional preparer_id, sends ClientInvitation once, and rejects re-converting an already-converted lead', function () {
    Notification::fake();

    $admin = User::factory()->admin()->withTwoFactor()->create();
    $preparer1 = User::factory()->preparer()->withTwoFactor()->create();
    $preparer2 = User::factory()->preparer()->withTwoFactor()->create();

    $lead = Lead::factory()->create([
        'name' => 'Olivia Carter',
        'email' => 'olivia.carter@example.com',
        'tier_interest' => Tier::Hybrid->value,
        'status' => LeadStatus::New,
    ]);

    // Admin converts with explicit preparer_id
    $this->actingAs($admin)
        ->post(route('admin.leads.convert', $lead), [
            'preparer_id' => $preparer1->id,
        ])
        ->assertRedirect();

    $convertedUser = User::where('email', 'olivia.carter@example.com')->first();
    expect($convertedUser)->not->toBeNull()
        ->and($convertedUser->email_verified_at)->not->toBeNull();

    $taxReturn = $convertedUser->taxReturns()->first();
    expect($taxReturn)->not->toBeNull()
        ->and($taxReturn->preparer_id)->toBe($preparer1->id)
        ->and($taxReturn->invoice)->not->toBeNull();

    Notification::assertSentToTimes($convertedUser, ClientInvitation::class, 1);

    // Re-converting an already converted lead is rejected and does not send another notification
    $this->actingAs($admin)
        ->post(route('admin.leads.convert', $lead))
        ->assertSessionHasErrors('lead');

    Notification::assertSentToTimes($convertedUser, ClientInvitation::class, 1);

    // Preparer converting without preparer_id defaults to themselves, and cannot assign another preparer
    $lead2 = Lead::factory()->create([
        'name' => 'Samuel Reyes',
        'email' => 'samuel.reyes@example.com',
        'status' => LeadStatus::New,
    ]);

    $this->actingAs($preparer1)
        ->post(route('admin.leads.convert', $lead2), [
            'preparer_id' => $preparer2->id,
        ])
        ->assertSessionHasErrors('preparer_id');

    $this->actingAs($preparer1)
        ->post(route('admin.leads.convert', $lead2))
        ->assertRedirect();

    $convertedUser2 = User::where('email', 'samuel.reyes@example.com')->first();
    expect($convertedUser2)->not->toBeNull()
        ->and($convertedUser2->taxReturns()->first()?->preparer_id)->toBe($preparer1->id);

    Notification::assertSentToTimes($convertedUser2, ClientInvitation::class, 1);
});

test('admin referrals index computes totals across all statuses, defaults filter to ready, and supports status filtering', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $preparer = User::factory()->preparer()->withTwoFactor()->create();
    $otherPreparer = User::factory()->preparer()->withTwoFactor()->create();

    $assignedReferrer = User::factory()->withTwoFactor()->create(['tier' => Tier::Hybrid]);
    TaxReturn::factory()->create([
        'user_id' => $assignedReferrer->id,
        'preparer_id' => $preparer->id,
    ]);

    $otherReferrer = User::factory()->withTwoFactor()->create(['tier' => Tier::UploadAndGo]);
    TaxReturn::factory()->create([
        'user_id' => $otherReferrer->id,
        'preparer_id' => $otherPreparer->id,
    ]);

    // 1 Sent (assigned), 1 SignedUp (assigned), 2 Filed/ready (1 assigned, 1 other), 1 Rewarded ($50, assigned)
    Referral::factory()->create([
        'referrer_id' => $assignedReferrer->id,
        'status' => ReferralStatus::Sent,
        'reward_cents' => null,
    ]);
    Referral::factory()->create([
        'referrer_id' => $assignedReferrer->id,
        'status' => ReferralStatus::SignedUp,
        'friend_user_id' => User::factory()->create()->id,
        'reward_cents' => null,
    ]);
    $readyAssigned = Referral::factory()->create([
        'referrer_id' => $assignedReferrer->id,
        'status' => ReferralStatus::Filed,
        'reward_cents' => null,
    ]);
    Referral::factory()->create([
        'referrer_id' => $otherReferrer->id,
        'status' => ReferralStatus::Filed,
        'reward_cents' => null,
    ]);
    Referral::factory()->create([
        'referrer_id' => $assignedReferrer->id,
        'status' => ReferralStatus::Rewarded,
        'reward_cents' => 5000,
    ]);

    // Default filter is 'ready' (shows the 2 Filed referrals for admin), with full totals and counts
    // Total invites = 5; signedUp = 4 (80%); filed = 3 (2 ready + 1 rewarded); readyToReward = 2; rewardsPaidCents = 5000 ($50); rewardedClients = 1
    $this->actingAs($admin)
        ->get(route('admin.referrals.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/referrals')
            ->where('filters.status', 'ready')
            ->where('counts.ready', 2)
            ->where('counts.all', 5)
            ->where('totals.invites', 5)
            ->where('totals.signedUp', 4)
            ->where('totals.signedUpPercent', 80)
            ->where('totals.filed', 3)
            ->where('totals.readyToReward', 2)
            ->where('totals.rewardsPaidCents', 5000)
            ->where('totals.rewardsPaidFormatted', '$50')
            ->where('totals.rewardedClients', 1)
            ->has('referrals.data', 2)
        );

    // Filter status=all returns all 5 referrals
    $this->actingAs($admin)
        ->get(route('admin.referrals.index', ['status' => 'all']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.status', 'all')
            ->has('referrals.data', 5)
        );

    // Filter by specific ReferralStatus value (e.g. 'rewarded')
    $this->actingAs($admin)
        ->get(route('admin.referrals.index', ['status' => ReferralStatus::Rewarded->value]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.status', ReferralStatus::Rewarded->value)
            ->has('referrals.data', 1)
        );

    // Preparer scoping: sees only the 4 referrals linked to assignedReferrer (1 ready)
    $this->actingAs($preparer)
        ->get(route('admin.referrals.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.status', 'ready')
            ->where('counts.ready', 1)
            ->where('counts.all', 4)
            ->where('totals.invites', 4)
            ->where('totals.readyToReward', 1)
            ->has('referrals.data', 1)
            ->where('referrals.data.0.id', $readyAssigned->id)
        );
});
