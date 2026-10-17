<?php

namespace App\Http\Controllers\Portal;

use App\Enums\ReferralStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Portal\StoreReferralRequest;
use App\Http\Resources\ReferralResource;
use App\Mail\ReferralInvite;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ReferralController extends Controller
{
    /**
     * Display a listing of the user's referrals.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $referrals = $user->referrals()
            ->latest('created_at')
            ->get();

        $referralCode = $user->referral_code;
        $referralLink = route('contact', ['ref' => $referralCode]);

        return Inertia::render('portal/referrals', [
            'referrals' => ReferralResource::collection($referrals)->resolve(),
            'referralCode' => $referralCode,
            'referralLink' => $referralLink,
            'rewardRange' => (string) config('site.referral.reward_range', '$25–$50'),
        ]);
    }

    /**
     * Store a newly created referral invitation.
     */
    public function store(StoreReferralRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $friendEmail = strtolower(trim($request->validated('friend_email')));
        $friendName = trim($request->validated('friend_name'));

        $referral = $user->referrals()->create([
            'friend_name' => $friendName,
            'friend_email' => $friendEmail,
            'status' => ReferralStatus::Sent,
            'source' => 'email',
        ]);

        AuditLog::record(
            action: 'referral.sent',
            entity: 'Referral',
            meta: [
                'referral_id' => $referral->id,
                'friend_name' => $referral->friend_name,
                'friend_email' => $referral->friend_email,
            ],
            entityId: $referral->id,
        );

        $referralLink = route('contact', ['ref' => $user->referral_code]);
        Mail::to($referral->friend_email)->queue(new ReferralInvite($referral, $user, $referralLink));

        return back()->with('success', "Referral sent! We've emailed {$referral->friend_name} an invitation.");
    }
}
