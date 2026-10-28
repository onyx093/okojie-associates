import { MessageSquare } from 'lucide-react';
import * as React from 'react';

import { ContactForm, ContactOffices, ContactWays } from '@/components/contact';
import { SeoHead } from '@/components/seo-head';
import { SiteLayout } from '@/layouts/site-layout';
import type { OfficeItem, TierItem } from '@/types/marketing';

export interface ContactProps {
    offices: OfficeItem[];
    tiers: TierItem[];
    initialTier?: string;
    referralCode?: string;
    userOverride?: { tier?: string | null } | null;
}

export default function Contact({
    offices,
    tiers,
    initialTier = '',
    referralCode = '',
    userOverride,
}: ContactProps) {
    return (
        <SiteLayout
            band={{
                eyebrow: 'Contact',
                icon: MessageSquare,
                title: (
                    <>
                        Talk to a <em>real person.</em>
                    </>
                ),
                lead: 'Start your return online, book a free consultation, or reach us at any of our four offices.',
            }}
            userOverride={userOverride as any}
        >
            <SeoHead
                title="Contact"
                description="Start your return online, book a free consultation, or reach us at any of our four offices in Philadelphia and Baltimore."
                offices={offices}
            />

            <ContactWays />
            <ContactForm
                tiers={tiers}
                initialTier={initialTier}
                referralCode={referralCode}
            />
            <ContactOffices offices={offices} />
        </SiteLayout>
    );
}
