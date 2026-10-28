<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReferralRedirectController extends Controller
{
    /**
     * Redirect short referral links (/r/{code}) to the contact page with attribution.
     */
    public function __invoke(Request $request, string $code): RedirectResponse
    {
        /** @var array<string, mixed> $query */
        $query = $request->query();
        unset($query['ref']);

        if (preg_match('/^[A-Za-z0-9-]{3,30}$/', $code) === 1) {
            return redirect()->to(route('contact', array_merge(['ref' => $code], $query)));
        }

        return redirect()->to(route('contact', $query));
    }
}
