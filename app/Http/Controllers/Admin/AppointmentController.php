<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ApptStatus;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AuditLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    /**
     * Update appointment status (confirm, cancel, complete).
     */
    public function updateStatus(Request $request, Appointment $appointment): RedirectResponse
    {
        Gate::authorize('update', $appointment);

        $validated = $request->validate([
            'status' => ['required', Rule::enum(ApptStatus::class)],
        ]);

        $newStatus = ApptStatus::from($validated['status']);
        $oldStatus = $appointment->status;
        $appointment->update(['status' => $newStatus]);

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
