import * as React from 'react';
import InputError from '@/components/input-error';
import {
    PasswordInput,
    type PasswordInputProps,
} from '@/components/password-input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type FieldProps = React.ComponentProps<'div'> & {
    label?: React.ReactNode;
    htmlFor?: string;
    optional?: boolean | string;
    hint?: React.ReactNode;
    error?: string;
    labelRight?: React.ReactNode;
};

export function Field({
    label,
    htmlFor,
    optional,
    hint,
    error,
    labelRight,
    className,
    children,
    ...props
}: FieldProps) {
    const generatedId = React.useId();
    const controlId = htmlFor ?? generatedId;
    const hintId = `${controlId}-hint`;
    const errorId = `${controlId}-error`;

    const describedBy =
        [hint ? hintId : null, error ? errorId : null]
            .filter(Boolean)
            .join(' ') || undefined;

    const enhancedChildren = React.Children.map(children, (child) => {
        if (!React.isValidElement<Record<string, unknown>>(child)) {
            return child;
        }

        return React.cloneElement(child, {
            id: (child.props.id as string | undefined) ?? controlId,
            'aria-invalid':
                (child.props['aria-invalid'] as boolean | undefined) ??
                (error ? true : undefined),
            'aria-describedby':
                (child.props['aria-describedby'] as string | undefined) ??
                describedBy,
        });
    });

    return (
        <div
            data-slot="field"
            className={cn('grid gap-[7px]', className)}
            {...props}
        >
            {(label !== undefined || labelRight !== undefined) && (
                <div className="flex items-center justify-between gap-2">
                    {label !== undefined && (
                        <Label
                            htmlFor={controlId}
                            className="flex items-center gap-1.5 text-[13.5px] font-medium text-foreground"
                        >
                            <span>{label}</span>
                            {optional && (
                                <span className="text-xs font-normal text-fg-3">
                                    {typeof optional === 'string'
                                        ? optional
                                        : 'Optional'}
                                </span>
                            )}
                        </Label>
                    )}
                    {labelRight}
                </div>
            )}

            {enhancedChildren}

            {error ? (
                <InputError id={errorId} message={error} />
            ) : (
                hint !== undefined && (
                    <p
                        id={hintId}
                        className="text-[12.5px] leading-snug text-fg-3"
                    >
                        {hint}
                    </p>
                )
            )}
        </div>
    );
}

export { InputError, PasswordInput, type PasswordInputProps };
