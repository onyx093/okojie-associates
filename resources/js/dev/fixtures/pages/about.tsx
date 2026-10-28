import * as React from 'react';

import { register } from '@/dev/fixtures';
import { fixtureClientUser } from '@/dev/fixtures/layouts';
import { sampleOffices, sampleStats } from '@/dev/fixtures/pages/home';

// Dynamic lazy import prevents Vite from converting pages/about into an internal chunk
const About = React.lazy(() => import('@/pages/about'));

export const aboutPageFixture = register({
    id: 'page-about',
    title: 'Page: About (§4.4 Story, Team, Security & Offices)',
    states: [
        {
            label: 'Guest (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <About stats={sampleStats} offices={sampleOffices} />
                </React.Suspense>
            ),
        },
        {
            label: 'Authenticated client (portal session)',
            render: () => (
                <React.Suspense fallback={null}>
                    <About
                        stats={sampleStats}
                        offices={sampleOffices}
                        userOverride={fixtureClientUser}
                    />
                </React.Suspense>
            ),
        },
    ],
});
