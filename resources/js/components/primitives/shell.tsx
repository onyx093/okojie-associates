import type * as React from 'react';
import { cn } from '@/lib/utils';

export type ShellProps = Omit<React.ComponentProps<'section'>, 'ref'> & {
    as?: 'section' | 'div' | 'article';
};

export function Shell({
    as: Comp = 'section',
    className,
    children,
    ...props
}: ShellProps) {
    return (
        <Comp
            data-slot="shell"
            className={cn(
                'min-w-0 rounded-card bg-shell p-1.5 shadow-[inset_0_0_0_1px_var(--border)]',
                className,
            )}
            {...props}
        >
            {children}
        </Comp>
    );
}

export type ShellHeadProps = Omit<React.ComponentProps<'div'>, 'title'> & {
    icon?: React.ReactNode;
    title?: React.ReactNode;
    headingId?: string;
    right?: React.ReactNode;
};

export function ShellHead({
    icon,
    title,
    headingId,
    right,
    className,
    children,
    ...props
}: ShellHeadProps) {
    return (
        <div
            data-slot="shell-head"
            className={cn(
                'flex min-h-12 flex-wrap items-center justify-between gap-3 px-3.5 pt-2.5 pb-3',
                className,
            )}
            {...props}
        >
            {title !== undefined ? (
                <h2
                    id={headingId}
                    className="flex items-center gap-2 text-[15px] font-medium tracking-[-0.01em] text-foreground [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:text-fg-3"
                >
                    {icon}
                    <span>{title}</span>
                </h2>
            ) : (
                children
            )}
            {right && <div className="flex items-center gap-2">{right}</div>}
        </div>
    );
}

export type InnerVariant = 'default' | 'flush-empty' | 'metrics' | 'paper';

export type InnerProps = React.ComponentProps<'div'> & {
    variant?: InnerVariant;
};

const innerVariantClasses: Record<InnerVariant, string> = {
    default: 'bg-card rounded-inner shadow-card p-5 max-sm:p-4',
    'flush-empty': 'bg-card rounded-inner shadow-card p-1.5',
    metrics: 'bg-card rounded-inner shadow-card p-0 overflow-hidden',
    paper: 'bg-card rounded-inner shadow-raised p-8 max-sm:p-5',
};

export function Inner({
    variant = 'default',
    className,
    children,
    ...props
}: InnerProps) {
    return (
        <div
            data-slot="inner"
            className={cn(innerVariantClasses[variant], className)}
            {...props}
        >
            {children}
        </div>
    );
}
