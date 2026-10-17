import { FileCheck, KeyRound, Lock, ShieldCheck, Users } from 'lucide-react';
import * as React from 'react';

import { OfficeGrid, StatsStrip } from '@/components/marketing';
import { Reveal } from '@/components/reveal';
import { SeoHead } from '@/components/seo-head';
import { Card, CardContent } from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import type { OfficeItem, StatItem } from '@/types/marketing';

interface AboutProps {
    stats: StatItem[];
    offices: OfficeItem[];
}

export default function About({ stats, offices }: AboutProps) {
    const securityCards = [
        {
            icon: ShieldCheck,
            title: 'IRS Publication 4557',
            description:
                "We follow the IRS's data-security guidance for tax professionals.",
        },
        {
            icon: Lock,
            title: 'FTC Safeguards Rule',
            description:
                'A written information security plan (WISP) governs how we protect client data.',
        },
        {
            icon: KeyRound,
            title: 'Multi-factor authentication',
            description: 'Every client account is protected with MFA.',
        },
        {
            icon: FileCheck,
            title: 'IRS-compliant e-signature',
            description:
                'Form 8879 e-file authorization with Form 7216 consent.',
        },
    ];

    return (
        <MarketingLayout>
            <SeoHead
                title="About"
                description="Okojie & Associates, Inc. has prepared tax returns for Philadelphia and Baltimore families and small businesses for over 26 years."
                offices={offices}
            />

            {/* 1. Text Hero */}
            <section
                aria-label="About Header"
                className="border-b border-border py-16 sm:py-24"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <Reveal direction="down">
                            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                Our Story
                            </span>
                            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                A neighborhood firm, now online
                            </h1>
                            <p className="mx-auto mt-6 text-base leading-relaxed text-body sm:text-lg lg:text-xl">
                                Okojie &amp; Associates, Inc. has prepared tax
                                returns for Philadelphia and Baltimore families
                                and small businesses for over 26 years. Okojie
                                Online is the same firm — the same credentialed
                                preparers — with a secure, fully remote way to
                                work with us.
                            </p>
                        </Reveal>
                    </div>

                    {/* 2. Rounded Photo Banner Placeholder */}
                    {/* Note: In production, insert licensed team photo: four diverse professionals around a table reviewing documents, laptop, and calculator */}
                    <div className="mt-12 sm:mt-16">
                        <Reveal direction="up" delay={100}>
                            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[18px] border border-border bg-[#181925] shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#14151f] via-[#1a1b2e] to-[#252849] opacity-90" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
                                        <Users className="size-8" />
                                    </div>
                                    <span className="text-sm font-semibold tracking-wide text-foreground sm:text-base">
                                        Okojie &amp; Associates Preparer Team
                                    </span>
                                    <span className="mt-1 max-w-md text-xs text-muted-foreground sm:text-sm">
                                        Licensed photo placeholder: four diverse
                                        tax professionals reviewing documents
                                        with laptop &amp; calculator
                                    </span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* 3. 3 Stats Row (Left-aligned) */}
            <StatsStrip stats={stats} align="left" />

            {/* 4. Your Data is Protected */}
            <section
                aria-label="Security and Compliance"
                className="border-b border-border py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                Compliance &amp; Trust
                            </span>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Your data is protected
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Security is not an afterthought — it is built
                                into every step of how we work.
                            </p>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {securityCards.map((card, idx) => {
                            const IconComponent = card.icon;
                            return (
                                <Reveal
                                    key={card.title}
                                    direction="up"
                                    delay={idx * 60}
                                    className="h-full"
                                >
                                    <Card className="h-full border-border bg-[#181925]/70 transition-all hover:border-primary/40">
                                        <CardContent className="flex flex-col p-6 sm:p-7">
                                            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <IconComponent className="size-6" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {card.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-body">
                                                {card.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. Find Us In Person */}
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
