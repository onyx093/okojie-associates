<?php

namespace App\Policies;

use App\Models\Referral;
use App\Models\User;

class ReferralPolicy
{
    /**
     * Determine whether the user can view any referrals.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the referral.
     */
    public function view(User $user, Referral $referral): bool
    {
        if ($user->isStaff()) {
            return true;
        }

        return $user->id === $referral->referrer_id;
    }

    /**
     * Determine whether the user can create referrals.
     */
    public function create(User $user): bool
    {
        return true;
    }
}
