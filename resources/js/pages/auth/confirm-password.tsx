import { useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import * as React from 'react';

import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button, Field } from '@/components/primitives';
import { Spinner } from '@/components/ui/spinner';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';
import { store as confirmPasswordStore } from '@/routes/password/confirm';

export interface ConfirmPasswordProps {
    status?: string;
    initialPassword?: string;
    initialErrors?: {
        password?: string;
    };
    isSubmitting?: boolean;
}

export default function ConfirmPassword({
    initialPassword = '',
    initialErrors,
    isSubmitting = false,
}: ConfirmPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: initialPassword,
    });

    const activeErrors = initialErrors ?? errors;
    const effectiveProcessing = processing || isSubmitting;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(confirmPasswordStore.url(), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthScreenLayout
            headTitle="Confirm it’s you — Okojie Online"
            iconTile={<Lock className="size-5" />}
            eyebrow="Secure area"
            title="Confirm it’s you"
            lead="You’re about to change a security setting. Enter your password to continue."
        >
            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                <Field
                    label="Password"
                    htmlFor="password"
                    error={activeErrors.password}
                >
                    <PasswordInput
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        placeholder="Password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoFocus
                        required
                        className="h-11"
                        aria-invalid={Boolean(activeErrors.password)}
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
                            <span>Confirming…</span>
                        </span>
                    ) : (
                        'Confirm password'
                    )}
                </Button>

                <PasskeyVerify
                    routes={{
                        options: confirmOptions(),
                        submit: confirmStore(),
                    }}
                    label="Confirm with a passkey"
                    loadingLabel="Confirming..."
                    separator="or"
                    variant="below"
                />
            </form>
        </AuthScreenLayout>
    );
}
