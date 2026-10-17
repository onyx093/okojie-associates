<?php

namespace App\Enums;

enum ReferralStatus: string
{
    case Sent = 'sent';
    case SignedUp = 'signed_up';
    case Filed = 'filed';
    case Rewarded = 'rewarded';

    public function label(): string
    {
        return match ($this) {
            self::Sent => 'Sent',
            self::SignedUp => 'Signed up',
            self::Filed => 'Filed',
            self::Rewarded => 'Rewarded',
        };
    }
}
