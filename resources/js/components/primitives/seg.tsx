import { Link } from '@inertiajs/react';
import type * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type SegItem<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    count?: number | string;
    disabled?: boolean;
};

export type SegProps<T extends string = string> = {
    items: SegItem<T>[];
    value: T;
    onValueChange: (value: T) => void;
    'aria-label'?: string;
    className?: string;
};

export function Seg<T extends string = string>({
    items,
    value,
    onValueChange,
    'aria-label': ariaLabel,
    className,
}: SegProps<T>) {
    return (
        <Tabs
            value={value}
            onValueChange={(next) => onValueChange(next as T)}
            className={cn('w-fit', className)}
        >
            <TabsList aria-label={ariaLabel}>
                {items.map((item) => (
                    <TabsTrigger
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                    >
                        <span>{item.label}</span>
                        {item.count !== undefined && (
                            <span className="text-[11.5px] text-fg-3 tabular-nums">
                                {item.count}
                            </span>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}

export type SegLinkItem = {
    href: string;
    label: React.ReactNode;
    count?: number | string;
    active?: boolean;
};

export type SegLinksProps = {
    items: SegLinkItem[];
    'aria-label'?: string;
    className?: string;
};

export function SegLinks({
    items,
    'aria-label': ariaLabel = 'Filter navigation',
    className,
}: SegLinksProps) {
    return (
        <nav
            aria-label={ariaLabel}
            className={cn(
                'inline-flex h-9 w-fit items-center rounded-[11px] bg-sunken p-[3px] shadow-[inset_0_0_0_1px_var(--border)]',
                className,
            )}
        >
            {items.map((item, idx) => (
                <Link
                    key={`${item.href}-${idx}`}
                    href={item.href}
                    preserveScroll
                    aria-current={item.active ? 'page' : undefined}
                    className={cn(
                        'inline-flex h-full items-center justify-center gap-1.5 rounded-[8px] px-3 py-1 text-[13px] font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                        item.active
                            ? 'bg-card text-foreground shadow-chip'
                            : 'text-fg-2 hov:text-foreground',
                    )}
                >
                    <span>{item.label}</span>
                    {item.count !== undefined && (
                        <span className="text-[11.5px] text-fg-3 tabular-nums">
                            {item.count}
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
}
