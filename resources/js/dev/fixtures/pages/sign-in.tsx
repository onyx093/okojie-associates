import { Link } from '@inertiajs/react';
import * as React from 'react';

import { SignInForm } from '@/components/auth/sign-in-form';
import { register } from '@/dev/fixtures';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';

export const signInPageFixture = register({
    id: 'page-sign-in',
    title: 'Page: Sign In (§2 Authentication)',
    states: [
        {
            label: 'Default (empty)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Secure client portal"
                    title="Sign in to Okojie Online"
                    lead="Upload documents, check your return, e-sign and pay, all in one place."
                    switchLine={
                        <>
                            New to Okojie Online?{' '}
                            <Link href="/register">Start your return</Link>
                        </>
                    }
                >
                    <SignInForm canResetPassword={true} />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Filled (sample credentials)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Secure client portal"
                    title="Sign in to Okojie Online"
                    lead="Upload documents, check your return, e-sign and pay, all in one place."
                    switchLine={
                        <>
                            New to Okojie Online?{' '}
                            <Link href="/register">Start your return</Link>
                        </>
                    }
                >
                    <SignInForm
                        canResetPassword={true}
                        initialValues={{
                            email: 'denise.r@example.com',
                            password: 'correct-horse',
                            remember: true,
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Error (Invalid credentials)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Secure client portal"
                    title="Sign in to Okojie Online"
                    lead="Upload documents, check your return, e-sign and pay, all in one place."
                    switchLine={
                        <>
                            New to Okojie Online?{' '}
                            <Link href="/register">Start your return</Link>
                        </>
                    }
                >
                    <SignInForm
                        canResetPassword={true}
                        initialValues={{
                            email: 'denise.r@example.com',
                            password: 'wrong-horse',
                            remember: true,
                        }}
                        initialErrors={{
                            email: "That email and password don't match. Check them and try again.",
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Throttled (Too many attempts)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Secure client portal"
                    title="Sign in to Okojie Online"
                    lead="Upload documents, check your return, e-sign and pay, all in one place."
                    switchLine={
                        <>
                            New to Okojie Online?{' '}
                            <Link href="/register">Start your return</Link>
                        </>
                    }
                >
                    <SignInForm
                        canResetPassword={true}
                        initialValues={{
                            email: 'denise.r@example.com',
                            password: 'wrong-horse',
                            remember: true,
                        }}
                        initialErrors={{
                            throttle:
                                'Too many attempts. Please wait 60 seconds.',
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Status banner (Password reset)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Secure client portal"
                    title="Sign in to Okojie Online"
                    lead="Upload documents, check your return, e-sign and pay, all in one place."
                    switchLine={
                        <>
                            New to Okojie Online?{' '}
                            <Link href="/register">Start your return</Link>
                        </>
                    }
                >
                    <SignInForm
                        status="Your password has been reset."
                        canResetPassword={true}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Submitting',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Secure client portal"
                    title="Sign in to Okojie Online"
                    lead="Upload documents, check your return, e-sign and pay, all in one place."
                    switchLine={
                        <>
                            New to Okojie Online?{' '}
                            <Link href="/register">Start your return</Link>
                        </>
                    }
                >
                    <SignInForm
                        canResetPassword={true}
                        isSubmitting={true}
                        initialValues={{
                            email: 'denise.r@example.com',
                            password: 'correct-horse',
                            remember: true,
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
    ],
});
