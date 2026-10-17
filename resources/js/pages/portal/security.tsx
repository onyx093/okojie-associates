import { Head, router, useForm } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
    AlertTriangle,
    Check,
    Copy,
    KeyRound,
    RefreshCw,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH, useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { PortalLayout } from '@/layouts/portal-layout';
import { cn } from '@/lib/utils';

interface SecurityProps {
    twoFactorEnabled: boolean;
    twoFactorConfirmed: boolean;
    hasSecret: boolean;
    passwordRules: string;
    status?: string | null;
    error?: string | null;
}

export default function PortalSecurity({
    twoFactorEnabled,
    twoFactorConfirmed,
    hasSecret,
    passwordRules,
}: SecurityProps) {
    const {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        fetchSetupData,
        fetchRecoveryCodes,
        clearTwoFactorAuthData,
    } = useTwoFactorAuth();

    const [copiedKey, copyKey] = useClipboard();
    const [copiedCodes, copyCodes] = useClipboard();
    const [showingRecoveryCodes, setShowingRecoveryCodes] =
        React.useState<boolean>(false);
    const [isFetchingCodes, setIsFetchingCodes] =
        React.useState<boolean>(false);

    // Fetch QR code & secret key when setup is active but unconfirmed
    React.useEffect(() => {
        if (hasSecret && !twoFactorConfirmed) {
            fetchSetupData();
        }
    }, [hasSecret, twoFactorConfirmed, fetchSetupData]);

    // OTP confirmation form
    const otpForm = useForm({
        code: '',
    });

    // Password change form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleEnable2FA = () => {
        router.post(
            '/user/two-factor-authentication',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Two-factor authentication initiated. Scan your QR code.');
                    fetchSetupData();
                },
                onError: () => {
                    toast.error('Failed to initiate two-factor setup.');
                },
            }
        );
    };

    const handleConfirmOTP = (e: React.FormEvent) => {
        e.preventDefault();
        otpForm.post('/user/confirmed-two-factor-authentication', {
            preserveScroll: true,
            onSuccess: () => {
                otpForm.reset();
                toast.success('Two-factor authentication confirmed and enabled!');
                clearTwoFactorAuthData();
            },
            onError: (errs) => {
                if (errs.code) {
                    toast.error(errs.code);
                }
            },
        });
    };

    const handleCancelSetup = () => {
        router.delete('/user/two-factor-authentication', {
            preserveScroll: true,
            onSuccess: () => {
                clearTwoFactorAuthData();
                otpForm.reset();
                toast.info('Two-factor setup cancelled.');
            },
        });
    };

    const handleDisable2FA = () => {
        if (
            window.confirm(
                'Are you sure you want to disable two-factor authentication? Client accounts require MFA for portal access.'
            )
        ) {
            router.delete('/user/two-factor-authentication', {
                preserveScroll: true,
                onSuccess: () => {
                    clearTwoFactorAuthData();
                    setShowingRecoveryCodes(false);
                    toast.info('Two-factor authentication disabled.');
                },
            });
        }
    };

    const handleViewRecoveryCodes = async () => {
        setIsFetchingCodes(true);
        try {
            await fetchRecoveryCodes();
            setShowingRecoveryCodes(true);
        } finally {
            setIsFetchingCodes(false);
        }
    };

    const handleRegenerateRecoveryCodes = () => {
        router.post(
            '/user/two-factor-recovery-codes',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    fetchRecoveryCodes();
                    toast.success('Recovery codes regenerated.');
                },
            }
        );
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/user/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                toast.success('Password updated successfully.');
            },
        });
    };

    return (
        <PortalLayout>
            <Head title="Client Portal — Security & MFA | Okojie Online" />

            <div className="mx-auto max-w-3xl space-y-8">
                {/* Notice banner if 2FA is not yet active */}
                {!twoFactorConfirmed && (
                    <div className="flex items-start gap-3 rounded-[18px] border border-warning/40 bg-warning/10 p-5 text-warning-foreground">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                        <div>
                            <h3 className="font-semibold text-foreground">
                                Two-factor authentication required
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                To protect your sensitive tax documents, IRS guidance requires every client account to enable multi-factor authentication (MFA). Please complete enrollment below to access the full portal.
                            </p>
                        </div>
                    </div>
                )}

                {/* 2FA Management Card */}
                <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                {twoFactorConfirmed ? (
                                    <ShieldCheck className="h-5 w-5 text-success" />
                                ) : (
                                    <ShieldAlert className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    Two-Factor Authentication
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Secure your account using a time-based one-time password (TOTP).
                                </p>
                            </div>
                        </div>
                        <div>
                            {twoFactorConfirmed ? (
                                <Badge variant="success" className="px-3 py-1">
                                    Active & Enforced
                                </Badge>
                            ) : (
                                <Badge variant="warning" className="px-3 py-1">
                                    Setup Required
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 border-t border-border pt-6">
                        {twoFactorConfirmed ? (
                            /* State 1: 2FA is active */
                            <div className="space-y-6">
                                <p className="text-sm text-muted-foreground">
                                    Two-factor authentication is active on your account. You will be prompted for a 6-digit code from your authenticator app whenever you sign in.
                                </p>

                                {/* Recovery Codes Section */}
                                <div className="rounded-[14px] border border-border bg-secondary/40 p-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <KeyRound className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold text-foreground">
                                                Emergency Recovery Codes
                                            </h3>
                                        </div>
                                    </div>
                                    <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                                        Keep these recovery codes in a secure password manager. If you lose access to your authenticator app, each code can be used once to sign in.
                                    </p>

                                    {showingRecoveryCodes && recoveryCodesList.length > 0 ? (
                                        <div className="mt-4 space-y-4">
                                            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background p-4 sm:grid-cols-4">
                                                {recoveryCodesList.map((code) => (
                                                    <span
                                                        key={code}
                                                        className="font-mono text-xs text-foreground select-all"
                                                    >
                                                        {code}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        copyCodes(recoveryCodesList.join('\n'))
                                                    }
                                                    className="rounded-full text-xs"
                                                >
                                                    {copiedCodes === recoveryCodesList.join('\n') ? (
                                                        <>
                                                            <Check className="mr-1.5 h-3.5 w-3.5 text-success" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                                                            Copy all codes
                                                        </>
                                                    )}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRegenerateRecoveryCodes}
                                                    className="rounded-full text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                                                    Regenerate codes
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={isFetchingCodes}
                                                onClick={handleViewRecoveryCodes}
                                                className="rounded-full text-xs"
                                            >
                                                {isFetchingCodes ? (
                                                    <Spinner className="mr-1.5 h-3.5 w-3.5" />
                                                ) : (
                                                    <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                                                )}
                                                View recovery codes
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDisable2FA}
                                        className="rounded-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        Disable two-factor authentication
                                    </Button>
                                </div>
                            </div>
                        ) : !hasSecret ? (
                            /* State 2: 2FA not yet initiated */
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    When you enable two-factor authentication, you will scan a QR code using an authenticator app (such as Google Authenticator, Microsoft Authenticator, 1Password, or Apple Passwords).
                                </p>
                                <div>
                                    <Button
                                        type="button"
                                        onClick={handleEnable2FA}
                                        className="rounded-full px-6 py-2.5 font-semibold"
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Enable Two-Factor Authentication
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* State 3: Secret initiated, awaiting confirmation code */
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground">
                                        Step 1: Scan QR code
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Open your authenticator app and scan the QR code below, or manually enter the setup key.
                                    </p>
                                </div>

                                {/* QR Code box */}
                                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-secondary/30 p-6 sm:flex-row sm:items-start sm:justify-start">
                                    <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-2">
                                        {qrCodeSvg ? (
                                            <div
                                                className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
                                                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                                            />
                                        ) : (
                                            <Spinner />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2 text-center sm:text-left">
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                            Manual setup key
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <code className="rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-foreground select-all">
                                                {manualSetupKey || 'Loading setup key...'}
                                            </code>
                                            {manualSetupKey && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyKey(manualSetupKey)}
                                                    className="h-8 rounded-full px-2.5 text-xs"
                                                >
                                                    {copiedKey === manualSetupKey ? (
                                                        <Check className="h-3.5 w-3.5 text-success" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            If your device cannot scan the code, enter this key manually into your authenticator app.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <h3 className="font-semibold text-foreground">
                                        Step 2: Enter 6-digit confirmation code
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Enter the 6-digit code shown in your authenticator app to complete setup.
                                    </p>

                                    <form onSubmit={handleConfirmOTP} className="space-y-4">
                                        <div className="flex justify-center sm:justify-start">
                                            <InputOTP
                                                name="code"
                                                maxLength={OTP_MAX_LENGTH}
                                                value={otpForm.data.code}
                                                onChange={(val) => otpForm.setData('code', val)}
                                                disabled={otpForm.processing}
                                                pattern={REGEXP_ONLY_DIGITS}
                                                autoFocus
                                            >
                                                <InputOTPGroup>
                                                    {Array.from({ length: OTP_MAX_LENGTH }, (_, i) => (
                                                        <InputOTPSlot key={i} index={i} />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>

                                        <InputError message={otpForm.errors.code} />

                                        <div className="flex items-center gap-3 pt-2">
                                            <Button
                                                type="submit"
                                                disabled={
                                                    otpForm.processing ||
                                                    otpForm.data.code.length !== OTP_MAX_LENGTH
                                                }
                                                className="rounded-full px-6 py-2.5 font-semibold"
                                            >
                                                {otpForm.processing ? (
                                                    <Spinner className="mr-2 h-4 w-4" />
                                                ) : (
                                                    <Check className="mr-2 h-4 w-4" />
                                                )}
                                                Confirm & Activate MFA
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={handleCancelSetup}
                                                disabled={otpForm.processing}
                                                className="rounded-full text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Password Change Card */}
                <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            Update Password
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ensure your account is using a long, random password (at least 12 characters) to stay secure.
                        </p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="current_password">Current password</Label>
                            <PasswordInput
                                id="current_password"
                                name="current_password"
                                value={passwordForm.data.current_password}
                                onChange={(e) =>
                                    passwordForm.setData('current_password', e.target.value)
                                }
                                autoComplete="current-password"
                                placeholder="Current password"
                                className="bg-secondary/50"
                            />
                            <InputError message={passwordForm.errors.current_password} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="new_password">New password</Label>
                            <PasswordInput
                                id="new_password"
                                name="password"
                                value={passwordForm.data.password}
                                onChange={(e) =>
                                    passwordForm.setData('password', e.target.value)
                                }
                                autoComplete="new-password"
                                placeholder="New password (min 12 characters)"
                                className="bg-secondary/50"
                            />
                            <InputError message={passwordForm.errors.password} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        'password_confirmation',
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                                placeholder="Confirm new password"
                                className="bg-secondary/50"
                            />
                            <InputError message={passwordForm.errors.password_confirmation} />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="rounded-full px-6 py-2.5 font-semibold"
                            >
                                {passwordForm.processing ? (
                                    <Spinner className="mr-2 h-4 w-4" />
                                ) : null}
                                Update Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </PortalLayout>
    );
}
