import { useForm } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { Button, Field } from '@/components/primitives';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';
import { store } from '@/routes/two-factor/login';

export interface TwoFactorChallengeProps {
    initialRecovery?: boolean;
    initialCode?: string;
    initialRecoveryCode?: string;
    initialErrors?: {
        code?: string;
        recovery_code?: string;
    };
    isSubmitting?: boolean;
}

export default function TwoFactorChallenge({
    initialRecovery = false,
    initialCode = '',
    initialRecoveryCode = '',
    initialErrors,
    isSubmitting,
}: TwoFactorChallengeProps) {
    const [isRecovery, setIsRecovery] =
        React.useState<boolean>(initialRecovery);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
        reset,
        transform,
    } = useForm({
        code: initialCode,
        recovery_code: initialRecoveryCode,
    });

    const effectiveProcessing = processing || Boolean(isSubmitting);
    const activeErrors = React.useMemo(
        () => ({
            ...errors,
            ...initialErrors,
        }),
        [errors, initialErrors],
    );

    const switchToRecovery = () => {
        setIsRecovery(true);
        clearErrors();
        setData({ code: '', recovery_code: '' });
    };

    const switchToCode = () => {
        setIsRecovery(false);
        clearErrors();
        setData({ code: '', recovery_code: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((formData) =>
            isRecovery
                ? { recovery_code: formData.recovery_code }
                : { code: formData.code },
        );

        post(store.url(), {
            onFinish: () => {
                if (isRecovery) {
                    reset('recovery_code');
                } else {
                    reset('code');
                }
            },
        });
    };

    return (
        <AuthScreenLayout
            headTitle="Two-factor authentication — Okojie Online"
            iconTile={<ShieldCheck className="size-5" />}
            title={
                isRecovery ? 'Use a recovery code' : 'Enter your 6-digit code'
            }
            lead={
                isRecovery
                    ? 'Enter one of the recovery codes you saved when you set up two-factor authentication. Each code works once.'
                    : 'Open your authenticator app and type the code for Okojie Online.'
            }
            switchLine={
                isRecovery ? (
                    <button
                        type="button"
                        onClick={switchToCode}
                        className="cursor-pointer font-medium text-brand hover:underline"
                    >
                        Use your authenticator app instead
                    </button>
                ) : (
                    <span>
                        Lost your phone?{' '}
                        <button
                            type="button"
                            onClick={switchToRecovery}
                            className="cursor-pointer font-medium text-brand hover:underline"
                        >
                            Use a recovery code
                        </button>
                    </span>
                )
            }
        >
            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                {isRecovery ? (
                    <Field
                        label="Recovery code"
                        htmlFor="recovery_code"
                        error={activeErrors.recovery_code}
                    >
                        <Input
                            id="recovery_code"
                            name="recovery_code"
                            type="text"
                            autoComplete="one-time-code"
                            placeholder="XXXX-XXXX"
                            value={data.recovery_code}
                            onChange={(e) =>
                                setData('recovery_code', e.target.value)
                            }
                            required
                            autoFocus
                            className="h-11 font-mono tracking-[0.06em]"
                            aria-invalid={Boolean(activeErrors.recovery_code)}
                            aria-describedby={
                                activeErrors.recovery_code
                                    ? 'recovery_code-error'
                                    : undefined
                            }
                        />
                    </Field>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <InputOTP
                            id="code"
                            name="code"
                            maxLength={6}
                            value={data.code}
                            onChange={(val) => setData('code', val)}
                            disabled={effectiveProcessing}
                            pattern={REGEXP_ONLY_DIGITS}
                            autoFocus
                            aria-label="Six-digit authentication code"
                            aria-invalid={Boolean(activeErrors.code)}
                            aria-describedby={
                                activeErrors.code ? 'code-error' : undefined
                            }
                        >
                            <InputOTPGroup className="justify-center gap-2">
                                {Array.from({ length: 6 }, (_, index) => (
                                    <InputOTPSlot key={index} index={index} />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                        {activeErrors.code && (
                            <div
                                id="code-error"
                                role="alert"
                                aria-live="polite"
                                className="w-full text-center"
                            >
                                <p className="text-[13px] text-danger">
                                    {activeErrors.code}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    block
                    disabled={effectiveProcessing}
                    className="mt-1 h-11 text-sm font-medium"
                >
                    {effectiveProcessing && <Spinner className="mr-2 size-4" />}
                    {effectiveProcessing ? 'Verifying…' : 'Continue'}
                </Button>
            </form>
        </AuthScreenLayout>
    );
}
