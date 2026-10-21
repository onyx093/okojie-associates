import {
    ArrowRight,
    Award,
    CalendarDays,
    Check,
    CreditCard,
    FileText,
    Gift,
    LayoutGrid,
    Lock,
    MapPin,
    MessageSquare,
    PenLine,
    Upload,
    Video,
} from 'lucide-react';
import * as React from 'react';

import { BrandMark, HomeNav } from '@/components/home/home-nav';
import type { HomeTheme } from '@/components/home/home-nav';
import { HomeLinkButton, StatusChip } from '@/components/home/primitives';
import { cn } from '@/lib/utils';
import { contact } from '@/routes';

export function HomeHero({
    theme,
    onToggleTheme,
}: {
    theme: HomeTheme;
    onToggleTheme: () => void;
}) {
    return (
        <div className="p-2 sm:p-3">
            <header className="home-sky home-sky-veil rounded-[22px] sm:rounded-[28px]">
                <HomeNav theme={theme} onToggleTheme={onToggleTheme} />

                <div className="relative z-[2] max-w-[760px] px-5 pt-9 sm:px-14 sm:pt-16">
                    <span className="inline-flex items-center gap-2 rounded-full bg-h-glass py-1.5 pr-3 pl-2 text-[13px] text-h-fg-2 shadow-[inset_0_0_0_1px_var(--h-glass-ring)] backdrop-blur-md">
                        <span className="size-2 rounded-full bg-[#3cc487] shadow-[0_0_0_3px_rgb(60_196_135/0.2)]" />
                        26+ years · Philadelphia &amp; Baltimore
                    </span>
                    <h1 className="mt-6 text-[clamp(42px,6.4vw,80px)] leading-[0.98] font-medium tracking-[-0.04em] text-balance">
                        The convenience of online filing, with a{' '}
                        <em className="text-h-accent-fg not-italic">
                            real tax professional.
                        </em>
                    </h1>
                    <p className="mt-6 max-w-[52ch] text-[16.5px] text-pretty text-h-fg-2 sm:text-lg">
                        Upload your documents, review with your preparer by
                        video, e-sign and file — all from home, backed by a team
                        that knows Pennsylvania and Maryland.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2.5">
                        <HomeLinkButton
                            href={`${contact.url()}#start`}
                            className="h-12 flex-[1_1_100%] pr-4 sm:flex-none"
                        >
                            Start my return online
                            <ArrowRight className="size-[15px]" />
                        </HomeLinkButton>
                        <HomeLinkButton
                            href={`${contact.url()}#consult`}
                            variant="secondary"
                            className="h-12 flex-[1_1_100%] sm:flex-none"
                        >
                            Book a free consultation
                        </HomeLinkButton>
                    </div>
                    <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-h-fg-2">
                        <span className="inline-flex items-center gap-1.5">
                            <Lock className="size-[15px] text-h-accent-fg" />
                            Secure client portal
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Award className="size-[15px] text-h-accent-fg" />
                            Credentialed preparers
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-[15px] text-h-accent-fg" />
                            Local PA &amp; MD knowledge
                        </span>
                    </div>
                </div>

                <PortalPreview />
            </header>
        </div>
    );
}

const sideItems = [
    { icon: LayoutGrid, label: 'Overview', active: true },
    { icon: FileText, label: 'Documents', count: 4 },
    { icon: MessageSquare, label: 'Messages', count: 1 },
    { icon: PenLine, label: 'E-sign' },
    { icon: CreditCard, label: 'Payments' },
];

const steps = [
    { label: 'Book', meta: 'Jan 28', state: 'done' },
    { label: 'Upload', meta: 'Feb 2', state: 'done' },
    { label: 'Prepare', meta: 'In progress', state: 'now' },
    { label: 'Review & e-sign', meta: 'Feb 12', state: 'todo' },
    { label: 'E-file', meta: '—', state: 'todo' },
] as const;

