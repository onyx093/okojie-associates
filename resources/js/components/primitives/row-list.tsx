import { ShieldCheck } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/lib/utils';

export type RowListProps = React.ComponentProps<'div'> & {
    footer?: React.ReactNode;
};

export function RowList({
    footer,
    className,
    children,
    ...props
}: RowListProps) {
    return (
        <div
            data-slot="row-list"
            className={cn('grid p-1', className)}
            {...props}
        >
            <div className="divide-y divide-border">{children}</div>
            {footer !== undefined && (
                <div className="mt-1 flex items-center gap-2 border-t border-border px-2 pt-3 pb-1 text-[13px] text-fg-3">
                    <ShieldCheck
                        className="size-4 shrink-0 text-fg-3"
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>{footer}</span>
                </div>
            )}
        </div>
    );
}

export type RowProps = Omit<React.ComponentProps<'div'>, 'title'> & {
    leading?: React.ReactNode;
    title: React.ReactNode;
    meta?: React.ReactNode;
    status?: React.ReactNode;
    actions?: React.ReactNode;
};

export function Row({
    leading,
    title,
    meta,
    status,
    actions,
    className,
    ...props
}: RowProps) {
    return (
        <div
            data-slot="row"
            className={cn(
                'flex items-center justify-between gap-3 px-2 py-3',
                className,
            )}
            {...props}
        >
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {leading}
                <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium text-foreground">
                        {title}
                    </div>
                    {meta !== undefined && (
                        <div className="truncate text-[12.5px] text-fg-3">
                            {meta}
                        </div>
                    )}
                </div>
            </div>

            {(status !== undefined || actions !== undefined) && (
                <div className="flex shrink-0 items-center gap-2.5">
                    {status}
                    {actions}
                </div>
            )}
        </div>
    );
}

export type FileBadgeProps = React.ComponentProps<'span'> & {
    ext: string;
};

export function FileBadge({ ext, className, ...props }: FileBadgeProps) {
    const cleanExt = ext.replace(/^\./, '').slice(0, 4).toUpperCase() || 'FILE';

    return (
        <span
            data-slot="file-badge"
            className={cn(
                'inline-flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-sunken font-mono text-[9.5px] font-medium tracking-[0.04em] text-fg-2 uppercase shadow-[inset_0_0_0_1px_var(--border)]',
                className,
            )}
            aria-hidden="true"
            {...props}
        >
            {cleanExt}
        </span>
    );
}
