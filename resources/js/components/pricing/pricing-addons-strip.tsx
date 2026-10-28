import { Link } from '@inertiajs/react';
import { ArrowRight, Plus } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { services } from '@/routes';
import type { AddOnItem } from '@/types/marketing';

interface AddonMeta {
    shortName: string;
    subtitle: string;
}

const ADDON_META: Record<string, AddonMeta> = {
    prior_year_amendments: {
        shortName: 'Amendments',
        subtitle: 'Prior-year returns',
    },
    irs_notice_response: {
        shortName: 'IRS notices',
        subtitle: 'We respond for you',
    },
    itin_applications: {
        shortName: 'ITIN',
        subtitle: 'New or renewal',
    },
    bookkeeping: {
        shortName: 'Bookkeeping',
        subtitle: 'Per month',
    },
    quarterly_estimates: {
        shortName: 'Quarterly estimates',
        subtitle: 'Per quarter',
    },
};

export function PricingAddonsStrip({ addons }: { addons: AddOnItem[] }) {
    return (
        <section
            id="addons"
            aria-labelledby="addons-title"
            className="py-14 sm:py-20"
        >
            <div className={container}>
                <div className="mb-9 grid items-end gap-5 sm:mb-12 md:grid-cols-[1fr_auto] md:gap-8">
                    <div>
                        <Eyebrow icon={Plus}>Add-ons</Eyebrow>
                        <h2
                            id="addons-title"
                            className="mt-5 max-w-[14ch] text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-foreground"
                        >
                            Add to any tier
                        </h2>
                    </div>
                    <div>
                        <Link
                            href={services.url()}
                            className="text-accent-fg inline-flex items-center gap-1.5 text-[15px] font-medium transition-colors hover:underline"
                        >
                            <span>What each add-on covers</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </div>

                <div className="rounded-[20px] bg-card p-2 shadow-card">
                    <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
                        {addons.map((addon) => {
                            const meta = ADDON_META[addon.slug] ?? {
                                shortName: addon.name,
                                subtitle: addon.description,
                            };

                            return (
                                <div
                                    key={addon.slug}
                                    className="grid gap-1 p-4.5"
                                >
                                    <b className="font-medium text-foreground">
                                        {meta.shortName}
                                    </b>
                                    <span className="text-accent-fg font-medium tabular-nums">
                                        {addon.price}
                                    </span>
                                    <small className="text-[13px] text-muted-foreground">
                                        {meta.subtitle}
                                    </small>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
