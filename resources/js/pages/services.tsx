import { Link } from '@inertiajs/react';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import * as React from 'react';

import {
    ServicesAddons,
    ServicesFaq,
    ServicesTierFinder,
    ServicesTierList,
} from '@/components/services';
import { Button } from '@/components/primitives';
import { SeoHead } from '@/components/seo-head';
import { SiteLayout } from '@/layouts/site-layout';
import { pricing } from '@/routes';
import type { AddOnItem, FaqItem, TierItem } from '@/types/marketing';

export interface ServicesProps {
    tiers: TierItem[];
    addons: AddOnItem[];
    faqs: FaqItem[];
    userOverride?: { tier?: string | null } | null;
}

export default function Services({
    tiers,
    addons,
    faqs,
    userOverride,
}: ServicesProps) {
    return (
        <SiteLayout
            band={{
                eyebrow: 'Services',
                icon: LayoutGrid,
                title: (
                    <>
                        Tax help that fits <em>your situation.</em>
                    </>
                ),
                lead: 'From a simple W-2 return to multi-state small-business filings. Choose the tier that matches how you want to work, and add specialist help when you need it.',
                ctas: (
                    <>
                        <Button asChild variant="primary" size="lg">
                            <a href="#guide">
                                Help me choose
                                <ArrowRight className="size-[15px]" />
                            </a>
                        </Button>
                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="bg-glass shadow-glass backdrop-blur-md"
                        >
                            <Link href={pricing.url()}>Compare prices</Link>
                        </Button>
                    </>
                ),
            }}
            userOverride={userOverride as any}
        >
            <SeoHead
                title="Services"
                description="From a simple W-2 return to multi-state small-business filings. Choose the tier that matches how you want to work, and add specialist help when you need it."
                faqs={faqs}
            />

            <ServicesTierList tiers={tiers} userOverride={userOverride} />
            <ServicesAddons addons={addons} />
            <ServicesTierFinder />
            <ServicesFaq faqs={faqs} />
        </SiteLayout>
    );
}
