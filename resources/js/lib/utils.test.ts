import { describe, expect, it } from 'vite-plus/test';
import { cn, toUrl } from '@/lib/utils';

describe('utils', () => {
    it('merges and deduplicates tailwind classes with cn', () => {
        const isHidden = false;
        expect(cn('px-2 py-1', 'px-4', isHidden && 'hidden')).toBe('py-1 px-4');
    });

    it('resolves string and object hrefs with toUrl', () => {
        expect(toUrl('/services')).toBe('/services');
        expect(toUrl({ url: '/pricing', method: 'get' })).toBe('/pricing');
    });
});
