import * as React from 'react';

import { register } from '@/dev/fixtures';
import { fixtureClientUser } from '@/dev/fixtures/layouts';
import { sampleFaqs, sampleTiers } from '@/dev/fixtures/pages/home';
import { sampleAddons } from '@/dev/fixtures/pages/services';

// Dynamic lazy import prevents Vite from converting pages/pricing into an internal chunk
const Pricing = React.lazy(() => import('@/pages/pricing'));

export const pricingPageFixture = register({
    id: 'page-pricing',
    title: 'Page: Pricing (§4.3 Tier Comparison & Fees)',
    states: [
        {
            label: 'Guest (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Pricing
                        tiers={sampleTiers}
                        addons={sampleAddons}
                        faqs={sampleFaqs}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Authenticated client (portal tier current)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Pricing
                        tiers={sampleTiers}
                        addons={sampleAddons}
                        faqs={sampleFaqs}
                        userOverride={fixtureClientUser}
                    />
                </React.Suspense>
            ),
        },
    ],
});
