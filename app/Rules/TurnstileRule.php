<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Translation\PotentiallyTranslatedString;

class TurnstileRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $secretKey = config('services.turnstile.secret_key');

        // Skip validation in local/testing environments or when secret key is not configured.
        if (app()->environment('local', 'testing') || empty($secretKey)) {
            return;
        }

        if (empty($value) || ! is_string($value)) {
            $fail('Please complete the security challenge.');

            return;
        }

        try {
            $response = Http::asForm()
                ->timeout(5)
                ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $secretKey,
                    'response' => $value,
                    'remoteip' => request()->ip(),
                ]);

            if (! $response->successful() || ! $response->json('success')) {
                $fail('Security verification failed. Please try again.');
            }
        } catch (\Throwable) {
            $fail('Unable to verify security challenge. Please try again later.');
        }
    }
}
