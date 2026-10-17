import * as React from 'react';

import { Reveal } from '@/components/reveal';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AddOnItem } from '@/types/marketing';

interface AddOnCardsProps {
    addOns: AddOnItem[];
    className?: string;
}

export function AddOnCards({ addOns, className }: AddOnCardsProps) {
    return (
        <div
            data-slot="add-on-cards"
            className={cn(
                'mx-auto grid max-w-[840px] grid-cols-1 gap-5 sm:grid-cols-2',
                className,
            )}
        >
            {addOns.map((addOn, idx) => (
                <Reveal
                    key={addOn.slug}
                    delay={idx * 60}
                    direction="up"
                    className="h-full"
                >
                    <Card className="flex h-full flex-col justify-between p-6 transition-colors hover:border-border-strong">
                        <CardHeader className="p-0 pb-3">
                            <div className="flex items-start justify-between gap-3">
                                <CardTitle className="text-base leading-snug font-semibold text-foreground">
                                    {addOn.name}
                                </CardTitle>
                                <span className="shrink-0 text-sm font-bold whitespace-nowrap text-primary">
                                    {addOn.price}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <CardDescription className="text-sm leading-relaxed text-body">
                                {addOn.description}
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Reveal>
            ))}
        </div>
    );
}
