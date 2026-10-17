<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsletterRequest;
use App\Models\AuditLog;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;

class NewsletterController extends Controller
{
    /**
     * Subscribe an email to the newsletter (idempotent).
     */
    public function store(NewsletterRequest $request): RedirectResponse
    {
        /** @var string $email */
        $email = $request->validated('email');

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $email],
            ['confirmed_at' => now()]
        );

        AuditLog::record(
            action: 'newsletter.subscribed',
            entity: 'NewsletterSubscriber',
            meta: [
                'email' => $subscriber->email,
                'subscriber_id' => $subscriber->id,
            ],
            entityId: $subscriber->id
        );

        return back()->with('success', 'Thank you for subscribing to tax updates.');
    }
}
