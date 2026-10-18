<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any models (staff client list).
     */
    public function viewAny(User $user): bool
    {
        return $user->isStaff();
    }

    /**
     * Determine whether the user can view the model.
     * Admins can view anyone; preparers can view assigned clients; users can view themselves.
     */
    public function view(User $user, User $model): bool
    {
        if ($user->id === $model->id) {
            return true;
        }

        if ($user->role === Role::Admin) {
            return true;
        }

        if ($user->role === Role::Preparer) {
            return $model->taxReturns()->where('preparer_id', $user->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        return $this->view($user, $model);
    }

    /**
     * Determine whether the user can update their service tier.
     */
    public function updateTier(User $user, User $model): bool
    {
        return $this->update($user, $model);
    }
}
