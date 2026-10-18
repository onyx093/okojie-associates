<?php

use App\Models\NewsletterSubscriber;

test('guest can subscribe to newsletter and submission is idempotent', function () {
    $response = $this->post(route('newsletter.subscribe'), [
        'email' => 'subscriber@example.com',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Thank you for subscribing to tax updates.');

    $this->assertDatabaseHas('newsletter_subscribers', [
        'email' => 'subscriber@example.com',
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'newsletter.subscribed',
        'entity' => 'NewsletterSubscriber',
    ]);

    // Resubscribing same email is idempotent
    $repeat = $this->post(route('newsletter.subscribe'), [
        'email' => 'subscriber@example.com',
    ]);

    $repeat->assertRedirect();
    expect(NewsletterSubscriber::where('email', 'subscriber@example.com')->count())->toBe(1);
});

test('newsletter subscription requires valid email', function () {
    $response = $this->post(route('newsletter.subscribe'), [
        'email' => 'invalid-email',
    ]);

    $response->assertSessionHasErrors([
        'email' => 'Enter a valid email address.',
    ]);

    expect(NewsletterSubscriber::count())->toBe(0);
});

test('newsletter honeypot rejects spam bots', function () {
    $response = $this->post(route('newsletter.subscribe'), [
        'email' => 'bot@spammer.com',
        'my_name' => 'bot-value',
    ]);

    expect(NewsletterSubscriber::where('email', 'bot@spammer.com')->exists())->toBeFalse();
});
