<?php

use App\Enums\ApptFormat;
use App\Enums\ApptStatus;
use App\Enums\Role;
use App\Enums\TimeWindow;
use App\Mail\AppointmentRequested;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('guests are redirected to login from appointments page', function () {
    $response = $this->get(route('portal.appointments'));

    $response->assertRedirect(route('login'));
});

test('unverified users are redirected to email verification from appointments page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('portal.appointments'));

    $response->assertRedirect(route('verification.notice'));
});

test('users without 2fa are redirected to portal security from appointments page', function () {
    $user = User::factory()->create([
        'two_factor_confirmed_at' => null,
    ]);

    $response = $this->actingAs($user)->get(route('portal.appointments'));

    $response->assertRedirect(route('portal.security'));
});

test('authenticated user can view empty appointments page', function () {
    $user = User::factory()->withTwoFactor()->create();

    $response = $this->actingAs($user)->get(route('portal.appointments'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/appointments')
        ->has('appointments', 0)
    );
});

test('authenticated user sees their existing appointments in the list', function () {
    $user = User::factory()->withTwoFactor()->create();

    $appt1 = Appointment::factory()->create([
        'user_id' => $user->id,
        'preferred_date' => now()->addDays(5)->toDateString(),
        'time_window' => TimeWindow::Morning,
        'format' => ApptFormat::Video,
        'topic' => 'Return review',
        'status' => ApptStatus::Requested,
    ]);

    $appt2 = Appointment::factory()->create([
        'user_id' => $user->id,
        'preferred_date' => now()->addDays(10)->toDateString(),
        'time_window' => TimeWindow::Afternoon,
        'format' => ApptFormat::Phone,
        'topic' => 'Planning consultation',
        'status' => ApptStatus::Confirmed,
    ]);

    $response = $this->actingAs($user)->get(route('portal.appointments'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/appointments')
        ->has('appointments', 2)
        ->where('appointments.0.id', $appt2->id)
        ->where('appointments.1.id', $appt1->id)
        ->where('appointments.1.can_cancel', true)
        ->where('appointments.0.can_cancel', false)
    );
});

test('user can submit a valid appointment request and mails are queued to staff and client', function () {
    Mail::fake();

    $user = User::factory()->withTwoFactor()->create();
    $date = now('America/New_York')->addDays(7)->toDateString();

    $response = $this->actingAs($user)->post(route('portal.appointments.store'), [
        'preferred_date' => $date,
        'time_window' => 'morning',
        'format' => 'video',
        'topic' => 'Need help with 1099-NEC forms',
        'notes' => 'I started freelancing this year and have multiple contracts.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('appointments', [
        'user_id' => $user->id,
        'preferred_date' => $date,
        'time_window' => 'morning',
        'format' => 'video',
        'topic' => 'Need help with 1099-NEC forms',
        'notes' => 'I started freelancing this year and have multiple contracts.',
        'status' => 'requested',
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => $user->id,
        'action' => 'appointment.requested',
        'entity' => 'Appointment',
    ]);

    // Check staff and client emails
    Mail::assertQueued(AppointmentRequested::class, 2);

    $staffEmail = (string) config('site.contact.staff_email', 'staff@okojieonline.com');
    Mail::assertQueued(AppointmentRequested::class, function ($mail) use ($staffEmail) {
        return $mail->hasTo($staffEmail) && $mail->forStaff === true;
    });

    Mail::assertQueued(AppointmentRequested::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email) && $mail->forStaff === false;
    });
});

