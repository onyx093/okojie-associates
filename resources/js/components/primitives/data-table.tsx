import { Link } from '@inertiajs/react';
import { ChevronDown, ListFilter, Search, X } from 'lucide-react';
import type * as React from 'react';
import { Button } from '@/components/primitives/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type DataTableProps = React.ComponentProps<typeof Table> & {
    compact?: boolean;
};

export function DataTable({
    compact = false,
    className,
    ...props
}: DataTableProps) {
    return (
        <Table
            className={cn(compact && '[&_td]:py-2 [&_th]:h-9', className)}
            {...props}
        />
    );
}

export type TableToolbarProps = React.ComponentProps<'div'> & {
    left?: React.ReactNode;
    right?: React.ReactNode;
};

export function TableToolbar({
    left,
    right,
    className,
    children,
    ...props
}: TableToolbarProps) {
    return (
        <div
            data-slot="table-toolbar"
            className={cn(
                'mb-3.5 flex flex-wrap items-center justify-between gap-2.5',
                className,
            )}
            {...props}
        >
            {children ?? (
                <>
                    <div className="flex flex-wrap items-center gap-2">
                        {left}
                    </div>
                    {right && (
                        <div className="flex flex-wrap items-center gap-2">
                            {right}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export type SearchInputProps = Omit<React.ComponentProps<'input'>, 'type'> & {
    onClear?: () => void;
    wrapperClassName?: string;
};

export function SearchInput({
    value,
    onChange,
    onClear,
    placeholder = 'Search…',
    className,
    wrapperClassName,
    ...props
}: SearchInputProps) {
    const hasValue = typeof value === 'string' && value.length > 0;

    return (
        <div
            className={cn(
                'relative flex h-9 min-w-[240px] items-center rounded-control bg-card px-3 text-sm text-foreground shadow-chip transition-shadow focus-within:shadow-[inset_0_0_0_1.5px_var(--primary),0_0_0_4px_var(--brand-soft)] max-sm:min-w-full',
                wrapperClassName,
            )}
        >
            <Search
                className="mr-2 size-[15px] shrink-0 text-fg-3"
                strokeWidth={1.7}
                aria-hidden="true"
            />
            <input
                type="search"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={cn(
                    'w-full bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-fg-3 [&::-webkit-search-cancel-button]:hidden',
                    className,
                )}
                {...props}
            />
            {hasValue && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    aria-label="Clear search"
                    className="ml-1 inline-flex size-5 items-center justify-center rounded text-fg-3 hov:text-foreground"
                >
                    <X className="size-3.5" strokeWidth={1.7} />
                </button>
            )}
        </div>
    );
}

export type FilterOption = {
    value: string;
    label: string;
};

export type FilterButtonProps = {
    label: string;
    value?: string | null;
    options: FilterOption[];
    onSelect: (value: string | null) => void;
    allLabel?: string;
    className?: string;
};

export function FilterButton({
    label,
    value,
    options,
    onSelect,
    allLabel = 'All',
    className,
}: FilterButtonProps) {
    const activeOption = options.find((opt) => opt.value === value);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'inline-flex h-9 items-center gap-1.5 rounded-control bg-card px-3 text-[13px] font-medium text-foreground shadow-chip transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hov:bg-sunken',
                        activeOption && 'text-brand',
                        className,
                    )}
                >
                    <ListFilter
                        className="size-[15px] text-fg-3"
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>
                        {label}
                        {activeOption ? `: ${activeOption.label}` : ''}
                    </span>
                    <ChevronDown
                        className="size-3.5 text-fg-3"
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-52 p-1.5">
                <div className="grid gap-0.5">
                    <button
                        type="button"
                        onClick={() => onSelect(null)}
                        className={cn(
                            'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors hov:bg-sunken',
                            !activeOption
                                ? 'bg-brand-soft font-medium text-brand'
                                : 'text-foreground',
                        )}
                    >
                        <span>{allLabel}</span>
                    </button>
                    {options.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onSelect(opt.value)}
                                className={cn(
                                    'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors hov:bg-sunken',
                                    isSelected
                                        ? 'bg-brand-soft font-medium text-brand'
                                        : 'text-foreground',
                                )}
                            >
                                <span>{opt.label}</span>
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export type PaginatorMeta = {
    from?: number | null;
    to?: number | null;
    total?: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
};

export type PagerProps = {
    from?: number | null;
    to?: number | null;
    total?: number;
    prevUrl?: string | null;
    nextUrl?: string | null;
    onPrev?: () => void;
    onNext?: () => void;
    noun?: string;
    className?: string;
};

export function Pager({
    from,
    to,
    total = 0,
    prevUrl,
    nextUrl,
    onPrev,
    onNext,
    noun,
    className,
}: PagerProps) {
    const start = from ?? (total > 0 ? 1 : 0);
    const end = to ?? total;

    return (
        <div
            data-slot="pager"
            className={cn(
                'mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-[13px] text-fg-3',
                className,
            )}
        >
            <span className="tabular-nums">
                Showing {start}–{end} of {total}
                {noun ? ` ${noun}` : ''}
            </span>

            <div className="flex items-center gap-1.5">
                {prevUrl ? (
                    <Button variant="secondary" size="xs" asChild>
                        <Link href={prevUrl} preserveScroll>
                            Previous
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        size="xs"
                        disabled={!onPrev}
                        onClick={onPrev}
                    >
                        Previous
                    </Button>
                )}

                {nextUrl ? (
                    <Button variant="secondary" size="xs" asChild>
                        <Link href={nextUrl} preserveScroll>
                            Next
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        size="xs"
                        disabled={!onNext}
                        onClick={onNext}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}

export {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
};
