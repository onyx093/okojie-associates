import { CreditCard } from 'lucide-react';
import * as React from 'react';

import {
    PricingAddonsStrip,
    PricingCompareTable,
    PricingFaq,
    PricingPaymentSteps,
} from '@/components/pricing';
import { SeoHead } from '@/components/seo-head';
import { SiteLayout } from '@/layouts/site-layout';
import type { AddOnItem, FaqItem, TierItem } from '@/types/marketing';

export interface PricingProps {
    tiers: TierItem[];
    addons: AddOnItem[];
    faqs: FaqItem[];
    userOverride?: { tier?: string | null } | null;
}

export default function Pricing({
    tiers,
    addons,
    faqs,
    userOverride,
}: PricingProps) {
    return (
        <SiteLayout
            band={{
                eyebrow: 'Pricing',
                icon: CreditCard,
                title: (
                    <>
                        Clear prices. <em>No surprises.</em>
                    </>
                ),
                lead: 'Fees are shown as starting ranges. You’ll always see your exact price in your portal before we file.',
            }}
            userOverride={userOverride as any}
        >
            <SeoHead
                title="Pricing"
                description="Fees are shown as starting ranges. You will always know your exact price before we file — no surprises."
                faqs={faqs}
            />

            <PricingCompareTable tiers={tiers} userOverride={userOverride} />
            <PricingAddonsStrip addons={addons} />
            <PricingPaymentSteps />
            <PricingFaq faqs={faqs} />
        </SiteLayout>
    );
}
