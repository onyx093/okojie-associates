<?php

namespace App\Http\Requests\Portal;

use App\Enums\ApptFormat;
use App\Enums\TimeWindow;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $now = now('America/New_York');
        $today = $now->toDateString();
        $maxDate = $now->copy()->addDays(180)->toDateString();

        return [
            'preferred_date' => [
                'required',
                'date',
                'date_format:Y-m-d',
                "after_or_equal:{$today}",
                "before_or_equal:{$maxDate}",
            ],
            'time_window' => ['required', Rule::enum(TimeWindow::class)],
            'format' => ['required', Rule::enum(ApptFormat::class)],
            'topic' => ['nullable', 'string', 'max:120'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Get the validation error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'preferred_date.required' => 'Please select a preferred date.',
            'preferred_date.date_format' => 'Please provide a valid date in YYYY-MM-DD format.',
            'preferred_date.after_or_equal' => 'Please choose a date from today onward.',
            'preferred_date.before_or_equal' => 'Appointments may only be scheduled up to 180 days in advance.',
            'time_window.required' => 'Please select a time window.',
            'format.required' => 'Please select an appointment format.',
            'topic.max' => 'The topic must not exceed 120 characters.',
        ];
    }
}
