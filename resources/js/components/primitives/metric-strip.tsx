import { Link } from '@inertiajs/react';
import type * as React from 'react';
import { Inner } from '@/components/primitives/shell';
import { cn } from '@/lib/utils';

export type MetricTone = 'indigo' | 'green' | 'amber' | 'rose';

const tileToneClasses: Record<MetricTone, string> = {
    indigo: 'bg-brand-soft text-brand',
    green: 'bg-success-soft text-success',
    amber: 'bg-warning-soft text-warning',
    rose: 'bg-rose-soft text-rose',
};

export type MetricStripProps = React.ComponentProps<'div'> & {
    columns?: 3 | 4;
};

export function MetricStrip({
    columns = 4,
    className,
    children,
    ...props
}: MetricStripProps) {
    return (
        <Inner
            variant="metrics"
            className={cn(
                'grid divide-border',
                columns === 3
                    ? 'grid-cols-3 divide-x max-shell:grid-cols-1 max-shell:divide-x-0 max-shell:divide-y'
                    : 'grid-cols-4 divide-x max-shell:grid-cols-2 max-sm:grid-cols-1 max-sm:divide-x-0 max-sm:divide-y',
                className,
            )}
            {...props}
        >
            {children}
        </Inner>
    );
}

export type MetricProps = {
    label: React.ReactNode;
    value: React.ReactNode;
    context?: React.ReactNode;
    hot?: boolean;
    tone?: MetricTone;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    valueSize?: 'default' | 'sm';
    className?: string;
};

export function Metric({
    label,
    value,
    context,
    hot = false,
    tone = 'indigo',
    icon,
    href,
    onClick,
    valueSize = 'default',
    className,
}: MetricProps) {
    const content = (
        <>
            <div className="flex items-center gap-2.5">
                {icon && (
                    <span
                        className={cn(
                            'inline-flex size-7 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4',
                            tileToneClasses[tone],
                        )}
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                )}
                <span className="text-[13px] font-medium text-fg-2">
                    {label}
                </span>
            </div>

            <div
                className={cn(
                    'font-medium tracking-[-0.03em] text-foreground tabular-nums',
                    valueSize === 'sm'
                        ? 'text-[18px]'
                        : 'text-[26px] leading-tight',
                )}
            >
                {value}
            </div>

            {context !== undefined && (
                <div
                    className={cn(
                        'text-[12.5px]',
                        hot ? 'font-medium text-brand' : 'text-fg-3',
                    )}
                >
                    {context}
                </div>
            )}
        </>
    );

    const cellClasses = cn(
        'flex flex-col justify-between gap-2.5 p-5 text-left transition-colors',
        (href || onClick) && 'cursor-pointer hov:bg-sunken/75',
        className,
    );

    if (href) {
        return (
            <Link href={href} className={cellClasses}>
                {content}
            </Link>
        );
    }

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={cellClasses}>
                {content}
            </button>
        );
    }

    return <div className={cellClasses}>{content}</div>;
}
