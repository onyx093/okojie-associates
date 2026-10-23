import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export const container = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6';

export function Eyebrow({
    icon: Icon,
    children,
    className,
}: {
    icon: LucideIcon;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-h-surface py-[5px] pr-2.5 pl-[5px] font-mono text-[11.5px] font-medium tracking-[0.06em] whitespace-nowrap text-h-fg uppercase shadow-h-chip',
                className,
            )}
        >
            <span className="grid size-[18px] place-items-center rounded-[5px] bg-h-fg text-h-bg">
                <Icon className="size-[11px]" strokeWidth={2.2} />
            </span>
            {children}
        </span>
    );
}

export function SectionHead({
    eyebrow,
    icon,
    title,
    description,
    id,
    align = 'split',
}: {
    eyebrow: string;
    icon: LucideIcon;
    title: string;
    description: string;
    id: string;
    align?: 'split' | 'center';
}) {
    if (align === 'center') {
        return (
            <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
                <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
                <h2
                    id={id}
                    className="mt-5 max-w-[20ch] text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance"
                >
                    {title}
                </h2>
                <p className="mt-4 max-w-[46ch] text-[17px] text-pretty text-h-fg-2">
                    {description}
                </p>
            </div>
        );
    }

    return (
        <div className="mb-9 grid items-end gap-5 sm:mb-14 md:grid-cols-[1fr_auto] md:gap-8">
            <div>
                <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
                <h2
                    id={id}
                    className="mt-5 max-w-[14ch] text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance"
                >
                    {title}
                </h2>
            </div>
            <p className="max-w-[38ch] text-[17px] text-pretty text-h-fg-2 md:text-right">
                {description}
            </p>
        </div>
    );
}

const buttonBase =
    'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-medium whitespace-nowrap transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-h-accent disabled:pointer-events-none disabled:opacity-60';

const buttonVariants = {
    primary:
        'bg-h-accent text-white shadow-h-btn [@media(hover:hover)]:hover:bg-h-accent-hover',
    secondary:
        'bg-h-surface text-h-fg shadow-h-chip [@media(hover:hover)]:hover:bg-h-sunken',
};

export function homeButtonClass(
    variant: keyof typeof buttonVariants = 'primary',
    className?: string,
) {
    return cn(buttonBase, buttonVariants[variant], className);
}

export function HomeLinkButton({
    href,
    variant = 'primary',
    className,
    children,
}: {
    href: string;
    variant?: keyof typeof buttonVariants;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Link href={href} className={homeButtonClass(variant, className)}>
            {children}
        </Link>
    );
}

export function StatusChip({
    tone,
    children,
    dot = true,
}: {
    tone: 'ok' | 'warn' | 'accent' | 'neutral';
    children: React.ReactNode;
    dot?: boolean;
}) {
    const tones = {
        ok: 'bg-h-ok-soft text-h-ok',
        warn: 'bg-h-warn-soft text-h-warn',
        accent: 'bg-h-accent-soft text-h-accent-fg',
        neutral:
            'bg-h-sunken text-h-fg-2 shadow-[inset_0_0_0_1px_var(--h-line)]',
    };

    return (
        <span
            className={cn(
                'inline-flex h-[22px] items-center gap-[5px] rounded-full px-2 text-xs font-medium whitespace-nowrap',
                tones[tone],
            )}
        >
            {dot && <span className="size-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
}
