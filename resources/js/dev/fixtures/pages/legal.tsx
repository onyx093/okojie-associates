import * as React from 'react';

import { register } from '@/dev/fixtures';
import { fixtureClientUser } from '@/dev/fixtures/layouts';

// Dynamic lazy imports prevent Vite from converting pages/legal into internal chunks
const Privacy = React.lazy(() => import('@/pages/legal/privacy'));
const Terms = React.lazy(() => import('@/pages/legal/terms'));
const Security = React.lazy(() => import('@/pages/legal/security'));

export const privacyPageFixture = register({
    id: 'page-privacy',
    title: 'Page: Privacy Policy (§1 Legal Document & TOC)',
    states: [
        {
            label: 'Guest (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Privacy />
                </React.Suspense>
            ),
        },
        {
            label: 'Authenticated client (portal session)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Privacy userOverride={fixtureClientUser} />
                </React.Suspense>
            ),
        },
    ],
});

export const termsPageFixture = register({
    id: 'page-terms',
    title: 'Page: Terms of Service (§1 Legal Document & TOC)',
    states: [
        {
            label: 'Guest (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Terms />
                </React.Suspense>
            ),
        },
        {
            label: 'Authenticated client (portal session)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Terms userOverride={fixtureClientUser} />
                </React.Suspense>
            ),
        },
    ],
});

export const securityPageFixture = register({
    id: 'page-security',
    title: 'Page: Security & Data Safeguards (§1 Legal Document & TOC)',
    states: [
        {
            label: 'Guest (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Security />
                </React.Suspense>
            ),
        },
        {
            label: 'Authenticated client (portal session)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Security userOverride={fixtureClientUser} />
                </React.Suspense>
            ),
        },
    ],
});
