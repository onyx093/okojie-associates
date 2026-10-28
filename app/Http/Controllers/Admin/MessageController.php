<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMessageRequest;
use App\Models\AuditLog;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Post a new message from staff to the client.
     */
    public function store(StoreMessageRequest $request, User $client): RedirectResponse
    {
        Gate::authorize('view', $client);

        $validated = $request->validated();

        $message = Message::create([
            'from_user_id' => $request->user()->id,
            'to_user_id' => $client->id,
            'body' => trim($validated['body']),
        ]);

        if ($request->hasFile('attachments')) {
            /** @var array<int, UploadedFile> $files */
            $files = $request->file('attachments', []);

            foreach ($files as $file) {
                $path = Storage::disk('private')->putFile("message-attachments/{$message->id}", $file);

                if ($path === false) {
                    continue;
                }

                $message->attachments()->create([
                    'filename' => $file->getClientOriginalName(),
                    'mime' => $file->getMimeType() ?: 'application/octet-stream',
                    'size_bytes' => (int) $file->getSize(),
                    'storage_key' => $path,
                ]);
            }
        }

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
