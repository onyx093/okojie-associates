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
            self::InPreparation => "We're moving to: Ready for review. We'll keep you posted here.",
            self::ReadyForReview => "We're moving to: E-signed. Review your return and sign when ready.",
            self::ESigned => "We're moving to: E-filed. We'll keep you posted here.",
            self::EFiled => 'Your return has been e-filed. Thank you!',
        };
    }

    public function isBeforeReadyForReview(): bool
    {
        return match ($this) {
            self::IntakeReceived, self::InPreparation => true,
            self::ReadyForReview, self::ESigned, self::EFiled => false,
        };
    }
}
