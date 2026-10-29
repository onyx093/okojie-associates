import { Link, useForm } from '@inertiajs/react';
import * as React from 'react';

import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button, Field, Note } from '@/components/primitives';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { request as forgotPassword } from '@/routes/password';

export interface SignInFormProps {
    status?: string;
    canResetPassword?: boolean;
    tier?: string;
    next?: string;
    ref?: string;
    toggleUrl?: string;
    initialValues?: {
        email?: string;
        password?: string;
        remember?: boolean;
    };
    initialErrors?: {
        email?: string;
        password?: string;
        throttle?: string;
    };
    isSubmitting?: boolean;
}

export function SignInForm({
    status,
    canResetPassword = true,
    tier,
    next,
    ref: refParam,
    initialValues,
    initialErrors,
    isSubmitting = false,
}: SignInFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: initialValues?.email ?? '',
        password: initialValues?.password ?? '',
        remember: initialValues?.remember ?? true,
        tier: tier || '',
        next: next || '',
        ref: refParam || '',
    });

    const activeErrors = initialErrors ?? errors;
    const activeProcessing = processing || isSubmitting;

    const errorMessage =
        activeErrors.email ||
        activeErrors.password ||
        (activeErrors as Record<string, string | undefined>).throttle;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(login.url(), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
            {status && (
                <Note tone="ok" className="mb-2">
                    {status}
                </Note>
            )}

            {errorMessage && (
                <Note
                    id="signin-error"
                    tone="warn"
                    role="alert"
                    className="mb-2"
                >
                    {errorMessage}
                </Note>
            )}

            <Field label="Email address" htmlFor="email">
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
                    aria-describedby={errorMessage ? 'signin-error' : undefined}
                />
            </Field>

            <Field
                label="Password"
                htmlFor="password"
                labelRight={
                    canResetPassword ? (
                        <Link
                            href={forgotPassword.url()}
                            className="text-[13px] font-medium text-brand hover:underline"
                        >
                            Forgot password?
                        </Link>
                    ) : undefined
                }
            >
                <PasswordInput
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                    className="h-11"
                    aria-invalid={Boolean(
                        activeErrors.password || activeErrors.email,
                    )}
                    aria-describedby={errorMessage ? 'signin-error' : undefined}
                />
            </Field>

            <div className="flex items-center gap-2.5 pt-0.5 pb-1">
                <Checkbox
                    id="remember"
                    name="remember"
                    checked={data.remember}
                    onCheckedChange={(val) => setData('remember', val === true)}
                />
                <label
                    htmlFor="remember"
                    className="cursor-pointer text-sm text-foreground select-none"
                >
                    Keep me signed in on this device
                </label>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                block
                disabled={activeProcessing}
                className="h-11 text-sm font-medium"
            >
                {activeProcessing && <Spinner className="mr-2 size-4" />}
                {activeProcessing ? 'Signing in…' : 'Sign in'}
            </Button>

            <PasskeyVerify variant="below" />
        </form>
    );
}

export default SignInForm;
