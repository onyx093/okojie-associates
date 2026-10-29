import * as React from 'react';

import { register } from '@/dev/fixtures';

// Dynamic lazy import prevents Vite from converting pages/auth/verify-email into an internal chunk
const VerifyEmail = React.lazy(() => import('@/pages/auth/verify-email'));

export const verifyEmailPageFixture = register({
    id: 'page-verify-email',
    title: 'Page: Verify Email (§2 Authentication)',
    states: [
        {
            label: 'Waiting (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <VerifyEmail email="denise.r@example.com" />
                </React.Suspense>
            ),
        },
        {
            label: 'Resent (status link sent)',
            render: () => (
                <React.Suspense fallback={null}>
                    <VerifyEmail
                        email="denise.r@example.com"
                        status="verification-link-sent"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Submitting (loading)',
            render: () => (
                <React.Suspense fallback={null}>
                    <VerifyEmail
                        email="denise.r@example.com"
                        isSubmitting={true}
                    />
                </React.Suspense>
            ),
        },
    ],
});
