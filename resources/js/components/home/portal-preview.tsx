import {
    CalendarDays,
    Check,
    CreditCard,
    FileText,
    Gift,
    LayoutGrid,
    Lock,
    MessageSquare,
    PenLine,
    Upload,
    Video,
} from 'lucide-react';
import * as React from 'react';

import { Chip } from '@/components/primitives/chip';
import { SiteBrandMark } from '@/layouts/site-layout';
import { cn } from '@/lib/utils';

const SIDEBAR_ITEMS = [
    { icon: LayoutGrid, label: 'Overview', active: true },
    { icon: FileText, label: 'Documents', count: 4 },
    { icon: MessageSquare, label: 'Messages', count: 1 },
    { icon: PenLine, label: 'E-sign' },
    { icon: CreditCard, label: 'Payments' },
];

const PREVIEW_STEPS = [
    { label: 'Book', meta: 'Jan 28', state: 'done' },
    { label: 'Upload', meta: 'Feb 2', state: 'done' },
    { label: 'Prepare', meta: 'In progress', state: 'now' },
    { label: 'Review & e-sign', meta: 'Feb 12', state: 'todo' },
    { label: 'E-file', meta: '—', state: 'todo' },
] as const;

export function PortalPreview({ className }: { className?: string }) {
    return (
        <div
            role="img"
            aria-label="Preview of the Okojie Online client portal showing return progress, uploaded documents and an upcoming review call with your preparer."
            className={cn(
                'relative z-10 mt-12 ml-4 w-[calc(100%-16px)] rounded-tl-[20px] bg-glass pt-1.5 pl-1.5 shadow-glass backdrop-blur-lg sm:mx-auto sm:mt-20 sm:w-[min(1160px,calc(100%-112px))] sm:rounded-t-[26px] sm:p-2 sm:pb-0',
                className,
            )}
        >
            <FloatTag className="-top-[18px] right-10" icon={Lock}>
                Encrypted upload
            </FloatTag>
            <FloatTag className="-top-[18px] right-[220px]" icon={PenLine}>
                IRS Form 8879 e-sign
            </FloatTag>

            <div
                aria-hidden="true"
                className="grid overflow-hidden rounded-tl-[14px] bg-card text-[13px] shadow-[0_0_0_1px_var(--border),0_30px_80px_-30px_rgb(16_19_60/0.45)] sm:rounded-t-[18px] lg:min-h-[400px] lg:grid-cols-[196px_1fr]"
            >
                {/* Desktop Mini-Sidebar */}
                <aside className="hidden border-r border-border bg-sunken px-3 py-4 lg:block">
                    <div className="flex items-center gap-2.5 px-1.5 pt-0.5 pb-4 text-[13.5px] font-semibold text-foreground">
                        <SiteBrandMark size="sm" />
                        Okojie Online
                    </div>
                    <SideLabel>Your return</SideLabel>
                    {SIDEBAR_ITEMS.map(
                        ({ icon: Icon, label, count, active }) => (
                            <div
                                key={label}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg px-2 py-[7px] text-muted-foreground',
                                    active &&
                                        'bg-card font-medium text-foreground shadow-chip',
                                )}
                            >
                                <Icon className="size-[15px]" />
                                {label}
                                {count !== undefined && (
                                    <span className="text-tertiary ml-auto text-[11px]">
                                        {count}
                                    </span>
                                )}
                            </div>
                        ),
                    )}
                    <SideLabel>Account</SideLabel>
                    <div className="flex items-center gap-2 px-2 py-[7px] text-muted-foreground">
                        <Gift className="size-[15px]" />
                        Refer a friend
                    </div>
                    <div className="flex items-center gap-2 px-2 py-[7px] text-muted-foreground">
                        <CalendarDays className="size-[15px]" />
                        Appointments
                    </div>
                </aside>

                {/* Main Preview Area */}
                <div className="grid content-start gap-3.5 p-3.5 sm:px-5 sm:pt-[18px] sm:pb-6 md:grid-cols-[1.35fr_1fr]">
                    <div className="flex items-center justify-between gap-3 md:col-span-2">
                        <div>
                            <h3 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
                                Welcome back, Denise
                            </h3>
                            <p className="text-tertiary text-[12.5px]">
                                2026 federal + PA return · Hybrid
                            </p>
                        </div>
                        <Chip tone="accent">In preparation</Chip>
                    </div>

                    {/* Progress Track */}
                    <MiniCard
                        title="Return progress"
                        meta="Updated 2h ago"
                        className="md:col-span-2"
                    >
                        <div className="relative grid grid-cols-5">
                            <span className="absolute top-2.5 right-[10%] left-[10%] h-0.5 rounded bg-border-strong" />
                            <span className="bg-accent-solid absolute top-2.5 left-[10%] h-0.5 w-[40%] rounded" />
                            {PREVIEW_STEPS.map((step) => (
                                <div
                                    key={step.label}
                                    className="relative grid justify-items-center gap-1.5 text-center"
                                >
                                    <StepDot state={step.state} />
                                    <b className="text-[12.5px] font-medium text-foreground">
                                        {step.label}
                                    </b>
                                    <small
                                        className={cn(
                                            'text-tertiary hidden text-[11.5px] sm:block',
                                            step.state === 'now' &&
                                                'text-accent-fg font-medium',
                                        )}
                                    >
                                        {step.meta}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </MiniCard>

                    {/* Documents List */}
                    <MiniCard title="Documents" meta="3 of 4 ready">
                        <DocRow
                            name="W-2 · Temple University"
                            meta="W2_2026.pdf · 214 KB"
                            status={<Chip tone="success">Verified</Chip>}
                        />
                        <DocRow
                            name="1099-INT · PNC Bank"
                            meta="1099INT.pdf · 88 KB"
                            status={<Chip tone="success">Verified</Chip>}
                        />
                        <DocRow
                            name="Photo ID"
                            meta="license-front.jpg · 64%"
                            icon={Upload}
                            progress={64}
                        />
                        <DocRow
                            name="1098-T · Tuition"
                            meta="Page 2 is missing"
                            status={<Chip tone="warning">Needs attention</Chip>}
                        />
                    </MiniCard>

                    {/* Preparer Callout */}
                    <MiniCard title="Your preparer" className="hidden md:block">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg_in_oklab,#a9b4ff,#f6c7b0)] text-sm font-semibold text-[#1b1d3a] shadow-sm">
                                AO
                            </span>
                            <span>
                                <b className="block font-medium text-foreground">
                                    Adaeze Okojie, EA
                                </b>
                                <small className="text-tertiary text-xs">
                                    Germantown Ave office
                                </small>
                            </span>
                        </div>
                        <div className="bg-accent-soft text-accent-fg mt-3 flex items-center gap-2 rounded-[9px] px-3 py-2.5 text-[12.5px]">
                            <Video className="size-[15px]" />
                            <span>
                                <b className="font-medium">Video review</b> ·
                                Thu, Feb 12 · 4:30 PM
                            </span>
                        </div>
                    </MiniCard>
                </div>
            </div>
        </div>
    );
}

function SideLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-tertiary px-2 pt-2.5 pb-1.5 font-mono text-[10.5px] tracking-[0.08em] uppercase">
            {children}
        </div>
    );
}

