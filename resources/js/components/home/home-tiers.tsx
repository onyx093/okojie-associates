import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Check, CreditCard, Video } from 'lucide-react';
import * as React from 'react';

import {
    container,
    homeButtonClass,
    SectionHead,
    StatusChip,
} from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import { pricing, register } from '@/routes';
import { update as updateTier } from '@/routes/portal/tier';
import type { TierItem, TierSlug } from '@/types/marketing';

export function HomeTiers({
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
            className="py-20 sm:py-[120px]"
        >
            <div className={container}>
                <SectionHead
                    id="tiers-title"
                    eyebrow="Service tiers"
                    icon={CreditCard}
                    title="Three ways to file"
                    description="Pick the level of support that fits. Every tier includes a real, credentialed preparer."
                />

                <div className="mx-auto grid max-w-[560px] gap-4 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <TierCard
                            key={tier.slug}
                            tier={tier}
                            userOverride={userOverride}
                        />
                    ))}
                </div>

                <div className="mt-7 flex justify-center">
                    <Link
                        href={pricing.url()}
                        className="text-accent-fg inline-flex items-center gap-1.5 font-medium underline decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:decoration-current"
                    >
                        See full pricing and what’s included
                        <ArrowRight className="size-[15px]" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function TierCard({
    tier,
    userOverride,
}: {
    tier: TierItem;
    userOverride?: { tier?: string | null } | null;
}) {
    const featured = tier.slug === 'hybrid';

    return (
        <article
            className={cn(
                'flex flex-col rounded-[20px] bg-card p-2 shadow-card',
                featured &&
                    'shadow-[0_0_0_1.5px_var(--accent-solid),0_24px_56px_-24px_rgb(79_99_232/0.45)]',
            )}
        >
            <div
                aria-hidden="true"
                className="grid h-[188px] place-items-center overflow-hidden rounded-xl bg-sunken bg-[radial-gradient(var(--border)_1px,transparent_1.2px)] bg-[size:14px_14px]"
            >
                <TierVisual slug={tier.slug} />
            </div>
            <div className="flex flex-1 flex-col px-[18px] pt-[22px] pb-[18px]">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[22px] font-medium tracking-[-0.025em] text-foreground">
                        {tier.name}
                    </h3>
                    {featured && (
                        <StatusChip tone="accent" dot={false}>
                            Most popular
                        </StatusChip>
                    )}
                </div>
                <p className="text-tertiary mt-0.5 text-sm">{tier.tagline}</p>
                <p className="mt-5 flex items-baseline gap-2">
                    <small className="text-tertiary font-mono text-[11px] tracking-[0.06em] uppercase">
                        From
                    </small>
                    <b className="text-[34px] font-medium tracking-[-0.035em] text-foreground tabular-nums">
                        ${tier.price_min}–${tier.price_max}
                    </b>
                </p>
                <p className="mt-2.5 text-[14.5px] text-pretty text-muted-foreground">
                    {tier.description}
                </p>
                <ul className="mt-5 grid gap-2.5 border-t border-border pt-[18px] text-[14.5px]">
                    {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                            <Check className="text-accent-fg mt-0.5 size-[15px] shrink-0" />
                            <span className="text-foreground">{feature}</span>
                        </li>
                    ))}
                </ul>
                <span className="flex-1" />
                <p className="mt-5 rounded-[10px] bg-sunken px-3.5 py-3 text-[13.5px] text-muted-foreground">
                    <b className="font-medium text-foreground">Best for</b>{' '}
                    {tier.best_for}
                </p>
                <TierAction
                    tier={tier}
                    featured={featured}
                    userOverride={userOverride}
                />
            </div>
        </article>
    );
}

/** Signed-in clients switch tier in place; guests register with the tier preselected. */
function TierAction({
    tier,
    featured,
    userOverride,
}: {
    tier: TierItem;
    featured: boolean;
    userOverride?: { tier?: string | null } | null;
}) {
    const { props } = usePage<{
        auth?: { user?: { tier?: string | null } | null };
    }>();
    const user = userOverride !== undefined ? userOverride : props.auth?.user;
    const [updating, setUpdating] = React.useState(false);
    const className = homeButtonClass(
        featured ? 'primary' : 'secondary',
        'mt-[18px] w-full',
    );

    if (!user) {
        return (
            <Link
                href={register.url({ query: { tier: tier.slug } })}
                className={className}
            >
                {tier.cta}
            </Link>
        );
    }

    const isCurrent = user.tier === tier.slug;

    return (
        <button
            type="button"
            disabled={updating || isCurrent}
            onClick={() => {
                setUpdating(true);
                router.patch(
                    updateTier.url(),
                    { tier: tier.slug },
                    { onFinish: () => setUpdating(false) },
                );
            }}
            className={cn(className, 'cursor-pointer')}
        >
            {isCurrent
                ? 'Your current tier'
                : updating
                  ? 'Updating…'
                  : tier.cta}
        </button>
    );
}

