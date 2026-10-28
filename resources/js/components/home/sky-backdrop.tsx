import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkyBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
    photoSrc?: string | null;
    photoSrcSet?: string;
    variant?: 'hero' | 'cta' | 'compact';
    children?: React.ReactNode;
}

/**
 * Atmospheric sky gradient backdrop converting home.css (.home-sky, veil, streaks)
 * into pure Tailwind CSS v4 utilities.
 * Supports D-08 option 2 photo layer under the sky veil.
 */
export function SkyBackdrop({
    photoSrc,
    photoSrcSet,
    variant = 'hero',
    className,
    children,
    ...props
}: SkyBackdropProps) {
    return (
        <div
            className={cn(
                'relative isolate overflow-hidden bg-(image:--sky-band) text-foreground',
                // Long-exposure streaks
                'before:pointer-events-none before:absolute before:inset-[-20px] before:-z-20 before:bg-[repeating-linear-gradient(180deg,rgb(255_255_255/0.1)_0_3px,transparent_3px_11px),repeating-linear-gradient(180deg,rgb(0_0_0/0.04)_0_1px,transparent_1px_23px)] before:blur-[1.5px]',
                // Legibility sky veil (horizontal + bottom fade)
                'after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-(image:--sky-veil)',
                variant === 'hero' && 'rounded-[22px] sm:rounded-[28px]',
                variant === 'cta' && 'rounded-[22px] sm:rounded-[28px]',
                variant === 'compact' && 'rounded-[14px]',
                className,
            )}
            {...props}
        >
            {photoSrc && (
                <img
                    src={photoSrc}
                    srcSet={photoSrcSet}
                    alt=""
                    aria-hidden="true"
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    loading="eager"
                    className="pointer-events-none absolute inset-0 -z-15 size-full object-cover opacity-25 mix-blend-multiply dark:opacity-15 dark:mix-blend-luminosity"
                />
            )}
            {children}
        </div>
    );
}
