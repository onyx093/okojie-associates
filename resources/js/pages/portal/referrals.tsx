import { Head, useForm } from '@inertiajs/react';
import {
    Check,
    Copy,
    DollarSign,
    Gift,
    Loader2,
    Mail,
    Send,
    User as UserIcon,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { store } from '@/actions/App/Http/Controllers/Portal/ReferralController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PortalLayout } from '@/layouts/portal-layout';
import { cn } from '@/lib/utils';

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

interface ReferralsPageProps {
    referrals: ReferralItem[];
    referralCode: string;
    referralLink: string;
    rewardRange?: string;
}

export default function ReferralsPage({
    referrals = [],
    referralCode,
    referralLink,
    rewardRange = '$25–$50',
}: ReferralsPageProps) {
    const [copied, setCopied] = React.useState(false);

    // Compute the full origin-based link client-side or fallback to prop
    const fullLink = React.useMemo(() => {
        if (typeof window !== 'undefined' && referralCode) {
            return `${window.location.origin}/contact?ref=${referralCode}`;
        }
        return referralLink || `/contact?ref=${referralCode}`;
    }, [referralCode, referralLink]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullLink);
            setCopied(true);
            toast.success('Referral link copied to clipboard.');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link. Please select and copy manually.');
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
                toast.success("Referral sent! We've emailed your friend an invitation.");
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            },
        });
    };

    const getStatusBadge = (status: ReferralItem['status'], label: string) => {
        switch (status) {
            case 'rewarded':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
                    >
                        {label}
                    </Badge>
                );
            case 'filed':
                return (
                    <Badge
                        variant="outline"
                        className="border-purple-300 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-800"
                    >
                        {label}
                    </Badge>
                );
            case 'signed_up':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                    >
                        {label}
                    </Badge>
                );
            case 'sent':
            default:
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700"
                    >
                        {label}
                    </Badge>
                );
        }
    };

    return (
        <PortalLayout>
            <Head title="Referrals | Okojie Online" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left Card: Refer a friend */}
                <div className="lg:col-span-5">
                    <div className="rounded-[18px] border border-border bg-card p-6 sm:p-7">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                Refer a friend
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Share your link — you earn {rewardRange} when they file.
                            </p>
                        </div>

                        {/* Referral Link Box */}
                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-semibold text-foreground">
                                Your personal referral link
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        readOnly
                                        value={fullLink}
                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                        className="w-full rounded-md border border-input bg-muted/50 px-3 py-2 font-mono text-xs text-foreground select-all focus:outline-none"
                                        aria-label="Your personal referral link"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="shrink-0 gap-1.5"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4 text-emerald-600" />
                                            <span>Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 text-muted-foreground" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative my-7">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-3 text-muted-foreground">
                                    Or send an invite directly
                                </span>
                            </div>
                        </div>

                        {/* Direct Email Referral Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="friend_name"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Friend's name
                                </label>
                                <Input
                                    id="friend_name"
                                    type="text"
                                    placeholder="First and last name"
                                    value={data.friend_name}
                                    onChange={(e) => setData('friend_name', e.target.value)}
                                    required
                                    className="w-full"
                                />
                                <InputError message={errors.friend_name} />
                            </div>

                            <div className="space-y-1.5">
                                <label
                                    htmlFor="friend_email"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Friend's email
                                </label>
                                <Input
                                    id="friend_email"
                                    type="email"
                                    placeholder="friend@example.com"
                                    value={data.friend_email}
                                    onChange={(e) => setData('friend_email', e.target.value)}
                                    required
                                    className="w-full"
                                />
                                <InputError message={errors.friend_email} />
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-full py-5 text-sm font-semibold"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending referral...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send referral
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Card: Your referrals */}
                <div className="lg:col-span-7">
                    <div className="rounded-[18px] border border-border bg-card p-6 sm:p-7">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    Your referrals
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {referrals.length}{' '}
                                    {referrals.length === 1 ? 'referral' : 'referrals'}
                                </p>
                            </div>
                        </div>

                        {/* Empty State */}
                        {referrals.length === 0 ? (
                            <div className="mt-8 flex flex-col items-center justify-center rounded-[14px] border border-dashed border-border py-12 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Gift className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-foreground">
                                    No referrals yet. Share your link to get started.
                                </h3>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    When friends or family file with Okojie Online using your referral
                                    link, you'll earn {rewardRange} per return.
                                </p>
                            </div>
                        ) : (
                            /* Referrals List */
                            <div className="mt-6 space-y-3">
                                {referrals.map((ref) => (
                                    <div
                                        key={ref.id}
                                        className="flex flex-col gap-3 rounded-[14px] border border-border p-4 transition-colors hover:border-border-strong sm:flex-row sm:items-center sm:justify-between sm:p-5"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {ref.friend_name}
                                                    </span>
                                                    {getStatusBadge(ref.status, ref.status_label)}
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {ref.friend_email}
                                                    </span>
                                                    {ref.created_at_formatted && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Sent {ref.created_at_formatted}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reward info */}
                                        <div className="flex items-center justify-between border-t border-border pt-2 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                                            <span className="text-xs text-muted-foreground">
                                                Reward
                                            </span>
                                            <span
                                                className={cn(
                                                    'flex items-center text-sm font-semibold',
                                                    ref.reward_cents
                                                        ? 'text-emerald-600'
                                                        : 'text-muted-foreground'
                                                )}
                                            >
                                                {ref.reward_cents ? (
                                                    <>
                                                        <DollarSign className="h-3.5 w-3.5" />
                                                        {ref.reward_formatted.replace('$', '')}
                                                    </>
                                                ) : (
                                                    '—'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
