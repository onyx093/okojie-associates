import * as React from 'react';

import { Reveal } from '@/components/reveal';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StepItem } from '@/types/marketing';

interface HowItWorksProps {
    steps: StepItem[];
    className?: string;
}

export function HowItWorks({ steps, className }: HowItWorksProps) {
    return (
        <div
            data-slot="how-it-works"
            className={cn(
                'grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5',
                className,
            )}
        >
            {steps.map((stepItem, idx) => (
                <Reveal
                    key={stepItem.step}
                    delay={idx * 70}
                    direction="up"
                    className="h-full"
                >
                    <Card className="relative flex h-full flex-col justify-start overflow-hidden p-6 transition-colors hover:border-border-strong">
                        <CardHeader className="p-0">
                            <span className="mb-2 block text-xs font-semibold tracking-[0.06em] text-primary uppercase">
                                STEP {stepItem.step}
                            </span>
                            <CardTitle className="text-lg font-bold text-foreground">
                                {stepItem.title}
                            </CardTitle>
                            <CardDescription className="mt-2 text-sm leading-relaxed text-body">
                                {stepItem.body}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Reveal>
            ))}
        </div>
    );
}
