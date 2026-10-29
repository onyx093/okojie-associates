import * as React from 'react';

import { register } from '@/dev/fixtures';

// Dynamic lazy import prevents Vite from converting pages/auth/reset-password into an internal chunk
const ResetPassword = React.lazy(() => import('@/pages/auth/reset-password'));

export const resetPasswordPageFixture = register({
    id: 'page-reset-password',
    title: 'Page: Reset Password (§2 Authentication)',
    states: [
        {
            label: 'Default',
            render: () => (
                <React.Suspense fallback={null}>
                    <ResetPassword
                        token="mock-reset-token-12345"
                        email="denise.r@example.com"
                        passwordRules="At least 12 characters. A short phrase is easiest to remember."
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Invalid token',
            render: () => (
                <React.Suspense fallback={null}>
                    <ResetPassword
                        token="invalid-token"
                        email="denise.r@example.com"
                        passwordRules="At least 12 characters. A short phrase is easiest to remember."
                        initialErrors={{
                            email: 'This password reset token is invalid.',
                        }}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Mismatch',
            render: () => (
                <React.Suspense fallback={null}>
                    <ResetPassword
                        token="mock-reset-token-12345"
                        email="denise.r@example.com"
                        passwordRules="At least 12 characters. A short phrase is easiest to remember."
                        initialValues={{
                            password: 'CorrectHorseBattery12!',
                            password_confirmation: 'DifferentPassword12!',
                        }}
                        initialErrors={{
                            password_confirmation: "Passwords don't match.",
                        }}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Weak',
            render: () => (
                <React.Suspense fallback={null}>
                    <ResetPassword
                        token="mock-reset-token-12345"
                        email="denise.r@example.com"
                        passwordRules="At least 12 characters. A short phrase is easiest to remember."
                        initialValues={{
                            password: 'short',
                        }}
                        initialErrors={{
                            password:
                                'The password must be at least 12 characters.',
                        }}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Submitting',
            render: () => (
                <React.Suspense fallback={null}>
                    <ResetPassword
                        token="mock-reset-token-12345"
                        email="denise.r@example.com"
                        passwordRules="At least 12 characters. A short phrase is easiest to remember."
                        initialValues={{
                            password: 'CorrectHorseBattery12!',
                            password_confirmation: 'CorrectHorseBattery12!',
                        }}
                        isSubmitting={true}
                    />
                </React.Suspense>
            ),
        },
    ],
});
