<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Message;
use App\Models\MessageAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
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
            ->with(['fromUser', 'toUser', 'attachments'])
            ->orderBy('created_at', 'asc')
            ->get();

        $latestReturn = $user->taxReturns()
            ->with('preparer')
            ->latest('tax_year')
            ->first();

        $preparer = $latestReturn?->preparer;

        return Inertia::render('portal/messages', [
            'preparer' => $preparer ? [
                'name' => $preparer->name,
                'title' => $preparer->title,
                'office' => $preparer->office,
                'officeLabel' => $preparer->officeLabel(),
                'avatarUrl' => $preparer->avatarUrl(),
            ] : null,
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
                'attachments' => $m->attachments->map(fn (MessageAttachment $a): array => [
                    'id' => $a->id,
                    'filename' => $a->filename,
                    'size_formatted' => $a->formattedSize(),
                    'download_url' => route('portal.messages.attachments.download', $a),
                ])->values()->all(),
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

    /**
     * Download the specified message attachment.
     */
    public function downloadAttachment(Request $request, MessageAttachment $attachment): RedirectResponse
    {
        Gate::authorize('download', $attachment);

        AuditLog::record(
            action: 'message_attachment.downloaded',
            entity: 'MessageAttachment',
            meta: [
                'filename' => $attachment->filename,
                'message_id' => $attachment->message_id,
            ],
            entityId: $attachment->id,
        );

        $url = Storage::disk('private')->temporaryUrl(
            $attachment->storage_key,
            now()->addSeconds(60),
            ['ResponseContentDisposition' => 'attachment; filename="'.addslashes($attachment->filename).'"']
        );

        return redirect()->away($url);
    }
}
