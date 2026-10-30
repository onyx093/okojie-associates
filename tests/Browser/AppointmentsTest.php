<?php

use App\Enums\ApptFormat;
use App\Enums\ApptStatus;
use App\Enums\Tier;
use App\Enums\TimeWindow;
use App\Models\Appointment;
use App\Models\TaxReturn;
use App\Models\User;

it('renders portal appointments on desktop with request form and upcoming/past appointment lists', function () {
    $user = User::factory()->create([
        'name' => 'Denise Robinson',
        'email' => 'denise.appts@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
        'tier' => Tier::Hybrid,
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    Appointment::factory()->create([
        'user_id' => $user->id,
        'format' => ApptFormat::Video,
        'status' => ApptStatus::Confirmed,
        'preferred_date' => now()->addDays(3)->toDateString(),
        'scheduled_at' => now()->addDays(3)->setTime(16, 30),
        'topic' => 'Review call with your preparer',
        'notes' => 'Go through the return together before e-signing.',
        'join_url' => 'https://meet.google.com/xyz-call',
    ]);

    Appointment::factory()->create([
        'user_id' => $user->id,
        'format' => ApptFormat::Phone,
        'status' => ApptStatus::Requested,
        'preferred_date' => now()->addDays(7)->toDateString(),
        'time_window' => TimeWindow::Afternoon,
        'topic' => 'Question about my 1098-T',
        'notes' => null,
    ]);

    Appointment::factory()->create([
        'user_id' => $user->id,
        'format' => ApptFormat::InPerson,
        'status' => ApptStatus::Completed,
        'preferred_date' => now()->subDays(10)->toDateString(),
        'scheduled_at' => now()->subDays(10)->setTime(10, 0),
        'topic' => 'Free consultation',
        'notes' => null,
    ]);

    Appointment::factory()->create([
        'user_id' => $user->id,
        'format' => ApptFormat::Video,
        'status' => ApptStatus::Cancelled,
        'preferred_date' => now()->subDays(15)->toDateString(),
        'topic' => 'Previous tax question',
        'notes' => null,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'denise.appts@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/appointments')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'Your return')
        ->assertSeeIn('main#main h1', 'Appointments')
        ->assertSeeIn('main#main', 'Talk to your preparer by video, phone or in person.')
        ->assertSeeIn('#req-title', 'Request an appointment')
        ->assertPresent('input[type="radio"][value="video"]')
        ->assertPresent('#date')
        ->assertPresent('input[type="radio"][value="afternoon"]')
        ->assertPresent('#topic')
        ->assertPresent('#notes')
        ->assertSeeIn('main#main button[type="submit"]', 'Request appointment')
        ->assertSeeIn('main#main', 'We confirm requests within one business day.')
        ->assertSeeIn('#list-title', 'Your appointments')
        ->assertSeeIn('[data-slot="upcoming-group"]', 'Upcoming')
        ->assertSeeIn('[data-slot="appointment-row"]:has-text("Review call with your preparer")', 'Confirmed')
        ->assertPresent('a:has-text("Join call")')
        ->assertPresent('button:has-text("Reschedule")')
        ->assertSeeIn('[data-slot="appointment-row"]:has-text("Question about my 1098-T")', 'Requested')
        ->assertPresent('button:has-text("Cancel request")')
        ->assertSeeIn('[data-slot="past-group"]', 'Past')
        ->assertSeeIn('[data-slot="appointment-row"]:has-text("Free consultation")', 'Completed')
        ->assertSeeIn('[data-slot="appointment-row"]:has-text("Previous tax question")', 'Cancelled');
});

it('renders empty appointments state with call to action', function () {
    $user = User::factory()->create([
        'email' => 'empty.appts@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'empty.appts@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/appointments')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('main#main', 'No appointments yet')
        ->assertSeeIn('main#main', 'Request a video, phone or in-person call with your preparer using the form.')
        ->assertSeeIn('main#main button', 'Choose a date');
});

it('submits a new appointment request through the form and displays success toast', function () {
    $user = User::factory()->create([
        'email' => 'new.appts@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    $futureDate = now('America/New_York')->addDays(5)->toDateString();

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'new.appts@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/appointments')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#date', $futureDate)
        ->fill('#topic', 'Review 1099 freelance income')
        ->click('button[type="submit"]:has-text("Request appointment")')
        ->assertSee('Request sent. We’ll confirm a time within one business day.')
        ->assertSeeIn('[data-slot="appointment-row"]', 'Review 1099 freelance income')
        ->assertSeeIn('[data-slot="appointment-row"]', 'Requested')
        ->assertPresent('button:has-text("Cancel request")');
});

it('allows client to cancel a requested appointment with confirmation dialog', function () {
    $user = User::factory()->create([
        'email' => 'cancel.appts@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    Appointment::factory()->create([
        'user_id' => $user->id,
        'format' => ApptFormat::Phone,
        'status' => ApptStatus::Requested,
        'preferred_date' => now()->addDays(7)->toDateString(),
        'topic' => 'Cancelable appointment',
    ]);

    visit('/login')
        ->on()->desktop()
        ->assertNoSmoke()
        ->fill('#email', 'cancel.appts@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/appointments')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSeeIn('[data-slot="appointment-row"]', 'Cancelable appointment')
        ->assertPresent('button:has-text("Cancel request")')
        ->click('button:has-text("Cancel request")')
        ->assertSee('Cancel appointment request?')
        ->click('[role="alertdialog"] button:has-text("Cancel request")')
        ->assertSee('Your appointment has been cancelled.')
        ->assertSeeIn('[data-slot="past-group"]', 'Cancelled');
});

it('renders portal appointments on mobile viewport cleanly', function () {
    $user = User::factory()->create([
        'email' => 'mobile.appts@example.com',
        'password' => 'CorrectHorseBattery99!',
        'two_factor_confirmed_at' => now(),
    ]);

    TaxReturn::factory()->create([
        'user_id' => $user->id,
    ]);

    Appointment::factory()->create([
        'user_id' => $user->id,
        'format' => ApptFormat::Video,
        'status' => ApptStatus::Confirmed,
        'preferred_date' => now()->addDays(3)->toDateString(),
        'scheduled_at' => now()->addDays(3)->setTime(16, 30),
        'topic' => 'Mobile appointment check',
        'join_url' => 'https://meet.google.com/xyz-call',
    ]);

    visit('/login')
        ->on()->mobile()
        ->assertNoSmoke()
        ->fill('#email', 'mobile.appts@example.com')
        ->fill('#password', 'CorrectHorseBattery99!')
        ->click('button[type="submit"]:has-text("Sign in")');

    visit('/portal/appointments')
        ->on()->mobile()
        ->assertNoSmoke()
        ->assertSeeIn('main#main h1', 'Appointments')
        ->assertSeeIn('#req-title', 'Request an appointment')
        ->assertSeeIn('#list-title', 'Your appointments')
        ->assertSeeIn('[data-slot="appointment-row"]', 'Mobile appointment check');
});

it('renders styleguide portal appointments fixture states with no smoke errors', function () {
    visit('/dev/styleguide?fixture=page-portal-appointments&state=0')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('Upcoming')
        ->assertSee('Past');

    visit('/dev/styleguide?fixture=page-portal-appointments&state=1')
        ->on()->desktop()
        ->assertNoSmoke()
        ->assertSee('No appointments yet');
});
