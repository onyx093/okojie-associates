<?php

namespace App\Support;

class UserAgentParser
{
    /**
     * Format a raw User-Agent string into a concise "Browser on OS" label.
     */
    public static function describe(?string $userAgent): string
    {
        if ($userAgent === null || trim($userAgent) === '') {
            return 'Unknown device';
        }

        $os = self::detectPlatform($userAgent);
        $browser = self::detectBrowser($userAgent);

        if ($browser !== null && $os !== null) {
            return "{$browser} on {$os}";
        }

        return $browser ?? $os ?? 'Unknown device';
    }

    /**
     * Detect the operating system or device family from a User-Agent string.
     */
    private static function detectPlatform(string $userAgent): ?string
    {
        return match (true) {
            str_contains($userAgent, 'iPhone') => 'iPhone',
            str_contains($userAgent, 'iPad') => 'iPad',
            str_contains($userAgent, 'Android') => 'Android',
            str_contains($userAgent, 'Macintosh') || str_contains($userAgent, 'Mac OS X') => 'macOS',
            str_contains($userAgent, 'Windows') => 'Windows',
            str_contains($userAgent, 'CrOS') => 'ChromeOS',
            str_contains($userAgent, 'Linux') => 'Linux',
            default => null,
        };
    }

    /**
     * Detect the browser family from a User-Agent string.
     */
    private static function detectBrowser(string $userAgent): ?string
    {
        return match (true) {
            str_contains($userAgent, 'Edg/') || str_contains($userAgent, 'EdgA/') || str_contains($userAgent, 'EdgiOS/') || str_contains($userAgent, 'Edge/') => 'Edge',
            str_contains($userAgent, 'OPR/') || str_contains($userAgent, 'Opera') => 'Opera',
            str_contains($userAgent, 'Firefox/') || str_contains($userAgent, 'FxiOS/') => 'Firefox',
            str_contains($userAgent, 'Chrome/') || str_contains($userAgent, 'CriOS/') => 'Chrome',
            str_contains($userAgent, 'Safari/') => 'Safari',
            default => null,
        };
    }
}
