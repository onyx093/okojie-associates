import { useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

import { useHoneypotFields } from '@/hooks/use-honeypot';
import { quote } from '@/routes/leads';
import type { HoneypotSharedProp } from '@/types';

export interface UseQuoteFormOptions {
    initialTier?: string;
    referralCode?: string;
    honeypotOverride?: HoneypotSharedProp;
    initialSubmitted?: boolean;
}

export interface QuoteFormData {
    name: string;
    phone: string;
    email: string;
    tier_interest: string;
    situation: string;
    ref: string;
    my_name: string;
    valid_from: string;
}

/**
 * Shared state and submit logic for the "Start my return" quote request on the homepage and contact page.
 * Reads ?tier= and ?ref= from the URL on mount.
 * Handled via server session flash toast (no duplicate client toast).
 */
export function useQuoteForm(options: UseQuoteFormOptions = {}) {
    const {
        initialTier = '',
        referralCode = '',
        honeypotOverride,
        initialSubmitted = false,
    } = options;

    const honeypot = useHoneypotFields(honeypotOverride);
    const blank: QuoteFormData = {
        name: '',
        phone: '',
        email: '',
        tier_interest: initialTier || '',
        situation: '',
        ref: referralCode || '',
        ...honeypot,
    };

    const form = useForm<QuoteFormData>(blank);
    const { data, setData, post } = form;

    const [activeRef, setActiveRef] = React.useState(referralCode || '');
    const [submitted, setSubmitted] = React.useState(initialSubmitted);

    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const queryTier = params.get('tier');
        const queryRef = params.get('ref');

        if (queryTier && !data.tier_interest) {
            setData('tier_interest', queryTier);
        }
        if (queryRef && !data.ref) {
            setData('ref', queryRef);
            setActiveRef(queryRef);
        }
    }, [data.ref, data.tier_interest, setData]);

    React.useEffect(() => {
        if (initialTier) {
            setData('tier_interest', initialTier);
        }
    }, [initialTier, setData]);

    const firstName = data.name.trim().split(' ')[0] || 'there';

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(quote.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                // Flash message is delivered by HandleInertiaRequests and handled by useFlashToast
            },
            onError: (errors) => {
                if (Object.keys(errors).length === 0) {
                    toast.error(
                        'Something went wrong. Please try again or call (215) 555-0142.',
                    );
                }
            },
        });
    };

    const startOver = () => {
        form.setData({ ...blank, ref: data.ref });
        form.clearErrors();
        setSubmitted(false);
    };

    return {
        ...form,
        activeRef,
        firstName,
        submit,
        submitted,
        setSubmitted,
        startOver,
    };
}
