import { Clock, MapPin, Phone } from 'lucide-react';
import * as React from 'react';

import {
    container,
    HomeLinkButton,
    SectionHead,
    StatusChip,
} from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import { contact } from '@/routes';
import type { OfficeItem } from '@/types/marketing';

const roads = [
    ['top-[58%] h-2.5 -rotate-[8deg]', 'left-[30%] w-2 rotate-12'],
    ['top-[40%] h-2 rotate-[4deg]', 'left-[62%] w-2.5 -rotate-6'],
    ['top-[66%] h-[9px] -rotate-[14deg]', 'left-[44%] w-2 rotate-[20deg]'],
    ['top-1/2 h-2.5 rotate-[10deg]', 'left-[24%] w-[9px] -rotate-[4deg]'],
];

export function HomeOffices({ offices }: { offices: OfficeItem[] }) {
    return (
        <section
            id="offices"
            aria-labelledby="offices-title"
            className="scroll-mt-24 pb-20 sm:pb-[120px]"
        >
            <div className={container}>
                <SectionHead
                    id="offices-title"
                    eyebrow="Offices"
                    icon={MapPin}
                    title="Find us in person"
                    description="Three Philadelphia offices and one in Baltimore — or work with us entirely online."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {offices.map((office, i) => {
                        const [h, v] = roads[i % roads.length];

                        return (
                            <article
                                key={office.address}
                                className="flex flex-col rounded-[20px] bg-card p-2 shadow-card"
                            >
                                <div
                                    aria-hidden="true"
                                    className="relative h-[120px] overflow-hidden rounded-xl bg-sunken bg-[radial-gradient(var(--border)_1px,transparent_1.2px)] bg-[size:14px_14px]"
                                >
                                    <span
                                        className={cn(
                                            'absolute -right-2.5 -left-2.5 bg-card shadow-[0_0_0_1px_var(--border)]',
                                            h,
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'absolute -top-2.5 -bottom-2.5 bg-card shadow-[0_0_0_1px_var(--border)]',
                                            v,
                                        )}
                                    />
                                    <span className="bg-accent-solid absolute top-1/2 left-1/2 grid size-[34px] -translate-x-1/2 -translate-y-[70%] -rotate-45 place-items-center rounded-[50%_50%_50%_4px] shadow-btn">
                                        <span className="size-2.5 rounded-full bg-white" />
                                    </span>
                                </div>
                                <div className="grid content-start gap-2.5 px-2.5 pt-4 pb-2.5">
                                    <span className="justify-self-start">
                                        <StatusChip tone="neutral" dot={false}>
                                            {office.city}
                                        </StatusChip>
                                    </span>
                                    <h3 className="text-[17px] font-medium tracking-[-0.01em] text-foreground">
                                        {office.address}
                                    </h3>
                                    <a
                                        href={`tel:${office.phone.replace(/[^\d+]/g, '')}`}
                                        className="hover:text-accent-fg flex items-center gap-2 text-sm text-foreground tabular-nums"
                                    >
                                        <Phone className="text-tertiary size-[15px]" />
                                        {office.phone}
                                    </a>
                                    <span className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <Clock className="text-tertiary mt-0.5 size-[15px] shrink-0" />
                                        <span>
                                            {office.hours
                                                .split(' · ')
                                                .map((line) => (
                                                    <span
                                                        key={line}
                                                        className="block"
                                                    >
                                                        {line}
                                                    </span>
                                                ))}
                                        </span>
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                    <div className="bg-accent-soft flex flex-col items-start justify-between gap-6 rounded-[20px] p-6 shadow-[inset_0_0_0_1px_var(--border)] sm:col-span-2 sm:flex-row sm:items-center sm:px-7 lg:col-span-4">
                        <div>
                            <h3 className="text-xl font-medium tracking-[-0.02em] text-foreground">
                                Prefer to stay home?
                            </h3>
                            <p className="mt-0.5 text-[15px] text-muted-foreground">
                                Our remote tiers work anywhere in the U.S., with
                                multi-state support for PA, MD, NJ, and DE.
                            </p>
                        </div>
                        <HomeLinkButton href={`${contact.url()}#start`}>
                            Start online
                        </HomeLinkButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
