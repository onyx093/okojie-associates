<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request and attach hardening security headers.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $nonce = Vite::cspNonce();
        if (! $nonce) {
            $nonce = base64_encode(random_bytes(16));
            Vite::useCspNonce($nonce);
        }

        $response = $next($request);

        // Standard hardening headers
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self "https://js.stripe.com")');

        // HSTS in production or over secure connection
        if (app()->isProduction() || $request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // X-Robots-Tag: noindex, nofollow for auth, portal, and admin routes
        if ($this->shouldNoIndex($request)) {
            $response->headers->set('X-Robots-Tag', 'noindex, nofollow');
        }

        // Content Security Policy
        $csp = [
            "default-src 'self'",
            "script-src 'self' 'nonce-{$nonce}' https://js.stripe.com https://challenges.cloudflare.com".(app()->environment('local', 'testing') ? " 'unsafe-eval'" : ''),
            "style-src 'self' 'unsafe-inline' https://fonts.bunny.net https://fonts.googleapis.com",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data: https://fonts.bunny.net https://fonts.gstatic.com",
            "connect-src 'self' https://api.stripe.com https://challenges.cloudflare.com ws: wss:",
            "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self' https://checkout.stripe.com",
        ];

        $response->headers->set('Content-Security-Policy', implode('; ', $csp));

        return $response;
    }

    /**
     * Determine if the request targets a non-public route that should be hidden from search crawlers.
     */
    protected function shouldNoIndex(Request $request): bool
    {
        return $request->is(
            'portal',
            'portal/*',
            'admin',
            'admin/*',
            'login',
            'register',
            'forgot-password',
            'reset-password',
            'reset-password/*',
            'two-factor-challenge',
            'user/confirm-password'
        );
    }
}
