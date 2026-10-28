<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ApptStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAppointmentStatusRequest;
use App\Models\Appointment;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;

class AppointmentController extends Controller
{
    /**
     * Update appointment status (confirm, cancel, complete).
     */
    public function updateStatus(UpdateAppointmentStatusRequest $request, Appointment $appointment): RedirectResponse
    {
        Gate::authorize('update', $appointment);

        $validated = $request->validated();

        $newStatus = ApptStatus::from($validated['status']);
        $oldStatus = $appointment->status;

        $attributes = ['status' => $newStatus];

        if ($newStatus === ApptStatus::Confirmed) {
            $attributes['confirmed_at'] = $appointment->confirmed_at ?? now();

            if (array_key_exists('scheduled_at', $validated)) {
                $attributes['scheduled_at'] = $validated['scheduled_at'] !== null
                    ? Carbon::parse($validated['scheduled_at'])
                    : null;
            }

            if (array_key_exists('join_url', $validated)) {
                $attributes['join_url'] = $validated['join_url'];
            }
        }

        $appointment->update($attributes);

        AuditLog::record(
            action: 'admin.appointment_status_updated',
            entity: 'Appointment',
            meta: [
                'from' => $oldStatus->value,
                'to' => $newStatus->value,
                'client_id' => $appointment->user_id,
            ],
            entityId: $appointment->id,
        );

        return back()->with('success', "Appointment marked as {$newStatus->label()}.");
    }
}
