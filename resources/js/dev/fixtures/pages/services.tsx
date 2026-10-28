import * as React from 'react';

import { Chip } from '@/components/primitives';
import { register } from '@/dev/fixtures';
import { fixtureClientUser } from '@/dev/fixtures/layouts';
import { sampleFaqs, sampleTiers } from '@/dev/fixtures/pages/home';
import {
    type IncomeChoice,
    type MeetChoice,
    recommendTier,
    type StatesChoice,
    type TierGuideInput,
} from '@/lib/tier-guide';
import type { AddOnItem } from '@/types/marketing';

// Dynamic lazy import prevents Vite from converting pages/services into an internal chunk
const Services = React.lazy(() => import('@/pages/services'));

export const sampleAddons: AddOnItem[] = [
    {
        slug: 'prior_year_amendments',
        name: 'Prior-year amendments',
        description:
            'Amend a previously filed return to claim missed credits or correct errors.',
        price: '$150–$500',
    },
    {
        slug: 'irs_notice_response',
        name: 'IRS notice response',
        description:
            'We read the notice, respond on your behalf, and keep you informed.',
        price: '$125–$400',
    },
    {
        slug: 'itin_applications',
        name: 'ITIN applications',
        description:
            'New or renewed ITIN applications with certified documentation review.',
        price: '$150–$300',
    },
    {
        slug: 'bookkeeping',
        name: 'Bookkeeping',
        description:
            'Monthly bookkeeping for small businesses and self-employed clients.',
        price: '$100–$500',
    },
    {
        slug: 'quarterly_estimates',
        name: 'Quarterly estimates',
        description:
            'Estimated tax calculations and payment reminders each quarter.',
        price: '$75–$250',
    },
];

const ALL_INCOMES: IncomeChoice[] = ['w2', 'se', 'rent', 'mix'];
const ALL_MEETS: MeetChoice[] = ['remote', 'office'];
const ALL_STATES: StatesChoice[] = ['one', 'multi'];

const ALL_16_COMBINATIONS: TierGuideInput[] = [];
for (const income of ALL_INCOMES) {
    for (const meet of ALL_MEETS) {
        for (const states of ALL_STATES) {
            ALL_16_COMBINATIONS.push({ income, meet, states });
        }
    }
}

function TruthTableFixture() {
    return (
        <div className="mx-auto max-w-5xl p-6">
            <div className="mb-6">
                <span className="font-mono text-xs tracking-[0.06em] text-muted-foreground uppercase">
                    State Matrix §1
                </span>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                    Tier Finder Truth Table (All 16 Combinations)
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    D-02 Option 2 corrected logic:{' '}
                    <code>
                        income !== 'w2' || states === 'multi' ? premium_remote :
                        meet === 'office' ? hybrid : upload_and_go
                    </code>
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-border bg-sunken font-mono text-xs tracking-wider text-muted-foreground uppercase">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Income</th>
                            <th className="px-4 py-3">Meet</th>
                            <th className="px-4 py-3">States</th>
                            <th className="px-4 py-3">Expected Slug</th>
                            <th className="px-4 py-3">Recommended Tier</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-xs">
                        {ALL_16_COMBINATIONS.map((input, idx) => {
                            const result = recommendTier(input);
                            const expectedSlug =
                                input.income !== 'w2' ||
                                input.states === 'multi'
                                    ? 'premium_remote'
                                    : input.meet === 'office'
                                      ? 'hybrid'
                                      : 'upload_and_go';
                            const matches = result.slug === expectedSlug;

                            return (
                                <tr
                                    key={`${input.income}-${input.meet}-${input.states}`}
                                    className="hover:bg-sunken/50"
                                >
                                    <td className="px-4 py-2.5 text-muted-foreground">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="px-4 py-2.5 font-sans font-medium text-foreground">
                                        {input.income}
                                    </td>
                                    <td className="px-4 py-2.5 font-sans text-muted-foreground">
                                        {input.meet}
                                    </td>
                                    <td className="px-4 py-2.5 font-sans text-muted-foreground">
                                        {input.states}
                                    </td>
                                    <td className="text-accent-fg px-4 py-2.5">
                                        {expectedSlug}
                                    </td>
                                    <td className="px-4 py-2.5 font-sans font-medium text-foreground">
                                        {result.name}
                                    </td>
                                    <td className="px-4 py-2.5 text-muted-foreground">
                                        {result.price}
                                    </td>
                                    <td className="px-4 py-2.5 font-sans">
                                        {matches ? (
                                            <Chip tone="success">Match</Chip>
                                        ) : (
                                            <Chip tone="danger">Mismatch</Chip>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export const servicesPageFixture = register({
    id: 'page-services',
    title: 'Page: Services (§4.2 Service Tiers & Finder)',
    states: [
        {
            label: 'Guest (default)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Services
                        tiers={sampleTiers}
                        addons={sampleAddons}
                        faqs={sampleFaqs}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Authenticated client (portal tier current)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Services
                        tiers={sampleTiers}
                        addons={sampleAddons}
                        faqs={sampleFaqs}
                        userOverride={fixtureClientUser}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Tier finder truth table (all 16 combos)',
            render: () => <TruthTableFixture />,
        },
    ],
});
