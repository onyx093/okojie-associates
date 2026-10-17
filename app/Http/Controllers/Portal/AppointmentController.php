<?php

namespace App\Http\Controllers\Portal;

use App\Enums\ApptFormat;
use App\Enums\ApptStatus;
use App\Enums\TimeWindow;
use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Mail\AppointmentRequested;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the user's appointments.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $appointments = $user->appointments()
            ->latest('preferred_date')
            ->latest('created_at')
            ->get();

        return Inertia::render('portal/appointments', [
            'appointments' => AppointmentResource::collection($appointments)->resolve(),
        ]);
    }

    /**
     * Store a newly created appointment request in storage.
     */
    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $appointment = $user->appointments()->create([
            'preferred_date' => $request->validated('preferred_date'),
            'time_window' => $request->enum('time_window', TimeWindow::class),
            'format' => $request->enum('format', ApptFormat::class),
            'topic' => $request->validated('topic'),
            'notes' => $request->validated('notes'),
            'status' => ApptStatus::Requested,
        ]);

        AuditLog::record(
            action: 'appointment.requested',
            entity: 'Appointment',
            meta: [
                'appointment_id' => $appointment->id,
                'preferred_date' => $appointment->preferred_date->toDateString(),
                'time_window' => $appointment->time_window->value,
                'format' => $appointment->format->value,
                'topic' => $appointment->topic,
            ],
            entityId: $appointment->id,
        );

        $staffEmail = (string) config('site.contact.staff_email', 'staff@okojieonline.com');
        Mail::to($staffEmail)->queue(new AppointmentRequested($appointment, forStaff: true));
        Mail::to($user->email)->queue(new AppointmentRequested($appointment, forStaff: false));

        return back()->with('success', 'Your appointment request has been submitted. A preparer will confirm shortly.');
    }

    /**
     * Cancel the specified appointment (destroy=cancel while Requested).
     */
    public function destroy(Request $request, Appointment $appointment): RedirectResponse
    {
        Gate::authorize('delete', $appointment);

        $appointment->update([
            'status' => ApptStatus::Cancelled,
        ]);

        AuditLog::record(
            action: 'appointment.cancelled',
            entity: 'Appointment',
            meta: [
                'appointment_id' => $appointment->id,
            ],
            entityId: $appointment->id,
        );

        return back()->with('success', 'Your appointment has been cancelled.');
    }
}
