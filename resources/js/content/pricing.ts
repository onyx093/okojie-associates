import type { TierSlug } from '@/types/marketing';

export interface PricingComparisonFeature {
    label: string;
    tiers: Record<TierSlug, boolean>;
}

export interface PricingComparisonGroup {
    name: string;
    features: PricingComparisonFeature[];
}

export const PRICING_COMPARISON_GROUPS: PricingComparisonGroup[] = [
    {
        name: 'Preparation',
        features: [
            {
                label: 'Federal + state return by a credentialed preparer',
                tiers: {
                    upload_and_go: true,
                    hybrid: true,
                    premium_remote: true,
                },
            },
            {
                label: 'EITC and Child Tax Credit review',
                tiers: {
                    upload_and_go: true,
                    hybrid: true,
                    premium_remote: true,
                },
            },
            {
                label: 'Prior-year comparison',
                tiers: {
                    upload_and_go: false,
                    hybrid: true,
                    premium_remote: true,
                },
            },
            {
                label: 'Schedule C and E (business, rentals)',
                tiers: {
                    upload_and_go: false,
                    hybrid: false,
                    premium_remote: true,
                },
            },
            {
                label: 'Multi-state (PA / MD / NJ / DE)',
                tiers: {
                    upload_and_go: false,
                    hybrid: false,
                    premium_remote: true,
                },
            },
        ],
    },
    {
        name: 'How you work with us',
        features: [
            {
                label: 'Secure portal upload',
                tiers: {
                    upload_and_go: true,
                    hybrid: true,
                    premium_remote: true,
                },
            },
            {
                label: 'In-office drop-off and review',
                tiers: {
                    upload_and_go: false,
                    hybrid: true,
                    premium_remote: false,
                },
            },
            {
                label: 'Review by video or phone',
                tiers: {
                    upload_and_go: true,
                    hybrid: true,
                    premium_remote: true,
                },
            },
            {
                label: 'Dedicated preparer, year-round',
                tiers: {
                    upload_and_go: false,
                    hybrid: false,
                    premium_remote: true,
                },
            },
            {
                label: 'Quarterly estimates and planning',
                tiers: {
                    upload_and_go: false,
                    hybrid: false,
                    premium_remote: true,
                },
            },
            {
                label: 'Priority support',
                tiers: {
                    upload_and_go: false,
                    hybrid: false,
                    premium_remote: true,
                },
            },
        ],
    },
];
