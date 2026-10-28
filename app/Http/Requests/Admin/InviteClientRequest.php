<?php

namespace App\Http\Requests\Admin;

use App\Enums\Role;
use App\Enums\Tier;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InviteClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null && $user->can('viewAny', User::class);
    }

    /**
     * Normalize email before validation.
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge([
                'email' => strtolower(trim($this->input('email'))),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class, 'email')],
            'tier' => ['nullable', Rule::enum(Tier::class)],
            'preparer_id' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')->whereIn('role', [Role::Preparer->value, Role::Admin->value]),
            ],
        ];
    }
}
