import type * as React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export type ConfirmDialogProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    confirmLabel?: React.ReactNode;
    cancelLabel?: React.ReactNode;
    variant?: 'primary' | 'danger';
    disabled?: boolean;
    onConfirm?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
};

export function ConfirmDialog({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
    disabled = false,
    onConfirm,
    children,
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && (
                <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                {children && <div className="py-1">{children}</div>}
                <AlertDialogFooter>
                    <AlertDialogCancel variant="ghost">
                        {cancelLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        disabled={disabled}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export type SkipLinkProps = React.ComponentProps<'a'> & {
    target?: string;
};

export function SkipLink({
    target = '#main',
    children = 'Skip to content',
    className,
    ...props
}: SkipLinkProps) {
    return (
        <a
            href={target}
            className={cn(
                'sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:h-10 focus:items-center focus:rounded-btn focus:bg-primary focus:px-4 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-btn focus:outline-2 focus:outline-offset-2 focus:outline-primary',
                className,
            )}
            {...props}
        >
            {children}
        </a>
    );
}
