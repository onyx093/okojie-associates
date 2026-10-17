<?php

namespace App\Enums;

enum Role: string
{
    case Client = 'client';
    case Preparer = 'preparer';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Client => 'Client',
            self::Preparer => 'Preparer',
            self::Admin => 'Admin',
        };
    }
}
