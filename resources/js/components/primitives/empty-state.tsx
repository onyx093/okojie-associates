import { Check, CircleAlert, Inbox, Info, Sparkles } from 'lucide-react';
import type * as React from 'react';
import { cn } from '@/lib/utils';

export type EmptyStateProps = Omit<React.ComponentProps<'div'>, 'title'> & {
    icon?: React.ReactNode;
    title: React.ReactNode;
    body?: React.ReactNode;
    actions?: React.ReactNode;
    size?: 'default' | 'sm';
};

export function EmptyState({
    icon,
    title,
    body,
    actions,
    size = 'default',
    className,
    ...props
}: EmptyStateProps) {
    return (
        <div
            data-slot="empty-state"
            className={cn(
                'flex flex-col items-center justify-center rounded-inner bg-sunken px-6 py-10 text-center shadow-[inset_0_0_0_1px_var(--border)]',
                size === 'sm' ? 'min-h-[200px]' : 'min-h-[280px]',
                className,
            )}
            {...props}
        >
            <span
                className="mb-3.5 inline-flex size-[52px] items-center justify-center rounded-inner bg-card text-fg-2 shadow-chip [&_svg]:size-5"
                aria-hidden="true"
            >
                {icon ?? <Inbox className="size-5" strokeWidth={1.7} />}
            </span>
            <h3 className="text-[16.5px] font-medium tracking-[-0.02em] text-foreground">
                {title}
            </h3>
            {body && (
                <p className="mt-1.5 max-w-[36ch] text-[14px] leading-relaxed text-fg-3">
                    {body}
                </p>
            )}
            {actions && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                    {actions}
                </div>
            )}
        </div>
    );
}

export type NoteTone = 'neutral' | 'accent' | 'warn' | 'ok';

export type NoteProps = React.ComponentProps<'div'> & {
    tone?: NoteTone;
    icon?: React.ReactNode;
};

const noteToneClasses: Record<NoteTone, string> = {
    neutral:
        'bg-sunken text-fg-2 shadow-[inset_0_0_0_1px_var(--border)] [&_svg]:text-fg-3',
    accent: 'bg-brand-soft text-brand [&_svg]:text-brand',
    warn: 'bg-warning-soft text-warning [&_svg]:text-warning',
    ok: 'bg-success-soft text-success [&_svg]:text-success',
};

function defaultNoteIcon(tone: NoteTone): React.ReactNode {
    switch (tone) {
        case 'accent':
            return (
                <Sparkles
                    className="size-4 shrink-0"
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            );
        case 'warn':
            return (
                <CircleAlert
                    className="size-4 shrink-0"
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            );
        case 'ok':
            return (
                <Check
                    className="size-4 shrink-0"
                    strokeWidth={1.9}
                    aria-hidden="true"
                />
            );
        case 'neutral':
            return (
                <Info
                    className="size-4 shrink-0"
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            );
    }
}

export function Note({
    tone = 'neutral',
    icon,
    className,
    children,
    ...props
}: NoteProps) {
    return (
        <div
            data-slot="note"
            className={cn(
                'flex items-start gap-2.5 rounded-control px-3.5 py-2.5 text-[13.5px] leading-snug',
                noteToneClasses[tone],
                className,
            )}
            {...props}
        >
            <span className="mt-0.5 shrink-0">
                {icon !== undefined ? icon : defaultNoteIcon(tone)}
            </span>
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}
