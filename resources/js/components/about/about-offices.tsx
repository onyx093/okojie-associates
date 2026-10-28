import { Clock, MapPin, Phone } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { Chip } from '@/components/primitives';
import type { OfficeItem } from '@/types/marketing';

interface AboutOfficesProps {
    offices: OfficeItem[];
}

function formatTelHref(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
        return `tel:${cleaned}`;
    }
    const digitsOnly = cleaned.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
        return `tel:+1${digitsOnly}`;
    }
    return `tel:+${digitsOnly}`;
}

export function AboutOffices({ offices }: AboutOfficesProps) {
    return (
        <section aria-labelledby="off-t" className="pb-16 sm:pb-24">
            <div className={container}>
                <div className="mb-8 grid items-end gap-4 sm:mb-12 md:grid-cols-[1fr_auto] md:gap-8">
                    <div>
                        <Eyebrow icon={MapPin}>Offices</Eyebrow>
                        <h2
                            id="off-t"
                            className="mt-4.5 max-w-[18ch] text-[clamp(32px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.035em] text-foreground"
                        >
                            Find us in person
                        </h2>
                    </div>
                    <p className="max-w-[40ch] text-[16.5px] text-muted-foreground md:text-right">
                        Three Philadelphia offices and one in Baltimore, or work
                        with us entirely online.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {offices.map((office) => {
                        const telHref = formatTelHref(office.phone);

                        return (
                            <div
                                key={office.address}
                                className="grid content-start gap-2 rounded-2xl bg-card p-5 shadow-card"
                            >
                                <Chip
                                    tone="neutral"
                                    className="justify-self-start"
                                >
                                    {office.city}
                                </Chip>
                                <h3 className="text-[17px] font-medium text-foreground">
                                    {office.address}
                                </h3>
                                <a
                                    href={telHref}
                                    className="flex items-center gap-2 font-mono text-sm text-muted-foreground tabular-nums transition-colors hover:text-foreground"
                                >
                                    <Phone className="size-3.5 shrink-0 text-muted-foreground/70" />
                                    <span>{office.phone}</span>
                                </a>
                                <span className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Clock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
                                    <span>{office.hours}</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
