<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    /**
     * Post a new message from staff to the client.
     */
    public function store(Request $request, User $client): RedirectResponse
    {
        Gate::authorize('view', $client);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $message = Message::create([
            'from_user_id' => $request->user()->id,
            'to_user_id' => $client->id,
            'body' => trim($validated['body']),
        ]);

        AuditLog::record(
            action: 'admin.message_sent',
            entity: 'Message',
            meta: [
                'to_client_id' => $client->id,
            ],
            entityId: $message->id,
        );

        return back()->with('success', 'Message posted to client.');
    }
}
