<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\AppearancePreferencesUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class AppearanceController extends Controller
{
    /**
     * Update the authenticated user's display preferences.
     */
    public function update(AppearancePreferencesUpdateRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var array{compact_tables?: bool, reduce_motion?: bool} $validated */
        $validated = $request->validated();

        $user->update($validated);

        return back();
    }
}
