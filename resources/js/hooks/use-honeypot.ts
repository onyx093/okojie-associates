import { usePage } from '@inertiajs/react';
import type { HoneypotSharedProp } from '@/types';

export type HoneypotFields = {
    my_name: string;
    valid_from: string;
};

/**
 * Honeypot fields for public forms protected by Spatie's ProtectAgainstSpam.
 * Without `valid_from` the middleware treats every submission as spam and
 * silently drops it. Spread the result into `useForm`'s initial data.
 */
export function useHoneypotFields(
    override?: HoneypotSharedProp,
): HoneypotFields {
    const { props } = usePage<{ honeypot?: HoneypotSharedProp }>();
    const honeypot = override !== undefined ? override : props.honeypot;

    return {
        my_name: '',
        valid_from: honeypot?.validFrom ?? '',
    };
}
