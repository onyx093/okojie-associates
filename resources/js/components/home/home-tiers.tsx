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
import type { StatItem, TierItem, TierSlug } from '@/types/marketing';

export function HomeStats({ stats }: { stats: StatItem[] }) {
    return (
        <div className={container}>
            <dl className="mt-12 grid grid-cols-2 gap-y-7 sm:mt-[72px] md:grid-cols-4">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className={cn(
                            'flex flex-col-reverse border-l border-h-line-strong px-4 py-2 sm:px-7',
                            i % 2 === 0 && 'border-l-0 pl-0 sm:pl-0',
                            i === 2 && 'md:border-l md:pl-7',
                        )}
                    >
                        <dt className="mt-1.5 font-mono text-xs leading-snug tracking-[0.06em] text-h-fg-3 uppercase">
                            {stat.label}
                        </dt>
                        <dd className="text-[clamp(36px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.04em] tabular-nums">
                            {stat.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export function HomeTiers({ tiers }: { tiers: TierItem[] }) {
    return (
        <section aria-labelledby="tiers-title" className="py-20 sm:py-[120px]">
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
                        <TierCard key={tier.slug} tier={tier} />
                    ))}
                </div>

                <div className="mt-7 flex justify-center">
                    <Link
                        href={pricing.url()}
                        className="inline-flex items-center gap-1.5 font-medium text-h-accent-fg underline decoration-transparent underline-offset-4 transition-[text-decoration-color] [@media(hover:hover)]:hover:decoration-current"
                    >
                        See full pricing and what’s included
                        <ArrowRight className="size-[15px]" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function TierCard({ tier }: { tier: TierItem }) {
    const featured = tier.slug === 'hybrid';

    return (
        <article
            className={cn(
                'flex flex-col rounded-[20px] bg-h-surface p-2 shadow-h-card',
                featured &&
                    'shadow-[0_0_0_1.5px_var(--h-accent),0_24px_56px_-24px_rgb(79_99_232/0.45)]',
            )}
        >
            <div
                aria-hidden="true"
                className="home-dots grid h-[188px] place-items-center overflow-hidden rounded-xl bg-h-sunken"
            >
                <TierVisual slug={tier.slug} />
            </div>
            <div className="flex flex-1 flex-col px-[18px] pt-[22px] pb-[18px]">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[22px] font-medium tracking-[-0.025em]">
                        {tier.name}
                    </h3>
                    {featured && (
                        <StatusChip tone="accent" dot={false}>
                            Most popular
                        </StatusChip>
                    )}
                </div>
                <p className="mt-0.5 text-sm text-h-fg-3">{tier.tagline}</p>
                <p className="mt-5 flex items-baseline gap-2">
                    <small className="font-mono text-[11px] tracking-[0.06em] text-h-fg-3 uppercase">
                        From
                    </small>
                    <b className="text-[34px] font-medium tracking-[-0.035em] tabular-nums">
                        ${tier.price_min}–${tier.price_max}
                    </b>
                </p>
                <p className="mt-2.5 text-[14.5px] text-pretty text-h-fg-2">
                    {tier.description}
                </p>
                <ul className="mt-5 grid gap-2.5 border-t border-h-line pt-[18px] text-[14.5px]">
                    {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                            <Check className="mt-0.5 size-[15px] shrink-0 text-h-accent-fg" />
                            {feature}
                        </li>
                    ))}
                </ul>
                <span className="flex-1" />
                <p className="mt-5 rounded-[10px] bg-h-sunken px-3.5 py-3 text-[13.5px] text-h-fg-2">
                    <b className="font-medium text-h-fg">Best for</b>{' '}
                    {tier.best_for}
                </p>
                <TierAction tier={tier} featured={featured} />
            </div>
        </article>
    );
}

/** Signed-in clients switch tier in place; guests register with the tier preselected. */
function TierAction({ tier, featured }: { tier: TierItem; featured: boolean }) {
    const { props } = usePage<{
        auth?: { user?: { tier?: string | null } | null };
    }>();
    const user = props.auth?.user;
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
                <span className="relative h-0.5 w-11 bg-[repeating-linear-gradient(90deg,var(--h-line-strong)_0_4px,transparent_4px_8px)]">
                    <span className="absolute top-1/2 left-1/2 -translate-1/2 rounded-md bg-h-sunken px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em] text-h-fg-3 uppercase shadow-[inset_0_0_0_1px_var(--h-line)]">
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
        <div className="w-[82%] rounded-xl bg-h-surface px-3 py-2.5 text-[12.5px] shadow-h-chip">
            <div className="flex justify-between pb-1.5 font-mono text-[10.5px] tracking-[0.06em] text-h-fg-3 uppercase">
                <span>Quarterly estimates</span>
                <span>2026</span>
            </div>
            {quarters.map(([q, due, status]) => (
                <div
                    key={q}
                    className="grid grid-cols-[28px_1fr_auto] items-center gap-2 border-t border-h-line py-1.5"
                >
                    <b className="font-medium">{q}</b>
                    <span className="text-h-fg-3">{due}</span>
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
                'flex items-center gap-2.5 rounded-[10px] bg-h-surface px-2.5 py-[9px] text-[13px] shadow-h-chip',
                className,
            )}
        >
            <span
                className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-md text-[8.5px] font-semibold tracking-[0.02em] text-white',
                    tone === 'red' ? 'bg-[#e25b4b]' : 'bg-h-accent',
                )}
            >
                {badge}
            </span>
            {name}
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
        <div className="grid w-[104px] justify-items-center gap-2 rounded-[14px] bg-h-surface px-2.5 py-3 text-center text-[12.5px] shadow-h-chip sm:w-[120px] sm:px-4 sm:py-3.5">
            <span className="grid size-[34px] place-items-center rounded-full bg-h-fg text-h-bg">
                <Icon className="size-[15px]" />
            </span>
            <span>
                {title}
                <small className="block text-[11.5px] text-h-fg-3">
                    {meta}
                </small>
            </span>
        </div>
    );
}