test('validation: date must be today or up to 180 days in America/New_York', function () {
    $user = User::factory()->withTwoFactor()->create();

    // Past date fails
    $pastDate = now('America/New_York')->subDay()->toDateString();
    $resPast = $this->actingAs($user)->post(route('portal.appointments.store'), [
        'preferred_date' => $pastDate,
        'time_window' => 'morning',
        'format' => 'video',
    ]);
    $resPast->assertSessionHasErrors('preferred_date');

    // Date > 180 days fails
    $farDate = now('America/New_York')->addDays(181)->toDateString();
    $resFar = $this->actingAs($user)->post(route('portal.appointments.store'), [
        'preferred_date' => $farDate,
        'time_window' => 'morning',
        'format' => 'video',
    ]);
    $resFar->assertSessionHasErrors('preferred_date');

    // Today passes
    $today = now('America/New_York')->toDateString();
    $resToday = $this->actingAs($user)->post(route('portal.appointments.store'), [
        'preferred_date' => $today,
        'time_window' => 'morning',
        'format' => 'video',
    ]);
    $resToday->assertSessionHasNoErrors();

    // Exactly 180 days passes
    $maxDate = now('America/New_York')->addDays(180)->toDateString();
    $resMax = $this->actingAs($user)->post(route('portal.appointments.store'), [
        'preferred_date' => $maxDate,
        'time_window' => 'morning',
        'format' => 'video',
    ]);
    $resMax->assertSessionHasNoErrors();
});

test('validation: time_window, format, and topic length', function () {
    $user = User::factory()->withTwoFactor()->create();
    $date = now('America/New_York')->addDays(3)->toDateString();

    // Invalid time_window
    $res1 = $this->actingAs($user)->post(route('portal.appointments.store'), [
        'preferred_date' => $date,
        'time_window' => 'midnight',
        'format' => 'video',
    ]);
    $res1->assertSessionHasErrors('time_window');

    // Invalid format
    $res2 = $this->actingAs($user)->post(route('portal.appointments.store'), [
        'preferred_date' => $date,
        'time_window' => 'morning',
        'format' => 'telepathy',
    ]);
    $res2->assertSessionHasErrors('format');

    // Topic exceeding 120 chars
    $res3 = $this->actingAs($user)->post(route('portal.appointments.store'), [
        'preferred_date' => $date,
        'time_window' => 'morning',
        'format' => 'video',
        'topic' => str_repeat('a', 121),
    ]);
    $res3->assertSessionHasErrors('topic');
});

test('cancel rules: user can cancel their own appointment while Requested', function () {
    $user = User::factory()->withTwoFactor()->create();

    $appointment = Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Requested,
    ]);

    $response = $this->actingAs($user)->delete(route('portal.appointments.destroy', $appointment));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $appointment->refresh();
    expect($appointment->status)->toBe(ApptStatus::Cancelled);

    $this->assertDatabaseHas('audit_logs', [
        'actor_id' => $user->id,
        'action' => 'appointment.cancelled',
        'entity' => 'Appointment',
        'entity_id' => $appointment->id,
    ]);
});

test('cancel rules: user cannot cancel an appointment that is Confirmed', function () {
    $user = User::factory()->withTwoFactor()->create();

    $appointment = Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Confirmed,
    ]);

    $response = $this->actingAs($user)->delete(route('portal.appointments.destroy', $appointment));

    $response->assertForbidden();

    $appointment->refresh();
    expect($appointment->status)->toBe(ApptStatus::Confirmed);
});

test('cancel rules: user cannot cancel an appointment that is Completed', function () {
    $user = User::factory()->withTwoFactor()->create();

    $appointment = Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Completed,
    ]);

    $response = $this->actingAs($user)->delete(route('portal.appointments.destroy', $appointment));

    $response->assertForbidden();

    $appointment->refresh();
    expect($appointment->status)->toBe(ApptStatus::Completed);
});

test('cancel rules: user cannot cancel an already Cancelled appointment', function () {
    $user = User::factory()->withTwoFactor()->create();

    $appointment = Appointment::factory()->create([
        'user_id' => $user->id,
        'status' => ApptStatus::Cancelled,
    ]);

    $response = $this->actingAs($user)->delete(route('portal.appointments.destroy', $appointment));

    $response->assertForbidden();
});

test('IDOR: user A cannot cancel user B appointment', function () {
    $userA = User::factory()->withTwoFactor()->create();
    $userB = User::factory()->withTwoFactor()->create();

    $appointmentB = Appointment::factory()->create([
        'user_id' => $userB->id,
        'status' => ApptStatus::Requested,
    ]);

    $response = $this->actingAs($userA)->delete(route('portal.appointments.destroy', $appointmentB));

    $response->assertForbidden();

    $appointmentB->refresh();
    expect($appointmentB->status)->toBe(ApptStatus::Requested);
});

