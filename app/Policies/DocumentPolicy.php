<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    /**
     * Determine whether the user can view any documents.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the document.
     */
    public function view(User $user, Document $document): bool
    {
        if ($user->role === Role::Admin || $user->role === Role::Preparer) {
            return true;
        }

        return $user->id === $document->user_id;
    }

    /**
     * Determine whether the user can download the document.
     */
    public function download(User $user, Document $document): bool
    {
        return $this->view($user, $document);
    }

    /**
     * Determine whether the user can create documents.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the document.
     * Deletion is only permitted before ReadyForReview.
     */
    public function delete(User $user, Document $document): bool
    {
        // Must belong to user (or admin)
        if ($user->id !== $document->user_id && $user->role !== Role::Admin) {
            return false;
        }

        // Check return status: delete only before ReadyForReview
        $taxReturn = $document->taxReturn ?: $document->user->taxReturns()->latest('tax_year')->first();
        if ($taxReturn) {
            return $taxReturn->status->isBeforeReadyForReview();
        }

        return true;
    }
}
