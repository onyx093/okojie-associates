<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    /**
     * Determine whether the user can view the invoice.
     */
    public function view(User $user, Invoice $invoice): bool
    {
        return $invoice->taxReturn?->user_id === $user->id || $user->isStaff();
    }

    /**
     * Determine whether the user can checkout the invoice.
     */
    public function checkout(User $user, Invoice $invoice): bool
    {
        return $invoice->taxReturn?->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the invoice.
     */
    public function update(User $user, Invoice $invoice): bool
    {
        return $user->isStaff();
    }
}
