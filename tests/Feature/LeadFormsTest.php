<?php

use App\Enums\ApptFormat;
use App\Enums\LeadKind;
use App\Enums\TimeWindow;
use App\Mail\LeadConfirmation;
use App\Mail\LeadReceived;
use App\Models\Lead;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Mail::fake();
});

test('guest can submit quote lead and receives confirmation', function () {
    $response = $this->post(route('leads.quote'), [
        'name' => 'Marcus Taylor',
        'phone' => '(215) 555-0142',
        'email' => 'marcus@example.com',
        'tier_interest' => 'hybrid',
        'situation' => 'W-2 employee with side consulting business.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Thanks, Marcus! A preparer will follow up within one business day.');

    $this->assertDatabaseHas('leads', [
        'kind' => LeadKind::Quote->value,
        'name' => 'Marcus Taylor',
        'email' => 'marcus@example.com',
        'phone' => '(215) 555-0142',
        'tier_interest' => 'hybrid',
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'lead.quote_submitted',
        'entity' => 'Lead',
    ]);

    Mail::assertQueued(LeadReceived::class, function ($mail) {
        return $mail->lead->email === 'marcus@example.com';
    });

    Mail::assertQueued(LeadConfirmation::class, function ($mail) {
        return $mail->hasTo('marcus@example.com') && $mail->lead->name === 'Marcus Taylor';
    });
});

test('quote form requires name and valid email', function () {
    $response = $this->from(route('contact'))->post(route('leads.quote'), [
        'name' => '',
        'email' => 'not-an-email',
    ]);

    $response->assertRedirect(route('contact'));
    $response->assertSessionHasErrors([
        'name' => 'Please enter your name.',
        'email' => 'Enter a valid email address.',
    ]);

    expect(Lead::count())->toBe(0);
    Mail::assertNothingQueued();
});

test('guest can submit consultation lead and receives confirmation', function () {
    $futureDate = now()->addDays(3)->toDateString();

    $response = $this->post(route('leads.consult'), [
        'name' => 'Sarah Jenkins',
        'phone' => '(410) 555-0166',
        'email' => 'sarah@example.com',
        'preferred_date' => $futureDate,
        'time_window' => TimeWindow::Morning->value,
        'format' => ApptFormat::Video->value,
        'notes' => 'Need help sorting out multi-state PA and MD filing.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', "Request received. We'll confirm your consultation by email shortly.");

    $this->assertDatabaseHas('leads', [
        'kind' => LeadKind::Consult->value,
        'name' => 'Sarah Jenkins',
        'email' => 'sarah@example.com',
        'preferred_date' => $futureDate,
        'time_window' => TimeWindow::Morning->value,
        'format' => ApptFormat::Video->value,
    ]);

    Mail::assertQueued(LeadReceived::class);
    Mail::assertQueued(LeadConfirmation::class);
});

test('consultation form validates required fields and future date', function () {
    $pastDate = now()->subDays(2)->toDateString();

    $response = $this->post(route('leads.consult'), [
        'name' => '',
        'email' => '',
        'preferred_date' => $pastDate,
        'time_window' => 'invalid_window',
        'format' => 'invalid_format',
    ]);

    $response->assertSessionHasErrors([
        'name' => 'Please enter your name.',
        'email' => 'Enter a valid email address.',
        'preferred_date' => 'Choose a date today or later.',
        'time_window',
        'format',
    ]);

    expect(Lead::count())->toBe(0);
});

test('visiting contact page with ref attaches 30-day cookie and stores ref on lead', function () {
    // 1. Visit with ?ref=
    $visit = $this->get(route('contact', ['ref' => 'OKJ-674SU5']));
    $visit->assertOk();
    $visit->assertPlainCookie('okojie_referral', 'OKJ-674SU5');

    // 2. Submit lead with unencrypted cookie (since okojie_referral is exempted from encryption)
    $response = $this->withUnencryptedCookie('okojie_referral', 'OKJ-674SU5')
        ->post(route('leads.quote'), [
            'name' => 'Referred Client',
            'email' => 'referred@example.com',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('leads', [
        'email' => 'referred@example.com',
        'ref_code' => 'OKJ-674SU5',
    ]);
});

test('honeypot rejects spam bot submissions', function () {
    $response = $this->post(route('leads.quote'), [
        'name' => 'Bot Spammer',
        'email' => 'bot@spammer.com',
        'my_name' => 'I am a spam bot',
    ]);

    // Honeypot responds with blank page or 200 without creating database row
    expect(Lead::where('email', 'bot@spammer.com')->exists())->toBeFalse();
    Mail::assertNothingQueued();
});

test('quote submissions that send the shared honeypot fields are accepted', function () {
    // Mirrors what the frontend sends: an empty honeypot plus the shared `valid_from` timestamp.
    $honeypot = $this->get(route('home'))->viewData('page')['props']['honeypot'];

    $this->travel(5)->seconds();

    $response = $this->post(route('leads.quote'), [
        'name' => 'Real Visitor',
        'email' => 'visitor@example.com',
        $honeypot['nameField'] => '',
        $honeypot['validFromField'] => $honeypot['validFrom'],
    ]);

    $response->assertRedirect();
    expect(Lead::where('email', 'visitor@example.com')->exists())->toBeTrue();
});

test('public forms are throttled to 5 requests per hour', function () {
    for ($i = 1; $i <= 5; $i++) {
        $res = $this->post(route('leads.quote'), [
            'name' => "User {$i}",
            'email' => "user{$i}@example.com",
        ]);
        $res->assertRedirect();
    }

    // 6th request from same IP should be blocked with 429
    $sixth = $this->post(route('leads.quote'), [
        'name' => 'User 6',
        'email' => 'user6@example.com',
    ]);

    $sixth->assertStatus(429);
});

test('shared honeypot prop exposes configured field names and encrypted validFrom token, and validates submissions', function () {
    $sharedHoneypot = null;

    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(function (Assert $page) use (&$sharedHoneypot) {
            $page->where('honeypot.name', config('honeypot.name_field_name'))
                ->where('honeypot.validFromName', config('honeypot.valid_from_field_name'));

            $sharedHoneypot = $page->toArray()['props']['honeypot'];
        });

    expect($sharedHoneypot)->toBeArray()
        ->and($sharedHoneypot['validFrom'])->toBeString()->not->toBeEmpty();

    // 1. Immediate submission (too fresh: < amount_of_seconds) is rejected by honeypot
    $this->post(route('leads.quote'), [
        'name' => 'Too Fast Submitter',
        'email' => 'toofast@example.com',
        $sharedHoneypot['name'] => '',
        $sharedHoneypot['validFromName'] => $sharedHoneypot['validFrom'],
    ]);
    expect(Lead::where('email', 'toofast@example.com')->exists())->toBeFalse();

    // 2. Invalid valid_from token is rejected by honeypot
    $this->post(route('leads.quote'), [
        'name' => 'Tampered Token',
        'email' => 'tampered@example.com',
        $sharedHoneypot['name'] => '',
        $sharedHoneypot['validFromName'] => 'invalid-encrypted-token',
    ]);
    expect(Lead::where('email', 'tampered@example.com')->exists())->toBeFalse();

    // 3. Valid submission after waiting past amount_of_seconds succeeds
    $this->travel(2)->seconds();

    $this->post(route('leads.quote'), [
        'name' => 'Human Visitor',
        'email' => 'human@example.com',
        $sharedHoneypot['name'] => '',
        $sharedHoneypot['validFromName'] => $sharedHoneypot['validFrom'],
    ])->assertRedirect();

    expect(Lead::where('email', 'human@example.com')->exists())->toBeTrue();

    // 4. When honeypot is disabled in config, shared prop is null
    config(['honeypot.enabled' => false]);

    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('honeypot', null)
        );
});
