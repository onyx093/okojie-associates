<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && is_null($user->two_factor_confirmed_at)) {
            if ($request->routeIs(
                'portal.security',
                'portal.security.*',
                'two-factor.*',
                'password.confirm',
                'password.confirmation',
                'user-password.update',
                'logout'
            ) || $request->is(
                'portal/security*',
                'user/two-factor*',
                'user/confirmed-two-factor-authentication',
                'user/password',
                'user/confirm-password',
                'logout'
            )) {
                return $next($request);
            }

            return redirect()->route('portal.security')->with('error', 'Two-factor authentication is required to access your client portal.');
        }

        return $next($request);
    }
}
