<?php

namespace App\Enums;

enum Tier: string
{
    case UploadAndGo = 'upload_and_go';
    case Hybrid = 'hybrid';
    case PremiumRemote = 'premium_remote';

    public function label(): string
    {
        return match ($this) {
            self::UploadAndGo => 'Upload & Go',
            self::Hybrid => 'Hybrid',
            self::PremiumRemote => 'Premium Remote',
        };
    }

    public function priceRange(): string
    {
        return match ($this) {
            self::UploadAndGo => '$150–$225',
            self::Hybrid => '$225–$350',
            self::PremiumRemote => '$400–$900',
        };
    }

    public function priceMin(): int
    {
        return match ($this) {
            self::UploadAndGo => 150,
            self::Hybrid => 225,
            self::PremiumRemote => 400,
        };
    }

    public function priceMax(): int
    {
        return match ($this) {
            self::UploadAndGo => 225,
            self::Hybrid => 350,
            self::PremiumRemote => 900,
        };
    }
}
