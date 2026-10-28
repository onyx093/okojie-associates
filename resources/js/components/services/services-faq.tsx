import { MessageSquare, Plus } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { getServicesFaqs } from '@/content/faqs';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/types/marketing';

export function ServicesFaq({ faqs }: { faqs: FaqItem[] }) {
    const servicesFaqs = React.useMemo(() => getServicesFaqs(faqs), [faqs]);

    return (
        <section
            id="faq"
            aria-labelledby="faq-title"
            className="py-14 sm:py-20"
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
                        Choosing a service
                    </h2>
                    <p className="mt-4 max-w-[34ch] text-[17px] text-muted-foreground">
                        Real questions about tiers, remote filing and
                        preparation.
                    </p>
                </div>

                <div className="grid gap-2">
                    {servicesFaqs.map((faq, i) => (
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
                            <p className="max-w-[65ch] px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
