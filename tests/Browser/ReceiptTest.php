<?php

use App\Enums\InvoiceStatus;
use App\Enums\Tier;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;

it('renders receipt for paid invoice with card details', function () {
    $user = User::factory()->create([
        'name' => 'Denise Robinson',
        'email' => 'denise.receipt@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
    ]);

    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 27500,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
        'payment_method_brand' => 'Visa',
        'payment_method_last4' => '4242',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.receipt@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/invoices/{$invoice->id}/receipt")
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Receipt')
        ->assertSeeIn('main#main header', 'Payment')
        ->assertSeeIn('main#main header', 'Back to overview')
        ->assertSeeIn('main#main header', 'Download PDF')
        ->assertSeeIn('main#main header', 'Print')
        ->assertSee('Okojie & Associates, Inc.')
        ->assertSee('Philadelphia & Baltimore offices')
        ->assertSee($invoice->fresh()->receipt_number)
        ->assertSee('Amount paid')
        ->assertSee('$275.00')
        ->assertSee('Paid in full')
        ->assertSeeIn('.receipt-wrap', 'Billed to')
        ->assertSeeIn('.receipt-wrap', 'Denise Robinson')
        ->assertSeeIn('.receipt-wrap', 'denise.receipt@example.com')
        ->assertSeeIn('.receipt-wrap', 'Payment')
        ->assertSeeIn('.receipt-wrap', 'Visa ending 4242')
        ->assertSeeIn('.receipt-wrap', 'Secure card processing by Stripe')
        ->assertSeeIn('.receipt-wrap table', 'Tax preparation — 2026 return')
        ->assertSeeIn('.totals', 'Subtotal')
        ->assertSeeIn('.totals', '$0.00')
        ->assertSeeIn('.totals', 'Total paid')
        ->assertSeeIn('.receipt-wrap', '(215) 555-0142 · hello@okojieonline.com')
        ->assertSeeIn('.receipt-wrap', 'Keep this receipt for your records.');
});

it('renders receipt for paid offline invoice with offline indicator', function () {
    $user = User::factory()->create([
        'name' => 'Marcus Vance',
        'email' => 'marcus.receipt@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::UploadAndGo,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
    ]);

    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 18000,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
        'payment_method_brand' => null,
        'payment_method_last4' => null,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'marcus.receipt@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/invoices/{$invoice->id}/receipt")
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Receipt')
        ->assertSeeIn('.receipt-wrap', 'Paid in person / offline')
        ->assertSeeIn('.receipt-wrap', 'Recorded by your preparer')
        ->assertDontSee('Secure card processing by Stripe')
        ->assertSee('$180.00');
});

it('aborts with 404 if client attempts to access receipt for unpaid invoice', function () {
    $user = User::factory()->create([
        'name' => 'Unpaid Client',
        'email' => 'unpaid.receipt@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
    ]);

    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'unpaid.receipt@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/invoices/{$invoice->id}/receipt")
        ->on()->desktop()
        ->assertSee('404');
});

it('renders receipt responsively on mobile viewport', function () {
    $user = User::factory()->create([
        'name' => 'Mobile Receipt User',
        'email' => 'mobile.receipt@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    $taxReturn = TaxReturn::factory()->create([
        'user_id' => $user->id,
        'tax_year' => 2026,
    ]);

    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 27500,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
        'payment_method_brand' => 'Visa',
        'payment_method_last4' => '4242',
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.receipt@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit("/portal/invoices/{$invoice->id}/receipt")
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Receipt')
        ->assertSee('$275.00')
        ->assertSee('Paid in full');
});

it('renders styleguide portal receipt fixture states cleanly', function () {
    // State 0: Paid with card
    visit('/dev/styleguide?fixture=page-portal-receipt&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('RCPT-2026-00418')
        ->assertSee('$275.00')
        ->assertSee('Visa ending 4242')
        ->assertSee('Secure card processing by Stripe');

    // State 1: Paid offline / in person
    visit('/dev/styleguide?fixture=page-portal-receipt&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('RCPT-2026-00089')
        ->assertSee('$180.00')
        ->assertSee('Paid in person / offline')
        ->assertSee('Recorded by your preparer');
});
