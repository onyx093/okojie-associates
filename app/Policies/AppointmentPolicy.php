<?php

namespace App\Policies;

use App\Enums\ApptStatus;
use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    /**
     * Determine whether the user can view any appointments.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the appointment.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        if ($user->isStaff()) {
            return true;
        }

        return $user->id === $appointment->user_id;
    }

    /**
     * Determine whether the user can create appointments.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can cancel/delete the appointment.
     * Deletion/cancellation is only permitted while status is Requested.
     */
    public function delete(User $user, Appointment $appointment): bool
    {
        if (! ($user->isStaff() || $user->id === $appointment->user_id)) {
            return false;
        }

        return $appointment->status === ApptStatus::Requested;
    }
}
