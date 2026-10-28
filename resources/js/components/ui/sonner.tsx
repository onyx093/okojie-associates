import { Check, CircleAlert } from 'lucide-react';
import type * as React from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useAppearance } from '@/hooks/use-appearance';
import { useFlashToast } from '@/hooks/use-flash-toast';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="bottom-center"
            duration={2200}
            icons={{
                success: <Check className="size-4 text-success" strokeWidth={2} />,
                error: <CircleAlert className="size-4 text-danger" strokeWidth={2} />,
            }}
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: 'inline-flex items-center gap-2.5 rounded-full bg-foreground px-4 py-2.5 text-[13.5px] font-medium text-background shadow-raised',
                    title: 'text-[13.5px] font-medium text-background',
                    description: 'text-xs text-background/80',
                },
            }}
            style={
                {
                    '--normal-bg': 'var(--foreground)',
                    '--normal-text': 'var(--background)',
                    '--normal-border': 'transparent',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
