<?php

namespace App\Jobs;

use App\Enums\ScanStatus;
use App\Models\Document;
use App\Services\VirusScanner\ScannerInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class ScanDocument implements ShouldQueue
{
    use Queueable;

    public function __construct(public Document $document) {}

    public function handle(ScannerInterface $scanner): void
    {
        $storage = Storage::disk('private');

        if (! $storage->exists($this->document->storage_key)) {
            return;
        }

        $path = null;
        $isTemp = false;

        try {
            $path = $storage->path($this->document->storage_key);
        } catch (\Throwable) {
            $temp = tempnam(sys_get_temp_dir(), 'clamav_');
            if ($temp !== false) {
                $content = $storage->get($this->document->storage_key);
                if ($content !== null) {
                    file_put_contents($temp, $content);
                    $path = $temp;
                    $isTemp = true;
                }
            }
        }

        $isClean = $path !== null ? $scanner->scan($path) : true;

        if ($isTemp && $path !== null && file_exists($path)) {
            @unlink($path);
        }

        $this->document->update([
            'scan_status' => $isClean ? ScanStatus::Clean : ScanStatus::Infected,
        ]);
    }
}
