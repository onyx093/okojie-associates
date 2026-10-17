<?php

namespace App\Enums;

enum ReturnStatus: string
{
    case IntakeReceived = 'intake_received';
    case InPreparation = 'in_preparation';
    case ReadyForReview = 'ready_for_review';
    case ESigned = 'e_signed';
    case EFiled = 'e_filed';

    public function label(): string
    {
        return match ($this) {
            self::IntakeReceived => 'Intake received',
            self::InPreparation => 'In preparation',
            self::ReadyForReview => 'Ready for review',
            self::ESigned => 'E-signed',
            self::EFiled => 'E-filed',
        };
    }

    public function next(): ?self
    {
        return match ($this) {
            self::IntakeReceived => self::InPreparation,
            self::InPreparation => self::ReadyForReview,
            self::ReadyForReview => self::ESigned,
            self::ESigned => self::EFiled,
            self::EFiled => null,
        };
    }

    public function nextStepText(): string
    {
        return match ($this) {
            self::IntakeReceived => "We're moving to: In preparation. We'll keep you posted here.",
            self::InPreparation => 'A credentialed preparer is building your return. Next: Ready for review.',
            self::ReadyForReview => 'Your return is ready for video/phone review and Form 8879 e-signature.',
            self::ESigned => 'E-signature received. We are finalizing and submitting your return to the IRS.',
            self::EFiled => 'Your return has been e-filed. We will notify you when accepted by the IRS.',
        };
    }
}
