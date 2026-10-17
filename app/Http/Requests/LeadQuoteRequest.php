<?php

namespace App\Http\Requests;

use App\Rules\TurnstileRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LeadQuoteRequest extends FormRequest
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
            'situation' => is_string($this->situation) ? strip_tags(trim($this->situation)) : $this->situation,
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
            'tier_interest' => ['nullable', 'string', 'in:upload_and_go,hybrid,premium_remote,not_sure'],
            'situation' => ['nullable', 'string', 'max:2000'],
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
        ];
    }
}