function TierVisual({ slug }: { slug: TierSlug }) {
    if (slug === 'upload_and_go') {
        return (
            <div className="grid w-[78%] gap-2">
                <FileRow name="W-2_2026.pdf" badge="PDF" tone="red">
                    <StatusChip tone="ok">Verified</StatusChip>
                </FileRow>
                <FileRow
                    name="1099-NEC.pdf"
                    badge="PDF"
                    tone="accent"
                    className="translate-x-3.5"
                >
                    <StatusChip tone="ok">Verified</StatusChip>
                </FileRow>
                <FileRow
                    name="ID-front.jpg"
                    badge="JPG"
                    tone="red"
                    className="-translate-x-1.5 opacity-75"
                >
                    <StatusChip tone="neutral" dot={false}>
                        Uploading
                    </StatusChip>
                </FileRow>
            </div>
        );
    }

    if (slug === 'hybrid') {
        return (
            <div className="flex items-center">
                <Option
                    icon={Building2}
                    title="In office"
                    meta="Germantown Ave"
                />
                <span className="relative h-0.5 w-11 bg-[repeating-linear-gradient(90deg,var(--border-strong)_0_4px,transparent_4px_8px)]">
                    <span className="text-tertiary absolute top-1/2 left-1/2 -translate-1/2 rounded-md bg-sunken px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em] uppercase shadow-[inset_0_0_0_1px_var(--border)]">
                        or
                    </span>
                </span>
                <Option icon={Video} title="By video" meta="Thu · 4:30 PM" />
            </div>
        );
    }

    const quarters = [
        ['Q1', 'Due Apr 15', 'Paid'],
        ['Q2', 'Due Jun 15', 'Paid'],
        ['Q3', 'Due Sep 15', 'Paid'],
        ['Q4', 'Due Jan 15', 'Scheduled'],
    ];

    return (
        <div className="w-[82%] rounded-xl bg-card px-3 py-2.5 text-[12.5px] shadow-chip">
            <div className="text-tertiary flex justify-between pb-1.5 font-mono text-[10.5px] tracking-[0.06em] uppercase">
                <span>Quarterly estimates</span>
                <span>2026</span>
            </div>
            {quarters.map(([q, due, status]) => (
                <div
                    key={q}
                    className="grid grid-cols-[28px_1fr_auto] items-center gap-2 border-t border-border py-1.5"
                >
                    <b className="font-medium text-foreground">{q}</b>
                    <span className="text-tertiary">{due}</span>
                    <StatusChip tone={status === 'Paid' ? 'ok' : 'accent'}>
                        {status}
                    </StatusChip>
                </div>
            ))}
        </div>
    );
}

function FileRow({
    name,
    badge,
    tone,
    className,
    children,
}: {
    name: string;
    badge: string;
    tone: 'red' | 'accent';
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                'flex items-center gap-2.5 rounded-[10px] bg-card px-2.5 py-[9px] text-[13px] text-foreground shadow-chip',
                className,
            )}
        >
            <span
                className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-md text-[8.5px] font-semibold tracking-[0.02em] text-white',
                    tone === 'red' ? 'bg-[#e25b4b]' : 'bg-accent-solid',
                )}
            >
                {badge}
            </span>
            <span className="truncate">{name}</span>
            <span className="ml-auto">{children}</span>
        </div>
    );
}

function Option({
    icon: Icon,
    title,
    meta,
}: {
    icon: typeof Video;
    title: string;
    meta: string;
}) {
    return (
        <div className="grid w-[104px] justify-items-center gap-2 rounded-[14px] bg-card px-2.5 py-3 text-center text-[12.5px] shadow-chip sm:w-[120px] sm:px-4 sm:py-3.5">
            <span className="grid size-[34px] place-items-center rounded-full bg-foreground text-background">
                <Icon className="size-[15px]" />
            </span>
            <span>
                <span className="block font-medium text-foreground">
                    {title}
                </span>
                <small className="text-tertiary block text-[11.5px]">
                    {meta}
                </small>
            </span>
        </div>
    );
}
