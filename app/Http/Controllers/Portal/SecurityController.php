<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SecurityController extends Controller
{
    /**
     * Display the client portal security page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('portal/security', [
            'twoFactorEnabled' => $user->hasEnabledTwoFactorAuthentication(),
            'twoFactorConfirmed' => ! is_null($user->two_factor_confirmed_at),
            'hasSecret' => ! is_null($user->two_factor_secret),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
            'passwordChangedAt' => $user->password_changed_at?->toIso8601String(),
            'status' => $request->session()->get('status'),
            'error' => $request->session()->get('error'),
        ]);
    }
}
