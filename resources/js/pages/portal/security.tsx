import { Head, router, useForm } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
    Check,
    Copy,
    Key,
    KeyRound,
    RefreshCw,
    Shield,
    ShieldCheck,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/primitives/button';
import { Chip } from '@/components/primitives/chip';
import { Note } from '@/components/primitives/empty-state';
import { Inner, Shell, ShellHead } from '@/components/primitives/shell';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH, useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import {
    confirm as confirmTwoFactor,
    disable as disableTwoFactor,
    enable as enableTwoFactor,
    regenerateRecoveryCodes,
} from '@/routes/two-factor';
import { update as updatePassword } from '@/routes/user-password';

export interface SecurityProps {
    twoFactorEnabled: boolean;
    twoFactorConfirmed: boolean;
    hasSecret: boolean;
    passwordRules: string;
    passwordChangedAt?: string | null;
    status?: string | null;
    error?: string | null;
}

function formatRelativeTime(dateString?: string | null): string | null {
    if (!dateString) {
        return null;
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSeconds < 60) {
        return 'Changed just now';
    }
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
        return `Changed ${diffMinutes}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `Changed ${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
        return `Changed ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
        return `Changed ${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    }
    const diffYears = Math.floor(diffMonths / 12);
    return `Changed ${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}

interface TwoFactorOffProps {
    onSetup: () => void;
    processing?: boolean;
}

function TwoFactorOff({ onSetup, processing }: TwoFactorOffProps) {
    return (
        <div>
            <p className="text-[14.5px] leading-relaxed text-fg-2">
                Each time you sign in, you’ll enter a 6-digit code from an
                authenticator app on your phone, so nobody can get in with just
                your password.
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
                <Chip tone="neutral">Google Authenticator</Chip>
                <Chip tone="neutral">Microsoft Authenticator</Chip>
                <Chip tone="neutral">1Password</Chip>
                <Chip tone="neutral">Apple Passwords</Chip>
            </div>
            <Button
                type="button"
                variant="primary"
                onClick={onSetup}
                disabled={processing}
                className="mt-5"
            >
                {processing
                    ? 'Initiating…'
                    : 'Set up two-factor authentication'}
            </Button>
        </div>
    );
}

interface TwoFactorSetupProps {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    otpCode: string;
    onOtpChange: (val: string) => void;
    onSubmitOtp: (e: React.FormEvent) => void;
    onCancel: () => void;
    processing: boolean;
    errorMessage?: string;
}

function TwoFactorSetup({
    qrCodeSvg,
    manualSetupKey,
    otpCode,
    onOtpChange,
    onSubmitOtp,
    onCancel,
    processing,
    errorMessage,
}: TwoFactorSetupProps) {
    const [, copy] = useClipboard();
    const [copiedKey, setCopiedKey] = React.useState(false);

    const handleCopyKey = async () => {
        if (!manualSetupKey) {
            return;
        }
        const ok = await copy(manualSetupKey);
        if (ok) {
            setCopiedKey(true);
            toast.success('Setup key copied');
            setTimeout(() => setCopiedKey(false), 2000);
        }
    };

    const formattedKey = React.useMemo(() => {
        if (!manualSetupKey) {
            return '';
        }
        return manualSetupKey.match(/.{1,4}/g)?.join(' ') ?? manualSetupKey;
    }, [manualSetupKey]);

    return (
        <div className="grid grid-cols-[176px_1fr] items-start gap-6 max-sm:grid-cols-1">
            {/* QR Box */}
            <div
                className="grid size-[176px] place-items-center rounded-[14px] bg-white p-3 shadow-chip max-sm:mx-auto"
                aria-label="QR code for your authenticator app"
                role="img"
            >
                {qrCodeSvg ? (
                    <div
                        className="size-full [&_svg]:size-full"
                        dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                    />
                ) : (
                    <Spinner />
                )}
            </div>

            {/* Steps & Inputs */}
            <div>
                <p className="text-[14.5px] font-medium text-foreground">
                    1. Scan the QR code
                </p>
                <p className="mt-0.5 text-[13.5px] text-fg-3">
                    Open your authenticator app and scan it. Can’t scan? Enter
                    this key instead.
                </p>

                {/* Key box */}
                <div className="mt-2.5 flex items-center gap-2 rounded-[10px] bg-sunken py-1.5 pr-1.5 pl-3 font-mono text-[13px] tracking-wide text-foreground shadow-[inset_0_0_0_1px_var(--border)]">
                    <span className="min-w-0 flex-1 truncate select-all">
                        {formattedKey || 'Loading setup key…'}
                    </span>
                    {manualSetupKey && (
                        <button
                            type="button"
                            onClick={handleCopyKey}
                            aria-label="Copy setup key"
                            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-fg-3 transition-colors hover:bg-card hover:text-foreground active:scale-95"
                        >
                            {copiedKey ? (
                                <Check className="size-3.5 text-emerald-600" />
                            ) : (
                                <Copy className="size-3.5" />
                            )}
                        </button>
                    )}
                </div>

                <p className="mt-5 text-[14.5px] font-medium text-foreground">
                    2. Enter the 6-digit code
                </p>
                <p className="mt-0.5 text-[13.5px] text-fg-3">
                    Type the code your app shows right now.
                </p>

                <form onSubmit={onSubmitOtp} className="mt-2.5 space-y-4">
                    <div className="flex justify-start">
                        <InputOTP
                            name="code"
                            maxLength={OTP_MAX_LENGTH}
                            value={otpCode}
                            onChange={onOtpChange}
                            disabled={processing}
                            pattern={REGEXP_ONLY_DIGITS}
                            autoFocus
                        >
                            <InputOTPGroup className="gap-2">
                                {Array.from(
                                    { length: OTP_MAX_LENGTH },
                                    (_, index) => (
                                        <InputOTPSlot
                                            key={index}
                                            index={index}
                                            className="h-[52px] w-[46px] font-mono text-xl max-sm:h-[48px] max-sm:w-[40px]"
                                        />
                                    ),
                                )}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {errorMessage && (
                        <p className="text-xs text-danger">{errorMessage}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={
                                processing || otpCode.length < OTP_MAX_LENGTH
                            }
                        >
                            {processing ? (
                                <>
                                    <Spinner className="mr-1.5 size-4" />
                                    <span>Activating…</span>
                                </>
                            ) : (
                                'Turn on 2FA'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            disabled={processing}
                            className="text-fg-3 hover:text-foreground"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface TwoFactorOnProps {
    recoveryCodesList: string[];
    onCopyCodes: () => void;
    copiedCodes: boolean;
    onRegenerateCodes: () => void;
    onViewCodes: () => void;
    isFetchingCodes: boolean;
    onDisable: () => void;
}

function TwoFactorOn({
    recoveryCodesList,
    onCopyCodes,
    copiedCodes,
    onRegenerateCodes,
    onViewCodes,
    isFetchingCodes,
    onDisable,
}: TwoFactorOnProps) {
    return (
        <div>
            {/* Success header */}
            <div className="flex items-center gap-3.5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success shadow-chip">
                    <ShieldCheck className="size-5" strokeWidth={1.9} />
                </span>
                <div>
                    <b className="block text-[15px] font-medium text-foreground">
                        Two-factor authentication is on
                    </b>
                    <small className="mt-0.5 block text-[13.5px] text-fg-3">
                        You’ll enter a code from your authenticator app each
                        time you sign in.
                    </small>
                </div>
            </div>

            <Separator className="my-5" />

            {/* Recovery codes */}
            <p className="text-[14.5px] font-medium text-foreground">
                Recovery codes
            </p>
            <p className="mt-0.5 text-[13.5px] text-fg-3">
                If you lose your phone, each code signs you in once. Keep them
                in a password manager.
            </p>

            {recoveryCodesList.length > 0 ? (
                <>
                    <div
                        className="mt-3.5 grid grid-cols-2 gap-1.5 rounded-xl bg-sunken p-3.5 font-mono text-[13.5px] tracking-wide text-foreground shadow-[inset_0_0_0_1px_var(--border)] max-sm:grid-cols-1"
                        role="list"
                        aria-label="Recovery codes"
                    >
                        {recoveryCodesList.map((code) => (
                            <span key={code} className="select-all">
                                {code}
                            </span>
                        ))}
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCopyCodes}
                            className="gap-1.5"
                        >
                            {copiedCodes ? (
                                <Check className="size-4 text-emerald-600" />
                            ) : (
                                <Copy className="size-4 text-fg-3" />
                            )}
                            <span>{copiedCodes ? 'Copied' : 'Copy codes'}</span>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onRegenerateCodes}
                            className="gap-1.5 text-fg-3 hover:text-foreground"
                        >
                            <RefreshCw className="size-4" />
                            <span>Create new codes</span>
                        </Button>
                    </div>
                </>
            ) : (
                <div className="mt-3.5">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onViewCodes}
                        disabled={isFetchingCodes}
                        className="gap-1.5"
                    >
                        {isFetchingCodes ? (
                            <Spinner className="size-4" />
                        ) : (
                            <KeyRound className="size-4 text-fg-3" />
                        )}
                        <span>View recovery codes</span>
                    </Button>
                </div>
            )}

            <Separator className="my-5" />

            {/* Turn off 2FA */}
            <Button
                type="button"
                variant="danger-ghost"
                onClick={onDisable}
                className="-ml-2.5 px-2.5 text-danger hover:bg-danger-soft"
            >
                Turn off two-factor authentication
            </Button>
            <p className="mt-1 text-xs text-fg-3">
                Client accounts need 2FA to use the portal, so you’ll be asked
                to set it up again.
            </p>
        </div>
    );
}

interface PasswordFormProps {
    currentPasswordValue: string;
    newPasswordValue: string;
    confirmPasswordValue: string;
    onCurrentPasswordChange: (val: string) => void;
    onNewPasswordChange: (val: string) => void;
    onConfirmPasswordChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    errors: {
        current_password?: string;
        password?: string;
        password_confirmation?: string;
    };
}

function PasswordForm({
    currentPasswordValue,
    newPasswordValue,
    confirmPasswordValue,
    onCurrentPasswordChange,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    processing,
    errors,
}: PasswordFormProps) {
    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <p className="text-[14px] leading-relaxed text-fg-2">
                Use a long password you don’t use anywhere else: at least 12
                characters.
            </p>

            <div className="grid gap-1.5">
                <label
                    htmlFor="cur"
                    className="text-[13px] font-medium text-foreground"
                >
                    Current password
                </label>
                <PasswordInput
                    id="cur"
                    name="current_password"
                    autoComplete="current-password"
                    value={currentPasswordValue}
                    onChange={(e) => onCurrentPasswordChange(e.target.value)}
                    required
                />
                <InputError message={errors.current_password} />
            </div>

            <div className="grid gap-1.5">
                <label
                    htmlFor="new"
                    className="text-[13px] font-medium text-foreground"
                >
                    New password
                </label>
                <PasswordInput
                    id="new"
                    name="password"
                    autoComplete="new-password"
                    showStrengthMeter
                    value={newPasswordValue}
                    onChange={(e) => onNewPasswordChange(e.target.value)}
                    required
                />
                <InputError message={errors.password} />
            </div>

            <div className="grid gap-1.5">
                <label
                    htmlFor="conf"
                    className="text-[13px] font-medium text-foreground"
                >
                    Confirm new password
                </label>
                <PasswordInput
                    id="conf"
                    name="password_confirmation"
                    autoComplete="new-password"
                    value={confirmPasswordValue}
                    onChange={(e) => onConfirmPasswordChange(e.target.value)}
                    required
                />
                <InputError message={errors.password_confirmation} />
            </div>

            <div className="flex items-center justify-between pt-1">
                <span />
                <Button type="submit" variant="primary" disabled={processing}>
                    {processing ? 'Updating…' : 'Update password'}
                </Button>
            </div>
        </form>
    );
}

export default function PortalSecurity({
    twoFactorConfirmed,
    hasSecret,
    passwordChangedAt,
}: SecurityProps) {
    const {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        fetchSetupData,
        fetchRecoveryCodes,
        clearTwoFactorAuthData,
    } = useTwoFactorAuth();

    const [, copyCodes] = useClipboard();
    const [copiedCodesState, setCopiedCodesState] = React.useState(false);
    const [isFetchingCodes, setIsFetchingCodes] = React.useState(false);
    const [isEnabling, setIsEnabling] = React.useState(false);

    // Fetch QR code & secret key when setup is active but unconfirmed
    React.useEffect(() => {
        if (hasSecret && !twoFactorConfirmed) {
            void fetchSetupData();
        }
    }, [hasSecret, twoFactorConfirmed, fetchSetupData]);

    // Fetch recovery codes when 2FA is confirmed and codes are empty
    React.useEffect(() => {
        if (twoFactorConfirmed && recoveryCodesList.length === 0) {
            void fetchRecoveryCodes();
        }
    }, [twoFactorConfirmed, recoveryCodesList.length, fetchRecoveryCodes]);

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
        setIsEnabling(true);
        router.post(
            enableTwoFactor.url(),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        'Two-factor authentication initiated. Scan your QR code.',
                    );
                    void fetchSetupData();
                },
                onError: () => {
                    toast.error('Failed to initiate two-factor setup.');
                },
                onFinish: () => {
                    setIsEnabling(false);
                },
            },
        );
    };

    const handleConfirmOTP = (e: React.FormEvent) => {
        e.preventDefault();
        otpForm.post(confirmTwoFactor.url(), {
            preserveScroll: true,
            onSuccess: () => {
                otpForm.reset();
                toast.success('Two-factor authentication is on');
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
        router.delete(disableTwoFactor.url(), {
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
                'Are you sure you want to disable two-factor authentication? Client accounts require MFA for portal access.',
            )
        ) {
            router.delete(disableTwoFactor.url(), {
                preserveScroll: true,
                onSuccess: () => {
                    clearTwoFactorAuthData();
                    toast.info('Two-factor authentication disabled.');
                },
            });
        }
    };

    const handleViewRecoveryCodes = async () => {
        setIsFetchingCodes(true);
        try {
            await fetchRecoveryCodes();
        } finally {
            setIsFetchingCodes(false);
        }
    };

    const handleCopyCodes = async () => {
        if (!recoveryCodesList.length) {
            return;
        }
        const ok = await copyCodes(recoveryCodesList.join(' '));
        if (ok) {
            setCopiedCodesState(true);
            toast.success('Recovery codes copied');
            setTimeout(() => setCopiedCodesState(false), 2000);
        }
    };

    const handleRegenerateRecoveryCodes = () => {
        router.post(
            regenerateRecoveryCodes.url(),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    void fetchRecoveryCodes();
                    toast.success('New recovery codes created');
                },
            },
        );
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put(updatePassword.url(), {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                toast.success('Password updated');
            },
        });
    };

    const relativeTime = React.useMemo(() => {
        return formatRelativeTime(passwordChangedAt);
    }, [passwordChangedAt]);

    return (
        <AppShellLayout
            area="portal"
            activeKey="security"
            headTitle="Client Portal — Security & 2FA | Okojie Online"
            eyebrow="Account"
            title="Security & 2FA"
            sub="Keep your tax documents safe."
        >
            <Head>
                <title>Client Portal — Security & 2FA | Okojie Online</title>
            </Head>

            <div id="page">
                {/* Gate Alert when 2FA is not yet confirmed */}
                {!twoFactorConfirmed && (
                    <Note
                        tone="accent"
                        role="alert"
                        className="mb-4"
                        icon={
                            <Shield
                                className="size-4 shrink-0"
                                strokeWidth={1.7}
                            />
                        }
                    >
                        <b className="font-medium">
                            Turn on two-factor authentication to continue.
                        </b>{' '}
                        IRS guidance requires it on every client account that
                        holds tax documents. It takes about two minutes.
                    </Note>
                )}

                <div className="grid grid-cols-2 items-start gap-4 max-shell:grid-cols-1">
                    {/* Left Column: 2FA */}
                    <Shell aria-labelledby="mfa-title">
                        <ShellHead
                            headingId="mfa-title"
                            icon={<Shield className="size-[18px]" />}
                            title="Two-factor authentication"
                            right={
                                twoFactorConfirmed ? (
                                    <Chip tone="success" dot>
                                        On
                                    </Chip>
                                ) : hasSecret ? (
                                    <Chip tone="accent">Step 2 of 2</Chip>
                                ) : (
                                    <Chip tone="warning" dot>
                                        Required
                                    </Chip>
                                )
                            }
                        />
                        <Inner>
                            {twoFactorConfirmed ? (
                                <TwoFactorOn
                                    recoveryCodesList={recoveryCodesList}
                                    onCopyCodes={handleCopyCodes}
                                    copiedCodes={copiedCodesState}
                                    onRegenerateCodes={
                                        handleRegenerateRecoveryCodes
                                    }
                                    onViewCodes={handleViewRecoveryCodes}
                                    isFetchingCodes={isFetchingCodes}
                                    onDisable={handleDisable2FA}
                                />
                            ) : hasSecret ? (
                                <TwoFactorSetup
                                    qrCodeSvg={qrCodeSvg}
                                    manualSetupKey={manualSetupKey}
                                    otpCode={otpForm.data.code}
                                    onOtpChange={(val) =>
                                        otpForm.setData('code', val)
                                    }
                                    onSubmitOtp={handleConfirmOTP}
                                    onCancel={handleCancelSetup}
                                    processing={otpForm.processing}
                                    errorMessage={otpForm.errors.code}
                                />
                            ) : (
                                <TwoFactorOff
                                    onSetup={handleEnable2FA}
                                    processing={isEnabling}
                                />
                            )}
                        </Inner>
                    </Shell>

                    {/* Right Column: Password */}
                    <Shell aria-labelledby="pw-title">
                        <ShellHead
                            headingId="pw-title"
                            icon={<Key className="size-[18px]" />}
                            title="Password"
                            right={
                                relativeTime ? (
                                    <span className="text-xs text-fg-3">
                                        {relativeTime}
                                    </span>
                                ) : null
                            }
                        />
                        <Inner>
                            <PasswordForm
                                currentPasswordValue={
                                    passwordForm.data.current_password
                                }
                                newPasswordValue={passwordForm.data.password}
                                confirmPasswordValue={
                                    passwordForm.data.password_confirmation
                                }
                                onCurrentPasswordChange={(val) =>
                                    passwordForm.setData(
                                        'current_password',
                                        val,
                                    )
                                }
                                onNewPasswordChange={(val) =>
                                    passwordForm.setData('password', val)
                                }
                                onConfirmPasswordChange={(val) =>
                                    passwordForm.setData(
                                        'password_confirmation',
                                        val,
                                    )
                                }
                                onSubmit={handleUpdatePassword}
                                processing={passwordForm.processing}
                                errors={passwordForm.errors}
                            />
                        </Inner>
                    </Shell>
                </div>
            </div>
        </AppShellLayout>
    );
}
