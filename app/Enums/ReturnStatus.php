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

    /**
     * @return array{
     *     key: string,
     *     title: string,
     *     text: string,
     *     cta: array{label: string, target: string}|null,
     *     tone: 'default'|'action'|'done',
     * }
     */
    public function nextStep(): array
    {
        return match ($this) {
            self::IntakeReceived => [
                'key' => self::IntakeReceived->value,
                'title' => 'We have your intake',
                'text' => "A preparer will look over your details within one business day. Upload anything that's missing so we can start sooner.",
                'cta' => [
                    'label' => 'Upload documents',
                    'target' => 'documents',
                ],
                'tone' => 'default',
            ],
            self::InPreparation => [
                'key' => self::InPreparation->value,
                'title' => 'Your preparer is working on your return',
                'text' => "Nothing for you to do right now. We'll message you here as soon as it's ready to review.",
                'cta' => [
                    'label' => 'Open messages',
                    'target' => 'messages',
                ],
                'tone' => 'default',
            ],
            self::ReadyForReview => [
                'key' => self::ReadyForReview->value,
                'title' => 'Your return is ready to review',
                'text' => "Look it over, ask anything you're unsure about, then sign Form 8879 so we can e-file.",
                'cta' => [
                    'label' => 'Review and e-sign',
                    'target' => 'sign',
                ],
                'tone' => 'action',
            ],
            self::ESigned => [
                'key' => self::ESigned->value,
                'title' => "Signed. We're e-filing your return",
                'text' => "We'll confirm here as soon as it's filed. You don't need to do anything else.",
                'cta' => null,
                'tone' => 'default',
            ],
            self::EFiled => [
                'key' => self::EFiled->value,
                'title' => 'Your return has been e-filed',
                'text' => 'Thank you for filing with Okojie. Most IRS refunds arrive within about 21 days of e-filing.',
                'cta' => [
                    'label' => 'View documents',
                    'target' => 'documents',
                ],
                'tone' => 'done',
            ],
        };
    }

    public function nextStepText(): string
    {
        return $this->nextStep()['text'];
    }

    public function isBeforeReadyForReview(): bool
    {
        return match ($this) {
            self::IntakeReceived, self::InPreparation => true,
            self::ReadyForReview, self::ESigned, self::EFiled => false,
        };
    }

    public function order(): int
    {
        return match ($this) {
            self::IntakeReceived => 0,
            self::InPreparation => 1,
            self::ReadyForReview => 2,
            self::ESigned => 3,
            self::EFiled => 4,
        };
    }
}
