<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can update their service tier.
     */
    public function updateTier(User $user, User $target): bool
    {
        return $user->id === $target->id;
    }
}
