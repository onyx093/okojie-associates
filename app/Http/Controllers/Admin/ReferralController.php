<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReferralStatus;
use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Referral;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReferralController extends Controller
{
    /**
     * Display a listing of all referrals.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Referral::query()->with(['referrer', 'friendUser'])->latest();

        // If preparer, filter to referrals where referrer or friend is assigned to them
        if ($user->role === Role::Preparer) {
            $query->where(function ($q) use ($user) {
                $q->whereHas('referrer.taxReturns', fn ($r) => $r->where('preparer_id', $user->id))
                    ->orWhereHas('friendUser.taxReturns', fn ($r) => $r->where('preparer_id', $user->id));
            });
        }

        $referrals = $query->paginate(30)->through(fn (Referral $r): array => [
            'id' => $r->id,
            'referrerName' => $r->referrer?->name ?: 'Unknown',
            'referrerEmail' => $r->referrer?->email ?: 'Unknown',
            'friendName' => $r->friend_name,
            'friendEmail' => $r->friend_email,
            'hasSignedUp' => (bool) $r->friend_user_id,
            'status' => $r->status->value,
            'statusLabel' => $r->status->label(),
            'rewardCents' => $r->reward_cents,
            'formattedReward' => $r->reward_cents ? '$'.number_format($r->reward_cents / 100, 2) : '—',
            'canReward' => $r->status !== ReferralStatus::Rewarded,
            'createdAt' => $r->created_at?->format('M j, Y g:i A'),
        ]);

        return Inertia::render('admin/referrals', [
            'referrals' => $referrals,
        ]);
    }

    /**
     * Mark a referral as Rewarded.
     */
    public function reward(Request $request, Referral $referral): RedirectResponse
    {
        $user = $request->user();

        if ($user->role === Role::Preparer) {
            $isAssigned = $referral->referrer?->taxReturns()->where('preparer_id', $user->id)->exists()
                || $referral->friendUser?->taxReturns()->where('preparer_id', $user->id)->exists();

            if (! $isAssigned) {
                abort(403);
            }
        }

        $referral->markRewarded();

        AuditLog::record(
            action: 'admin.referral_rewarded',
            entity: 'Referral',
            meta: [
                'reward_cents' => $referral->reward_cents,
                'status' => $referral->status->value,
            ],
            entityId: $referral->id,
        );

        $amount = number_format(($referral->reward_cents ?? 0) / 100, 2);

        return back()->with('success', "Referral marked as Rewarded (\${$amount}).");
    }
}
