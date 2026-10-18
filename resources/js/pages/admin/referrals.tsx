import { Head, router } from '@inertiajs/react';
import { Award, CheckCircle2, Gift, Mail } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/layouts/admin-layout';
import { reward as referralReward } from '@/routes/admin/referrals';

interface ReferralItem {
    id: string;
    referrerName: string;
    referrerEmail: string;
    friendName: string;
    friendEmail: string;
    hasSignedUp: boolean;
    status: string;
    statusLabel: string;
    rewardCents: number | null;
    formattedReward: string;
    canReward: boolean;
    createdAt: string;
}

interface ReferralsProps {
    referrals: {
        data: ReferralItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
}

export default function Referrals({ referrals }: ReferralsProps) {
    const handleMarkRewarded = (referralId: string) => {
        if (
            confirm(
                'Mark this referral as Rewarded? This records the payout amount based on tier.',
            )
        ) {
            router.post(
                referralReward.url({ referral: referralId }),
                {},
                { preserveScroll: true },
            );
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'rewarded':
                return 'default';
            case 'filed':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <AdminLayout title="Referrals & Rewards">
            <Head title="Admin - Referrals" />

            <div className="space-y-6">
                <Card className="border-border bg-card">
                    <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Gift className="size-4 text-primary" />
                                <CardTitle className="text-sm font-semibold">
                                    Client Referrals Directory
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">
                                    ({referrals.total} total)
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Payouts trigger when a referred friend&apos;s
                                return reaches E-Filed status.
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead>Referrer</TableHead>
                                        <TableHead>Referred Friend</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Reward</TableHead>
                                        <TableHead>Date Sent</TableHead>
                                        <TableHead className="text-right">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referrals.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-12 text-center text-sm text-muted-foreground"
                                            >
                                                No referrals recorded yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        referrals.data.map((ref) => {
                                            const isRewarded =
                                                ref.status === 'rewarded';
                                            const isFiled =
                                                ref.status === 'filed';

                                            return (
                                                <TableRow
                                                    key={ref.id}
                                                    className="border-border"
                                                >
                                                    <TableCell>
                                                        <div className="text-xs font-semibold text-foreground">
                                                            {ref.referrerName}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                            <Mail className="size-3" />
                                                            {ref.referrerEmail}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="text-xs font-medium text-foreground">
                                                            {ref.friendName}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                            <Mail className="size-3" />
                                                            {ref.friendEmail}
                                                        </div>
                                                        {ref.hasSignedUp && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                                                                <CheckCircle2 className="size-2.5" />
                                                                Account created
                                                            </span>
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge
                                                            variant={getStatusVariant(
                                                                ref.status,
                                                            )}
                                                            className="text-xs capitalize"
                                                        >
                                                            {ref.statusLabel}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="text-xs font-semibold text-foreground">
                                                            {
                                                                ref.formattedReward
                                                            }
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="text-xs text-muted-foreground">
                                                            {ref.createdAt}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        {isRewarded ? (
                                                            <span className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-500">
                                                                <CheckCircle2 className="size-3.5" />
                                                                Rewarded
                                                            </span>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant={
                                                                    isFiled
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                className="h-7 text-xs"
                                                                onClick={() =>
                                                                    handleMarkRewarded(
                                                                        ref.id,
                                                                    )
                                                                }
                                                            >
                                                                <Award className="mr-1.5 size-3.5" />
                                                                Mark Rewarded
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
