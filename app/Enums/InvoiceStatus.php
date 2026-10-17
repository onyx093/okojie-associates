<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case Draft = 'draft';
    case Open = 'open';
    case Paid = 'paid';
    case Refunded = 'refunded';
    case Void = 'void';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Open => 'Open',
            self::Paid => 'Paid',
            self::Refunded => 'Refunded',
            self::Void => 'Void',
        };
    }
}
