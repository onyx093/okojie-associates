import { Link, router, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { Button } from '@/components/primitives';
import { PRICING_COMPARISON_GROUPS } from '@/content/pricing';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import { update as updateTier } from '@/routes/portal/tier';
import type { TierItem } from '@/types/marketing';

function CompareAction({
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
                size="sm"
                className="mt-3.5 w-full"
            >
                <Link href={register.url({ query: { tier: tier.slug } })}>
                    Choose
                </Link>
            </Button>
        );
    }

    const isCurrent = user.tier === tier.slug;

    return (
        <Button
            variant={isFeatured ? 'primary' : 'secondary'}
            size="sm"
            disabled={updating || isCurrent}
            onClick={() => {
                setUpdating(true);
                router.patch(
                    updateTier.url(),
                    { tier: tier.slug },
                    { onFinish: () => setUpdating(false) },
                );
            }}
            className="mt-3.5 w-full cursor-pointer"
        >
            {isCurrent ? 'Current' : updating ? 'Updating…' : 'Choose'}
        </Button>
    );
}

export function PricingCompareTable({
    tiers,
    userOverride,
}: {
    tiers: TierItem[];
    userOverride?: { tier?: string | null } | null;
}) {
    const tierMap = React.useMemo(() => {
        const map = new Map<string, TierItem>();
        for (const t of tiers) {
            map.set(t.slug, t);
        }
        return map;
    }, [tiers]);

    const uploadTier = tierMap.get('upload_and_go') ?? {
        slug: 'upload_and_go',
        name: 'Upload & Go',
        tagline: 'Fully remote',
        price_min: 150,
        price_max: 225,
        price_range: '$150–$225',
        description: '',
        features: [],
        best_for: '',
        cta: 'Choose',
    };

    const hybridTier = tierMap.get('hybrid') ?? {
        slug: 'hybrid',
        name: 'Hybrid',
        tagline: 'Most popular',
        price_min: 225,
        price_max: 350,
        price_range: '$225–$350',
        description: '',
        features: [],
        best_for: '',
        cta: 'Choose',
    };

    const premiumTier = tierMap.get('premium_remote') ?? {
        slug: 'premium_remote',
        name: 'Premium Remote',
        tagline: 'Year-round',
        price_min: 400,
        price_max: 900,
        price_range: '$400–$900',
        description: '',
        features: [],
        best_for: '',
        cta: 'Choose',
    };

    const totalFeatures = PRICING_COMPARISON_GROUPS.reduce(
        (sum, g) => sum + g.features.length,
        0,
    );
    let renderedFeatureCount = 0;

    return (
        <section
            id="compare"
            aria-labelledby="cmp-title"
            className="py-14 sm:py-20"
        >
            <div className={container}>
                <div className="mb-9 grid items-end gap-5 sm:mb-12 md:grid-cols-[1fr_auto] md:gap-8">
                    <div>
                        <Eyebrow icon={LayoutGrid}>Compare</Eyebrow>
                        <h2
                            id="cmp-title"
                            className="mt-5 max-w-[16ch] text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-foreground"
                        >
                            What each tier includes
                        </h2>
                    </div>
                    <p className="max-w-[38ch] text-[17px] text-pretty text-muted-foreground md:text-right">
                        Every tier is prepared by a credentialed professional,
                        not software.
                    </p>
                </div>

                <div className="overflow-x-auto rounded-[20px] bg-card p-2 shadow-card">
                    <table
                        className="w-full min-w-[640px] border-separate border-spacing-0 text-[15px]"
                        aria-label="Tier comparison table"
                    >
                        <caption className="sr-only">
                            What each tier includes
                        </caption>
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="sticky left-0 z-20 w-[34%] border-b border-border bg-card p-4 text-left font-normal"
                                >
                                    <span className="sr-only">Feature</span>
                                </th>
                                <th
                                    scope="col"
                                    className="border-b border-border p-4 pt-5.5 text-center align-bottom font-normal"
                                >
                                    <b className="block text-[19px] font-medium tracking-[-0.02em] text-foreground">
                                        {uploadTier.name}
                                    </b>
                                    <small className="mt-0.5 block text-[13px] font-normal text-muted-foreground">
                                        Fully remote
                                    </small>
                                    <span className="mt-2 block text-[30px] font-medium tracking-[-0.035em] text-foreground tabular-nums">
                                        ${uploadTier.price_min}–$
                                        {uploadTier.price_max}
                                    </span>
                                    <CompareAction
                                        tier={uploadTier}
                                        isFeatured={false}
                                        userOverride={userOverride}
                                    />
                                </th>
                                <th
                                    scope="col"
                                    className="bg-accent-soft rounded-t-[14px] p-4 pt-5.5 text-center align-bottom font-normal"
                                >
                                    <b className="block text-[19px] font-medium tracking-[-0.02em] text-foreground">
                                        {hybridTier.name}
                                    </b>
                                    <small className="text-accent-fg mt-0.5 block text-[13px] font-medium">
                                        Most popular
                                    </small>
                                    <span className="mt-2 block text-[30px] font-medium tracking-[-0.035em] text-foreground tabular-nums">
                                        ${hybridTier.price_min}–$
                                        {hybridTier.price_max}
                                    </span>
                                    <CompareAction
                                        tier={hybridTier}
                                        isFeatured={true}
                                        userOverride={userOverride}
                                    />
                                </th>
                                <th
                                    scope="col"
                                    className="border-b border-border p-4 pt-5.5 text-center align-bottom font-normal"
                                >
                                    <b className="block text-[19px] font-medium tracking-[-0.02em] text-foreground">
                                        {premiumTier.name}
                                    </b>
                                    <small className="mt-0.5 block text-[13px] font-normal text-muted-foreground">
                                        Year-round
                                    </small>
                                    <span className="mt-2 block text-[30px] font-medium tracking-[-0.035em] text-foreground tabular-nums">
                                        ${premiumTier.price_min}–$
                                        {premiumTier.price_max}
                                    </span>
                                    <CompareAction
                                        tier={premiumTier}
                                        isFeatured={false}
                                        userOverride={userOverride}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PRICING_COMPARISON_GROUPS.map((group) => (
                                <React.Fragment key={group.name}>
                                    <tr className="group">
                                        <th
                                            scope="colgroup"
                                            colSpan={2}
                                            className="sticky left-0 z-10 border-b-0 bg-card px-4.5 pt-6 pb-2.5 text-left font-mono text-[11px] tracking-[0.07em] text-muted-foreground uppercase"
                                        >
                                            {group.name}
                                        </th>
                                        <td className="bg-accent-soft border-b-0 px-4.5 pt-6 pb-2.5" />
                                        <td className="border-b-0 px-4.5 pt-6 pb-2.5" />
                                    </tr>
                                    {group.features.map((feature) => {
                                        renderedFeatureCount++;
                                        const isLastRow =
                                            renderedFeatureCount ===
                                            totalFeatures;

                                        return (
                                            <tr
                                                key={feature.label}
                                                className="transition-colors hover:bg-sunken/40"
                                            >
                                                <th
                                                    scope="row"
                                                    className="sticky left-0 z-10 border-b border-border bg-card px-4.5 py-4 text-left font-normal text-muted-foreground"
                                                >
                                                    {feature.label}
                                                </th>
                                                <td className="border-b border-border px-4.5 py-4 text-center">
                                                    {feature.tiers
                                                        .upload_and_go ? (
                                                        <span className="text-accent-fg font-medium">
                                                            ✓
                                                            <span className="sr-only">
                                                                Included in
                                                                Upload &amp; Go
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="text-muted-foreground/60 select-none"
                                                            aria-hidden="true"
                                                        >
                                                            —
                                                            <span className="sr-only">
                                                                Not included
                                                            </span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td
                                                    className={cn(
                                                        'bg-accent-soft px-4.5 py-4 text-center',
                                                        isLastRow
                                                            ? 'rounded-b-[14px]'
                                                            : 'border-b border-border/50',
                                                    )}
                                                >
                                                    {feature.tiers.hybrid ? (
                                                        <span className="text-accent-fg font-medium">
                                                            ✓
                                                            <span className="sr-only">
                                                                Included in
                                                                Hybrid
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="text-muted-foreground/60 select-none"
                                                            aria-hidden="true"
                                                        >
                                                            —
                                                            <span className="sr-only">
                                                                Not included
                                                            </span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="border-b border-border px-4.5 py-4 text-center">
                                                    {feature.tiers
                                                        .premium_remote ? (
                                                        <span className="text-accent-fg font-medium">
                                                            ✓
                                                            <span className="sr-only">
                                                                Included in
                                                                Premium Remote
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="text-muted-foreground/60 select-none"
                                                            aria-hidden="true"
                                                        >
                                                            —
                                                            <span className="sr-only">
                                                                Not included
                                                            </span>
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
