import * as React from 'react';

import { Reveal } from '@/components/reveal';
import { cn } from '@/lib/utils';
import type { StatItem } from '@/types/marketing';

interface StatsStripProps {
    stats: StatItem[];
    align?: 'center' | 'left';
    bordered?: boolean;
    className?: string;
}

export function StatsStrip({
    stats,
    align = 'center',
    bordered = true,
    className,
}: StatsStripProps) {
    return (
        <div
            data-slot="stats-strip"
            className={cn(
                'w-full py-12',
                bordered && 'border-y border-border bg-[#181925]/50',
                className,
            )}
        >
            <div className="mx-auto max-w-[1160px] px-6">
                <div
                    className={cn(
                        'grid gap-8',
                        stats.length === 3
                            ? 'grid-cols-1 sm:grid-cols-3'
                            : 'grid-cols-2 md:grid-cols-4',
                        align === 'center' ? 'text-center' : 'text-left',
                    )}
                >
                    {stats.map((stat, idx) => (
                        <Reveal
                            key={idx}
                            delay={idx * 60}
                            direction="up"
                            className={cn(
                                'flex flex-col',
                                align === 'center'
                                    ? 'items-center'
                                    : 'items-start',
                            )}
                        >
                            <span className="text-3xl leading-none font-bold tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
                                {stat.value}
                            </span>
                            <span className="mt-2 text-xs leading-snug text-muted-foreground sm:text-sm">
                                {stat.label}
                            </span>
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    );
}
