import { usePage } from '@inertiajs/react';
import { Clock, Mail, Phone } from 'lucide-react';
import * as React from 'react';

import { container } from '@/components/home/primitives';
import type { SiteConfig } from '@/types';

export function ContactWays() {
    const { props } = usePage<{ site?: SiteConfig }>();
    const site = props.site;

    const phone = site?.contact?.phone ?? '(215) 555-0142';
    const email = site?.contact?.email ?? 'hello@okojieonline.com';
    const hours = site?.contact?.hours ?? 'Mon–Fri 9am–6pm';

    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const telHref = cleanPhone.startsWith('+')
        ? `tel:${cleanPhone}`
        : cleanPhone.length === 10
          ? `tel:+1${cleanPhone}`
          : `tel:+${cleanPhone}`;

    return (
        <section
            aria-label="Ways to reach us"
            className="relative z-10 -mt-10 mb-12 sm:-mt-14 sm:mb-16"
        >
            <div className={container}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <a
                        href={telHref}
                        className="flex items-start gap-3.5 rounded-2xl bg-card p-5 shadow-card transition-colors hover:border-border-strong"
                    >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                            <Phone className="size-[18px]" />
                        </span>
                        <div>
                            <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                Call us
                            </span>
                            <b className="mt-1 block font-mono text-lg font-medium tracking-tight text-foreground tabular-nums">
                                {phone}
                            </b>
                            <small className="text-xs text-muted-foreground">
                                Main office, Philadelphia
                            </small>
                        </div>
                    </a>

                    <a
                        href={`mailto:${email}`}
                        className="flex items-start gap-3.5 rounded-2xl bg-card p-5 shadow-card transition-colors hover:border-border-strong"
                    >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Mail className="size-[18px]" />
                        </span>
                        <div>
                            <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                Email
                            </span>
                            <b className="mt-1 block text-lg font-medium tracking-tight text-foreground">
                                {email}
                            </b>
                            <small className="text-xs text-muted-foreground">
                                We reply within one business day
                            </small>
                        </div>
                    </a>

                    <div className="flex items-start gap-3.5 rounded-2xl bg-card p-5 shadow-card">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <Clock className="size-[18px]" />
                        </span>
                        <div>
                            <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                                Hours
                            </span>
                            <b className="mt-1 block text-lg font-medium tracking-tight text-foreground">
                                {hours}
                            </b>
                            <small className="text-xs text-muted-foreground">
                                Some offices open Saturdays
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
