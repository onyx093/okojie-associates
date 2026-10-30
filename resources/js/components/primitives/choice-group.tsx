import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch as BaseSwitch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export type ChoiceOption = {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
};

export type ChoiceGroupProps = {
    options: ChoiceOption[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    name?: string;
    cols?: 1 | 2 | 3 | 4;
    className?: string;
    itemClassName?: string;
    'aria-label'?: string;
};

const colsClasses: Record<1 | 2 | 3 | 4, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2 max-sm:grid-cols-1',
    3: 'grid-cols-3 max-sm:grid-cols-1',
    4: 'grid-cols-4 max-sm:grid-cols-2',
};

export function ChoiceGroup({
    options,
    value,
    defaultValue,
    onValueChange,
    name,
    cols = 3,
    className,
    itemClassName,
    'aria-label': ariaLabel,
}: ChoiceGroupProps) {
    const groupId = React.useId();

    return (
        <RadioGroup
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            name={name}
            aria-label={ariaLabel}
            className={cn('grid gap-2', colsClasses[cols], className)}
        >
            {options.map((option) => {
                const itemId = `${groupId}-${option.value}`;
                return (
                    <label
                        key={option.value}
                        htmlFor={itemId}
                        className={cn(
                            'group relative flex cursor-pointer items-center gap-2.5 rounded-control bg-sunken px-3.5 py-2.5 text-[13.5px] font-medium text-fg-2 shadow-[inset_0_0_0_1px_var(--border)] transition-[background-color,color,box-shadow] duration-150 select-none hov:text-foreground',
                            'has-data-[state=checked]:bg-brand-soft has-data-[state=checked]:text-brand has-data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--primary)]',
                            'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary',
                            option.disabled && 'pointer-events-none opacity-60',
                            itemClassName,
                        )}
                    >
                        <RadioGroupItem
                            id={itemId}
                            value={option.value}
                            disabled={option.disabled}
                            className="sr-only"
                        />
                        {option.icon && (
                            <span
                                className="inline-flex shrink-0 text-current [&_svg]:size-4"
                                aria-hidden="true"
                            >
                                {option.icon}
                            </span>
                        )}
                        <span className="flex min-w-0 flex-col">
                            <span className="truncate">{option.label}</span>
                            {option.description && (
                                <span className="text-xs font-normal text-fg-3">
                                    {option.description}
                                </span>
                            )}
                        </span>
                    </label>
                );
            })}
        </RadioGroup>
    );
}

export type CheckProps = Omit<
    React.ComponentProps<typeof Checkbox>,
    'children'
> & {
    label: React.ReactNode;
    description?: React.ReactNode;
    wrapperClassName?: string;
};

export function Check({
    id,
    label,
    description,
    wrapperClassName,
    className,
    ...props
}: CheckProps) {
    const generatedId = React.useId();
    const checkId = id ?? generatedId;

    return (
        <label
            htmlFor={checkId}
            className={cn(
                'flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-foreground select-none',
                props.disabled && 'cursor-not-allowed opacity-60',
                wrapperClassName,
            )}
        >
            <Checkbox
                id={checkId}
                className={cn('mt-0.5', className)}
                {...props}
            />
            <span className="grid gap-0.5">
                <span className="text-[14px] leading-snug">{label}</span>
                {description && (
                    <span className="text-[12.5px] text-fg-3">
                        {description}
                    </span>
                )}
            </span>
        </label>
    );
}

export { BaseSwitch as Switch };
