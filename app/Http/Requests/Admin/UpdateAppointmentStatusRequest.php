<?php

namespace App\Http\Requests\Admin;

use App\Enums\ApptStatus;
use App\Models\Appointment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAppointmentStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $appointment = $this->route('appointment');

        return $appointment instanceof Appointment
            && $this->user() !== null
            && $this->user()->can('update', $appointment);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isConfirming = $this->input('status') === ApptStatus::Confirmed->value;

        return [
            'status' => ['required', Rule::enum(ApptStatus::class)],
            'scheduled_at' => $isConfirming ? ['nullable', 'date', 'after:now'] : ['nullable', 'date'],
            'join_url' => ['nullable', 'string', 'url:https', 'max:2048'],
        ];
    }
}
