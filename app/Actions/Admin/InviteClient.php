<?php

namespace App\Actions\Admin;

use App\Enums\InvoiceStatus;
use App\Enums\ReturnStatus;
use App\Enums\Role;
use App\Enums\Tier;
use App\Models\Invoice;
use App\Models\TaxReturn;
use App\Models\User;
use App\Notifications\ClientInvitation;
use Database\Factories\UserFactory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class InviteClient
{
    /**
     * Create or retrieve a client user, ensure a current-year TaxReturn and Invoice exist,
     * and optionally send a queued ClientInvitation notification with a signed password-setup link.
     *
     * @return array{user: User, taxReturn: TaxReturn, invoice: Invoice}
     */
    public function execute(
        string $name,
        string $email,
        ?User $byUser = null,
        ?Tier $tier = null,
        ?int $preparerId = null,
        ?string $phone = null,
        ?string $referredByCode = null,
        bool $sendInvitation = true,
    ): array {
        $normalizedEmail = strtolower(trim($email));

        $user = User::query()->where('email', $normalizedEmail)->first();

        if (! $user) {
            $user = new User([
                'name' => trim($name),
                'email' => $normalizedEmail,
                'phone' => $phone,
                'password' => Hash::make(Str::random(32)),
                'role' => Role::Client,
                'tier' => $tier ?? Tier::UploadAndGo,
                'referral_code' => UserFactory::generateReferralCode(),
                'referred_by_code' => $referredByCode,
            ]);
            $user->email_verified_at = now();
            $user->save();
        }

        $effectivePreparerId = $preparerId
            ?? ($byUser?->role === Role::Preparer ? $byUser->id : null);

        $taxYear = (int) date('Y');
        $taxReturn = TaxReturn::firstOrCreate(
            [
                'user_id' => $user->id,
                'tax_year' => $taxYear,
            ],
            [
                'tier' => $user->tier ?? $tier ?? Tier::UploadAndGo,
                'status' => ReturnStatus::IntakeReceived,
                'preparer_id' => $effectivePreparerId,
            ],
        );

        if ($preparerId !== null && $taxReturn->preparer_id !== $preparerId) {
            $taxReturn->update(['preparer_id' => $preparerId]);
        }

        $invoice = Invoice::firstOrCreate(
            ['tax_return_id' => $taxReturn->id],
            [
                'currency' => 'usd',
                'status' => InvoiceStatus::Draft,
            ],
        );

        if ($sendInvitation) {
            $token = Password::broker()->createToken($user);
            $setupUrl = URL::temporarySignedRoute(
                'password.reset',
                now()->addDays(7),
                [
                    'token' => $token,
                    'email' => $user->email,
                ],
            );

            $taxReturn->setRelation('user', $user);
            $user->notify(new ClientInvitation(
                token: $token,
                taxReturn: $taxReturn,
                setupUrl: $setupUrl,
            ));
        }

        return [
            'user' => $user,
            'taxReturn' => $taxReturn,
            'invoice' => $invoice,
        ];
    }
}
