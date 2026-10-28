import * as React from 'react';

import {
    HomeFaq,
    HomeFinalCta,
    HomeHero,
    HomeIntake,
    HomeOffices,
    HomeReferral,
    HomeStats,
    HomeSteps,
    HomeTestimonials,
    HomeTiers,
    HomeVideos,
} from '@/components/home';
import { SiteLayout } from '@/layouts/site-layout';
import type { User } from '@/types';
import type {
    FaqItem,
    OfficeItem,
    StatItem,
    StepItem,
    TestimonialItem,
    TierItem,
    VideoGroup,
} from '@/types/marketing';

export interface HomeProps {
    tiers: TierItem[];
    steps: StepItem[];
    testimonials: TestimonialItem[];
    videos: VideoGroup[];
    offices: OfficeItem[];
    faqs: FaqItem[];
    stats: StatItem[];
    photoSrc?: string | null;
    userOverride?: User | null;
}

export default function Home({
    tiers,
    steps,
    testimonials,
    videos,
    offices,
    faqs,
    stats,
    photoSrc,
    userOverride,
}: HomeProps) {
    return (
        <SiteLayout
            seo={{
                isHome: true,
                title: 'Okojie & Associates, Inc. — Okojie Online Tax Preparation',
                description:
                    'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Secure portal, e-sign, and e-file with Okojie & Associates.',
                faqs,
                offices,
            }}
            hero={<HomeHero photoSrc={photoSrc} />}
            offices={offices}
            userOverride={userOverride}
            mainClassName="grid gap-12 sm:gap-16 lg:gap-24"
        >
            <HomeStats stats={stats} />
            <HomeTiers tiers={tiers} userOverride={userOverride} />
            <HomeSteps steps={steps} />
            <HomeTestimonials testimonials={testimonials} />
            <HomeVideos groups={videos} />
            <HomeOffices offices={offices} />
            <HomeReferral />
            <HomeIntake tiers={tiers} />
            <HomeFaq faqs={faqs} />
            <HomeFinalCta />
        </SiteLayout>
    );
}
