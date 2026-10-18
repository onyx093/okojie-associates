<?php

namespace App\Actions\Fortify;

use App\Enums\InvoiceStatus;
use App\Enums\ReferralStatus;
use App\Enums\ReturnStatus;
use App\Enums\Tier;
use App\Models\AuditLog;
use App\Models\Invoice;
use App\Models\Referral;
use App\Models\TaxReturn;
use App\Models\User;
use App\Rules\TurnstileRule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['nullable', 'string', 'max:100'],
            'email' => ['required', 'string', 'email:rfc', 'max:254', Rule::unique(User::class)],
            'password' => ['required', 'string', Password::min(12)->letters()->numbers()->uncompromised()],
            'tier' => ['nullable', 'string'],
            'ref' => ['nullable', 'string', 'max:30'],
            'cf-turnstile-response' => ['nullable', new TurnstileRule],
        ], [
            'email.unique' => 'An account may already exist for this email. Try signing in.',
            'password.min' => 'Password must be at least 12 characters.',
        ])->validate();

        $tierInput = isset($input['tier']) && is_string($input['tier']) ? $input['tier'] : null;
        $tier = $tierInput ? Tier::tryFrom($tierInput) : null;

        /** @var string|null $cookieRef */
        $cookieRef = request()->cookie('okojie_referral');
        $refCode = (isset($input['ref']) && is_string($input['ref']) && $input['ref'] !== '')
            ? $input['ref']
            : $cookieRef;

        /** @var string|null $name */
        $name = isset($input['name']) && is_string($input['name']) && trim($input['name']) !== ''
            ? trim($input['name'])
            : null;
        /** @var string $email */
        $email = $input['email'];
        /** @var string $password */
        $password = $input['password'];

        $referrer = $refCode ? User::where('referral_code', $refCode)->first() : null;
        $referredByCode = $referrer ? $referrer->referral_code : ($refCode && strlen($refCode) <= 32 ? $refCode : null);

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'tier' => $tier,
            'referred_by_code' => $referredByCode,
        ]);

        $taxReturn = TaxReturn::create([
            'user_id' => $user->id,
            'tax_year' => (int) date('Y'),
            'tier' => $tier,
            'status' => ReturnStatus::IntakeReceived,
        ]);

        Invoice::create([
            'tax_return_id' => $taxReturn->id,
            'amount_cents' => null,
            'currency' => 'usd',
            'status' => InvoiceStatus::Draft,
        ]);

        if ($refCode) {
            $referrer = User::where('referral_code', $refCode)->first();
            if ($referrer) {
                Referral::updateOrCreate(
                    [
                        'referrer_id' => $referrer->id,
                        'friend_email' => $user->email,
                    ],
                    [
                        'friend_name' => $user->name ?? $user->email,
                        'friend_user_id' => $user->id,
                        'status' => ReferralStatus::SignedUp,
                    ]
                );
            }
        }

        AuditLog::record(
            action: 'user.registered',
            entity: 'User',
            meta: [
                'user_id' => $user->id,
                'email' => $user->email,
                'tier' => $tier?->value,
                'ref_code' => $refCode,
            ],
            entityId: (string) $user->id,
            actorId: $user->id,
        );

        return $user;
    }
}
