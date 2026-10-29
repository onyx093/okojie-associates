import * as React from 'react';

import { register } from '@/dev/fixtures';

// Dynamic lazy import prevents Vite from converting pages/auth/confirm-password into an internal chunk
const ConfirmPassword = React.lazy(
    () => import('@/pages/auth/confirm-password'),
);

export const confirmPasswordPageFixture = register({
    id: 'page-confirm-password',
    title: 'Page: Confirm Password (§2 Authentication)',
    states: [
        {
            label: 'Default',
            render: () => (
                <React.Suspense fallback={null}>
                    <ConfirmPassword />
                </React.Suspense>
            ),
        },
        {
            label: 'Wrong password',
            render: () => (
                <React.Suspense fallback={null}>
                    <ConfirmPassword
                        initialPassword="wrong-password"
                        initialErrors={{
                            password:
                                'This password does not match our records.',
                        }}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Submitting',
            render: () => (
                <React.Suspense fallback={null}>
                    <ConfirmPassword
                        initialPassword="CorrectHorseBattery12!"
                        isSubmitting={true}
                    />
                </React.Suspense>
            ),
        },
    ],
});
