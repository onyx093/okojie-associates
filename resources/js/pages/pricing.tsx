import * as React from 'react';

import { AddOnCards, FaqList, TierGrid } from '@/components/marketing';
import { Reveal } from '@/components/reveal';
import { SeoHead } from '@/components/seo-head';
import { MarketingLayout } from '@/layouts/marketing-layout';
import type { AddOnItem, FaqItem, TierItem } from '@/types/marketing';

interface PricingProps {
    tiers: TierItem[];
    addons: AddOnItem[];
    faqs: FaqItem[];
}

export default function Pricing({ tiers, addons, faqs }: PricingProps) {
    return (
        <MarketingLayout>
            <SeoHead
                title="Pricing"
                description="Fees are shown as starting ranges. You will always know your exact price before we file — no surprises."
                faqs={faqs}
            />

            {/* Page Header */}
            <section
                aria-label="Pricing Header"
                className="border-b border-border py-16 sm:py-24"
            >
                <div className="mx-auto max-w-[1160px] px-6 text-center">
                    <Reveal direction="down">
                        <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                            Simple &amp; Clear
                        </span>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Transparent pricing
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
                            Fees are shown as starting ranges. You will always
                            know your exact price before we file — no surprises.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Tiers Section */}
            <section
                aria-label="Filing Tiers"
                className="border-b border-border py-20 sm:py-28"
            >
                <div className="mx-auto max-w-[1160px] px-6">
                    <TierGrid tiers={tiers} featuredSlug="hybrid" />
                </div>
            </section>

            {/* Add-ons Cards Section */}
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
                                Add any of these to your tier.
                            </p>
                        </Reveal>
                    </div>

                    <AddOnCards addOns={addons} />
                </div>
            </section>

            {/* Pricing Questions FAQ Section */}
            <section aria-label="Pricing questions" className="py-20 sm:py-28">
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <Reveal direction="up">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Pricing questions
                            </h2>
                            <p className="mt-4 text-base text-body sm:text-lg">
                                Clear answers about our fees, payments, and
                                billing.
                            </p>
                        </Reveal>
                    </div>

                    <FaqList faqs={faqs} defaultOpenIndices={[3]} />
                </div>
            </section>
        </MarketingLayout>
    );
}
