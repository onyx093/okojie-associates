import { useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

import { useHoneypotFields } from '@/hooks/use-honeypot';
import { quote } from '@/routes/leads';

interface UseQuoteFormOptions {
    initialTier?: string;
    referralCode?: string;
}

/**
 * Shared state and submit logic for the "Start my return" quote request.
 * Reads ?tier= and ?ref= from the URL on mount.
 */
export function useQuoteForm({
    initialTier = '',
    referralCode = '',
}: UseQuoteFormOptions = {}) {
    const honeypot = useHoneypotFields();
    const blank = {
        name: '',
        phone: '',
        email: '',
        tier_interest: initialTier || '',
        situation: '',
        ref: referralCode || '',
        ...honeypot,
    };
    const form = useForm(blank);
    const { data, setData, post } = form;

    const [activeRef, setActiveRef] = React.useState(referralCode || '');
    // Inertia's reset() doesn't clear wasSuccessful, so track the thank-you state here.
    const [submitted, setSubmitted] = React.useState(false);

    React.useEffect(() => {
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
    }, []);

    React.useEffect(() => {
        if (initialTier) {
            setData('tier_interest', initialTier);
        }
    }, [initialTier]);

    const firstName = data.name.trim().split(' ')[0] || 'there';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(quote.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                toast.success(
                    `Thanks, ${firstName}! A preparer will follow up within one business day.`,
                );
            },
            onError: () => {
                toast.error(
                    'Something went wrong. Please try again or call (215) 555-0142.',
                );
            },
        });
    };

    // Inertia makes the submitted values the new defaults on success, so reset() would refill them.
    const startOver = () => {
        form.setData({ ...blank, ref: data.ref });
        form.clearErrors();
        setSubmitted(false);
    };

    return { ...form, activeRef, firstName, submit, submitted, startOver };
}
