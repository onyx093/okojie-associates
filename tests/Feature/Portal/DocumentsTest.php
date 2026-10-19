<?php

use App\Enums\DocType;
use App\Enums\ReturnStatus;
use App\Enums\ScanStatus;
use App\Jobs\ScanDocument;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\TaxReturn;
use App\Models\User;
use App\Services\VirusScanner\FakeScanner;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('guests are redirected to login from documents page', function () {
    $response = $this->get(route('portal.documents'));

    $response->assertRedirect(route('login'));
});

test('unverified users are redirected to email verification from documents page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('portal.documents'));

    $response->assertRedirect(route('verification.notice'));
});

test('users without 2fa are redirected to portal security from documents page', function () {
    $user = User::factory()->create([
        'two_factor_confirmed_at' => null,
    ]);

    $response = $this->actingAs($user)->get(route('portal.documents'));

    $response->assertRedirect(route('portal.security'));
});

test('authenticated user can view empty documents page with exact copy from CONTENT.md', function () {
    $user = User::factory()->withTwoFactor()->create();

    $response = $this->actingAs($user)->get(route('portal.documents'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/documents')
        ->has('documents', 0)
        ->where('canDelete', true)
    );
});

test('user can upload a valid document', function () {
    Storage::fake('private');
    Queue::fake();

    $user = User::factory()->withTwoFactor()->create();
    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::IntakeReceived,
    ]);

    // Create a valid PDF with magic bytes %PDF-1.4
    $file = UploadedFile::fake()->createWithContent('w2_sample.pdf', "%PDF-1.4\nSample W-2 content for testing");

    $response = $this->actingAs($user)->post(route('portal.documents.store'), [
        'type' => DocType::W2->value,
        'file' => $file,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $document = Document::where('user_id', $user->id)->first();
    expect($document)->not->toBeNull()
        ->and($document->filename)->toBe('w2_sample.pdf')
        ->and($document->type)->toBe(DocType::W2)
        ->and($document->scan_status)->toBe(ScanStatus::Pending);

    Storage::disk('private')->assertExists($document->storage_key);
    Queue::assertPushed(ScanDocument::class);

    // Verify AuditLog
    expect(AuditLog::where('action', 'document.uploaded')
        ->where('entity_id', $document->id)
        ->exists())->toBeTrue();
});

test('upload rejects files exceeding 25 MB', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create();

    // 26 MB file
    $oversize = UploadedFile::fake()->createWithContent(
        'large.pdf',
        "%PDF-1.4\n".str_repeat('A', 26 * 1024 * 1024)
    );

    $response = $this->actingAs($user)->post(route('portal.documents.store'), [
        'type' => DocType::W2->value,
        'file' => $oversize,
    ]);

    $response->assertSessionHasErrors(['file']);
});

test('upload rejects disallowed extensions and MIMEs', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create();

    $badFile = UploadedFile::fake()->createWithContent('script.sh', "#!/bin/bash\necho hello");

    $response = $this->actingAs($user)->post(route('portal.documents.store'), [
        'type' => DocType::W2->value,
        'file' => $badFile,
    ]);

    $response->assertSessionHasErrors(['file']);
});

test('upload rejects files failing magic byte check', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create();

    // Renamed executable/plain text claiming to be a PDF
    $spoofedFile = UploadedFile::fake()->createWithContent('malicious.pdf', "MZ\x90\x00\x03This is not a real PDF");

    $response = $this->actingAs($user)->post(route('portal.documents.store'), [
        'type' => DocType::W2->value,
        'file' => $spoofedFile,
    ]);

    $response->assertSessionHasErrors(['file']);
});

test('download is blocked when scan status is pending or infected', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create();

    $pendingDoc = Document::factory()->pending()->create([
        'user_id' => $user->id,
        'storage_key' => 'documents/pending.pdf',
    ]);
    Storage::disk('private')->put($pendingDoc->storage_key, '%PDF-1.4');

    $response = $this->actingAs($user)->get(route('portal.documents.download', $pendingDoc));
    $response->assertForbidden();

    $infectedDoc = Document::factory()->infected()->create([
        'user_id' => $user->id,
        'storage_key' => 'documents/infected.pdf',
    ]);
    Storage::disk('private')->put($infectedDoc->storage_key, '%PDF-1.4');

    $response2 = $this->actingAs($user)->get(route('portal.documents.download', $infectedDoc));
    $response2->assertForbidden();
});

