<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\TaxReturn;
use App\Models\User;

class TaxReturnPolicy
{
    /**
     * Determine whether the user can view the tax return.
     */
    public function view(User $user, TaxReturn $taxReturn): bool
    {
        if ($user->role === Role::Admin) {
            return true;
        }

        if ($user->role === Role::Preparer) {
            return $taxReturn->preparer_id === $user->id;
        }

        return $user->id === $taxReturn->user_id;
    }

    /**
     * Determine whether the user can update the tax return.
     */
    public function update(User $user, TaxReturn $taxReturn): bool
    {
        if ($user->role === Role::Admin) {
            return true;
        }

        if ($user->role === Role::Preparer) {
            return $taxReturn->preparer_id === $user->id;
        }

        return false;
    }
}
