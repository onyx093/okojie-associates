<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRequested extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Appointment $appointment,
        public bool $forStaff = false,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->forStaff
            ? "New Appointment Request: {$this->appointment->user->name} ({$this->appointment->preferred_date->format('M j, Y')})"
            : 'We received your appointment request — Okojie Online';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.appointment-requested',
            with: [
                'user' => $this->appointment->user,
                'preferredDate' => $this->appointment->preferred_date->format('l, F j, Y'),
                'timeWindow' => $this->appointment->time_window->label(),
                'format' => $this->appointment->format->label(),
                'topic' => $this->appointment->topic,
                'notes' => $this->appointment->notes,
                'forStaff' => $this->forStaff,
                'firstName' => explode(' ', trim($this->appointment->user->name))[0] ?: 'Client',
            ],
        );
    }
}
