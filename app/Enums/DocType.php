<?php

namespace App\Enums;

enum DocType: string
{
    case W2 = 'w2';
    case Form1099 = '1099';
    case Id = 'id';
    case PriorReturn = 'prior_return';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::W2 => 'W-2',
            self::Form1099 => '1099',
            self::Id => 'Government ID',
            self::PriorReturn => 'Prior Return',
            self::Other => 'Other Document',
        };
    }
}
