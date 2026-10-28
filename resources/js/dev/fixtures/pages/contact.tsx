import * as React from 'react';

import { register } from '@/dev/fixtures';
import { fixtureClientUser } from '@/dev/fixtures/layouts';
import { sampleOffices, sampleTiers } from '@/dev/fixtures/pages/home';

// Dynamic lazy import prevents Vite from converting pages/contact into an internal chunk
const Contact = React.lazy(() => import('@/pages/contact'));

export const contactPageFixture = register({
    id: 'page-contact',
    title: 'Page: Contact (§4.5 Intake Form & Offices)',
    states: [
        {
            label: 'Quote tab (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Contact tiers={sampleTiers} offices={sampleOffices} />
                </React.Suspense>
            ),
        },
        {
            label: 'With referral code (OKJ-DEMO)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Contact
                        tiers={sampleTiers}
                        offices={sampleOffices}
                        referralCode="OKJ-DEMO"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'With pre-selected tier (premium_remote)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Contact
                        tiers={sampleTiers}
                        offices={sampleOffices}
                        initialTier="premium_remote"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Authenticated client view',
            render: () => (
                <React.Suspense fallback={null}>
                    <Contact
                        tiers={sampleTiers}
                        offices={sampleOffices}
                        userOverride={fixtureClientUser}
                    />
                </React.Suspense>
            ),
        },
    ],
});
