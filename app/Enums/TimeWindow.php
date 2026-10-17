<?php

namespace App\Enums;

enum TimeWindow: string
{
    case Any = 'any';
    case Morning = 'morning';
    case Afternoon = 'afternoon';
    case Evening = 'evening';

    public function label(): string
    {
        return match ($this) {
            self::Any => 'Any time',
            self::Morning => 'Morning (9am–12pm)',
            self::Afternoon => 'Afternoon (12pm–4pm)',
            self::Evening => 'Evening (4pm–6pm)',
        };
    }
}
