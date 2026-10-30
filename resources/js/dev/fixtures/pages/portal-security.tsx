import * as React from 'react';

import { register } from '@/dev/fixtures';

// Dynamic lazy import prevents Vite from converting pages/portal/security into an internal chunk
const PortalSecurity = React.lazy(() => import('@/pages/portal/security'));

export const portalSecurityPageFixture = register({
    id: 'page-portal-security',
    title: 'Page: Portal Security & 2FA (§3 Matrix)',
    states: [
        {
            label: 'Off (2FA Required Gate)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalSecurity
                        twoFactorEnabled={false}
                        twoFactorConfirmed={false}
                        hasSecret={false}
                        passwordRules="minlength: 12;"
                        passwordChangedAt={null}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Setup (Step 2 of 2 — Awaiting OTP)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalSecurity
                        twoFactorEnabled={false}
                        twoFactorConfirmed={false}
                        hasSecret={true}
                        passwordRules="minlength: 12;"
                        passwordChangedAt={null}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'On (Active & Enforced — Changed 3 months ago)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalSecurity
                        twoFactorEnabled={true}
                        twoFactorConfirmed={true}
                        hasSecret={true}
                        passwordRules="minlength: 12;"
                        passwordChangedAt={new Date(
                            Date.now() - 90 * 24 * 60 * 60 * 1000,
                        ).toISOString()}
                    />
                </React.Suspense>
            ),
        },
    ],
});
