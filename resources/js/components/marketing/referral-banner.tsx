import { Link, usePage } from '@inertiajs/react';
import { Gift, Share2, DollarSign, ArrowRight } from 'lucide-react';
import * as React from 'react';

import { Reveal } from '@/components/reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import { referrals } from '@/routes/portal';

interface ReferralBannerProps {
    className?: string;
}

export function ReferralBanner({ className }: ReferralBannerProps) {
    const pageProps = usePage().props as unknown as {
        auth?: {
            user?: unknown;
        };
    };

    const user = pageProps.auth?.user;
    const targetHref = user
        ? referrals.url()
        : register.url({ query: { next: referrals.url() } });

    return (
        <div
            data-slot="referral-banner"
            className={cn(
                'relative overflow-hidden rounded-[24px] border border-border bg-gradient-to-br from-[#1c1d2a] via-[#181926] to-[#14151f] p-8 shadow-[var(--shadow-card)] sm:p-12',
                className,
            )}
        >
            {/* Decorative gradient overlay */}
            <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                {/* Left Column (7 cols) */}
                <div className="flex flex-col items-start gap-5 lg:col-span-7">
                    <Reveal delay={0} direction="up">
                        <Badge
                            variant="hero"
                            className="flex items-center gap-1.5"
                        >
                            <Gift className="size-3.5 text-primary" />
                            Refer a Friend
                        </Badge>
                    </Reveal>

                    <Reveal delay={70} direction="up">
                        <h2 className="text-2xl leading-[1.15] font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                            Earn $25–$50 for every friend you refer
                        </h2>
                    </Reveal>

                    <Reveal delay={140} direction="up">
                        <p className="max-w-[560px] text-sm leading-relaxed text-body sm:text-base">
                            Know someone who dreads tax season? Send them our
                            way. When they file with Okojie Online, you earn a
                            reward — and they get a real tax professional who
                            knows Philadelphia and Baltimore.
                        </p>
                    </Reveal>

                    <Reveal delay={210} direction="up">
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Button
                                variant="primary"
                                asChild
                                className="rounded-full shadow-sm"
                            >
                                <Link href={targetHref}>
                                    Get my referral link
                                    <ArrowRight className="ml-1.5 size-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                className="rounded-full"
                            >
                                <Link href={targetHref}>Refer someone now</Link>
                            </Button>
                        </div>
                    </Reveal>
                </div>

                {/* Right Column: 2 Mini-Cards (5 cols) */}
                <div className="flex flex-col gap-4 lg:col-span-5">
                    <Reveal delay={100} direction="right">
                        <Card className="border-border bg-secondary/70 p-5 transition-colors hover:border-border-strong">
                            <CardHeader className="flex flex-row items-start gap-3.5 p-0">
                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                    <Share2 className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold text-foreground">
                                        Share your link
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                        Every client gets a unique referral code
                                        and link in their portal.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Reveal>

                    <Reveal delay={180} direction="right">
                        <Card className="border-border bg-secondary/70 p-5 transition-colors hover:border-border-strong">
                            <CardHeader className="flex flex-row items-start gap-3.5 p-0">
                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                    <DollarSign className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-semibold text-foreground">
                                        They file, you earn
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                        When your friend becomes a client, you
                                        earn $25–$50.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