/** Decorative preview of the client portal. Sample data only. */
function PortalPreview() {
    return (
        <div
            role="img"
            aria-label="Preview of the Okojie Online client portal showing return progress, uploaded documents and an upcoming review call with your preparer."
            className="relative z-[1] mt-12 ml-4 w-[calc(100%-16px)] rounded-tl-[20px] bg-h-glass pt-1.5 pl-1.5 shadow-[inset_0_0_0_1px_var(--h-glass-ring)] backdrop-blur-lg sm:mx-auto sm:mt-20 sm:w-[min(1160px,calc(100%-112px))] sm:rounded-t-[26px] sm:p-2 sm:pb-0"
        >
            <FloatTag className="-top-[18px] right-10" icon={Lock}>
                Encrypted upload
            </FloatTag>
            <FloatTag className="-top-[18px] right-[220px]" icon={PenLine}>
                IRS Form 8879 e-sign
            </FloatTag>

            <div
                aria-hidden="true"
                className="grid overflow-hidden rounded-tl-[14px] bg-h-surface text-[13px] shadow-[0_0_0_1px_var(--h-line),0_30px_80px_-30px_rgb(16_19_60/0.45)] sm:rounded-t-[18px] lg:min-h-[400px] lg:grid-cols-[196px_1fr]"
            >
                <aside className="hidden border-r border-h-line bg-h-sunken px-3 py-4 lg:block">
                    <div className="flex items-center gap-2.5 px-1.5 pt-0.5 pb-4 text-[13.5px] font-semibold">
                        <BrandMark size={24} />
                        Okojie Online
                    </div>
                    <SideLabel>Your return</SideLabel>
                    {sideItems.map(({ icon: Icon, label, count, active }) => (
                        <div
                            key={label}
                            className={cn(
                                'flex items-center gap-2 rounded-lg px-2 py-[7px] text-h-fg-2',
                                active &&
                                    'bg-h-surface font-medium text-h-fg shadow-h-chip',
                            )}
                        >
                            <Icon className="size-[15px]" />
                            {label}
                            {count && (
                                <span className="ml-auto text-[11px] text-h-fg-3">
                                    {count}
                                </span>
                            )}
                        </div>
                    ))}
                    <SideLabel>Account</SideLabel>
                    <div className="flex items-center gap-2 px-2 py-[7px] text-h-fg-2">
                        <Gift className="size-[15px]" />
                        Refer a friend
                    </div>
                    <div className="flex items-center gap-2 px-2 py-[7px] text-h-fg-2">
                        <CalendarDays className="size-[15px]" />
                        Appointments
                    </div>
                </aside>

                <div className="grid content-start gap-3.5 p-3.5 sm:px-5 sm:pt-[18px] sm:pb-6 md:grid-cols-[1.35fr_1fr]">
                    <div className="flex items-center justify-between gap-3 md:col-span-2">
                        <div>
                            <h3 className="text-[17px] font-medium tracking-[-0.015em]">
                                Welcome back, Denise
                            </h3>
                            <p className="text-[12.5px] text-h-fg-3">
                                2026 federal + PA return · Hybrid
                            </p>
                        </div>
                        <StatusChip tone="accent">In preparation</StatusChip>
                    </div>

                    <MiniCard
                        title="Return progress"
                        meta="Updated 2h ago"
                        className="md:col-span-2"
                    >
                        <div className="relative grid grid-cols-5">
                            <span className="absolute top-2.5 right-[10%] left-[10%] h-0.5 rounded bg-h-line-strong" />
                            <span className="absolute top-2.5 left-[10%] h-0.5 w-[40%] rounded bg-h-accent" />
                            {steps.map((step) => (
                                <div
                                    key={step.label}
                                    className="relative grid justify-items-center gap-1.5 text-center"
                                >
                                    <StepDot state={step.state} />
                                    <b className="text-[12.5px] font-medium">
                                        {step.label}
                                    </b>
                                    <small
                                        className={cn(
                                            'hidden text-[11.5px] text-h-fg-3 sm:block',
                                            step.state === 'now' &&
                                                'text-h-accent-fg',
                                        )}
                                    >
                                        {step.meta}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </MiniCard>

                    <MiniCard title="Documents" meta="3 of 4 ready">
                        <DocRow
                            name="W-2 · Temple University"
                            meta="W2_2026.pdf · 214 KB"
                            status={<StatusChip tone="ok">Verified</StatusChip>}
                        />
                        <DocRow
                            name="1099-INT · PNC Bank"
                            meta="1099INT.pdf · 88 KB"
                            status={<StatusChip tone="ok">Verified</StatusChip>}
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
                            status={
                                <StatusChip tone="warn">
                                    Needs attention
                                </StatusChip>
                            }
                        />
                    </MiniCard>

                    <MiniCard title="Your preparer" className="hidden md:block">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg_in_oklab,#a9b4ff,#f6c7b0)] text-sm font-semibold text-[#1b1d3a] outline outline-1 -outline-offset-1 outline-black/5">
                                AO
                            </span>
                            <span>
                                <b className="block font-medium">
                                    Adaeze Okojie, EA
                                </b>
                                <small className="text-xs text-h-fg-3">
                                    Germantown Ave office
                                </small>
                            </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 rounded-[9px] bg-h-accent-soft px-3 py-2.5 text-[12.5px] text-h-accent-fg">
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
        <div className="px-2 pt-2.5 pb-1.5 font-mono text-[10.5px] tracking-[0.08em] text-h-fg-3 uppercase">
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
                'absolute z-[3] hidden items-center gap-2 rounded-[10px] bg-h-surface py-[7px] pr-3 pl-2 font-mono text-[11.5px] tracking-[0.02em] whitespace-nowrap shadow-h-raised lg:inline-flex',
                className,
            )}
        >
            <span className="grid size-[22px] place-items-center rounded-md bg-h-fg text-h-bg">
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
                'rounded-[14px] bg-h-surface p-3.5 shadow-h-card',
                className,
            )}
        >
            <div className="mb-3 flex items-center justify-between font-medium">
                <span>{title}</span>
                {meta && (
                    <span className="text-xs font-normal text-h-fg-3">
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
            <span className="grid size-[22px] place-items-center rounded-full bg-h-accent text-white">
                <Check className="size-3" strokeWidth={2.6} />
            </span>
        );
    }

    return (
        <span
            className={cn(
                'grid size-[22px] place-items-center rounded-full bg-h-surface shadow-[inset_0_0_0_1.5px_var(--h-line-strong)]',
                state === 'now' &&
                    'shadow-[inset_0_0_0_1.5px_var(--h-accent),0_0_0_4px_var(--h-accent-soft)]',
            )}
        >
            {state === 'now' && (
                <span className="size-2 rounded-full bg-h-accent" />
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
        <div className="flex items-center gap-2.5 border-t border-h-line py-[9px] first-of-type:border-t-0 first-of-type:pt-0">
            <span className="grid size-[30px] shrink-0 place-items-center rounded-lg bg-h-sunken text-h-fg-2 shadow-[inset_0_0_0_1px_var(--h-line)]">
                <Icon className="size-[15px]" />
            </span>
            <span className="min-w-0 flex-1">
                <b className="block truncate text-[12.5px] font-medium">
                    {name}
                </b>
                <small className="text-[11.5px] text-h-fg-3">{meta}</small>
                {progress !== undefined && (
                    <span className="mt-1.5 block h-1 overflow-hidden rounded bg-h-sunken">
                        <i
                            className="block h-full rounded bg-h-accent"
                            style={{ width: `${progress}%` }}
                        />
                    </span>
                )}
            </span>
            {status}
        </div>
    );
}
