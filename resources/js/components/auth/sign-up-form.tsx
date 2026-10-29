import { Link, useForm } from '@inertiajs/react';
import * as React from 'react';

import PasswordInput from '@/components/password-input';
import { Button, Field, Note } from '@/components/primitives';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { privacy, register, terms } from '@/routes';

export interface SignUpFormValues {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    terms?: boolean;
}

export interface SignUpFormErrors {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    terms?: string;
}

export interface SignUpFormProps {
    status?: string;
    tier?: string;
    next?: string;
    ref?: string;
    passwordRules?: string;
    toggleUrl?: string;
    turnstileToken?: string;
    initialValues?: SignUpFormValues;
    initialErrors?: SignUpFormErrors;
}

export function SignUpForm({
    status,
    tier,
    next: _next,
    ref: refParam,
    passwordRules,
    turnstileToken,
    initialValues,
    initialErrors,
}: SignUpFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: initialValues?.name ?? '',
        email: initialValues?.email ?? '',
        password: initialValues?.password ?? '',
        tier: tier ?? '',
        ref: refParam ?? '',
        ...(turnstileToken ? { 'cf-turnstile-response': turnstileToken } : {}),
    });

    const [passwordConfirmation, setPasswordConfirmation] =
        React.useState<string>(initialValues?.password_confirmation ?? '');
    const [termsAccepted, setTermsAccepted] = React.useState<boolean>(
        Boolean(initialValues?.terms),
    );
    const [clientErrors, setClientErrors] = React.useState<SignUpFormErrors>(
        initialErrors ?? {},
    );

    const activeErrors: SignUpFormErrors = React.useMemo(
        () => ({
            ...errors,
            ...clientErrors,
        }),
        [errors, clientErrors],
    );

    const clearClientError = (key: keyof SignUpFormErrors) => {
        if (clientErrors[key]) {
            setClientErrors((prev) => ({ ...prev, [key]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: SignUpFormErrors = {};

        if (!data.name.trim()) {
            newErrors.name = 'Please enter your full name.';
        }

        if (!data.email.trim()) {
            newErrors.email = 'Please enter your email address.';
        }

        if (!data.password) {
            newErrors.password = 'Please enter a password.';
        }

        if (!passwordConfirmation) {
            newErrors.password_confirmation = 'Please confirm your password.';
        } else if (data.password !== passwordConfirmation) {
            newErrors.password_confirmation = "Passwords don't match.";
        }

        if (!termsAccepted) {
            newErrors.terms = 'You must agree to the Terms and Privacy Policy.';
        }

        if (Object.keys(newErrors).length > 0) {
            setClientErrors(newErrors);
            return;
        }

        setClientErrors({});
        post(register.url(), {
            onFinish: () => {
                reset('password');
                setPasswordConfirmation('');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
            {status && (
                <Note tone="ok" className="mb-2">
                    {status}
                </Note>
            )}

            <Field label="Full name" htmlFor="name" error={activeErrors.name}>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="As it appears on your tax return"
                    value={data.name}
                    onChange={(e) => {
                        setData('name', e.target.value);
                        clearClientError('name');
                    }}
                    autoFocus
                    required
                    className="h-11"
                    aria-invalid={Boolean(activeErrors.name)}
                />
            </Field>

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
                    onChange={(e) => {
                        setData('email', e.target.value);
                        clearClientError('email');
                    }}
                    required
                    className="h-11"
                    aria-invalid={Boolean(activeErrors.email)}
                />
            </Field>

            <Field
                label="Password"
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
                    required
                    className="h-11"
                    aria-invalid={Boolean(activeErrors.password)}
                />
            </Field>

            <Field
                label="Confirm password"
                htmlFor="password_confirmation"
                error={activeErrors.password_confirmation}
            >
                <PasswordInput
                    id="password_confirmation"
                    name="password_confirmation"
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(e) => {
                        setPasswordConfirmation(e.target.value);
                        clearClientError('password_confirmation');
                    }}
                    required
                    className="h-11"
                    aria-invalid={Boolean(activeErrors.password_confirmation)}
                />
            </Field>

            <div className="grid gap-1.5 pt-0.5 pb-1">
                <label className="flex cursor-pointer items-start gap-2.5 text-[13.5px] text-fg-2 select-none">
                    <Checkbox
                        id="terms"
                        name="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => {
                            const isChecked = Boolean(checked);
                            setTermsAccepted(isChecked);
                            if (isChecked) {
                                clearClientError('terms');
                            }
                        }}
                        aria-invalid={Boolean(activeErrors.terms)}
                        aria-describedby={
                            activeErrors.terms ? 'terms-error' : undefined
                        }
                        className="mt-0.5"
                    />
                    <span className="leading-snug">
                        I agree to the{' '}
                        <Link
                            href={terms.url()}
                            className="font-medium text-brand underline-offset-4 hover:underline"
                        >
                            Terms
                        </Link>{' '}
                        and{' '}
                        <Link
                            href={privacy.url()}
                            className="font-medium text-brand underline-offset-4 hover:underline"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </span>
                </label>
                {activeErrors.terms && (
                    <p
                        id="terms-error"
                        className="text-[12.5px] leading-snug text-danger"
                        role="alert"
                    >
                        {activeErrors.terms}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                block
                disabled={processing}
                className="mt-1 h-11 text-sm font-medium"
            >
                {processing && <Spinner className="mr-2 size-4" />}
                {processing ? 'Creating account…' : 'Create account'}
            </Button>
        </form>
    );
}

export default SignUpForm;
