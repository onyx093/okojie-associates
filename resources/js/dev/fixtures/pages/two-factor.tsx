import * as React from 'react';

import { register } from '@/dev/fixtures';

// Dynamic lazy import prevents Vite from converting pages/auth/two-factor-challenge into an internal chunk
const TwoFactorChallenge = React.lazy(
    () => import('@/pages/auth/two-factor-challenge'),
);

export const twoFactorPageFixture = register({
    id: 'page-two-factor',
    title: 'Page: Two-Factor Challenge (§2 Authentication)',
    states: [
        {
            label: 'Code (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <TwoFactorChallenge />
                </React.Suspense>
            ),
        },
        {
            label: 'Code (filled)',
            render: () => (
                <React.Suspense fallback={null}>
                    <TwoFactorChallenge initialCode="123456" />
                </React.Suspense>
            ),
        },
        {
            label: 'Code (invalid code)',
            render: () => (
                <React.Suspense fallback={null}>
                    <TwoFactorChallenge
                        initialCode="000000"
                        initialErrors={{
                            code: 'The provided two factor authentication code was invalid.',
                        }}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Recovery (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <TwoFactorChallenge initialRecovery={true} />
                </React.Suspense>
            ),
        },
        {
            label: 'Recovery (filled)',
            render: () => (
                <React.Suspense fallback={null}>
                    <TwoFactorChallenge
                        initialRecovery={true}
                        initialRecoveryCode="ABCD-EFGH"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Recovery (invalid code)',
            render: () => (
                <React.Suspense fallback={null}>
                    <TwoFactorChallenge
                        initialRecovery={true}
                        initialRecoveryCode="WRONG-CODE"
                        initialErrors={{
                            recovery_code:
                                'The provided two factor recovery code was invalid.',
                        }}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Submitting',
            render: () => (
                <React.Suspense fallback={null}>
                    <TwoFactorChallenge isSubmitting={true} />
                </React.Suspense>
            ),
        },
    ],
});
