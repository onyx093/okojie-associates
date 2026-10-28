<?php

namespace App\Support;

class CsvSanitizer
{
    /**
     * Neutralize spreadsheet formula injection by prefixing cells that begin
     * with '=', '+', '-', '@', tab, or carriage return with a single quote.
     */
    public static function sanitize(?string $value): string
    {
        $cell = (string) ($value ?? '');

        if ($cell !== '' && in_array($cell[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
            return "'".$cell;
        }

        return $cell;
    }

    /**
     * Sanitize an entire row of CSV cells.
     *
     * @param  list<string|int|float|null>  $row
     * @return list<string>
     */
    public static function sanitizeRow(array $row): array
    {
        return array_map(
            static fn (string|int|float|null $cell): string => self::sanitize($cell !== null ? (string) $cell : ''),
            $row,
        );
    }
}
