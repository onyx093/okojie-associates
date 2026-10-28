import { Ban, Check, CircleAlert, Clock, Hourglass, Info } from 'lucide-react';
import type * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ChipTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export type ChipProps = React.ComponentProps<'span'> & {
    tone?: ChipTone;
    dot?: boolean;
};

export function Chip({
    tone = 'neutral',
    dot = false,
    className,
    children,
    ...props
}: ChipProps) {
    return (
        <Badge
            variant={tone}
            dot={dot}
            className={cn(
                'h-[22px] rounded-full px-2 text-xs font-medium',
                className,
            )}
            {...props}
        >
            {children}
        </Badge>
    );
}

export type StatusTone = 'ok' | 'wait' | 'warn' | 'bad' | 'info';

export type StatusLabelProps = React.ComponentProps<'span'> & {
    tone?: StatusTone;
    icon?: React.ReactNode;
};

const statusToneClasses: Record<StatusTone, string> = {
    ok: 'text-success',
    wait: 'text-fg-2',
    warn: 'text-warning',
    bad: 'text-danger',
    info: 'text-brand',
};

function defaultStatusIcon(tone: StatusTone): React.ReactNode {
    switch (tone) {
        case 'ok':
            return (
                <Check
                    className="size-[15px]"
                    strokeWidth={1.9}
                    aria-hidden="true"
                />
            );
        case 'wait':
            return (
                <Hourglass
                    className="size-[15px]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            );
        case 'warn':
            return (
                <Clock
                    className="size-[15px]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            );
        case 'bad':
            return (
                <Ban
                    className="size-[15px]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            );
        case 'info':
            return (
                <Info
                    className="size-[15px]"
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            );
    }
}

export function StatusLabel({
    tone = 'info',
    icon,
    className,
    children,
    ...props
}: StatusLabelProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 text-[12.5px] font-medium',
                statusToneClasses[tone],
                className,
            )}
            {...props}
        >
            {icon !== undefined ? icon : defaultStatusIcon(tone)}
            <span>{children}</span>
        </span>
    );
}

export { CircleAlert };
