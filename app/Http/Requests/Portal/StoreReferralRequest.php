<?php

namespace App\Http\Requests\Portal;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreReferralRequest extends FormRequest
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
        return [
            'friend_name' => ['required', 'string', 'max:100'],
            'friend_email' => ['required', 'string', 'email:rfc', 'max:254'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var User|null $user */
            $user = $this->user();
            if (! $user) {
                return;
            }

            $friendEmail = strtolower(trim((string) $this->input('friend_email', '')));

            // Self-referral check
            if ($friendEmail === strtolower(trim($user->email))) {
                $validator->errors()->add('friend_email', 'You cannot refer yourself.');

                return;
            }

            // Duplicate referral check
            if ($user->referrals()->where('friend_email', $friendEmail)->exists()) {
                $validator->errors()->add('friend_email', 'You have already referred this email address.');
            }
        });
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'friend_name.required' => "Please enter your friend's name.",
            'friend_email.required' => "Please enter your friend's email address.",
            'friend_email.email' => 'Please provide a valid email address.',
        ];
    }
}
