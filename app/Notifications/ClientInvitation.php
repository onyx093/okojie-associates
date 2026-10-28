<?php

namespace App\Notifications;

use App\Models\TaxReturn;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class ClientInvitation extends Notification implements ShouldQueue
{
    use Queueable;

    public string $setupUrl;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $token,
        public TaxReturn $taxReturn,
        ?string $setupUrl = null,
    ) {
        $email = $this->taxReturn->user->email ?? '';

        $this->setupUrl = $setupUrl ?? URL::temporarySignedRoute(
            'password.reset',
            now()->addDays(7),
            [
                'token' => $this->token,
                'email' => $email,
            ],
        );
    }

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
        $name = $notifiable instanceof User && $notifiable->name !== ''
            ? $notifiable->name
            : 'there';

        return (new MailMessage)
            ->subject("You're invited to your Okojie & Associates client portal")
            ->greeting("Hello {$name},")
            ->line("We've set up your {$this->taxReturn->tax_year} tax return workspace at Okojie & Associates.")
            ->line('Choose a password below to access your secure client portal, upload documents, and message your preparer.')
            ->action('Set Up Your Password', $this->setupUrl)
            ->line('This password setup link will expire based on our security policy.');
    }
}
