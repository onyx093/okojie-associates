<?php

namespace App\Services\VirusScanner;

interface ScannerInterface
{
    /**
     * Scan a file path for viruses.
     * Returns true if clean, false if infected.
     */
    public function scan(string $absolutePath): bool;
}
