import * as React from 'react';
import {
    Button,
    buttonVariants,
    type ButtonProps,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type IconButtonProps = Omit<
    React.ComponentProps<'button'>,
    'children'
> & {
    'aria-label': string;
    variant?: 'surface' | 'ghost' | 'danger-ghost';
    size?: 'default' | 'sm';
    asChild?: boolean;
    children: React.ReactNode;
};

export function IconButton({
    className,
    variant = 'surface',
    size = 'default',
    asChild = false,
    children,
    ...props
}: IconButtonProps) {
    const mappedVariant =
        variant === 'surface'
            ? 'secondary'
            : variant === 'danger-ghost'
              ? 'danger-ghost'
              : 'ghost';
    const mappedSize = size === 'sm' ? 'icon-sm' : 'icon';

    return (
        <Button
            type="button"
            variant={mappedVariant}
            size={mappedSize}
            asChild={asChild}
            className={cn(className)}
            {...props}
        >
            {children}
        </Button>
    );
}

export { Button, buttonVariants, type ButtonProps };
