<?php

namespace App\Notifications;

use App\Enums\ReturnStatus;
use App\Models\TaxReturn;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReturnStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public TaxReturn $taxReturn,
        public ReturnStatus $status,
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $portalLink = route('portal.overview');

        return (new MailMessage)
            ->subject("Your return update: {$this->status->label()}")
            ->line("Your return is now **{$this->status->label()}**.")
            ->line($this->status->nextStepText())
            ->action('View Return in Portal', $portalLink)
            ->line("Sign in to your portal for details: {$portalLink}");
    }
}
