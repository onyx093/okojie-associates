<?php

namespace App\Enums;

enum LeadKind: string
{
    case Quote = 'quote';
    case Consult = 'consult';

    public function label(): string
    {
        return match ($this) {
            self::Quote => 'Quote request',
            self::Consult => 'Consultation',
        };
    }
}