function FloatTag({
    icon: Icon,
    className,
    children,
}: {
    icon: typeof Lock;
    className: string;
    children: React.ReactNode;
}) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'absolute z-20 hidden items-center gap-2 rounded-[10px] bg-card py-[7px] pr-3 pl-2 font-mono text-[11.5px] tracking-[0.02em] whitespace-nowrap text-foreground shadow-raised lg:inline-flex',
                className,
            )}
        >
            <span className="grid size-[22px] place-items-center rounded-md bg-foreground text-background">
                <Icon className="size-3" strokeWidth={2.2} />
            </span>
            {children}
        </span>
    );
}

function MiniCard({
    title,
    meta,
    className,
    children,
}: {
    title: string;
    meta?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                'rounded-[14px] bg-card p-3.5 shadow-card',
                className,
            )}
        >
            <div className="mb-3 flex items-center justify-between font-medium text-foreground">
                <span>{title}</span>
                {meta && (
                    <span className="text-tertiary text-xs font-normal">
                        {meta}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

function StepDot({ state }: { state: 'done' | 'now' | 'todo' }) {
    if (state === 'done') {
        return (
            <span className="bg-accent-solid grid size-[22px] place-items-center rounded-full text-white">
                <Check className="size-3" strokeWidth={2.6} />
            </span>
        );
    }

    return (
        <span
            className={cn(
                'grid size-[22px] place-items-center rounded-full bg-card shadow-[inset_0_0_0_1.5px_var(--border-strong)]',
                state === 'now' &&
                    'shadow-[inset_0_0_0_1.5px_var(--accent-solid),0_0_0_4px_var(--accent-soft)]',
            )}
        >
            {state === 'now' && (
                <span className="bg-accent-solid size-2 rounded-full" />
            )}
        </span>
    );
}

function DocRow({
    name,
    meta,
    status,
    icon: Icon = FileText,
    progress,
}: {
    name: string;
    meta: string;
    status?: React.ReactNode;
    icon?: typeof FileText;
    progress?: number;
}) {
    return (
        <div className="flex items-center gap-2.5 border-t border-border py-[9px] first-of-type:border-t-0 first-of-type:pt-0">
            <span className="grid size-[30px] shrink-0 place-items-center rounded-lg bg-sunken text-foreground shadow-[inset_0_0_0_1px_var(--border)]">
                <Icon className="size-[15px]" />
            </span>
            <span className="min-w-0 flex-1">
                <b className="block truncate text-[12.5px] font-medium text-foreground">
                    {name}
                </b>
                <small className="text-tertiary text-[11.5px]">{meta}</small>
                {progress !== undefined && (
                    <span className="mt-1.5 block h-1 overflow-hidden rounded bg-sunken">
                        <i
                            className="bg-accent-solid block h-full rounded"
                            style={{ width: `${progress}%` }}
                        />
                    </span>
                )}
            </span>
            {status}
        </div>
    );
}
