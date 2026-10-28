import type { FaqItem } from '@/types/marketing';

/**
 * Approved questions subset for the Services page (§4 FAQ "Choosing a service", BCR-22).
 */
export const SERVICES_FAQ_QUESTIONS: readonly string[] = [
    'Do I have to come into an office?',
    'Can you help with back taxes or an IRS notice?',
    'Do you serve clients outside Philadelphia and Baltimore?',
    'Is the e-signature legally valid?',
];

/**
 * Filter the passed FAQs down to the 4 questions for the Services page,
 * preserving the canonical question order.
 */
export function getServicesFaqs(faqs: FaqItem[]): FaqItem[] {
    const map = new Map<string, FaqItem>();
    for (const item of faqs) {
        map.set(item.question.trim().toLowerCase(), item);
    }

    const filtered: FaqItem[] = [];
    for (const q of SERVICES_FAQ_QUESTIONS) {
        const match = map.get(q.trim().toLowerCase());
        if (match) {
            filtered.push(match);
        }
    }

    // Fallback: if questions couldn't match (e.g. data variance), return first 4 or full list
    if (filtered.length === 0) {
        return faqs.slice(0, 4);
    }

    return filtered;
}

/**
 * Approved FAQ question for Pricing page not in config/faqs.php (CONTENT.md §R.2 / BCR-22).
 */
export const WHEN_DO_I_PAY_FAQ: FaqItem = {
    question: 'When do I pay?',
    answer: 'After your preparer sets your fee and before we e-file. You can pay by card in your portal or in person at any office.',
};

/**
 * Approved questions subset for the Pricing page (§4 FAQ "Pricing questions", BCR-22).
 */
export const PRICING_FAQ_QUESTIONS: readonly string[] = [
    'How much will my return cost?',
    'When do I pay?',
    'Can you help with back taxes or an IRS notice?',
];

/**
 * Filter the passed FAQs down to the 3 questions for the Pricing page,
 * injecting the approved "When do I pay?" question.
 */
export function getPricingFaqs(faqs: FaqItem[]): FaqItem[] {
    const map = new Map<string, FaqItem>();
    for (const item of faqs) {
        map.set(item.question.trim().toLowerCase(), item);
    }
    // Inject the synthesized "When do I pay?" question
    map.set(WHEN_DO_I_PAY_FAQ.question.trim().toLowerCase(), WHEN_DO_I_PAY_FAQ);

    const filtered: FaqItem[] = [];
    for (const q of PRICING_FAQ_QUESTIONS) {
        const match = map.get(q.trim().toLowerCase());
        if (match) {
            filtered.push(match);
        }
    }

    if (filtered.length === 0) {
        return [WHEN_DO_I_PAY_FAQ, ...faqs.slice(0, 2)];
    }

    return filtered;
}