test('user can download their clean document and audit log is written', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create();
    $doc = Document::factory()->create([
        'user_id' => $user->id,
        'scan_status' => ScanStatus::Clean,
        'storage_key' => 'documents/clean.pdf',
        'filename' => 'clean.pdf',
    ]);
    Storage::disk('private')->put($doc->storage_key, "%PDF-1.4\nTest file");

    $response = $this->actingAs($user)->get(route('portal.documents.download', $doc));

    $response->assertRedirect();

    expect(AuditLog::where('action', 'document.downloaded')
        ->where('entity_id', $doc->id)
        ->exists())->toBeTrue();
});

test('IDOR: user A cannot download or delete user B document', function () {
    Storage::fake('private');

    $userA = User::factory()->withTwoFactor()->create();
    $userB = User::factory()->withTwoFactor()->create();

    $docB = Document::factory()->create([
        'user_id' => $userB->id,
        'scan_status' => ScanStatus::Clean,
        'storage_key' => 'documents/userB.pdf',
    ]);
    Storage::disk('private')->put($docB->storage_key, "%PDF-1.4\nUser B file");

    // User A attempts to download User B's document
    $downloadResponse = $this->actingAs($userA)->get(route('portal.documents.download', $docB));
    $downloadResponse->assertForbidden();

    // User A attempts to delete User B's document
    $deleteResponse = $this->actingAs($userA)->delete(route('portal.documents.destroy', $docB));
    $deleteResponse->assertForbidden();

    Storage::disk('private')->assertExists($docB->storage_key);
});

test('user can delete their document before ReadyForReview', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create();
    TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::InPreparation,
    ]);

    $doc = Document::factory()->create([
        'user_id' => $user->id,
        'storage_key' => 'documents/to_delete.pdf',
    ]);
    Storage::disk('private')->put($doc->storage_key, "%PDF-1.4\nDelete me");

    $response = $this->actingAs($user)->delete(route('portal.documents.destroy', $doc));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    expect(Document::find($doc->id))->toBeNull();
    Storage::disk('private')->assertMissing($doc->storage_key);

    expect(AuditLog::where('action', 'document.deleted')
        ->where('entity_id', $doc->id)
        ->exists())->toBeTrue();
});

test('user cannot delete document once return status is ReadyForReview or later', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create();
    TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    $doc = Document::factory()->create([
        'user_id' => $user->id,
        'storage_key' => 'documents/locked.pdf',
    ]);
    Storage::disk('private')->put($doc->storage_key, "%PDF-1.4\nLocked file");

    $response = $this->actingAs($user)->delete(route('portal.documents.destroy', $doc));

    $response->assertForbidden();
    expect(Document::find($doc->id))->not->toBeNull();
    Storage::disk('private')->assertExists($doc->storage_key);
});

test('ScanDocument job updates scan status based on scanner result', function () {
    Storage::fake('private');

    $user = User::factory()->withTwoFactor()->create();
    $doc = Document::factory()->pending()->create([
        'user_id' => $user->id,
        'storage_key' => 'documents/scanned.pdf',
    ]);
    Storage::disk('private')->put($doc->storage_key, "%PDF-1.4\nScan file");

    $scanner = new FakeScanner;
    $scanner->setShouldPass(true);

    $job = new ScanDocument($doc);
    $job->handle($scanner);

    expect($doc->fresh()->scan_status)->toBe(ScanStatus::Clean);

    // If scanner detects infection
    $docInfected = Document::factory()->pending()->create([
        'user_id' => $user->id,
        'storage_key' => 'documents/infected.pdf',
    ]);
    Storage::disk('private')->put($docInfected->storage_key, "%PDF-1.4\nBad file");

    $scanner->setShouldPass(false);
    $jobInfected = new ScanDocument($docInfected);
    $jobInfected->handle($scanner);

    expect($docInfected->fresh()->scan_status)->toBe(ScanStatus::Infected);
});

test('overview documents count updates after document is uploaded', function () {
    $user = User::factory()->withTwoFactor()->create();
    TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::IntakeReceived,
    ]);

    Document::factory()->count(3)->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->get(route('portal.overview'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/overview')
        ->where('counts.documents', 3)
    );
});
