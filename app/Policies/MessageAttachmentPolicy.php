<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\MessageAttachment;
use App\Models\TaxReturn;
use App\Models\User;

class MessageAttachmentPolicy
{
    /**
     * Determine whether the user can view the attachment.
     */
    public function view(User $user, MessageAttachment $attachment): bool
    {
        $message = $attachment->message;

        if ($user->role === Role::Admin) {
            return true;
        }

        if ($user->role === Role::Preparer) {
            if ($message->from_user_id === $user->id || $message->to_user_id === $user->id) {
                return true;
            }

            return TaxReturn::whereIn('user_id', [$message->to_user_id, $message->from_user_id])
                ->where('preparer_id', $user->id)
                ->exists();
        }

        return $user->id === $message->to_user_id || $user->id === $message->from_user_id;
    }

    /**
     * Determine whether the user can download the attachment.
     */
    public function download(User $user, MessageAttachment $attachment): bool
    {
        return $this->view($user, $attachment);
    }
}
