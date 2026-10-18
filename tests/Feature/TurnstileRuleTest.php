<?php

use App\Rules\TurnstileRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

test('turnstile rule passes on successful cloudflare siteverify response', function () {
    Http::fake([
        'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response([
            'success' => true,
        ], 200),
    ]);

    $validator = Validator::make(
        ['cf-turnstile-response' => 'valid_token_123'],
        ['cf-turnstile-response' => [new TurnstileRule(forceValidate: true)]]
    );

    expect($validator->passes())->toBeTrue();
});

test('turnstile rule fails on unverified cloudflare siteverify response', function () {
    Http::fake([
        'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response([
            'success' => false,
            'error-codes' => ['invalid-input-response'],
        ], 200),
    ]);

    $validator = Validator::make(
        ['cf-turnstile-response' => 'invalid_token'],
        ['cf-turnstile-response' => [new TurnstileRule(forceValidate: true)]]
    );

    expect($validator->fails())->toBeTrue();
    expect($validator->errors()->first('cf-turnstile-response'))->toContain('Security verification failed');
});

test('turnstile rule fails on empty response value when forced', function () {
    $rule = new TurnstileRule(forceValidate: true);
    $errorMessage = null;

    $rule->validate('cf-turnstile-response', '', function ($message) use (&$errorMessage) {
        $errorMessage = $message;
    });

    expect($errorMessage)->toContain('complete the security challenge');
});

test('turnstile rule fails gracefully on network timeout or error', function () {
    Http::fake([
        'https://challenges.cloudflare.com/turnstile/v0/siteverify' => Http::response(status: 500),
    ]);

    $validator = Validator::make(
        ['cf-turnstile-response' => 'some_token'],
        ['cf-turnstile-response' => [new TurnstileRule(forceValidate: true)]]
    );

    expect($validator->fails())->toBeTrue();
});
