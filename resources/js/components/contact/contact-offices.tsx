import { MapPin } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { Button } from '@/components/primitives';
import type { OfficeItem } from '@/types/marketing';

interface ContactOfficesProps {
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

export function ContactOffices({ offices }: ContactOfficesProps) {
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
                        Walk-ins welcome during office hours. Booking ahead
                        means no wait.
                    </p>
                </div>

                <div className="divide-y divide-border rounded-2xl bg-card p-2 shadow-card">
                    {offices.map((office) => {
                        const telHref = formatTelHref(office.phone);
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${office.address}, ${office.city}`,
                        )}`;

                        return (
                            <div
                                key={office.address}
                                className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 text-[14.5px] sm:px-5 sm:py-4.5 md:grid-cols-[1.2fr_1fr_1.2fr_auto]"
                            >
                                <span className="min-w-0">
                                    <b className="block text-[15px] font-medium text-foreground">
                                        {office.address}
                                    </b>
                                    <small className="block text-[13px] text-muted-foreground">
                                        {office.city}
                                    </small>
                                </span>

                                <a
                                    href={telHref}
                                    className="hidden font-mono text-[14px] text-muted-foreground tabular-nums transition-colors hover:text-foreground md:inline-flex"
                                >
                                    {office.phone}
                                </a>

                                <span className="hidden text-[14px] text-muted-foreground md:inline-flex">
                                    {office.hours}
                                </span>

                                <Button
                                    asChild
                                    variant="secondary"
                                    size="sm"
                                    className="h-[34px] rounded-lg px-3 text-[13.5px]"
                                >
                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MapPin className="size-3.5" />
                                        Directions
                                    </a>
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
