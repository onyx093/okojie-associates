<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\AdvanceReturnStatus;
use App\Enums\ReturnStatus;
use App\Http\Controllers\Controller;
use App\Models\TaxReturn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class TaxReturnController extends Controller
{
    /**
     * Advance or reverse return status using AdvanceReturnStatus action.
     */
    public function updateStatus(
        Request $request,
        TaxReturn $taxReturn,
        AdvanceReturnStatus $action,
    ): RedirectResponse {
        Gate::authorize('update', $taxReturn);

        $validated = $request->validate([
            'status' => ['required', Rule::enum(ReturnStatus::class)],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $toStatus = ReturnStatus::from($validated['status']);

        $updatedReturn = $action->execute(
            taxReturn: $taxReturn,
            toStatus: $toStatus,
            byUser: $request->user(),
            reason: $validated['reason'] ?? null,
        );

        return back()->with('success', "Return status updated to {$updatedReturn->status->label()}.");
    }
}
