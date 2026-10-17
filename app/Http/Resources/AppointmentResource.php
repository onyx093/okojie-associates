<?php

namespace App\Http\Resources;

use App\Enums\ApptStatus;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Appointment
 */
class AppointmentResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'preferred_date' => $this->preferred_date->toDateString(),
            'preferred_date_formatted' => $this->preferred_date->format('M j, Y'),
            'preferred_date_full' => $this->preferred_date->format('l, F j, Y'),
            'time_window' => $this->time_window->value,
            'time_window_label' => $this->time_window->label(),
            'format' => $this->format->value,
            'format_label' => $this->format->label(),
            'topic' => $this->topic,
            'notes' => $this->notes,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'confirmed_at' => $this->confirmed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at?->format('M j, Y'),
            'can_cancel' => $this->status === ApptStatus::Requested,
        ];
    }
}
