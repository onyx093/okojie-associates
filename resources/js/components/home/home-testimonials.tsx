import { Quote } from 'lucide-react';
import * as React from 'react';

import { container, SectionHead } from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import type { TestimonialItem } from '@/types/marketing';

const avatarGradients = [
    'from-[#a9b4ff] to-[#f6c7b0]',
    'from-[#9ee2c4] to-[#a8c3ff]',
    'from-[#ffd2a1] to-[#f7a9c4]',
    'from-[#c9b8ff] to-[#9fd5ff]',
    'from-[#ffe29a] to-[#b8e5a8]',
];

function initials(name: string) {
    return name
        .replace(/[^A-Za-z ]/g, '')
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function Person({
    item,
    index,
    inverse = false,
}: {
    item: TestimonialItem;
    index: number;
    inverse?: boolean;
}) {
    return (
        <figcaption className="relative flex items-center gap-3">
            <span
                className={cn(
                    'grid size-[38px] shrink-0 place-items-center rounded-full bg-linear-135 text-[13px] font-semibold text-[#1b1d3a] outline outline-1 -outline-offset-1 outline-black/5',
                    avatarGradients[index % avatarGradients.length],
                )}
            >
                {initials(item.name)}
            </span>
            <span>
                <b className="block text-[14.5px] font-medium">{item.name}</b>
                <small
                    className={cn(
                        'text-[13px]',
                        inverse ? 'text-white/60' : 'text-tertiary',
                    )}
                >
                    {item.location}
                </small>
            </span>
        </figcaption>
    );
}

export function HomeTestimonials({
    testimonials,
}: {
    testimonials: TestimonialItem[];
}) {
    const [featured, ...rest] = testimonials;

    if (!featured) {
        return null;
    }

    return (
        <section aria-labelledby="quotes-title" className="py-20 sm:py-[120px]">
            <div className={container}>
                <SectionHead
                    id="quotes-title"
                    eyebrow="Client stories"
                    icon={Quote}
                    title="What clients say"
                    description="Families and business owners across Philadelphia and Baltimore."
                />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr]">
                    <figure className="relative m-0 flex flex-col justify-between gap-6 overflow-hidden rounded-[20px] bg-foreground p-6 text-background shadow-card sm:p-7 md:col-span-2 lg:col-span-1 lg:row-span-2">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-40 -right-40 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(94_112_240/0.55),transparent)]"
                        />
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-44 -left-36 size-[360px] rounded-full bg-[radial-gradient(closest-side,rgb(246_170_130/0.35),transparent)]"
                        />
                        <span
                            aria-hidden="true"
                            className="text-accent-fg relative h-7 font-serif text-[64px] leading-[0.6]"
                        >
                            “
                        </span>
                        <blockquote className="relative m-0 text-[clamp(22px,2.3vw,28px)] leading-[1.3] tracking-[-0.02em]">
                            {featured.quote}
                        </blockquote>
                        <Person item={featured} index={0} inverse />
                    </figure>
                    {rest.map((item, i) => (
                        <figure
                            key={item.name}
                            className="m-0 flex flex-col justify-between gap-6 rounded-[20px] bg-card p-6 shadow-card sm:p-7"
                        >
                            <blockquote className="m-0 text-[16.5px] leading-[1.55] text-foreground">
                                “{item.quote}”
                            </blockquote>
                            <Person item={item} index={i + 1} />
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
