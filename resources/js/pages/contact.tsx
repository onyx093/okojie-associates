import { Clock, Mail, Phone } from 'lucide-react';
import * as React from 'react';

import {
    ConsultFormCard,
    OfficeGrid,
    QuoteFormPanel,
} from '@/components/marketing';
import { Reveal } from '@/components/reveal';
import { SeoHead } from '@/components/seo-head';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import type { OfficeItem, TierItem } from '@/types/marketing';

interface ContactProps {
    offices: OfficeItem[];
    tiers: TierItem[];
    initialTier?: string;
    referralCode?: string;
}

export default function Contact({
    offices,
    tiers,
    initialTier = '',
    referralCode = '',
}: ContactProps) {
    const infoCards = [
        {
            icon: Phone,
            title: 'Call us',
            detail: '(215) 555-0142',
            href: 'tel:2155550142',
        },
        {
            icon: Mail,
            title: 'Email',
            detail: 'hello@okojieonline.com',
            href: 'mailto:hello@okojieonline.com',
        },
        {
            icon: Clock,
            title: 'Hours',
            detail: 'Mon–Fri 9am–6pm',
        },
    ];

    return (
        <MarketingLayout>
            <SeoHead
                title="Contact"
                description="Start your return online, book a free consultation, or reach us at any of our four offices in Philadelphia and Baltimore."
                offices={offices}
            />

            {/* Header */}
            <section
                aria-label="Contact Header"
                className="border-b border-border py-16 sm:py-24"
            >
                <div className="mx-auto max-w-[1160px] px-6 text-center">
                    <Reveal direction="down">
                        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                            Reach Out
                        </span>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Get in touch
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
                            Start your return online, book a free consultation,
                            or reach us at any of our four offices.
                        </p>
                    </Reveal>

                    {/* 3 Info Cards (Centered Row) */}
                    <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
                        {infoCards.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <Reveal
                                    key={item.title}
                                    direction="up"
                                    delay={idx * 60}
                                >
                                    <Card className="border-border bg-[#181925]/70 text-center transition-colors hover:border-primary/40">
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <IconComponent className="size-5" />
                                            </div>
                                            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                {item.title}
                                            </h2>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="mt-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                                >
                                                    {item.detail}
                                                </a>
                                            ) : (
                                                <span className="mt-1 text-sm font-semibold text-foreground">
                                                    {item.detail}
                                                </span>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Quote Panel (#start) */}
            <section
                aria-label="Start My Return Online"
                className="border-b border-border py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <QuoteFormPanel
                        id="start"
                        initialTier={initialTier}
                        referralCode={referralCode}
                        tiers={tiers}
                    />
                </div>
            </section>

            {/* Consultation Card (#consult) */}
            <section
                aria-label="Book a free consultation"
                className="border-b border-border bg-[#181925]/30 py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <ConsultFormCard id="consult" referralCode={referralCode} />
                </div>
            </section>

            {/* Offices Section */}
            <section aria-label="Find us in person" className="py-20 sm:py-28">
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Find us in person
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Three Philadelphia offices and one in Baltimore
                                — or work with us entirely online.
                            </p>
                        </Reveal>
                    </div>

                    <OfficeGrid offices={offices} />
                </div>
            </section>
        </MarketingLayout>
    );
}
