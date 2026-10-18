<?php

use App\Enums\DocType;
use App\Enums\ReturnStatus;
use App\Enums\ScanStatus;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\StatusEvent;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('sign flow state rules: sign page is available only when status is ReadyForReview', function () {
    $user = User::factory()->withTwoFactor()->create();

    // IntakeReceived -> 403
    $returnIntake = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2021,
        'status' => ReturnStatus::IntakeReceived,
    ]);
    $this->actingAs($user)->get(route('portal.sign', $returnIntake))->assertForbidden();

    // InPreparation -> 403
    $returnPrep = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2022,
        'status' => ReturnStatus::InPreparation,
    ]);
    $this->actingAs($user)->get(route('portal.sign', $returnPrep))->assertForbidden();

    // ESigned -> 403
    $returnSigned = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2023,
        'status' => ReturnStatus::ESigned,
    ]);
    $this->actingAs($user)->get(route('portal.sign', $returnSigned))->assertForbidden();

    // EFiled -> 403
    $returnFiled = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2024,
        'status' => ReturnStatus::EFiled,
    ]);
    $this->actingAs($user)->get(route('portal.sign', $returnFiled))->assertForbidden();

    // ReadyForReview -> 200 OK
    $returnReady = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2025,
        'status' => ReturnStatus::ReadyForReview,
    ]);
    $this->actingAs($user)->get(route('portal.sign', $returnReady))->assertOk();
});

test('sign flow state rules: user cannot view or sign another users tax return', function () {
    $owner = User::factory()->withTwoFactor()->create();
    $other = User::factory()->withTwoFactor()->create();

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $owner->id,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    $this->actingAs($other)->get(route('portal.sign', $taxReturn))->assertForbidden();
    $this->actingAs($other)->post(route('portal.sign.submit', $taxReturn), [
        'consent_7216' => true,
        'typed_signature' => 'Unauthorized Signer',
    ])->assertForbidden();
});

test('sign page displays return summary and Form 7216 consent text', function () {
    $user = User::factory()->withTwoFactor()->create(['name' => 'Jane Taxpayer']);
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    $response = $this->actingAs($user)->get(route('portal.sign', $taxReturn));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/sign')
        ->where('taxReturn.id', $taxReturn->id)
        ->where('taxReturn.taxYear', 2026)
        ->where('clientName', 'Jane Taxpayer')
        ->has('form7216ConsentText')
        ->has('form8879DeclarationText')
    );
});

test('sign submission requires affirmative Form 7216 consent and typed signature', function () {
    $user = User::factory()->withTwoFactor()->create();
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    // Omit consent
    $response = $this->actingAs($user)->post(route('portal.sign.submit', $taxReturn), [
        'consent_7216' => false,
        'typed_signature' => 'Jane Taxpayer',
    ]);
    $response->assertSessionHasErrors('consent_7216');

    // Omit signature
    $response2 = $this->actingAs($user)->post(route('portal.sign.submit', $taxReturn), [
        'consent_7216' => true,
        'typed_signature' => '',
    ]);
    $response2->assertSessionHasErrors('typed_signature');
});

test('successful e-signature generates pdf, records audit log, and advances status to ESigned', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create(['name' => 'Jane Taxpayer']);
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    $response = $this->actingAs($user)->post(route('portal.sign.submit', $taxReturn), [
        'consent_7216' => true,
        'typed_signature' => 'Jane Taxpayer',
    ]);

    $response->assertRedirect(route('portal.overview'));
    $response->assertSessionHas('success');

    // Assert tax return advanced to ESigned
    $taxReturn->refresh();
    expect($taxReturn->status)->toBe(ReturnStatus::ESigned);
    expect($taxReturn->signed_at)->not->toBeNull();

    // Assert signed PDF generated and stored on private disk
    $signedDoc = Document::where('user_id', $user->id)
        ->where('tax_return_id', $taxReturn->id)
        ->where('type', DocType::Other)
        ->first();

    expect($signedDoc)->not->toBeNull();
    expect($signedDoc->filename)->toContain('Form 8879 & 7216 Signed - 2026.pdf');
    expect($signedDoc->scan_status)->toBe(ScanStatus::Clean);
    Storage::disk('private')->assertExists($signedDoc->storage_key);

    // Verify PDF content
    $pdfContent = Storage::disk('private')->get($signedDoc->storage_key);
    expect($pdfContent)->toStartWith('%PDF-1.4');
    expect($pdfContent)->toContain('Jane Taxpayer');
    expect($pdfContent)->toContain('Form 7216');

    // Assert audit log created
    expect(AuditLog::where('action', 'tax_return.e_signed')
        ->where('entity_id', $taxReturn->id)
        ->where('actor_id', $user->id)
        ->exists()
    )->toBeTrue();

    // Assert status event recorded
    expect(StatusEvent::where('tax_return_id', $taxReturn->id)
        ->where('to', ReturnStatus::ESigned)
        ->exists()
    )->toBeTrue();
});
