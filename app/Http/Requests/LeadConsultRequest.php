<?php

namespace App\Http\Requests;

use App\Enums\ApptFormat;
use App\Enums\TimeWindow;
use App\Rules\TurnstileRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LeadConsultRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => is_string($this->name) ? trim($this->name) : $this->name,
            'email' => is_string($this->email) ? strtolower(trim($this->email)) : $this->email,
            'notes' => is_string($this->notes) ? strip_tags(trim($this->notes)) : $this->notes,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'string', 'email:rfc', 'max:254'],
            'phone' => ['nullable', 'string', 'regex:/^[0-9 ()+\-.]{7,20}$/'],
            'preferred_date' => ['required', 'date', 'after_or_equal:today', 'before_or_equal:+180 days'],
            'time_window' => ['required', Rule::enum(TimeWindow::class)],
            'format' => ['required', Rule::enum(ApptFormat::class)],
            'notes' => ['nullable', 'string', 'max:2000'],
            'ref' => ['nullable', 'string', 'max:30'],
            'cf-turnstile-response' => ['nullable', new TurnstileRule],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your name.',
            'name.min' => 'Please enter your name.',
            'email.required' => 'Enter a valid email address.',
            'email.email' => 'Enter a valid email address.',
            'phone.regex' => 'Please enter a valid phone number.',
            'preferred_date.required' => 'Choose a date today or later.',
            'preferred_date.after_or_equal' => 'Choose a date today or later.',
            'preferred_date.date' => 'Choose a date today or later.',
        ];
    }
}
