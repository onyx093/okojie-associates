import * as React from 'react';

import {
    HomeFaq,
    HomeFinalCta,
    HomeFooter,
    HomeIntake,
    HomeReferral,
} from '@/components/home/home-closing';
import { HomeHero } from '@/components/home/home-hero';
import type { HomeTheme } from '@/components/home/home-nav';
import {
    HomeOffices,
    HomeSteps,
    HomeTestimonials,
    HomeVideos,
} from '@/components/home/home-sections';
import { HomeStats, HomeTiers } from '@/components/home/home-tiers';
import { SeoHead } from '@/components/seo-head';
import { useAppearance } from '@/hooks/use-appearance';
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
    theme: HomeTheme;
    tiers: TierItem[];
    steps: StepItem[];
    testimonials: TestimonialItem[];
    videos: VideoGroup[];
    offices: OfficeItem[];
    faqs: FaqItem[];
    stats: StatItem[];
}

export default function Home({
    theme: initialTheme,
    tiers,
    steps,
    testimonials,
    videos,
    offices,
    faqs,
    stats,
}: HomeProps) {
    // The homepage supports light and dark; the theme comes from the
    // `appearance` cookie so the server render matches the client.
    const [theme, setTheme] = React.useState<HomeTheme>(initialTheme);
    const { updateAppearance } = useAppearance();

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        updateAppearance(next);
    };

    return (
        <div data-theme={theme} className="home min-h-screen overflow-x-clip">
            <SeoHead
                isHome
                title="Okojie & Associates, Inc. — Okojie Online Tax Preparation"
                description="The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Secure portal, e-sign, and e-file with Okojie & Associates."
                faqs={faqs}
                offices={offices}
            />
            <a
                href="#main"
                className="absolute -top-12 left-4 z-50 rounded-[10px] bg-h-surface px-3.5 py-2.5 shadow-h-chip focus-visible:top-4"
            >
                Skip to content
            </a>

            <HomeHero theme={theme} onToggleTheme={toggleTheme} />

            <main id="main" className="scroll-mt-4">
                <HomeStats stats={stats} />
                <HomeTiers tiers={tiers} />
                <HomeSteps steps={steps} />
                <HomeTestimonials testimonials={testimonials} />
                <HomeVideos groups={videos} />
                <HomeOffices offices={offices} />
                <HomeReferral />
                <HomeIntake tiers={tiers} />
                <HomeFaq faqs={faqs} />
                <HomeFinalCta />
            </main>

            <HomeFooter offices={offices} />
        </div>
    );
}
