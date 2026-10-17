<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AttributeReferral
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $ref = $request->query('ref');
        if ($ref && is_string($ref) && preg_match('/^[A-Za-z0-9\-_]{3,30}$/', $ref)) {
            // 30 days: 30 * 24 * 60 = 43200 minutes
            $cookie = cookie('okojie_referral', trim($ref), 43200, '/', null, config('session.secure', false), false);
            $response->headers->setCookie($cookie);
        }

        return $response;
    }
}
