import type { LucideIcon } from 'lucide-react';
import {
    BookOpen,
    Calendar,
    Mail,
    Plus,
    RotateCcw,
    UserCheck,
} from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import type { AddOnItem } from '@/types/marketing';

interface AddonVisual {
    icon: LucideIcon;
    colorClasses: string;
}

const ADDON_VISUALS: Record<string, AddonVisual> = {
    prior_year_amendments: {
        icon: RotateCcw,
        colorClasses: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
    },
    irs_notice_response: {
        icon: Mail,
        colorClasses: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    itin_applications: {
        icon: UserCheck,
        colorClasses:
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    bookkeeping: {
        icon: BookOpen,
        colorClasses: 'bg-rose-500/10 text-rose-500 dark:text-rose-400',
    },
    quarterly_estimates: {
        icon: Calendar,
        colorClasses: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
};

/**
 * Format the addon price. Bookkeeping shows "/ mo" only if the data indicates monthly.
 */
export function formatAddonPrice(addon: AddOnItem): string {
    const isMonthly =
        Boolean((addon as { monthly?: boolean }).monthly) ||
        addon.price.includes('/ mo') ||
        addon.description.toLowerCase().includes('monthly');

    if (addon.price.includes('/ mo')) {
        return addon.price;
    }
    if (isMonthly) {
        return `${addon.price} / mo`;
    }
    return addon.price;
}

export function ServicesAddons({ addons }: { addons: AddOnItem[] }) {
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
                            className="mt-5 max-w-[16ch] text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-foreground"
                        >
                            Extra help, when you need it
                        </h2>
                    </div>
                    <p className="max-w-[38ch] text-[17px] text-pretty text-muted-foreground md:text-right">
                        Available with any tier. Priced as ranges depending on
                        complexity.
                    </p>
                </div>

                <div className="rounded-[20px] bg-card p-2 shadow-card">
                    <div className="divide-y divide-border">
                        {addons.map((addon) => {
                            const visual = ADDON_VISUALS[addon.slug] ?? {
                                icon: Plus,
                                colorClasses: 'bg-accent-soft text-accent-fg',
                            };
                            const Icon = visual.icon;
                            const priceFormatted = formatAddonPrice(addon);

                            return (
                                <div
                                    key={addon.slug}
                                    className="grid grid-cols-[44px_1fr_auto] items-center gap-4 p-4 max-sm:grid-cols-[44px_minmax(0,1fr)] max-sm:p-3.5"
                                >
                                    <div
                                        className={cn(
                                            'grid size-11 place-items-center rounded-xl',
                                            visual.colorClasses,
                                        )}
                                        aria-hidden="true"
                                    >
                                        <Icon className="size-[19px]" />
                                    </div>

                                    <div>
                                        <b className="block text-base font-medium text-foreground">
                                            {addon.name}
                                        </b>
                                        <p className="mt-0.5 text-[14.5px] text-muted-foreground">
                                            {addon.description}
                                        </p>
                                    </div>

                                    <div className="text-right text-[15px] font-medium whitespace-nowrap text-foreground tabular-nums max-sm:col-start-2 max-sm:text-left">
                                        {priceFormatted}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
