<?php

use App\Enums\InvoiceStatus;
use App\Mail\PaymentReceipt;
use App\Models\AuditLog;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Cashier\Checkout;
use Laravel\Cashier\Events\WebhookReceived;
use Stripe\Checkout\Session;
use Stripe\PaymentIntent;
use Stripe\PaymentMethod;
use Stripe\Service\PaymentIntentService;
use Stripe\StripeClient;

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

test('receipt numbers are sequential per year, idempotent, and lazily assigned on first receipt view', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();
    $client1 = User::factory()->withTwoFactor()->create();
    $client2 = User::factory()->withTwoFactor()->create();
    $client3 = User::factory()->withTwoFactor()->create();

    $year = (int) now()->format('Y');

    $return1 = TaxReturn::factory()->create(['user_id' => $client1->id, 'tax_year' => $year]);
    $invoice1 = Invoice::factory()->create([
        'tax_return_id' => $return1->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    // 1. Mark paid offline via admin -> assigns RCPT-{year}-00001
    $this->actingAs($admin)
        ->patch(route('admin.invoices.update', $return1), [
            'mark_paid_offline' => true,
        ])
        ->assertRedirect();

    $invoice1->refresh();
    expect($invoice1->receipt_number)->toBe("RCPT-{$year}-00001")
        ->and($invoice1->payment_method_brand)->toBeNull()
        ->and($invoice1->payment_method_last4)->toBeNull();

    // Idempotent: calling ensureReceiptNumber() or viewing receipt never renumbers
    expect($invoice1->ensureReceiptNumber())->toBe("RCPT-{$year}-00001");

    // 2. Legacy paid row without receipt_number -> lazily assigned RCPT-{year}-00002 on receipt view
    $return2 = TaxReturn::factory()->create(['user_id' => $client2->id, 'tax_year' => $year]);
    $legacyPaidInvoice = Invoice::factory()->create([
        'tax_return_id' => $return2->id,
        'amount_cents' => 27500,
        'status' => InvoiceStatus::Paid,
        'paid_at' => now(),
        'receipt_number' => null,
        'payment_method_brand' => 'Visa',
        'payment_method_last4' => '4242',
    ]);

    $this->actingAs($client2)
        ->get(route('portal.invoices.receipt', $legacyPaidInvoice))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('portal/receipt')
            ->where('receiptNumber', "RCPT-{$year}-00002")
            ->where('paymentMethod', ['brand' => 'Visa', 'last4' => '4242'])
            ->where('lineItem', "Tax preparation — {$year} return")
        );

    expect($legacyPaidInvoice->fresh()->receipt_number)->toBe("RCPT-{$year}-00002");

    // 3. Unpaid invoice returns 404 on receipt view
    $return3 = TaxReturn::factory()->create(['user_id' => $client3->id, 'tax_year' => $year]);
    $unpaidInvoice = Invoice::factory()->create([
        'tax_return_id' => $return3->id,
        'amount_cents' => 22500,
        'status' => InvoiceStatus::Open,
    ]);

    $this->actingAs($client3)
        ->get(route('portal.invoices.receipt', $unpaidInvoice))
        ->assertNotFound();
});

test('webhook captures payment method brand and last4 when available and still succeeds when Stripe lookup throws', function () {
    Mail::fake();

    $year = (int) now()->format('Y');
    $client1 = User::factory()->withTwoFactor()->create();
    $return1 = TaxReturn::factory()->create(['user_id' => $client1->id, 'tax_year' => $year]);
    $invoice1 = Invoice::factory()->create([
        'tax_return_id' => $return1->id,
        'amount_cents' => 27500,
        'status' => InvoiceStatus::Open,
    ]);

    // Mock StripeClient in container to return a PaymentIntent with expanded PaymentMethod
    $paymentMethod = PaymentMethod::constructFrom([
        'id' => 'pm_test_123',
        'card' => [
            'brand' => 'visa',
            'last4' => '4242',
        ],
    ]);
    $paymentIntent = PaymentIntent::constructFrom([
        'id' => 'pi_test_123',
        'payment_method' => $paymentMethod,
    ]);

    $mockPiService = Mockery::mock(PaymentIntentService::class);
    $mockPiService->shouldReceive('retrieve')
        ->once()
        ->with('pi_test_123', ['expand' => ['payment_method']])
        ->andReturn($paymentIntent);

    $mockStripe = Mockery::mock(StripeClient::class);
    $mockStripe->paymentIntents = $mockPiService;
    $this->app->bind(StripeClient::class, fn () => $mockStripe);

    event(new WebhookReceived([
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'id' => 'cs_test_with_card',
                'payment_intent' => 'pi_test_123',
                'metadata' => [
                    'invoice_id' => $invoice1->id,
                    'user_id' => (string) $client1->id,
                ],
                'payment_status' => 'paid',
            ],
        ],
    ]));

    $invoice1->refresh();
    expect($invoice1->status)->toBe(InvoiceStatus::Paid)
        ->and($invoice1->receipt_number)->toBe("RCPT-{$year}-00001")
        ->and($invoice1->payment_method_brand)->toBe('Visa')
        ->and($invoice1->payment_method_last4)->toBe('4242');

    // Overview page exposes receipt_number and payment_method on InvoiceResource
    $this->actingAs($client1)
        ->get(route('portal.overview'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('invoice.receipt_number', "RCPT-{$year}-00001")
            ->where('invoice.payment_method', ['brand' => 'Visa', 'last4' => '4242'])
        );

    // When Stripe lookup throws an exception, webhook still marks invoice paid and assigns receipt number
    $client2 = User::factory()->withTwoFactor()->create();
    $return2 = TaxReturn::factory()->create(['user_id' => $client2->id, 'tax_year' => $year]);
    $invoice2 = Invoice::factory()->create([
        'tax_return_id' => $return2->id,
        'amount_cents' => 35000,
        'status' => InvoiceStatus::Open,
    ]);

    $throwingPiService = Mockery::mock(PaymentIntentService::class);
    $throwingPiService->shouldReceive('retrieve')
        ->once()
        ->andThrow(new RuntimeException('Stripe API unreachable'));

    $throwingStripe = Mockery::mock(StripeClient::class);
    $throwingStripe->paymentIntents = $throwingPiService;
    $this->app->bind(StripeClient::class, fn () => $throwingStripe);

    event(new WebhookReceived([
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'id' => 'cs_test_stripe_down',
                'payment_intent' => 'pi_test_fail',
                'metadata' => [
                    'invoice_id' => $invoice2->id,
                    'user_id' => (string) $client2->id,
                ],
                'payment_status' => 'paid',
            ],
        ],
    ]));

    $invoice2->refresh();
    expect($invoice2->status)->toBe(InvoiceStatus::Paid)
        ->and($invoice2->receipt_number)->toBe("RCPT-{$year}-00002")
        ->and($invoice2->payment_method_brand)->toBeNull()
        ->and($invoice2->payment_method_last4)->toBeNull();
});
