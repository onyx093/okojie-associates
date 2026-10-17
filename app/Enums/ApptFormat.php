<?php

namespace App\Enums;

enum ApptFormat: string
{
    case Video = 'video';
    case Phone = 'phone';
    case InPerson = 'in_person';

    public function label(): string
    {
        return match ($this) {
            self::Video => 'Video call',
            self::Phone => 'Phone call',
            self::InPerson => 'In person',
        };
    }
}
