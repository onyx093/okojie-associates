import { Head, useForm } from '@inertiajs/react';
import { Check, Copy, Gift, Mail, Send, User, Users } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Avatar } from '@/components/primitives/avatar';
import { Button } from '@/components/primitives/button';
import { StatusLabel } from '@/components/primitives/chip';
import { EmptyState } from '@/components/primitives/empty-state';
import { Inner, Shell, ShellHead } from '@/components/primitives/shell';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useClipboard } from '@/hooks/use-clipboard';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import { store } from '@/routes/portal/referrals';

export interface ReferralItem {
    id: string;
    friend_name: string;
    friend_email: string;
    status: 'sent' | 'signed_up' | 'filed' | 'rewarded';
    status_label: string;
    reward_cents: number | null;
    reward_formatted: string;
    source: string;
    created_at: string | null;
    created_at_formatted: string | null;
}

export interface ReferralsPageProps {
    referrals: ReferralItem[];
    referralCode: string;
    referralLink: string;
    rewardRange?: string;
}

export default function ReferralsPage({
    referrals,
    referralCode,
    referralLink,
    rewardRange = '$25–$50',
}: ReferralsPageProps) {
    const [, copy] = useClipboard();
    const [copied, setCopied] = React.useState(false);

    // Compute active link for copying
    const activeLink = React.useMemo(() => {
        if (referralLink) {
            return referralLink;
        }
        if (typeof window !== 'undefined' && referralCode) {
            return `${window.location.origin}/r/${referralCode}`;
        }
        return `/r/${referralCode}`;
    }, [referralLink, referralCode]);

    // Format clean display link without protocol
    const displayLink = React.useMemo(() => {
        return activeLink.replace(/^https?:\/\//, '');
    }, [activeLink]);

    const handleCopy = async () => {
        const ok = await copy(activeLink);
        if (ok) {
            setCopied(true);
            toast.success('Referral link copied');
            setTimeout(() => setCopied(false), 2000);
        } else {
            toast.error('Failed to copy link. Please copy manually.');
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        friend_name: '',
        friend_email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Invite sent to your friend');
            },
        });
    };

    const earnedSoFar = React.useMemo(() => {
        const totalCents = referrals
            .filter((r) => r.status === 'rewarded')
            .reduce((sum, r) => sum + (r.reward_cents ?? 0), 0);
        return `$${Math.round(totalCents / 100)} earned so far`;
    }, [referrals]);

    const getStatusInfo = (status: ReferralItem['status']) => {
        switch (status) {
            case 'sent':
                return {
                    label: 'Invite sent',
                    tone: 'wait' as const,
                    icon: <Send className="size-[15px]" strokeWidth={1.7} />,
                };
            case 'signed_up':
                return {
                    label: 'Signed up',
                    tone: 'info' as const,
                    icon: <User className="size-[15px]" strokeWidth={1.7} />,
                };
            case 'filed':
                return {
                    label: 'Filed',
                    tone: 'ok' as const,
                    icon: <Check className="size-[15px]" strokeWidth={1.9} />,
                };
            case 'rewarded':
                return {
                    label: 'Rewarded',
                    tone: 'ok' as const,
                    icon: <Check className="size-[15px]" strokeWidth={1.9} />,
                };
            default:
                return {
                    label: status,
                    tone: 'wait' as const,
                    icon: <Send className="size-[15px]" strokeWidth={1.7} />,
                };
        }
    };

    const renderReward = (ref: ReferralItem) => {
        if (
            ref.reward_cents !== null &&
            ref.reward_formatted &&
            ref.reward_formatted !== '—'
        ) {
            return (
                <span className="font-mono text-sm font-medium text-foreground tabular-nums">
                    {ref.reward_formatted}
                </span>
            );
        }
        if (ref.status === 'signed_up' || ref.status === 'filed') {
            return (
                <span className="text-xs text-fg-3 sm:text-[13px]">
                    When they file
                </span>
            );
        }
        return <span className="text-fg-3">—</span>;
    };

    return (
        <AppShellLayout
            area="portal"
            activeKey="referrals"
            headTitle="Client Portal — Referrals | Okojie Online"
            eyebrow="Account"
            title="Referrals"
            sub="Earn a reward for every friend who files with us."
        >
            <Head>
                <title>Client Portal — Referrals | Okojie Online</title>
            </Head>

            {/* Hero Card */}
            <section
                className="relative isolate mb-4 grid grid-cols-1 items-center gap-7 overflow-hidden rounded-card bg-[#0C0D16] p-7 text-[#F2F3F7] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] max-sm:p-5 md:grid-cols-2"
                aria-labelledby="ref-title"
            >
                <div
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_100%_0%,rgba(94,112,240,0.45),transparent_60%),radial-gradient(50%_80%_at_80%_120%,rgba(246,150,110,0.3),transparent_60%)]"
                    aria-hidden="true"
                />
                <div>
                    <span className="text-[11px] font-semibold tracking-wider text-[#F2F3F7]/55 uppercase">
                        Refer a friend
                    </span>
                    <h2
                        id="ref-title"
                        className="mt-2 text-2xl leading-tight font-semibold tracking-[-0.03em] text-[#F2F3F7] sm:text-[28px]"
                    >
                        Earn {rewardRange} for every friend you refer
                    </h2>
                    <p className="mt-2 max-w-[44ch] text-[14.5px] leading-relaxed text-[#F2F3F7]/70">
                        Share your link. When your friend files with Okojie
                        Online, you get a reward and they get a real tax
                        professional.
                    </p>
                </div>
                <div className="rounded-[16px] bg-white/[0.06] p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                    <div className="rounded-[10px] bg-[#15161F] p-4">
                        <span className="text-[10.5px] font-semibold tracking-wider text-[#F2F3F7]/55 uppercase">
                            Your personal referral link
                        </span>
                        <div className="mt-2 flex items-center gap-2 rounded-[10px] bg-[#0C0D16] py-1.5 pr-1.5 pl-3 font-mono text-[13px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                            <span className="min-w-0 flex-1 truncate text-[#F2F3F7]">
                                {displayLink}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                aria-label="Copy referral link"
                                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[7px] bg-[#F2F3F7] px-3 font-sans text-[13px] font-medium text-[#0C0D16] transition-transform hover:bg-white active:scale-95"
                            >
                                {copied ? (
                                    <>
                                        <Check className="size-3.5 text-emerald-600" />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="size-3.5" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[13px] text-[#F2F3F7]/60">
                            <span>Referral code</span>
                            <b className="font-mono font-medium tracking-wide text-[#F2F3F7]">
                                {referralCode}
                            </b>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3-Step Explainer */}
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-start gap-3 rounded-[14px] bg-card p-4 shadow-card">
                    <span className="grid size-[26px] shrink-0 place-items-center rounded-lg bg-sunken font-mono text-[11px] text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]">
                        01
                    </span>
                    <div>
                        <b className="block text-sm font-medium text-foreground">
                            Share your link
                        </b>
                        <small className="mt-0.5 block text-[13px] text-fg-3">
                            Text it, post it, or send an invite below.
                        </small>
                    </div>
                </div>
                <div className="flex items-start gap-3 rounded-[14px] bg-card p-4 shadow-card">
                    <span className="grid size-[26px] shrink-0 place-items-center rounded-lg bg-sunken font-mono text-[11px] text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]">
                        02
                    </span>
                    <div>
                        <b className="block text-sm font-medium text-foreground">
                            They sign up
                        </b>
                        <small className="mt-0.5 block text-[13px] text-fg-3">
                            Your friend creates an account and books.
                        </small>
                    </div>
                </div>
                <div className="flex items-start gap-3 rounded-[14px] bg-card p-4 shadow-card">
                    <span className="grid size-[26px] shrink-0 place-items-center rounded-lg bg-sunken font-mono text-[11px] text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]">
                        03
                    </span>
                    <div>
                        <b className="block text-sm font-medium text-foreground">
                            They file, you earn
                        </b>
                        <small className="mt-0.5 block text-[13px] text-fg-3">
                            {rewardRange} once their return is filed.
                        </small>
                    </div>
                </div>
            </div>

            {/* 2-Column Responsive Layout */}
            <div
                id="page"
                className="grid grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start gap-4 max-shell:grid-cols-1"
            >
                {/* Left Column: Send an invite */}
                <Shell aria-labelledby="inv-title">
                    <ShellHead
                        headingId="inv-title"
                        icon={<Mail className="size-[18px]" />}
                        title="Send an invite"
                    />
                    <Inner>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-1.5">
                                <label
                                    htmlFor="fname"
                                    className="text-[13px] font-medium text-foreground"
                                >
                                    Friend’s name
                                </label>
                                <input
                                    id="fname"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="e.g. Marcus Thompson"
                                    value={data.friend_name}
                                    onChange={(e) =>
                                        setData('friend_name', e.target.value)
                                    }
                                    className="w-full rounded-control border border-input bg-card px-3 py-2 text-sm text-foreground shadow-chip transition-colors placeholder:text-fg-3 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    required
                                />
                                {errors.friend_name && (
                                    <p className="text-xs text-danger">
                                        {errors.friend_name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-1.5">
                                <label
                                    htmlFor="femail"
                                    className="text-[13px] font-medium text-foreground"
                                >
                                    Friend’s email
                                </label>
                                <input
                                    id="femail"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="off"
                                    placeholder="name@example.com"
                                    value={data.friend_email}
                                    onChange={(e) =>
                                        setData('friend_email', e.target.value)
                                    }
                                    className="w-full rounded-control border border-input bg-card px-3 py-2 text-sm text-foreground shadow-chip transition-colors placeholder:text-fg-3 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    required
                                />
                                {errors.friend_email && (
                                    <p className="text-xs text-danger">
                                        {errors.friend_email}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                                className="w-full justify-center gap-2"
                            >
                                <Send
                                    className="size-4 shrink-0"
                                    strokeWidth={1.7}
                                />
                                <span>
                                    {processing ? 'Sending…' : 'Send invite'}
                                </span>
                            </Button>

                            <p className="text-xs text-fg-3">
                                We send one email with your link. We never add
                                your friend to a mailing list.
                            </p>
                        </form>
                    </Inner>
                </Shell>

                {/* Right Column: Your referrals */}
                <Shell aria-labelledby="list-title">
                    <ShellHead
                        headingId="list-title"
                        icon={<Users className="size-[18px]" />}
                        title="Your referrals"
                        right={
                            referrals.length > 0 ? (
                                <span className="text-xs text-fg-3">
                                    {earnedSoFar}
                                </span>
                            ) : null
                        }
                    />
                    {referrals.length === 0 ? (
                        <Inner variant="flush-empty">
                            <EmptyState
                                icon={
                                    <Gift
                                        className="size-5"
                                        strokeWidth={1.7}
                                    />
                                }
                                title="No referrals yet"
                                body="Share your link or send an invite, and your friends will show up here."
                                actions={
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleCopy}
                                        className="gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="size-4 text-emerald-600" />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-4 text-fg-3" />
                                                <span>Copy my link</span>
                                            </>
                                        )}
                                    </Button>
                                }
                            />
                        </Inner>
                    ) : (
                        <Inner className="overflow-hidden p-0">
                            <div className="table-wrap p-1.5">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Friend</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="hidden sm:table-cell">
                                                Invited
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Reward
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {referrals.map((ref) => {
                                            const statusInfo = getStatusInfo(
                                                ref.status,
                                            );
                                            return (
                                                <TableRow key={ref.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2.5">
                                                            <Avatar
                                                                name={
                                                                    ref.friend_name
                                                                }
                                                                size="default"
                                                            />
                                                            <div className="min-w-0">
                                                                <div className="truncate text-sm font-medium text-foreground">
                                                                    {
                                                                        ref.friend_name
                                                                    }
                                                                </div>
                                                                <div className="truncate text-xs text-fg-3">
                                                                    {
                                                                        ref.friend_email
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusLabel
                                                            tone={
                                                                statusInfo.tone
                                                            }
                                                            icon={
                                                                statusInfo.icon
                                                            }
                                                        >
                                                            {statusInfo.label}
                                                        </StatusLabel>
                                                    </TableCell>
                                                    <TableCell className="hidden text-sm text-fg-3 sm:table-cell">
                                                        {ref.created_at_formatted ??
                                                            '—'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {renderReward(ref)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </Inner>
                    )}
                </Shell>
            </div>
        </AppShellLayout>
    );
}
