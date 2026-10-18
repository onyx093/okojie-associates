<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * Display the messages page for the client.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Mark any unread incoming messages to this user as read
        Message::where('to_user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = Message::where(function ($query) use ($user) {
            $query->where('to_user_id', $user->id)
                ->orWhere('from_user_id', $user->id);
        })
            ->with(['fromUser', 'toUser'])
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('portal/messages', [
            'messages' => $messages->map(fn (Message $m): array => [
                'id' => $m->id,
                'fromUserId' => $m->from_user_id,
                'toUserId' => $m->to_user_id,
                'fromName' => $m->from_user_id === $user->id
                    ? 'You'
                    : ($m->fromUser?->name ?: 'Your Preparer'),
                'isFromStaff' => $m->from_user_id !== $user->id,
                'body' => $m->body,
                'readAt' => $m->read_at?->toISOString(),
                'isUnread' => ! $m->read_at && $m->to_user_id === $user->id,
                'createdAt' => $m->created_at?->toISOString(),
                'formattedDate' => $m->created_at?->format('M j, Y, g:i A') ?? '',
            ]),
        ]);
    }

    /**
     * Mark all unread incoming messages as read.
     */
    public function markRead(Request $request): RedirectResponse
    {
        $user = $request->user();

        Message::where('to_user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }
}
