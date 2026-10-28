import {
    CalendarDays,
    FileText,
    PenLine,
    Send,
    Sparkles,
    Upload,
} from 'lucide-react';
import * as React from 'react';

import {
    container,
    SectionHead,
    StatusChip,
} from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import type { StepItem } from '@/types/marketing';

const stepIcons = [CalendarDays, Upload, FileText, PenLine, Send];
const stepChips = [
    '~5 minutes',
    'Encrypted',
    'Real person',
    'Video or phone',
    'Done',
];

export function HomeSteps({ steps }: { steps: StepItem[] }) {
    return (
        <section
            aria-labelledby="how-title"
            className="mx-2 rounded-[22px] bg-card py-20 shadow-card sm:mx-3 sm:rounded-[28px] sm:py-[120px]"
        >
            <div className={container}>
                <SectionHead
                    id="how-title"
                    align="center"
                    eyebrow="How it works"
                    icon={Sparkles}
                    title="From start to filed, without an office visit"
                    description="Five steps, all tracked in your portal."
                />
                <ol className="relative grid gap-0 before:absolute before:top-7 before:bottom-7 before:left-[27px] before:w-0.5 before:bg-[repeating-linear-gradient(180deg,var(--border-strong)_0_6px,transparent_6px_12px)] lg:grid-cols-5 lg:gap-3 lg:before:top-[27px] lg:before:right-7 lg:before:bottom-auto lg:before:left-7 lg:before:h-0.5 lg:before:w-auto lg:before:bg-[repeating-linear-gradient(90deg,var(--border-strong)_0_6px,transparent_6px_12px)]">
                    {steps.map((step, i) => {
                        const Icon = stepIcons[i] ?? FileText;
                        const last = i === steps.length - 1;

                        return (
                            <li
                                key={step.step}
                                className="relative flex gap-5 pb-7 last:pb-0 lg:flex-col lg:gap-4 lg:pb-0"
                            >
                                <span
                                    className={cn(
                                        'grid size-14 shrink-0 place-items-center rounded-2xl bg-card text-foreground shadow-raised',
                                        last &&
                                            'bg-accent-solid text-white shadow-btn',
                                    )}
                                >
                                    <Icon className="size-[22px]" />
                                </span>
                                <div className="flex flex-col gap-3 lg:gap-4">
                                    <div>
                                        <span className="text-tertiary font-mono text-[11px] tracking-[0.08em] uppercase">
                                            Step{' '}
                                            {String(step.step).padStart(2, '0')}
                                        </span>
                                        <h3 className="mt-1 text-xl font-medium tracking-[-0.025em] text-foreground">
                                            {step.title}
                                        </h3>
                                        <p className="mt-1.5 text-[14.5px] text-pretty text-muted-foreground">
                                            {step.body}
                                        </p>
                                    </div>
                                    <span className="self-start">
                                        <StatusChip
                                            tone={last ? 'accent' : 'neutral'}
                                            dot={false}
                                        >
                                            {stepChips[i]}
                                        </StatusChip>
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