test('IDOR: user A only sees their own appointments on index', function () {
    $userA = User::factory()->withTwoFactor()->create();
    $userB = User::factory()->withTwoFactor()->create();

    $appA = Appointment::factory()->create([
        'user_id' => $userA->id,
        'topic' => 'User A Appointment',
    ]);

    $appB = Appointment::factory()->create([
        'user_id' => $userB->id,
        'topic' => 'User B Appointment',
    ]);

    $response = $this->actingAs($userA)->get(route('portal.appointments'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/appointments')
        ->has('appointments', 1)
        ->where('appointments.0.id', $appA->id)
        ->where('appointments.0.topic', 'User A Appointment')
    );
});

test('staff can cancel any user appointment while Requested', function () {
    $staff = User::factory()->withTwoFactor()->create([
        'role' => Role::Preparer,
    ]);
    $client = User::factory()->withTwoFactor()->create([
        'role' => Role::Client,
    ]);

    $appointment = Appointment::factory()->create([
        'user_id' => $client->id,
        'status' => ApptStatus::Requested,
    ]);

    $response = $this->actingAs($staff)->delete(route('portal.appointments.destroy', $appointment));

    $response->assertRedirect();

    $appointment->refresh();
    expect($appointment->status)->toBe(ApptStatus::Cancelled);
});

test('appointment resource formats scheduled_at and only exposes join_url for confirmed video appointments', function () {
    config(['app.timezone' => 'UTC']);

    $user = User::factory()->withTwoFactor()->create();
    $scheduledTime = Carbon::parse('2026-02-18 16:30:00', 'UTC');

    $confirmedVideo = Appointment::factory()->create([
        'user_id' => $user->id,
        'preferred_date' => '2026-02-18',
        'format' => ApptFormat::Video,
        'status' => ApptStatus::Confirmed,
        'confirmed_at' => now(),
        'scheduled_at' => $scheduledTime,
        'join_url' => 'https://meet.example.com/confirmed-video',
    ]);

    $confirmedPhone = Appointment::factory()->create([
        'user_id' => $user->id,
        'preferred_date' => '2026-02-17',
        'format' => ApptFormat::Phone,
        'status' => ApptStatus::Confirmed,
        'confirmed_at' => now(),
        'scheduled_at' => $scheduledTime,
        'join_url' => 'https://meet.example.com/confirmed-phone',
    ]);

    $requestedVideo = Appointment::factory()->create([
        'user_id' => $user->id,
        'preferred_date' => '2026-02-16',
        'format' => ApptFormat::Video,
        'status' => ApptStatus::Requested,
        'scheduled_at' => $scheduledTime,
        'join_url' => 'https://meet.example.com/requested-video',
    ]);

    $completedVideo = Appointment::factory()->create([
        'user_id' => $user->id,
        'preferred_date' => '2026-02-15',
        'format' => ApptFormat::Video,
        'status' => ApptStatus::Completed,
        'scheduled_at' => $scheduledTime,
        'join_url' => 'https://meet.example.com/completed-video',
    ]);

    $response = $this->actingAs($user)->get(route('portal.appointments'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('portal/appointments')
        ->has('appointments', 4)
        ->where('appointments.0.id', $confirmedVideo->id)
        ->where('appointments.0.scheduled_at', $scheduledTime->toIso8601String())
        ->where('appointments.0.scheduled_at_formatted', 'Wed, Feb 18 · 4:30 PM')
        ->where('appointments.0.join_url', 'https://meet.example.com/confirmed-video')
        ->where('appointments.1.id', $confirmedPhone->id)
        ->where('appointments.1.join_url', null)
        ->where('appointments.2.id', $requestedVideo->id)
        ->where('appointments.2.join_url', null)
        ->where('appointments.3.id', $completedVideo->id)
        ->where('appointments.3.join_url', null)
    );
});
