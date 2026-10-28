import { Sparkles } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import type { StatItem } from '@/types/marketing';

interface AboutStoryProps {
    stats: StatItem[];
}

export function AboutStory({ stats }: AboutStoryProps) {
    return (
        <section aria-labelledby="story-t" className="py-14 sm:py-20">
            <div className={container}>
                <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-16">
                    <div>
                        <Eyebrow icon={Sparkles}>Our story</Eyebrow>
                        <h2
                            id="story-t"
                            className="mt-4.5 text-[clamp(32px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.035em] text-foreground"
                        >
                            The same people, a lot less hassle
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[21px] leading-[1.45] tracking-[-0.015em] text-foreground">
                            We’ve always helped neighbors make sense of their
                            taxes face to face.
                        </p>
                        <p className="text-[17px] leading-[1.65] text-muted-foreground">
                            Today we have three Philadelphia offices and one in
                            Baltimore, and a secure online portal so you can
                            upload, review, sign and pay without taking time off
                            work.
                        </p>
                        <p className="text-[17px] leading-[1.65] text-muted-foreground">
                            What hasn’t changed: every return is prepared by a
                            credentialed professional who knows Pennsylvania and
                            Maryland, and you can always talk to a real person.
                        </p>
                    </div>
                </div>

                <div className="mt-14 grid grid-cols-2 gap-y-7 sm:mt-18 lg:grid-cols-4 lg:gap-y-0">
                    {stats.map((stat, idx) => {
                        const borderClasses =
                            idx === 0
                                ? 'border-l-0 pl-0'
                                : idx === 1
                                  ? 'border-l border-border-strong pl-5 sm:pl-7'
                                  : idx === 2
                                    ? 'border-l-0 pl-0 lg:border-l lg:border-border-strong lg:pl-7'
                                    : 'border-l border-border-strong pl-5 sm:pl-7';

                        return (
                            <div
                                key={stat.label}
                                className={cn(
                                    'py-2 pr-4 sm:pr-7',
                                    borderClasses,
                                )}
                            >
                                <b className="block text-[clamp(36px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.04em] text-foreground tabular-nums">
                                    {stat.value}
                                </b>
                                <span className="mt-1.5 block font-mono text-xs tracking-[0.06em] text-muted-foreground uppercase">
                                    {stat.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
