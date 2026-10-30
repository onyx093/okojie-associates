import { Check, Sparkles } from 'lucide-react';
import type * as React from 'react';
import { Eyebrow } from '@/components/primitives/eyebrow';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export type KeyValueItem = {
    label: React.ReactNode;
    value: React.ReactNode;
    mono?: boolean;
};

export type KeyValueProps = React.ComponentProps<'dl'> & {
    items: KeyValueItem[];
};

export function KeyValue({ items, className, ...props }: KeyValueProps) {
    return (
        <dl
            data-slot="key-value"
            className={cn('grid gap-2.5 text-sm', className)}
            {...props}
        >
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="flex items-baseline justify-between gap-4"
                >
                    <dt className="text-[13.5px] text-fg-3">{item.label}</dt>
                    <dd
                        className={cn(
                            'text-right text-[13.5px] font-medium text-foreground',
                            item.mono && 'font-mono tabular-nums',
                        )}
                    >
                        {item.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export function Divider({
    className,
    ...props
}: React.ComponentProps<typeof Separator>) {
    return <Separator className={cn('my-4', className)} {...props} />;
}

export type TimelineItem = {
    title: React.ReactNode;
    meta?: React.ReactNode;
    reason?: React.ReactNode;
    active?: boolean;
};

export type TimelineProps = React.ComponentProps<'ol'> & {
    items: TimelineItem[];
};

export function Timeline({ items, className, ...props }: TimelineProps) {
    return (
        <ol
            data-slot="timeline"
            className={cn('relative grid gap-4', className)}
            {...props}
        >
            {items.map((item, index) => (
                <li key={index} className="relative flex items-start gap-3">
                    {index < items.length - 1 && (
                        <span
                            className="absolute top-3 left-[5px] h-full w-px bg-border"
                            aria-hidden="true"
                        />
                    )}
                    <span
                        className={cn(
                            'relative z-10 mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-card',
                            item.active ? 'bg-primary' : 'bg-border-strong',
                        )}
                        aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium text-foreground">
                            {item.title}
                        </div>
                        {item.meta && (
                            <div className="text-[12.5px] text-fg-3">
                                {item.meta}
                            </div>
                        )}
                        {item.reason && (
                            <div className="mt-1 text-[12.5px] text-fg-2 italic">
                                “{item.reason}”
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}

export type CalendarTileProps = React.ComponentProps<'div'> & {
    month: string;
    day: string | number;
    isPast?: boolean;
};

export function CalendarTile({
    month,
    day,
    isPast = false,
    className,
    ...props
}: CalendarTileProps) {
    return (
        <div
            data-slot="calendar-tile"
            className={cn(
                'flex size-[52px] shrink-0 flex-col overflow-hidden rounded-[12px] bg-card text-center shadow-chip',
                isPast && 'opacity-75',
                className,
            )}
            {...props}
        >
            <span
                className={cn(
                    'py-0.5 font-mono text-[10px] font-medium tracking-[0.06em] uppercase',
                    isPast
                        ? 'bg-muted-foreground/30 text-muted-foreground'
                        : 'bg-primary text-primary-foreground',
                )}
            >
                {month}
            </span>
            <span
                className={cn(
                    'flex flex-1 items-center justify-center text-[20px] leading-none font-medium tabular-nums',
                    isPast ? 'text-muted-foreground' : 'text-foreground',
                )}
            >
                {day}
            </span>
        </div>
    );
}

export type StepperStage = {
    key: string;
    label: string;
    date?: string | null;
};

export type ReturnStepperProps = React.ComponentProps<'ol'> & {
    steps: StepperStage[];
    currentIndex: number;
};

export function ReturnStepper({
    steps,
    currentIndex,
    className,
    ...props
}: ReturnStepperProps) {
    const safeIndex = Math.max(0, Math.min(steps.length - 1, currentIndex));
    const isAllDone = safeIndex === steps.length - 1;
    const fillPercent =
        steps.length > 1 ? (safeIndex / (steps.length - 1)) * 80 : 0;

    return (
        <ol
            role="list"
            data-slot="return-stepper"
            className={cn(
                'relative grid grid-cols-5 gap-2 max-sm:grid-cols-1 max-sm:gap-0 max-sm:pl-0.5',
                className,
            )}
            {...props}
        >
            {/* Desktop connecting track */}
            <div
                className="pointer-events-none absolute top-[13px] right-[10%] left-[10%] h-0.5 bg-border-strong max-sm:hidden"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute top-[13px] left-[10%] h-0.5 bg-primary transition-[width] duration-400 ease-snap motion-reduce:transition-none max-sm:hidden"
                style={{ width: `${fillPercent}%` }}
                aria-hidden="true"
            />

            {steps.map((step, idx) => {
                const isDone =
                    idx < safeIndex || (isAllDone && idx === safeIndex);
                const isNow = idx === safeIndex && !isAllDone;

                return (
                    <li
                        key={step.key}
                        aria-current={
                            isNow || (isAllDone && idx === safeIndex)
                                ? 'step'
                                : undefined
                        }
                        className={cn(
                            'relative flex flex-col items-center text-center',
                            'max-sm:grid max-sm:grid-cols-[26px_1fr] max-sm:items-start max-sm:gap-x-3 max-sm:pb-[18px] max-sm:text-left max-sm:last:pb-0',
                            "max-sm:before:absolute max-sm:before:top-[28px] max-sm:before:bottom-0 max-sm:before:left-[12px] max-sm:before:w-[2px] max-sm:before:content-[''] max-sm:last:before:hidden",
                            isDone
                                ? 'max-sm:before:bg-primary'
                                : 'max-sm:before:bg-border-strong',
                        )}
                    >
                        <span
                            className={cn(
                                'relative z-10 inline-flex size-[26px] shrink-0 items-center justify-center rounded-full transition-all',
                                isDone &&
                                    'bg-primary text-primary-foreground shadow-xs',
                                isNow &&
                                    'bg-card shadow-[0_0_0_5px_var(--brand-soft)] ring-2 ring-primary',
                                !isDone &&
                                    !isNow &&
                                    'bg-card ring-[1.5px] ring-border-strong',
                                'max-sm:row-span-2',
                            )}
                            aria-hidden="true"
                        >
                            {isDone ? (
                                <Check className="size-3.5" strokeWidth={2.3} />
                            ) : isNow ? (
                                <span className="size-[9px] rounded-full bg-primary" />
                            ) : null}
                        </span>

                        <div className="mt-2.5 max-sm:mt-0">
                            <div
                                className={cn(
                                    'text-[13.5px]',
                                    isDone || isNow
                                        ? 'font-medium text-foreground'
                                        : 'font-normal text-fg-3',
                                )}
                            >
                                {step.label}
                            </div>
                            <div
                                className={cn(
                                    'mt-0.5 min-h-[18px] text-[12px] max-sm:min-h-0',
                                    isNow
                                        ? 'font-medium text-primary'
                                        : 'text-fg-3',
                                )}
                            >
                                {step.date ?? (isNow ? 'Now' : '')}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export type NextStepCardProps = Omit<React.ComponentProps<'div'>, 'title'> & {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    body?: React.ReactNode;
    action?: React.ReactNode;
    actionPosition?: 'side' | 'below';
    icon?: React.ReactNode;
    tone?: 'default' | 'action' | 'done';
};

export function NextStepCard({
    eyebrow = 'What happens next',
    title,
    body,
    action,
    actionPosition = 'below',
    icon,
    tone = 'default',
    className,
    ...props
}: NextStepCardProps) {
    return (
        <div
            role="status"
            data-slot="next-step-card"
            className={cn(
                'flex flex-wrap items-start justify-between gap-4 rounded-[12px] p-4.5',
                tone === 'action'
                    ? 'bg-brand-soft shadow-[inset_0_0_0_1px_rgb(79_99_232/0.25)]'
                    : tone === 'done'
                      ? 'bg-success-soft shadow-[inset_0_0_0_1px_rgb(18_122_73/0.25)]'
                      : 'bg-sunken shadow-[inset_0_0_0_1px_var(--border)]',
                className,
            )}
            {...props}
        >
            <div className="flex min-w-0 flex-1 items-start gap-3.5">
                <span
                    className={cn(
                        'inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-card shadow-chip [&_svg]:size-[18px]',
                        tone === 'action'
                            ? 'text-primary'
                            : tone === 'done'
                              ? 'text-success'
                              : 'text-fg-2',
                    )}
                    aria-hidden="true"
                >
                    {icon ?? (
                        <Sparkles className="size-[18px]" strokeWidth={1.7} />
                    )}
                </span>
                <div className="min-w-0 flex-1">
                    {eyebrow && (
                        <Eyebrow
                            className={cn(
                                tone === 'action' && 'text-primary',
                                tone === 'done' && 'text-success',
                            )}
                        >
                            {eyebrow}
                        </Eyebrow>
                    )}
                    <h3 className="mt-1 text-[16px] font-medium tracking-[-0.01em] text-foreground">
                        {title}
                    </h3>
                    {body && (
                        <p className="mt-1 max-w-[60ch] text-[14px] leading-relaxed text-fg-2">
                            {body}
                        </p>
                    )}
                    {action && actionPosition === 'below' && (
                        <div className="mt-3.5">{action}</div>
                    )}
                </div>
            </div>
            {action && actionPosition === 'side' && (
                <div className="shrink-0">{action}</div>
            )}
        </div>
    );
}
