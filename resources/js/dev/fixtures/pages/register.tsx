import { Link } from '@inertiajs/react';
import * as React from 'react';

import { SignUpForm } from '@/components/auth/sign-up-form';
import { register } from '@/dev/fixtures';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';

export const registerPageFixture = register({
    id: 'page-register',
    title: 'Page: Register (§2 Authentication)',
    states: [
        {
            label: 'Default (empty)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Start your return"
                    title="Create your account"
                    lead="It takes a minute. You’ll set up two-factor authentication next to keep your documents safe."
                    switchLine={
                        <>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </>
                    }
                >
                    <SignUpForm />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Filled (sample registration)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Start your return"
                    title="Create your account"
                    lead="It takes a minute. You’ll set up two-factor authentication next to keep your documents safe."
                    switchLine={
                        <>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </>
                    }
                >
                    <SignUpForm
                        initialValues={{
                            name: 'Denise Richardson',
                            email: 'denise.r@example.com',
                            password: 'CorrectHorseBattery99!',
                            password_confirmation: 'CorrectHorseBattery99!',
                            terms: true,
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Email taken (server duplicate)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Start your return"
                    title="Create your account"
                    lead="It takes a minute. You’ll set up two-factor authentication next to keep your documents safe."
                    switchLine={
                        <>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </>
                    }
                >
                    <SignUpForm
                        initialValues={{
                            name: 'Denise Richardson',
                            email: 'existing@example.com',
                            password: 'CorrectHorseBattery99!',
                            password_confirmation: 'CorrectHorseBattery99!',
                            terms: true,
                        }}
                        initialErrors={{
                            email: 'An account may already exist for this email. Try signing in.',
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Weak password (<12 chars)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Start your return"
                    title="Create your account"
                    lead="It takes a minute. You’ll set up two-factor authentication next to keep your documents safe."
                    switchLine={
                        <>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </>
                    }
                >
                    <SignUpForm
                        initialValues={{
                            name: 'Denise Richardson',
                            email: 'denise.r@example.com',
                            password: 'short1!',
                            password_confirmation: 'short1!',
                            terms: true,
                        }}
                        initialErrors={{
                            password:
                                'Password must be at least 12 characters.',
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Password mismatch',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Start your return"
                    title="Create your account"
                    lead="It takes a minute. You’ll set up two-factor authentication next to keep your documents safe."
                    switchLine={
                        <>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </>
                    }
                >
                    <SignUpForm
                        initialValues={{
                            name: 'Denise Richardson',
                            email: 'denise.r@example.com',
                            password: 'CorrectHorseBattery99!',
                            password_confirmation: 'DifferentPass123!',
                            terms: true,
                        }}
                        initialErrors={{
                            password_confirmation: "Passwords don't match.",
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Terms unchecked',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Start your return"
                    title="Create your account"
                    lead="It takes a minute. You’ll set up two-factor authentication next to keep your documents safe."
                    switchLine={
                        <>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </>
                    }
                >
                    <SignUpForm
                        initialValues={{
                            name: 'Denise Richardson',
                            email: 'denise.r@example.com',
                            password: 'CorrectHorseBattery99!',
                            password_confirmation: 'CorrectHorseBattery99!',
                            terms: false,
                        }}
                        initialErrors={{
                            terms: 'You must agree to the Terms and Privacy Policy.',
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
        {
            label: 'Prefilled ?tier=hybrid',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Start your return"
                    title="Create your account"
                    lead="It takes a minute. You’ll set up two-factor authentication next to keep your documents safe."
                    switchLine={
                        <>
                            Already have an account?{' '}
                            <Link href="/login?tier=hybrid">Sign in</Link>
                        </>
                    }
                >
                    <SignUpForm
                        tier="hybrid"
                        initialValues={{
                            name: 'Denise Richardson',
                            email: 'denise.r@example.com',
                            password: 'CorrectHorseBattery99!',
                            password_confirmation: 'CorrectHorseBattery99!',
                            terms: true,
                        }}
                    />
                </AuthScreenLayout>
            ),
        },
    ],
});
