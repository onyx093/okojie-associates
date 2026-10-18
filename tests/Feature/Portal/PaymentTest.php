<?php

use App\Enums\InvoiceStatus;
use App\Mail\PaymentReceipt;
use App\Models\AuditLog;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Checkout;
use Laravel\Cashier\Events\WebhookReceived;
use Stripe\Checkout\Session;

test('checkout guard rails: unauthorized user cannot checkout invoice', function () {
    $owner = User::factory()->withTwoFactor()->create();
    $otherUser = User::factory()->withTwoFactor()->create();

    $taxReturn = TaxReturn::factory()->create(['user_id' => $owner->id]);
    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    $this->actingAs($otherUser)
        ->post(route('portal.invoices.checkout', $invoice))
        ->assertForbidden();
});

test('checkout guard rails: 409 conflict if invoice amount is null (awaiting quote)', function () {
    $user = User::factory()->withTwoFactor()->create();
    $taxReturn = TaxReturn::factory()->create(['user_id' => $user->id]);
    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => null,
        'status' => InvoiceStatus::Draft,
    ]);

    $this->actingAs($user)
        ->post(route('portal.invoices.checkout', $invoice))
        ->assertStatus(409);
});

test('checkout guard rails: 409 conflict if invoice is already paid', function () {
    $user = User::factory()->withTwoFactor()->create();
    $taxReturn = TaxReturn::factory()->create(['user_id' => $user->id]);
    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
    ]);

    $this->actingAs($user)
        ->post(route('portal.invoices.checkout', $invoice))
        ->assertStatus(409);
});

test('checkout initiates stripe checkout charge and returns location', function () {
    $user = User::factory()->withTwoFactor()->create();
    $taxReturn = TaxReturn::factory()->create(['user_id' => $user->id, 'tax_year' => 2026]);
    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    $stripeSession = Session::constructFrom([
        'id' => 'cs_test_123',
        'url' => 'https://checkout.stripe.com/pay/cs_test_sample123',
    ]);
    $realCheckout = new Checkout($user, $stripeSession);

    $mockUser = Mockery::mock($user)->makePartial();
    $mockUser->shouldReceive('checkoutCharge')
        ->once()
        ->with(
            22500,
            'Tax Preparation Fee — Tax Year 2026',
            1,
            Mockery::on(function ($options) use ($invoice, $user) {
                return isset($options['success_url'], $options['cancel_url'], $options['metadata'])
                    && $options['metadata']['invoice_id'] === $invoice->id
                    && $options['metadata']['user_id'] === (string) $user->id;
            })
        )
        ->andReturn($realCheckout);

    $response = $this->actingAs($mockUser)
        ->post(route('portal.invoices.checkout', $invoice));

    // Inertia::location returns 302 or 409 with redirect location
    if ($response->getStatusCode() === 409) {
        $response->assertHeader('X-Inertia-Location', 'https://checkout.stripe.com/pay/cs_test_sample123');
    } else {
        $response->assertRedirect('https://checkout.stripe.com/pay/cs_test_sample123');
    }
});

test('webhook idempotency: marks invoice paid and queues receipt email once', function () {
    Mail::fake();

    $user = User::factory()->withTwoFactor()->create(['email' => 'client@example.com']);
    $taxReturn = TaxReturn::factory()->create(['user_id' => $user->id]);
    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    $payload = [
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'id' => 'cs_test_webhook_session_999',
                'metadata' => [
                    'invoice_id' => $invoice->id,
                    'user_id' => (string) $user->id,
                ],
                'payment_status' => 'paid',
            ],
        ],
    ];

    // Fire webhook event the first time
    event(new WebhookReceived($payload));

    $freshInvoice = $invoice->fresh();
    expect($freshInvoice->status)->toBe(InvoiceStatus::Paid);
    expect($freshInvoice->paid_at)->not->toBeNull();
    expect($freshInvoice->stripe_session_id)->toBe('cs_test_webhook_session_999');

    // Mail queued
    Mail::assertQueued(PaymentReceipt::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });

    // AuditLog recorded
    expect(AuditLog::where('action', 'invoice.paid')
        ->where('entity_id', $invoice->id)
        ->exists()
    )->toBeTrue();

    // Idempotency: fire identical webhook a second time
    Mail::fake();
    event(new WebhookReceived($payload));

    // Nothing queued again
    Mail::assertNothingQueued();

    // No duplicate audit log
    expect(AuditLog::where('action', 'invoice.paid')
        ->where('entity_id', $invoice->id)
        ->count()
    )->toBe(1);
});

test('paid invoice receipt can be viewed by client', function () {
    $user = User::factory()->withTwoFactor()->create(['name' => 'Paid Client']);
    $taxReturn = TaxReturn::factory()->create(['user_id' => $user->id, 'tax_year' => 2026]);
    $invoice = Invoice::factory()->create([
        'tax_return_id' => $taxReturn->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('portal.invoices.receipt', $invoice));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('portal/receipt')
        ->where('invoice.id', $invoice->id)
        ->where('invoice.amountFormatted', '$225.00')
    );
});
