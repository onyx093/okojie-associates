import { MessageSquare, Plus } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/types/marketing';

export function HomeFaq({ faqs }: { faqs: FaqItem[] }) {
    return (
        <section
            id="faq"
            aria-labelledby="faq-title"
            className="pb-20 sm:pb-[120px]"
        >
            <div
                className={cn(
                    container,
                    'grid items-start gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16',
                )}
            >
                <div>
                    <Eyebrow icon={MessageSquare}>FAQ</Eyebrow>
                    <h2
                        id="faq-title"
                        className="mt-5 text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-foreground"
                    >
                        Questions, answered
                    </h2>
                    <p className="mt-4 max-w-[34ch] text-[17px] text-muted-foreground">
                        Filing online, security, and fees — here’s how it works.
                    </p>
                </div>
                <div className="grid gap-2">
                    {faqs.map((faq, i) => (
                        <details
                            key={faq.question}
                            open={i === 0}
                            className="group rounded-2xl bg-card shadow-card"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-[18px] text-base font-medium text-foreground [&::-webkit-details-marker]:hidden">
                                {faq.question}
                                <span className="group-open:bg-accent-soft group-open:text-accent-fg grid size-7 shrink-0 place-items-center rounded-lg bg-sunken text-muted-foreground transition-[transform,background-color] duration-250 group-open:rotate-45">
                                    <Plus className="size-[15px]" />
                                </span>
                            </summary>
                            <p className="max-w-[65ch] px-5 pb-5 text-[15px] text-muted-foreground">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
