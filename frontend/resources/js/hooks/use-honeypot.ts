import { usePage } from '@inertiajs/react';

/**
 * Honeypot fields for public forms protected by Spatie's ProtectAgainstSpam.
 * Without `valid_from` the middleware treats every submission as spam and
 * silently drops it. Spread the result into `useForm`'s initial data.
 */
export function useHoneypotFields() {
    const { props } = usePage<{ honeypot?: { validFrom: string } }>();

    return {
        my_name: '',
        valid_from: props.honeypot?.validFrom ?? '',
    };
}
