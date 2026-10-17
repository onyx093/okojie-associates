<?php

namespace App\Http\Controllers\Portal;

use App\Enums\Tier;
use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\UpdateTierRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class TierController extends Controller
{
    /**
     * Update the authenticated user's tax preparation service tier.
     */
    public function update(UpdateTierRequest $request): RedirectResponse
    {
        $user = $request->user();

        Gate::authorize('updateTier', $user);

        /** @var Tier $tier */
        $tier = $request->enum('tier', Tier::class);

        $user->update([
            'tier' => $tier,
        ]);

        return redirect()->route('portal.overview')->with('success', 'Service tier updated to '.$tier->label().'.');
    }
}
