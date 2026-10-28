<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReferralStatus;
use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Referral;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReferralController extends Controller
{
    /**
     * Display a listing of referrals with totals and status filter.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $statusFilter = $this->resolveStatusFilter($request);

        $baseQuery = $this->buildVisibleQuery($user);

        $allReferrals = (clone $baseQuery)->get(['id', 'referrer_id', 'friend_user_id', 'status', 'reward_cents']);

        $invitesCount = $allReferrals->count();
        $signedUpCount = $allReferrals->filter(
            fn (Referral $r): bool => in_array($r->status, [
                ReferralStatus::SignedUp,
                ReferralStatus::Filed,
                ReferralStatus::Rewarded,
            ], true) || $r->friend_user_id !== null,
        )->count();
        $readyToRewardCount = $allReferrals->where('status', ReferralStatus::Filed)->count();
        $rewardedReferrals = $allReferrals->where('status', ReferralStatus::Rewarded);
        $rewardedCount = $rewardedReferrals->count();
        $filedCount = $readyToRewardCount + $rewardedCount;
        $rewardsPaidCents = (int) $rewardedReferrals->sum(fn (Referral $r): int => (int) ($r->reward_cents ?? 0));
        $rewardsDecimals = $rewardsPaidCents % 100 === 0 ? 0 : 2;
        $rewardsPaidFormatted = '$'.number_format($rewardsPaidCents / 100, $rewardsDecimals);

        $query = $this->buildVisibleQuery($user)
            ->with(['referrer', 'friendUser'])
            ->latest();

        if ($statusFilter === 'ready') {
            $query->where('status', ReferralStatus::Filed);
        } elseif ($statusFilter !== 'all') {
            $statusEnum = ReferralStatus::tryFrom($statusFilter);
            if ($statusEnum !== null) {
                $query->where('status', $statusEnum);
            }
        }

        $referrals = $query
            ->paginate(30)
            ->withQueryString()
            ->through(fn (Referral $r): array => [
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
            'filters' => [
                'status' => $statusFilter,
            ],
            'counts' => [
                'ready' => $readyToRewardCount,
                'all' => $invitesCount,
            ],
            'totals' => [
                'invites' => $invitesCount,
                'signedUp' => $signedUpCount,
                'signedUpPercent' => $invitesCount > 0 ? (int) round(($signedUpCount / $invitesCount) * 100) : 0,
                'filed' => $filedCount,
                'readyToReward' => $readyToRewardCount,
                'rewardsPaidCents' => $rewardsPaidCents,
                'rewardsPaidFormatted' => $rewardsPaidFormatted,
                'rewardedClients' => $rewardedCount,
            ],
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

    /**
     * Build the base Referral query scoped to the actor's visibility.
     *
     * @return Builder<Referral>
     */
    private function buildVisibleQuery(User $user): Builder
    {
        $query = Referral::query();

        if ($user->role === Role::Preparer) {
            $query->where(function (Builder $q) use ($user) {
                $q->whereHas('referrer.taxReturns', fn (Builder $r) => $r->where('preparer_id', $user->id))
                    ->orWhereHas('friendUser.taxReturns', fn (Builder $r) => $r->where('preparer_id', $user->id));
            });
        }

        return $query;
    }

    /**
     * Normalize the status query parameter ('ready' | 'all' | ReferralStatus value).
     */
    private function resolveStatusFilter(Request $request): string
    {
        $raw = is_string($request->query('status')) ? trim($request->query('status')) : '';

        if ($raw === 'all' || $raw === 'ready') {
            return $raw;
        }

        $enum = ReferralStatus::tryFrom($raw);

        return $enum !== null ? $enum->value : 'ready';
    }
}
