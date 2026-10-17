<?php

namespace App\Services\VirusScanner;

class FakeScanner implements ScannerInterface
{
    protected bool $shouldPass = true;

    public function setShouldPass(bool $pass): self
    {
        $this->shouldPass = $pass;

        return $this;
    }

    public function scan(string $absolutePath): bool
    {
        return $this->shouldPass;
    }
}
