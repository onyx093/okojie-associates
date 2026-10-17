<?php

namespace App\Mail;

use App\Models\Referral;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReferralInvite extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Referral $referral,
        public User $referrer,
        public string $referralLink,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $referrerName = $this->referrer->name ?: 'A friend';

        return new Envelope(
            subject: "{$referrerName} thinks you'd like Okojie Online",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.referral-invite',
            with: [
                'referrerName' => $this->referrer->name ?: 'A friend',
                'friendName' => $this->referral->friend_name,
                'link' => $this->referralLink,
            ],
        );
    }
}
