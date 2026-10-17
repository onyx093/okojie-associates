<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Translation\PotentiallyTranslatedString;

class SafeUpload implements ValidationRule
{
    /**
     * Max size in kilobytes (25 MB).
     */
    protected const MAX_KILOBYTES = 25600;

    /**
     * Allowed MIME types and extensions.
     */
    protected const ALLOWED_EXTENSIONS = [
        'pdf', 'jpg', 'jpeg', 'png', 'heic', 'webp', 'xlsx', 'xls', 'csv',
    ];

    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            $fail('The :attribute must be a valid file.');

            return;
        }

        if ($value->getSize() > (self::MAX_KILOBYTES * 1024)) {
            $fail('The :attribute must not exceed 25 MB.');

            return;
        }

        $extension = strtolower($value->getClientOriginalExtension());
        if (! in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            $fail('The :attribute must be a file of type: pdf, jpg, jpeg, png, heic, webp, xlsx, xls, csv.');

            return;
        }

        // Magic bytes validation
        if (! $this->passesMagicByteCheck($value, $extension)) {
            $fail('The uploaded file does not match its claimed file type.');
        }
    }

    protected function passesMagicByteCheck(UploadedFile $file, string $extension): bool
    {
        $path = $file->getRealPath();
        if (! $path || ! file_exists($path)) {
            return false;
        }

        $handle = fopen($path, 'rb');
        if (! $handle) {
            return false;
        }

        $header = fread($handle, 32);
        fclose($handle);

        if ($header === false || strlen($header) < 2) {
            return false;
        }

        return match ($extension) {
            'pdf' => str_starts_with($header, '%PDF-'),
            'png' => str_starts_with($header, "\x89PNG\r\n\x1a\n"),
            'jpg', 'jpeg' => str_starts_with($header, "\xFF\xD8\xFF"),
            'webp' => str_starts_with($header, 'RIFF') && str_contains(substr($header, 8, 8), 'WEBP'),
            'heic' => strlen($header) >= 12 && substr($header, 4, 4) === 'ftyp',
            'xlsx' => str_starts_with($header, "PK\x03\x04"),
            'xls' => str_starts_with($header, "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1"),
            'csv' => ! str_contains($header, "\0"),
            default => false,
        };
    }
}
