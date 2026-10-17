import * as React from 'react';

import {
    AddOnTable,
    FaqList,
    QuoteFormPanel,
    TierGrid,
} from '@/components/marketing';
import { Reveal } from '@/components/reveal';
import { SeoHead } from '@/components/seo-head';
import { MarketingLayout } from '@/layouts/marketing-layout';
import type { AddOnItem, FaqItem, TierItem } from '@/types/marketing';

interface ServicesProps {
    tiers: TierItem[];
    addons: AddOnItem[];
    faqs: FaqItem[];
}

export default function Services({ tiers, addons, faqs }: ServicesProps) {
    return (
        <MarketingLayout>
            <SeoHead
                title="Services"
                description="From a simple W-2 return to multi-state small-business filings — choose the tier that matches your situation, and add specialized help when you need it."
                faqs={faqs}
            />

            {/* Page Header */}
            <section
                aria-label="Services Header"
                className="border-b border-border py-16 sm:py-24"
            >
                <div className="mx-auto max-w-[1160px] px-6 text-center">
                    <Reveal direction="down">
                        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                            What We Offer
                        </span>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Services
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
                            From a simple W-2 return to multi-state
                            small-business filings — choose the tier that
                            matches your situation, and add specialized help
                            when you need it.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Tiers Section */}
            <section
                aria-label="Service Tiers"
                className="border-b border-border py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <TierGrid tiers={tiers} featuredSlug="hybrid" />
                </div>
            </section>

            {/* Add-ons Table Section */}
            <section
                aria-label="Add-on Services"
                className="border-b border-border bg-[#181925]/30 py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Add-ons
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Available with any tier. Priced as ranges
                                depending on complexity.
                            </p>
                        </Reveal>
                    </div>

                    <AddOnTable addOns={addons} />
                </div>
            </section>

            {/* Quote Panel Variant ("Not sure which tier fits?") */}
            <section
                aria-label="Guidance Form"
                className="border-b border-border py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <QuoteFormPanel variant="services" tiers={tiers} />
                </div>
            </section>

            {/* FAQ Section */}
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
                                Real questions about choosing a service tier,
                                remote filing, and tax preparation.
                            </p>
                        </Reveal>
                    </div>

                    <FaqList faqs={faqs} defaultOpenIndices={[0]} />
                </div>
            </section>
        </MarketingLayout>
    );
}
