<?php

namespace App\Enums;

enum ScanStatus: string
{
    case Pending = 'pending';
    case Clean = 'clean';
    case Infected = 'infected';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending scan',
            self::Clean => 'Clean',
            self::Infected => 'Infected',
        };
    }
}
