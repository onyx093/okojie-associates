import * as React from 'react';

import { Reveal } from '@/components/reveal';
import { TierCard } from '@/components/marketing/tier-card';
import { cn } from '@/lib/utils';
import type { TierItem } from '@/types/marketing';

interface TierGridProps {
    tiers: TierItem[];
    featuredSlug?: string;
    className?: string;
}

export function TierGrid({
    tiers,
    featuredSlug = 'hybrid',
    className,
}: TierGridProps) {
    return (
        <div
            data-slot="tier-grid"
            className={cn(
                'grid grid-cols-1 items-stretch gap-6 min-[900px]:grid-cols-3',
                className,
            )}
        >
            {tiers.map((tier, idx) => (
                <Reveal
                    key={tier.slug}
                    delay={idx * 80}
                    direction="up"
                    className="h-full"
                >
                    <TierCard
                        tier={tier}
                        featured={tier.slug === featuredSlug}
                    />
                </Reveal>
            ))}
        </div>
    );
}
