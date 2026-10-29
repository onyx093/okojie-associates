import { Link, useForm } from '@inertiajs/react';
import * as React from 'react';

import PasswordInput from '@/components/password-input';
import { Button, Field, Note } from '@/components/primitives';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';
import {
    request as forgotPassword,
    update as updatePassword,
} from '@/routes/password';

export interface ResetPasswordErrors {
    email?: string;
    token?: string;
    password?: string;
    password_confirmation?: string;
}

export interface ResetPasswordProps {
    token: string;
    email: string;
    passwordRules?: string;
    initialValues?: {
        password?: string;
        password_confirmation?: string;
    };
    initialErrors?: ResetPasswordErrors;
    isSubmitting?: boolean;
}

export default function ResetPassword({
    token,
    email,
    passwordRules,
    initialValues,
    initialErrors,
    isSubmitting = false,
}: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token ?? '',
        email: email ?? '',
        password: initialValues?.password ?? '',
        password_confirmation: initialValues?.password_confirmation ?? '',
    });

    const [clientErrors, setClientErrors] = React.useState<ResetPasswordErrors>(
        initialErrors ?? {},
    );

    const activeErrors: ResetPasswordErrors = React.useMemo(
        () => ({
            ...errors,
            ...clientErrors,
        }),
        [errors, clientErrors],
    );

    const clearClientError = (key: keyof ResetPasswordErrors) => {
        if (clientErrors[key]) {
            setClientErrors((prev) => ({ ...prev, [key]: undefined }));
        }
    };

    const effectiveProcessing = processing || isSubmitting;
    const tokenErrorMessage = activeErrors.token || activeErrors.email;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: ResetPasswordErrors = {};

        if (!data.password) {
            newErrors.password = 'Please enter a new password.';
        }

        if (!data.password_confirmation) {
            newErrors.password_confirmation =
                'Please confirm your new password.';
        } else if (data.password !== data.password_confirmation) {
            newErrors.password_confirmation = "Passwords don't match.";
        }

        if (Object.keys(newErrors).length > 0) {
            setClientErrors(newErrors);
            return;
        }

        setClientErrors({});
        post(updatePassword.url(), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthScreenLayout
            headTitle="Choose a new password — Okojie Online"
            eyebrow="Account recovery"
            title="Choose a new password"
            lead="Use at least 12 characters, and don’t reuse a password from another site."
        >
            {tokenErrorMessage && (
                <Note tone="warn" role="alert" className="mb-4">
                    <span>{tokenErrorMessage}</span>{' '}
                    <Link
                        href={forgotPassword.url()}
                        className="font-medium underline hover:text-foreground"
                    >
                        Request a new reset link
                    </Link>
                </Note>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                <input type="hidden" name="token" value={data.token} />

                <Field label="Email address" htmlFor="email">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        readOnly
                        required
                        className="h-11 cursor-not-allowed bg-muted/50"
                        aria-readonly="true"
                    />
                </Field>

                <Field
                    label="New password"
                    htmlFor="password"
                    hint={
                        passwordRules ??
                        'At least 12 characters. A short phrase is easiest to remember.'
                    }
                    error={activeErrors.password}
                >
                    <PasswordInput
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        showStrengthMeter
                        value={data.password}
                        onChange={(e) => {
                            setData('password', e.target.value);
                            clearClientError('password');
                        }}
                        autoFocus
                        required
                        className="h-11"
                        aria-invalid={Boolean(activeErrors.password)}
                    />
                </Field>

                <Field
                    label="Confirm new password"
                    htmlFor="password_confirmation"
                    error={activeErrors.password_confirmation}
                >
                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => {
                            setData('password_confirmation', e.target.value);
                            clearClientError('password_confirmation');
                        }}
                        required
                        className="h-11"
                        aria-invalid={Boolean(
                            activeErrors.password_confirmation,
                        )}
                    />
                </Field>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="mt-2 w-full"
                    disabled={effectiveProcessing}
                >
                    {effectiveProcessing ? (
                        <span className="inline-flex items-center gap-2">
                            <Spinner className="size-4" />
                            <span>Resetting password…</span>
                        </span>
                    ) : (
                        'Reset password'
                    )}
                </Button>
            </form>
        </AuthScreenLayout>
    );
}
