import { Link } from '@inertiajs/react';
import * as React from 'react';

import { SignInForm, SignUpForm } from '@/components/auth';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';
import { login, register } from '@/routes';

export interface AccessProps {
    mode: 'signin' | 'signup';
    status?: string;
    canResetPassword?: boolean;
    passwordRules?: string;
    tier?: string;
    next?: string;
    ref?: string;
}

export default function AccessPage({
    mode,
    status,
    canResetPassword = true,
    passwordRules,
    tier,
    next,
    ref: refParam,
}: AccessProps) {
    const isSignIn = mode === 'signin';

    const toggleUrl = React.useMemo(() => {
        const routeFn = isSignIn ? register : login;
        const query: Record<string, string> = {};
        if (tier) {
            query.tier = tier;
        }
        if (next) {
            query.next = next;
        }
        if (refParam) {
            query.ref = refParam;
        }
        return routeFn.url(
            Object.keys(query).length > 0 ? { query } : undefined,
        );
    }, [isSignIn, tier, next, refParam]);

    return (
        <AuthScreenLayout
            headTitle={
                isSignIn
                    ? 'Sign in — Okojie Online'
                    : 'Create account — Okojie Online'
            }
            eyebrow={isSignIn ? 'Secure client portal' : 'Start your return'}
            title={
                isSignIn ? 'Sign in to Okojie Online' : 'Create your account'
            }
            lead={
                isSignIn
                    ? 'Upload documents, check your return, e-sign and pay, all in one place.'
                    : 'It takes a minute. You’ll set up two-factor authentication next to keep your documents safe.'
            }
            switchLine={
                isSignIn ? (
                    <>
                        New to Okojie Online?{' '}
                        <Link href={toggleUrl}>Start your return</Link>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <Link href={toggleUrl}>Sign in</Link>
                    </>
                )
            }
        >
            {isSignIn ? (
                <SignInForm
                    status={status}
                    canResetPassword={canResetPassword}
                    tier={tier}
                    next={next}
                    ref={refParam}
                    toggleUrl={toggleUrl}
                />
            ) : (
                <SignUpForm
                    status={status}
                    tier={tier}
                    next={next}
                    ref={refParam}
                    passwordRules={passwordRules}
                    toggleUrl={toggleUrl}
                />
            )}
        </AuthScreenLayout>
    );
}
