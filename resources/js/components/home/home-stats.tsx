import * as React from 'react';

import { container } from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import type { StatItem } from '@/types/marketing';

export function HomeStats({ stats }: { stats: StatItem[] }) {
    return (
        <div className={container}>
            <dl className="mt-12 grid grid-cols-2 gap-y-7 sm:mt-[72px] md:grid-cols-4">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className={cn(
                            'flex flex-col-reverse border-l border-border-strong px-4 py-2 sm:px-7',
                            i % 2 === 0 && 'border-l-0 pl-0 sm:pl-0',
                            i === 2 && 'md:border-l md:pl-7',
                        )}
                    >
                        <dt className="text-tertiary mt-1.5 font-mono text-xs leading-snug tracking-[0.06em] uppercase">
                            {stat.label}
                        </dt>
                        <dd className="text-[clamp(36px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.04em] text-foreground tabular-nums">
                            {stat.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
