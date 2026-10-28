import { Link, router, usePage } from '@inertiajs/react';
import { Check, CreditCard } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { Button, Chip } from '@/components/primitives';
import { cn } from '@/lib/utils';
import { contact, register } from '@/routes';
import { update as updateTier } from '@/routes/portal/tier';
import type { TierItem, TierSlug } from '@/types/marketing';

const TIER_NUM_TAGS: Record<TierSlug, string> = {
    upload_and_go: '01 · Fully remote',
    hybrid: '02 · In office or online',
    premium_remote: '03 · Year-round',
};

function TierRowAction({
    tier,
    isFeatured,
    userOverride,
}: {
    tier: TierItem;
    isFeatured: boolean;
    userOverride?: { tier?: string | null } | null;
}) {
    const { props } = usePage<{
        auth?: { user?: { tier?: string | null } | null };
    }>();
    const user = userOverride !== undefined ? userOverride : props.auth?.user;
    const [updating, setUpdating] = React.useState(false);

    if (!user) {
        return (
            <Button
                asChild
                variant={isFeatured ? 'primary' : 'secondary'}
                size="lg"
            >
                <Link href={register.url({ query: { tier: tier.slug } })}>
                    {tier.cta}
                </Link>
            </Button>
        );
    }

    const isCurrent = user.tier === tier.slug;

    return (
        <Button
            variant={isFeatured ? 'primary' : 'secondary'}
            size="lg"
            disabled={updating || isCurrent}
            onClick={() => {
                setUpdating(true);
                router.patch(
                    updateTier.url(),
                    { tier: tier.slug },
                    { onFinish: () => setUpdating(false) },
                );
            }}
            className="cursor-pointer"
        >
            {isCurrent
                ? 'Your current tier'
                : updating
                  ? 'Updating…'
                  : tier.cta}
        </Button>
    );
}

export function ServicesTierList({
    tiers,
    userOverride,
}: {
    tiers: TierItem[];
    userOverride?: { tier?: string | null } | null;
}) {
    return (
        <section
            id="tiers"
            aria-labelledby="tiers-title"
            className="py-14 sm:py-20"
        >
            <div className={container}>
                <div className="mb-9 grid items-end gap-5 sm:mb-12 md:grid-cols-[1fr_auto] md:gap-8">
                    <div>
                        <Eyebrow icon={CreditCard}>Service tiers</Eyebrow>
                        <h2
                            id="tiers-title"
                            className="mt-5 max-w-[14ch] text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-foreground"
                        >
                            Three ways to file
                        </h2>
                    </div>
                    <p className="max-w-[38ch] text-[17px] text-pretty text-muted-foreground md:text-right">
                        Every tier includes a real, credentialed preparer and an
                        IRS-compliant e-signature.
                    </p>
                </div>

                <div className="grid gap-4">
                    {tiers.map((tier) => {
                        const isFeatured = tier.slug === 'hybrid';
                        const numTag =
                            TIER_NUM_TAGS[tier.slug] ??
                            `0${tier.slug} · Service`;

                        return (
                            <article
                                key={tier.slug}
                                className={cn(
                                    'grid gap-0 rounded-[20px] bg-card p-2 shadow-card transition-shadow lg:grid-cols-[1fr_1.1fr]',
                                    isFeatured &&
                                        'shadow-[0_0_0_1.5px_var(--accent-solid),0_24px_56px_-28px_rgb(79_99_232/0.45)]',
                                )}
                            >
                                <div className="flex flex-col p-7 max-sm:p-5">
                                    <span className="font-mono text-xs tracking-[0.06em] text-muted-foreground">
                                        {numTag}
                                    </span>
                                    <h3 className="mt-2.5 flex flex-wrap items-center gap-2.5 text-[30px] font-medium tracking-[-0.03em] text-foreground">
                                        <span>{tier.name}</span>
                                        {isFeatured && (
                                            <Chip tone="accent">
                                                Most popular
                                            </Chip>
                                        )}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {tier.tagline}
                                    </p>
                                    <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
                                        {tier.description}
                                    </p>

                                    <div className="mt-auto flex items-baseline gap-2 pt-6">
                                        <small className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                                            From
                                        </small>
                                        <b className="text-[34px] font-medium tracking-[-0.035em] text-foreground tabular-nums">
                                            ${tier.price_min}–${tier.price_max}
                                        </b>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <TierRowAction
                                            tier={tier}
                                            isFeatured={isFeatured}
                                            userOverride={userOverride}
                                        />
                                        {isFeatured && (
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="lg"
                                            >
                                                <Link
                                                    href={`${contact.url()}#start`}
                                                >
                                                    Book a free consultation
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid content-start gap-4.5 rounded-[14px] bg-sunken p-6 shadow-[inset_0_0_0_1px_var(--border)] max-sm:p-5">
                                    <ul className="m-0 grid list-none gap-2.5 p-0 text-[15px]">
                                        {tier.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2.5 text-foreground"
                                            >
                                                <Check className="text-accent-fg mt-1 size-[15px] shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="border-t border-border pt-4 text-[14.5px] text-muted-foreground">
                                        <b className="font-medium text-foreground">
                                            Best for
                                        </b>{' '}
                                        {tier.best_for}.
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
