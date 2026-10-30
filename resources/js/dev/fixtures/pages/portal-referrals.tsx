import * as React from 'react';

import { register } from '@/dev/fixtures';
import type { ReferralItem } from '@/pages/portal/referrals';

// Dynamic lazy import prevents Vite from converting pages/portal/referrals into an internal chunk
const PortalReferrals = React.lazy(() => import('@/pages/portal/referrals'));

const SAMPLE_REFERRALS: ReferralItem[] = [
    {
        id: 'ref-1',
        friend_name: 'Marcus Thompson',
        friend_email: 'marcus.t@example.com',
        status: 'filed',
        status_label: 'Filed',
        reward_cents: 5000,
        reward_formatted: '$50',
        source: 'email',
        created_at: '2026-01-30T10:00:00Z',
        created_at_formatted: 'Jan 30',
    },
    {
        id: 'ref-2',
        friend_name: 'Priya Shah',
        friend_email: 'priya.shah@example.com',
        status: 'signed_up',
        status_label: 'Signed up',
        reward_cents: null,
        reward_formatted: '—',
        source: 'email',
        created_at: '2026-02-04T14:30:00Z',
        created_at_formatted: 'Feb 4',
    },
    {
        id: 'ref-3',
        friend_name: 'Terrence Wallace',
        friend_email: 't.wallace@example.com',
        status: 'sent',
        status_label: 'Sent',
        reward_cents: null,
        reward_formatted: '—',
        source: 'email',
        created_at: '2026-02-09T09:15:00Z',
        created_at_formatted: 'Feb 9',
    },
];

export const portalReferralsPageFixture = register({
    id: 'page-portal-referrals',
    title: 'Page: Portal Referrals (§3 Matrix)',
    states: [
        {
            label: 'Default (Mixed Referrals — Mockup State)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalReferrals
                        referrals={SAMPLE_REFERRALS}
                        referralCode="DENISE-R"
                        referralLink="https://okojie.online/r/DENISE-R"
                        rewardRange="$25–$50"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Empty state (No referrals yet)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalReferrals
                        referrals={[]}
                        referralCode="DENISE-R"
                        referralLink="https://okojie.online/r/DENISE-R"
                        rewardRange="$25–$50"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Rewarded status and accumulated earnings',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalReferrals
                        referrals={[
                            {
                                id: 'ref-1',
                                friend_name: 'Marcus Thompson',
                                friend_email: 'marcus.t@example.com',
                                status: 'rewarded',
                                status_label: 'Rewarded',
                                reward_cents: 5000,
                                reward_formatted: '$50',
                                source: 'email',
                                created_at: '2026-01-30T10:00:00Z',
                                created_at_formatted: 'Jan 30',
                            },
                            {
                                id: 'ref-4',
                                friend_name: 'Alicia Keys',
                                friend_email: 'alicia.k@example.com',
                                status: 'rewarded',
                                status_label: 'Rewarded',
                                reward_cents: 2500,
                                reward_formatted: '$25',
                                source: 'email',
                                created_at: '2026-02-01T11:00:00Z',
                                created_at_formatted: 'Feb 1',
                            },
                            {
                                id: 'ref-2',
                                friend_name: 'Priya Shah',
                                friend_email: 'priya.shah@example.com',
                                status: 'signed_up',
                                status_label: 'Signed up',
                                reward_cents: null,
                                reward_formatted: '—',
                                source: 'email',
                                created_at: '2026-02-04T14:30:00Z',
                                created_at_formatted: 'Feb 4',
                            },
                        ]}
                        referralCode="DENISE-R"
                        referralLink="https://okojie.online/r/DENISE-R"
                        rewardRange="$25–$50"
                    />
                </React.Suspense>
            ),
        },
    ],
});
