<?php

use App\Enums\DocType;
use App\Enums\ReturnStatus;
use App\Enums\ScanStatus;
use App\Enums\Tier;
use App\Models\Document;
use App\Models\TaxReturn;
use App\Models\User;

it('renders portal documents on desktop with upload form, checklist counts, download links, and delete actions', function () {
    $user = User::factory()->create([
        'name' => 'Denise Robinson',
        'email' => 'denise.docs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::InPreparation,
    ]);

    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'W2_2026_TempleUniversity.pdf',
        'type' => DocType::W2,
        'scan_status' => ScanStatus::Clean,
        'size_bytes' => 219136,
    ]);

    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => '1099-INT_PNC.pdf',
        'type' => DocType::Form1099,
        'scan_status' => ScanStatus::Clean,
        'size_bytes' => 90112,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.docs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/documents')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Your return')
        ->assertSeeIn('main#main h1', 'Documents')
        ->assertSeeIn('main#main', 'Only you and your preparer can see these files.')
        ->assertSeeIn('#up-title', 'Upload a document')
        ->assertPresent('#doc-type')
        ->assertPresent('#file-in')
        ->assertSeeIn('#ck-title', 'What we usually need')
        ->assertSeeIn('[data-slot="checklist-item"]:has-text("W-2 from each job")', '1 uploaded')
        ->assertSeeIn('[data-slot="checklist-item"]:has-text("1099s (interest, freelance)")', '1 uploaded')
        ->assertSeeIn('[data-slot="checklist-item"]:has-text("1098-T or 1098")', 'Optional')
        ->assertSeeIn('#list-title', 'Your documents')
        ->assertSeeIn('main#main', '2 files')
        ->assertSeeIn('[data-slot="row"]:has-text("W2_2026_TempleUniversity.pdf")', 'Clean')
        ->assertSeeIn('[data-slot="row"]:has-text("1099-INT_PNC.pdf")', 'Clean')
        ->assertPresent('a[aria-label="Download W2_2026_TempleUniversity.pdf"]')
        ->assertPresent('button[aria-label="Delete W2_2026_TempleUniversity.pdf"]')
        ->assertSeeIn('main#main', 'Every file is virus-scanned');
});

it('renders portal documents in locked state when return is ready for review', function () {
    $user = User::factory()->create([
        'email' => 'locked.docs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => '2026_review_file.pdf',
        'type' => DocType::W2,
        'scan_status' => ScanStatus::Clean,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'locked.docs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/documents')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertPresent('#page[data-locked="true"]')
        ->assertSeeIn('.lockbar', 'Your return is ready for review, so documents can’t be deleted now')
        ->assertSeeIn('main#main', '2026_review_file.pdf')
        ->assertPresent('a[aria-label="Download 2026_review_file.pdf"]')
        ->assertMissing('button[aria-label="Delete 2026_review_file.pdf"]');
});

it('renders disabled download buttons for scanning and infected documents with aria-labels', function () {
    $user = User::factory()->create([
        'email' => 'scans.docs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::InPreparation,
    ]);

    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'pending_receipt.pdf',
        'type' => DocType::Other,
        'scan_status' => ScanStatus::Pending,
    ]);

    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'infected_bundle.zip',
        'type' => DocType::Other,
        'scan_status' => ScanStatus::Infected,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'scans.docs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/documents')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('[data-slot="row"]:has-text("pending_receipt.pdf")', 'Scanning…')
        ->assertSeeIn('[data-slot="row"]:has-text("infected_bundle.zip")', 'Blocked')
        ->assertPresent('button[disabled][aria-label="Download available after scan"]')
        ->assertPresent('button[disabled][aria-label="Blocked file can’t be downloaded"]');
});

it('renders empty documents state with call to action', function () {
    $user = User::factory()->create([
        'email' => 'empty.docs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::IntakeReceived,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'empty.docs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/documents')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'No documents yet')
        ->assertSeeIn('main#main', 'Upload your first file and it will appear here once it’s been scanned.')
        ->assertPresent('label[for="file-in"]');
});

it('renders portal documents on mobile viewport cleanly', function () {
    $user = User::factory()->create([
        'email' => 'mobile.docs@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::InPreparation,
    ]);

    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'mobile_doc.pdf',
        'type' => DocType::W2,
        'scan_status' => ScanStatus::Clean,
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.docs@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/documents')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Documents')
        ->assertSeeIn('#up-title', 'Upload a document')
        ->assertSeeIn('#list-title', 'Your documents')
        ->assertSeeIn('main#main', 'mobile_doc.pdf');
});

it('renders styleguide portal documents fixture states with no smoke errors', function () {
    visit('/dev/styleguide?fixture=page-portal-documents&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('W2_2026_TempleUniversity.pdf')
        ->assertSee('What we usually need');

    visit('/dev/styleguide?fixture=page-portal-documents&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Your return is ready for review, so documents can’t be deleted now');

    visit('/dev/styleguide?fixture=page-portal-documents&state=2')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('No documents yet');
});
