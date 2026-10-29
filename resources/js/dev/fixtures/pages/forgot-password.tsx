import * as React from 'react';

import { register } from '@/dev/fixtures';

// Dynamic lazy import prevents Vite from converting pages/auth/forgot-password into an internal chunk
const ForgotPassword = React.lazy(() => import('@/pages/auth/forgot-password'));

export const forgotPasswordPageFixture = register({
    id: 'page-forgot-password',
    title: 'Page: Forgot Password (§2 Authentication)',
    states: [
        {
            label: 'Form (empty)',
            render: () => (
                <React.Suspense fallback={null}>
                    <ForgotPassword />
                </React.Suspense>
            ),
        },
        {
            label: 'Form (filled)',
            render: () => (
                <React.Suspense fallback={null}>
                    <ForgotPassword initialEmail="denise.r@example.com" />
                </React.Suspense>
            ),
        },
        {
            label: 'Sent (link sent)',
            render: () => (
                <React.Suspense fallback={null}>
                    <ForgotPassword
                        initialEmail="denise.r@example.com"
                        status="We have emailed your password reset link."
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Validation error',
            render: () => (
                <React.Suspense fallback={null}>
                    <ForgotPassword
                        initialEmail="invalid-email"
                        initialErrors={{
                            email: 'Please enter a valid email address.',
                        }}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Throttled',
            render: () => (
                <React.Suspense fallback={null}>
                    <ForgotPassword
                        initialEmail="denise.r@example.com"
                        initialErrors={{
                            throttle:
                                'Too many password reset attempts. Please try again in 60 seconds.',
                        }}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Submitting',
            render: () => (
                <React.Suspense fallback={null}>
                    <ForgotPassword
                        initialEmail="denise.r@example.com"
                        isSubmitting={true}
                    />
                </React.Suspense>
            ),
        },
    ],
});
