import { Building2 } from 'lucide-react';
import * as React from 'react';

import {
    AboutOffices,
    AboutSecurity,
    AboutStory,
    AboutTeam,
} from '@/components/about';
import { SeoHead } from '@/components/seo-head';
import { SiteLayout } from '@/layouts/site-layout';
import type { OfficeItem, StatItem } from '@/types/marketing';

export interface AboutProps {
    stats: StatItem[];
    offices: OfficeItem[];
    userOverride?: { tier?: string | null } | null;
}

export default function About({ stats, offices, userOverride }: AboutProps) {
    return (
        <SiteLayout
            band={{
                eyebrow: 'About us',
                icon: Building2,
                title: (
                    <>
                        A neighborhood firm, <em>now online.</em>
                    </>
                ),
                lead: 'For more than 26 years, Okojie & Associates has prepared returns for Philadelphia and Baltimore families and small businesses.',
            }}
            userOverride={userOverride as any}
        >
            <SeoHead
                title="About"
                description="For more than 26 years, Okojie & Associates has prepared returns for Philadelphia and Baltimore families and small businesses."
                offices={offices}
            />

            <AboutStory stats={stats} />
            <AboutTeam />
            <AboutSecurity />
            <AboutOffices offices={offices} />
        </SiteLayout>
    );
}
