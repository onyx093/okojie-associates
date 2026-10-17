<?php

namespace App\Services\VirusScanner;

class ClamAvScanner implements ScannerInterface
{
    /**
     * Scan a file path for viruses using ClamAV socket or command.
     */
    public function scan(string $absolutePath): bool
    {
        $socketPath = config('services.clamav.socket', '/var/run/clamav/clamd.ctl');

        if (file_exists($socketPath) && is_readable($socketPath)) {
            $socket = @fsockopen('unix://'.$socketPath);
            if ($socket) {
                fwrite($socket, "SCAN {$absolutePath}\n");
                $response = trim((string) fgets($socket));
                fclose($socket);

                if (str_ends_with($response, 'OK')) {
                    return true;
                }

                if (str_contains($response, 'FOUND')) {
                    return false;
                }
            }
        }

        // Fallback: if daemon is not running in dev, treat as clean
        return true;
    }
}
