import { Link } from '@inertiajs/react';
import { ArrowRight, Lock, MapPin, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import {
    FaqList,
    HowItWorks,
    OfficeGrid,
    QuoteFormPanel,
    ReferralBanner,
    StatsStrip,
    TestimonialCarousel,
    TierGrid,
    VideoLibrary,
} from '@/components/marketing';
import { Reveal } from '@/components/reveal';
import { SeoHead } from '@/components/seo-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketingLayout } from '@/layouts/marketing-layout';
import type {
    FaqItem,
    OfficeItem,
    StatItem,
    StepItem,
    TestimonialItem,
    TierItem,
    VideoGroup,
} from '@/types/marketing';

interface HomeProps {
    tiers: TierItem[];
    steps: StepItem[];
    testimonials: TestimonialItem[];
    videos: VideoGroup[];
    offices: OfficeItem[];
    faqs: FaqItem[];
    stats: StatItem[];
}

export default function Home({
    tiers,
    steps,
    testimonials,
    videos,
    offices,
    faqs,
    stats,
}: HomeProps) {
    return (
        <MarketingLayout>
            <SeoHead
                isHome
                title="Okojie & Associates, Inc. — Okojie Online Tax Preparation"
                description="The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Secure portal, e-sign, and e-file with Okojie & Associates."
                faqs={faqs}
                offices={offices}
            />

            {/* 1. Hero Section */}
            <section
                aria-label="Hero"
                className="relative overflow-hidden border-b border-border py-20 sm:py-28 lg:py-36"
            >
                {/* Dark moody skyline background with heavy overlay */}
                {/* Note: In production, source a licensed photo of a moody city skyline at dusk with warm office window lights */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[#14151f]"
                >
                    {/* Atmospheric radial gradient simulating distant city dusk glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1d1f36] via-[#14151f] to-[#0d0e15] opacity-90" />
                    {/* Subtle grid texture */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2b3b0a_1px,transparent_1px),linear-gradient(to_bottom,#2a2b3b0a_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#14151f] to-transparent" />
                </div>

                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <Reveal direction="down">
                            <Badge variant="hero" className="mb-6">
                                26+ years · Philadelphia &amp; Baltimore
                            </Badge>
                        </Reveal>

                        <Reveal direction="up" delay={80}>
                            <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-foreground sm:text-5xl lg:text-[62px]">
                                The convenience of online filing, with a real
                                tax professional.
                            </h1>
                        </Reveal>

                        <Reveal direction="up" delay={140}>
                            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg lg:text-xl">
                                Okojie Online brings 26+ years of Philadelphia
                                and Baltimore tax expertise to a secure, fully
                                remote experience — upload, review, e-sign, and
                                file without leaving home.
                            </p>
                        </Reveal>

                        <Reveal direction="up" delay={200}>
                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Button
                                    asChild
                                    variant="primary"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    <Link href="/contact#start">
                                        Start My Return Online
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto"
                                >
                                    <Link href="/contact#consult">
                                        Book a Free Consultation
                                    </Link>
                                </Button>
                            </div>
                        </Reveal>

                        {/* Trust Row */}
                        <Reveal direction="up" delay={260}>
                            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-border/60 pt-8 sm:gap-10">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                                    <Lock className="size-4 text-primary" />
                                    <span>Secure client portal</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                                    <ShieldCheck className="size-4 text-primary" />
                                    <span>Credentialed preparers</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                                    <MapPin className="size-4 text-primary" />
                                    <span>Local PA &amp; MD knowledge</span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* 2. Stats Strip */}
            <StatsStrip stats={stats} />

            {/* 3. Three Ways to File */}
            <section
                aria-label="Three ways to file"
                className="border-b border-border py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Three ways to file
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Pick the level of support that fits — every tier
                                includes a real, credentialed preparer.
                            </p>
                        </Reveal>
                    </div>

                    <TierGrid tiers={tiers} featuredSlug="hybrid" />

                    <div className="mt-12 text-center">
                        <Reveal direction="up" delay={100}>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                            >
                                See full pricing and what's included
                                <ArrowRight className="ml-1.5 size-4" />
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* 4. How It Works */}
            <section
                aria-label="How it works"
                className="border-b border-border bg-[#181925]/30 py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                How it works
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Five steps from start to filed — no office visit
                                required.
                            </p>
                        </Reveal>
                    </div>

                    <HowItWorks steps={steps} />
                </div>
            </section>

            {/* 5. What Clients Say */}
            <section
                aria-label="What clients say"
                className="border-b border-border py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                What clients say
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Real families and business owners across
                                Philadelphia and Baltimore.
                            </p>
                        </Reveal>
                    </div>

                    <TestimonialCarousel testimonials={testimonials} />
                </div>
            </section>

            {/* 6. Watch & Learn */}
            <section
                aria-label="Watch & Learn"
                className="border-b border-border bg-[#181925]/30 py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Watch &amp; Learn
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Short videos on getting started, using your
                                portal, and hearing from clients.
                            </p>
                        </Reveal>
                    </div>

                    <VideoLibrary groups={videos} />
                </div>
            </section>

            {/* 7. Find Us In Person */}
            <section
                aria-label="Find us in person"
                className="border-b border-border py-20 sm:py-28"
            >
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

            {/* 8. Referral Banner */}
            <section
                aria-label="Referral banner"
                className="border-b border-border bg-[#181925]/40 py-16 sm:py-24"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <ReferralBanner />
                </div>
            </section>

            {/* 9. Quote Form */}
            <section
                aria-label="Start My Return Online"
                className="border-b border-border py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <QuoteFormPanel tiers={tiers} />
                </div>
            </section>

            {/* 10. Frequently Asked Questions */}
            <section
                aria-label="Frequently asked questions"
                className="py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Frequently asked questions
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Have questions about filing online, security, or
                                fees? Here is how it works.
                            </p>
                        </Reveal>
                    </div>

                    <FaqList faqs={faqs} defaultOpenIndices={[0]} />
                </div>
            </section>
        </MarketingLayout>
    );
}
