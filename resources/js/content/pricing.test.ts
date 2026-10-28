import { describe, expect, it } from 'vitest';

import {
    getPricingFaqs,
    PRICING_FAQ_QUESTIONS,
    WHEN_DO_I_PAY_FAQ,
} from '@/content/faqs';
import { PRICING_COMPARISON_GROUPS } from '@/content/pricing';
import type { FaqItem } from '@/types/marketing';

describe('pricing content & comparison groups', () => {
    it('defines 2 comparison groups (Preparation and How you work with us)', () => {
        expect(PRICING_COMPARISON_GROUPS).toHaveLength(2);
        expect(PRICING_COMPARISON_GROUPS[0].name).toBe('Preparation');
        expect(PRICING_COMPARISON_GROUPS[1].name).toBe('How you work with us');
    });

    it('each feature defines values for all 3 tier slugs', () => {
        for (const group of PRICING_COMPARISON_GROUPS) {
            for (const feature of group.features) {
                expect(feature.label.length).toBeGreaterThan(0);
                expect(feature.tiers).toHaveProperty('upload_and_go');
                expect(feature.tiers).toHaveProperty('hybrid');
                expect(feature.tiers).toHaveProperty('premium_remote');
                expect(typeof feature.tiers.upload_and_go).toBe('boolean');
                expect(typeof feature.tiers.hybrid).toBe('boolean');
                expect(typeof feature.tiers.premium_remote).toBe('boolean');
            }
        }
    });

    it('getPricingFaqs returns the 3 canonical questions including synthesized "When do I pay?"', () => {
        const sampleFaqs: FaqItem[] = [
            {
                question: 'How much will my return cost?',
                answer: 'Fees start in these ranges...',
            },
            {
                question: 'Can you help with back taxes or an IRS notice?',
                answer: 'Yes. Our IRS notice response...',
            },
            {
                question: 'Do I have to come into an office?',
                answer: 'No. Upload & Go...',
            },
        ];

        const result = getPricingFaqs(sampleFaqs);
        expect(result).toHaveLength(3);
        expect(result.map((f) => f.question)).toEqual(PRICING_FAQ_QUESTIONS);
        expect(result[1]).toEqual(WHEN_DO_I_PAY_FAQ);
    });
});
