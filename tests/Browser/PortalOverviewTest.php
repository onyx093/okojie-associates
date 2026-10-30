<?php

use App\Enums\ApptFormat;
use App\Enums\ApptStatus;
use App\Enums\DocType;
use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Enums\ScanStatus;
use App\Enums\Tier;
use App\Models\Appointment;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;

it('renders portal overview on desktop with header, stepper, next step card, metrics, documents, fee, and call cards', function () {
    $user = User::factory()->create([
        'name' => 'Denise Robinson',
        'email' => 'denise.robinson@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::IntakeReceived,
    ]);

    Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => 'W2_2026_TempleUniversity.pdf',
        'type' => DocType::W2,
        'scan_status' => ScanStatus::Clean,
    ]);

    Document::factory()->create([
        'user_id' => $user->id,
        'filename' => '1099-INT_PNC.pdf',
        'type' => DocType::Form1099,
        'scan_status' => ScanStatus::Clean,
    ]);

    Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Confirmed,
        'format' => ApptFormat::Video,
        'preferred_date' => now()->addDays(3)->toDateString(),
        'scheduled_at' => now()->addDays(3)->setTime(16, 30),
        'topic' => 'Review call with your preparer',
        'join_url' => 'https://meet.google.com/xyz-call',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.robinson@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/overview')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Welcome back, Denise')
        ->assertSeeIn('main#main', 'Overview')
        ->assertSeeIn('#status-title', 'Your return')
        ->assertSeeIn('main#main', 'Intake received')
        ->assertSeeIn('main#main', 'In preparation')
        ->assertSeeIn('main#main', 'Ready for review')
        ->assertSeeIn('main#main', 'E-signed')
        ->assertSeeIn('main#main', 'E-filed')
        ->assertSeeIn('main#main', 'We have your intake')
        ->assertSeeIn('main#main header', 'Upload documents')
        ->assertSeeIn('main#main #next', 'Upload documents')
        ->assertSeeIn('section[aria-label="At a glance"]', 'Documents')
        ->assertSeeIn('section[aria-label="At a glance"]', 'Messages')
        ->assertSeeIn('section[aria-label="At a glance"]', 'Next call')
        ->assertSeeIn('section[aria-label="At a glance"]', 'Referrals')
        ->assertSeeIn('#docs-title', 'Recent documents')
        ->assertSeeIn('main#main', 'W2_2026_TempleUniversity.pdf')
        ->assertSeeIn('#inv-title', 'Your fee')
        ->assertSeeIn('section[aria-labelledby="inv-title"]', 'Preparation')
        ->assertSeeIn('section[aria-labelledby="inv-title"]', 'Before we e-file')
        ->assertSeeIn('main#main', 'Pay $225')
        ->assertSeeIn('#appt-title', 'Upcoming call')
        ->assertSeeIn('main#main', 'Join call')
        ->assertSeeIn('main#main', 'Reschedule');
});

it('renders portal overview on mobile viewport cleanly with vertical stepper', function () {
    $user = User::factory()->create([
        'name' => 'Denise Mobile',
        'email' => 'mobile.denise@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
        'status' => ReturnStatus::IntakeReceived,
    ]);

    Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.denise@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/overview')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Welcome back, Denise')
        ->assertSeeIn('#status-title', 'Your return')
        ->assertPresent('main#main #stepper')
        ->assertSeeIn('main#main', 'Pay $225');
});

it('displays Action needed next-step card when return is ready for review', function () {
    $user = User::factory()->create([
        'email' => 'review.client@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::ReadyForReview,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'review.client@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/overview')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main #next', 'Action needed')
        ->assertSeeIn('main#main #next', 'Your return is ready to review')
        ->assertSeeIn('main#main #next', 'Review and e-sign')
        ->assertScript('document.querySelector(\'#next a[href*="portal/sign"]\') !== null', true);
});

it('displays All done and Paid receipt when return is e-filed and paid', function () {
    $user = User::factory()->create([
        'email' => 'filed.client@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'status' => ReturnStatus::EFiled,
        'filed_at' => now()->subDay(),
    ]);

    Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 27500,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now()->subDay(),
        'receipt_number' => 'RCPT-2026-00001',
        'payment_method_brand' => 'Visa',
        'payment_method_last4' => '4242',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'filed.client@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/overview')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main #next', 'All done')
        ->assertSeeIn('main#main #next', 'Your return has been e-filed')
        ->assertSeeIn('section[aria-labelledby="inv-title"]', 'Paid in full')
        ->assertSeeIn('main#main', 'Visa ending 4242')
        ->assertSeeIn('main#main', 'View receipt')
        ->assertScript('document.querySelector(\'a[href*="portal/invoices"][href*="receipt"]\') !== null', true);
});

it('displays empty state cleanly when user has no return, documents, or calls', function () {
    $user = User::factory()->create([
        'email' => 'empty.client@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'empty.client@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/overview')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'No documents yet')
        ->assertSeeIn('main#main', 'No calls booked')
        ->assertSeeIn('main#main', 'Awaiting quote')
        ->assertSeeIn('main#main', 'Not set yet');
});

it('renders styleguide portal overview fixture states with no smoke errors', function () {
    visit('/dev/styleguide?fixture=page-portal-overview&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Intake received');

    visit('/dev/styleguide?fixture=page-portal-overview&state=14')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Action needed');

    visit('/dev/styleguide?fixture=page-portal-overview&state=29')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('All done');
});
