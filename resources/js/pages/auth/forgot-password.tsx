import { Link, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import * as React from 'react';

import { Button, Field, Note } from '@/components/primitives';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';
import { login } from '@/routes';
import { email as passwordEmail } from '@/routes/password';

export interface ForgotPasswordProps {
    status?: string;
    initialEmail?: string;
    initialErrors?: {
        email?: string;
        throttle?: string;
    };
    isSubmitting?: boolean;
    isSent?: boolean;
}

export default function ForgotPassword({
    status,
    initialEmail = '',
    initialErrors,
    isSubmitting = false,
    isSent = false,
}: ForgotPasswordProps) {
    const [submittedEmail, setSubmittedEmail] = React.useState(initialEmail);
    const { data, setData, post, processing, errors, transform } = useForm({
        email: initialEmail,
    });

    const activeErrors = initialErrors ?? errors;
    const effectiveProcessing = processing || isSubmitting;
    const showSentState = isSent || Boolean(status);
    const displayEmail = submittedEmail || data.email || 'your email';

    const errorMessage =
        activeErrors.email ||
        (activeErrors as Record<string, string | undefined>).throttle;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittedEmail(data.email);
        post(passwordEmail.url());
    };

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        transform((currentData) => ({
            ...currentData,
            email: displayEmail,
        }));
        post(passwordEmail.url(), {
            preserveScroll: true,
        });
    };

    if (showSentState) {
        return (
            <AuthScreenLayout
                headTitle="Check your email — Okojie Online"
                iconTile={<Mail className="size-5" />}
                title="Check your email"
                lead={
                    <>
                        If an account exists for{' '}
                        <strong className="font-medium text-foreground">
                            {displayEmail}
                        </strong>
                        , a reset link is on its way. It expires in 60 minutes.
                    </>
                }
            >
                {/* Note: Expiration wording aligns with Laravel's config('auth.passwords.users.expire') = 60 minutes */}
                {status && (
                    <Note tone="ok" role="status" className="mb-6">
                        {status}
                    </Note>
                )}

                <form onSubmit={handleResend} className="grid gap-3" noValidate>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={effectiveProcessing}
                    >
                        {effectiveProcessing ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                <span>Sending…</span>
                            </span>
                        ) : (
                            'Send again'
                        )}
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className="w-full text-muted-foreground hover:text-foreground"
                    >
                        <Link href={login.url()}>Back to sign in</Link>
                    </Button>
                </form>
            </AuthScreenLayout>
        );
    }

    return (
        <AuthScreenLayout
            headTitle="Reset password — Okojie Online"
            eyebrow="Account recovery"
            title="Forgot your password?"
            lead="Enter your email and we’ll send you a link to choose a new one."
            switchLine={
                <>
                    Remembered it?{' '}
                    <Link
                        href={login.url()}
                        className="font-medium text-brand hover:underline"
                    >
                        Back to sign in
                    </Link>
                </>
            }
        >
            {errorMessage && (
                <Note tone="warn" role="alert" className="mb-4">
                    {errorMessage}
                </Note>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                <Field
                    label="Email address"
                    htmlFor="email"
                    error={activeErrors.email}
                >
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoFocus
                        required
                        className="h-11"
                        aria-invalid={Boolean(activeErrors.email)}
                    />
                </Field>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={effectiveProcessing}
                >
                    {effectiveProcessing ? (
                        <span className="inline-flex items-center gap-2">
                            <Spinner className="size-4" />
                            <span>Sending reset link…</span>
                        </span>
                    ) : (
                        'Send reset link'
                    )}
                </Button>
            </form>
        </AuthScreenLayout>
    );
}
