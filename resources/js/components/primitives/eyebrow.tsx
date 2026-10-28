import { Sparkles } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/lib/utils';

export type EyebrowProps = React.ComponentProps<'span'>;

export function Eyebrow({ className, children, ...props }: EyebrowProps) {
    return (
        <span
            className={cn(
                'font-mono text-[11px] font-medium tracking-[0.07em] text-fg-3 uppercase',
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}

export type ChipEyebrowProps = React.ComponentProps<'span'> & {
    icon?: React.ReactNode;
};

export function ChipEyebrow({
    icon,
    className,
    children,
    ...props
}: ChipEyebrowProps) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center gap-2 rounded-full bg-card py-1 pr-3 pl-1.5 font-mono text-[11.5px] font-medium tracking-[0.06em] text-foreground uppercase shadow-chip',
                className,
            )}
            {...props}
        >
            <span
                className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-foreground text-background"
                aria-hidden="true"
            >
                {icon ?? <Sparkles className="size-3" strokeWidth={1.9} />}
            </span>
            <span>{children}</span>
        </span>
    );
}
