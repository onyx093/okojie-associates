import type { TierSlug } from '@/types/marketing';

export type IncomeChoice = 'w2' | 'se' | 'rent' | 'mix';
export type MeetChoice = 'remote' | 'office';
export type StatesChoice = 'one' | 'multi';

export interface TierGuideInput {
    income: IncomeChoice;
    meet: MeetChoice;
    states: StatesChoice;
}

export interface TierGuideResult {
    slug: TierSlug;
    name: string;
    price: string;
    reason: string;
}

export const TIER_GUIDE_RESULTS: Record<TierSlug, TierGuideResult> = {
    upload_and_go: {
        slug: 'upload_and_go',
        name: 'Upload & Go',
        price: '$150–$225',
        reason: 'A straightforward return you can finish from home.',
    },
    hybrid: {
        slug: 'hybrid',
        name: 'Hybrid',
        price: '$225–$350',
        reason: "You'd like to sit down with a preparer, in person or by video.",
    },
    premium_remote: {
        slug: 'premium_remote',
        name: 'Premium Remote',
        price: '$400–$900',
        reason: 'Self-employment, rentals or several states need a dedicated preparer.',
    },
};

/**
 * Pure function evaluating the 3-question tier guide according to
 * docs/UI-STATE-MATRIX.md §1 (D-02 option 2 - corrected truth table):
 *
 * income !== 'w2' || states === 'multi' ? premium_remote : meet === 'office' ? hybrid : upload_and_go
 */
export function recommendTier(input: TierGuideInput): TierGuideResult {
    const isPremium = input.income !== 'w2' || input.states === 'multi';

    if (isPremium) {
        return TIER_GUIDE_RESULTS.premium_remote;
    }

    if (input.meet === 'office') {
        return TIER_GUIDE_RESULTS.hybrid;
    }

    return TIER_GUIDE_RESULTS.upload_and_go;
}
