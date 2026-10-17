import * as React from 'react';

import { Reveal } from '@/components/reveal';
import { OfficeCard } from '@/components/marketing/office-card';
import { cn } from '@/lib/utils';
import type { OfficeItem } from '@/types/marketing';

interface OfficeGridProps {
    offices: OfficeItem[];
    className?: string;
}

export function OfficeGrid({ offices, className }: OfficeGridProps) {
    return (
        <div
            data-slot="office-grid"
            className={cn(
                'grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4',
                className,
            )}
        >
            {offices.map((office, idx) => (
                <Reveal
                    key={`${office.address}-${idx}`}
                    delay={idx * 60}
                    direction="up"
                    className="h-full"
                >
                    <OfficeCard office={office} />
                </Reveal>
            ))}
        </div>
    );
}
