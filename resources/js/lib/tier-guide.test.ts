import { describe, expect, it } from 'vitest';

import {
    type IncomeChoice,
    type MeetChoice,
    recommendTier,
    type StatesChoice,
    TIER_GUIDE_RESULTS,
    type TierGuideInput,
} from '@/lib/tier-guide';

describe('tier-guide truth table (D-02 option 2)', () => {
    const allIncomes: IncomeChoice[] = ['w2', 'se', 'rent', 'mix'];
    const allMeets: MeetChoice[] = ['remote', 'office'];
    const allStates: StatesChoice[] = ['one', 'multi'];

    const combinations: TierGuideInput[] = [];
    for (const income of allIncomes) {
        for (const meet of allMeets) {
            for (const states of allStates) {
                combinations.push({ income, meet, states });
            }
        }
    }

    it('covers all 16 unique input combinations', () => {
        expect(combinations).toHaveLength(16);
    });

    it('recommends Upload & Go only for W-2, remote, single state', () => {
        const result = recommendTier({
            income: 'w2',
            meet: 'remote',
            states: 'one',
        });
        expect(result).toEqual(TIER_GUIDE_RESULTS.upload_and_go);
        expect(result.slug).toBe('upload_and_go');
        expect(result.name).toBe('Upload & Go');
        expect(result.price).toBe('$150–$225');
        expect(result.reason).toBe(
            'A straightforward return you can finish from home.',
        );
    });

    it('recommends Hybrid only for W-2, office, single state', () => {
        const result = recommendTier({
            income: 'w2',
            meet: 'office',
            states: 'one',
        });
        expect(result).toEqual(TIER_GUIDE_RESULTS.hybrid);
        expect(result.slug).toBe('hybrid');
        expect(result.name).toBe('Hybrid');
        expect(result.price).toBe('$225–$350');
        expect(result.reason).toBe(
            "You'd like to sit down with a preparer, in person or by video.",
        );
    });

    it('recommends Premium Remote whenever states is multi, even for W-2 office filers', () => {
        const remoteResult = recommendTier({
            income: 'w2',
            meet: 'remote',
            states: 'multi',
        });
        const officeResult = recommendTier({
            income: 'w2',
            meet: 'office',
            states: 'multi',
        });

        expect(remoteResult).toEqual(TIER_GUIDE_RESULTS.premium_remote);
        expect(officeResult).toEqual(TIER_GUIDE_RESULTS.premium_remote);
    });

    it.each([
        ['se', 'remote', 'one'],
        ['se', 'office', 'one'],
        ['se', 'remote', 'multi'],
        ['se', 'office', 'multi'],
        ['rent', 'remote', 'one'],
        ['rent', 'office', 'one'],
        ['rent', 'remote', 'multi'],
        ['rent', 'office', 'multi'],
        ['mix', 'remote', 'one'],
        ['mix', 'office', 'one'],
        ['mix', 'remote', 'multi'],
        ['mix', 'office', 'multi'],
    ] as const)(
        'recommends Premium Remote for non-W2 income (%s, %s, %s) without mockup hybrid override',
        (income, meet, states) => {
            const result = recommendTier({ income, meet, states });
            expect(result).toEqual(TIER_GUIDE_RESULTS.premium_remote);
            expect(result.slug).toBe('premium_remote');
            expect(result.price).toBe('$400–$900');
            expect(result.reason).toBe(
                'Self-employment, rentals or several states need a dedicated preparer.',
            );
        },
    );

    it('exhaustively evaluates all 16 states against the expected logic', () => {
        for (const input of combinations) {
            const expectedSlug =
                input.income !== 'w2' || input.states === 'multi'
                    ? 'premium_remote'
                    : input.meet === 'office'
                      ? 'hybrid'
                      : 'upload_and_go';

            const result = recommendTier(input);
            expect(result.slug).toBe(expectedSlug);
        }
    });
});
