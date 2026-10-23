import {
    CalendarDays,
    Clock,
    FileText,
    MapPin,
    PenLine,
    Phone,
    Play,
    Quote,
    Send,
    Sparkles,
    Upload,
    Video,
} from 'lucide-react';
import * as React from 'react';

import {
    container,
    HomeLinkButton,
    SectionHead,
    StatusChip,
} from '@/components/home/primitives';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { contact } from '@/routes';
import type {
    OfficeItem,
    StepItem,
    TestimonialItem,
    VideoGroup,
    VideoItem,
} from '@/types/marketing';

/* ───────── How it works ───────── */

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
            className="mx-2 rounded-[22px] bg-h-surface py-20 shadow-h-card sm:mx-3 sm:rounded-[28px] sm:py-[120px]"
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
                <ol className="relative grid gap-0 before:absolute before:top-7 before:bottom-7 before:left-[27px] before:w-0.5 before:bg-[repeating-linear-gradient(180deg,var(--h-line-strong)_0_6px,transparent_6px_12px)] lg:grid-cols-5 lg:gap-3 lg:before:top-[27px] lg:before:right-7 lg:before:bottom-auto lg:before:left-7 lg:before:h-0.5 lg:before:w-auto lg:before:bg-[repeating-linear-gradient(90deg,var(--h-line-strong)_0_6px,transparent_6px_12px)]">
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
                                        'grid size-14 shrink-0 place-items-center rounded-2xl bg-h-surface shadow-h-raised',
                                        last &&
                                            'bg-h-accent text-white shadow-h-btn',
                                    )}
                                >
                                    <Icon className="size-[22px]" />
                                </span>
                                <div className="flex flex-col gap-3 lg:gap-4">
                                    <div>
                                        <span className="font-mono text-[11px] tracking-[0.08em] text-h-fg-3 uppercase">
                                            Step{' '}
                                            {String(step.step).padStart(2, '0')}
                                        </span>
                                        <h3 className="mt-1 text-xl font-medium tracking-[-0.025em]">
                                            {step.title}
                                        </h3>
                                        <p className="mt-1.5 text-[14.5px] text-pretty text-h-fg-2">
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

/* ───────── Testimonials ───────── */

const avatarGradients = [
    'from-[#a9b4ff] to-[#f6c7b0]',
    'from-[#9ee2c4] to-[#a8c3ff]',
    'from-[#ffd2a1] to-[#f7a9c4]',
    'from-[#c9b8ff] to-[#9fd5ff]',
    'from-[#ffe29a] to-[#b8e5a8]',
];

function initials(name: string) {
    return name
        .replace(/[^A-Za-z ]/g, '')
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function Person({
    item,
    index,
    inverse = false,
}: {
    item: TestimonialItem;
    index: number;
    inverse?: boolean;
}) {
    return (
        <figcaption className="relative flex items-center gap-3">
            <span
                className={cn(
                    'grid size-[38px] shrink-0 place-items-center rounded-full bg-linear-135 text-[13px] font-semibold text-[#1b1d3a] outline outline-1 -outline-offset-1 outline-black/5',
                    avatarGradients[index % avatarGradients.length],
                )}
            >
                {initials(item.name)}
            </span>
            <span>
                <b className="block text-[14.5px] font-medium">{item.name}</b>
                <small
                    className={cn(
                        'text-[13px]',
                        inverse ? 'text-white/60' : 'text-h-fg-3',
                    )}
                >
                    {item.location}
                </small>
            </span>
        </figcaption>
    );
}

export function HomeTestimonials({
    testimonials,
}: {
    testimonials: TestimonialItem[];
}) {
    const [featured, ...rest] = testimonials;

    if (!featured) {
        return null;
    }

    return (
        <section aria-labelledby="quotes-title" className="py-20 sm:py-[120px]">
            <div className={container}>
                <SectionHead
                    id="quotes-title"
                    eyebrow="Client stories"
                    icon={Quote}
                    title="What clients say"
                    description="Families and business owners across Philadelphia and Baltimore."
                />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr]">
                    <figure className="relative m-0 flex flex-col justify-between gap-6 overflow-hidden rounded-[20px] bg-h-inverse p-6 text-[#f2f3f7] shadow-h-card sm:p-7 md:col-span-2 lg:col-span-1 lg:row-span-2">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-40 -right-40 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(94_112_240/0.55),transparent)]"
                        />
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-44 -left-36 size-[360px] rounded-full bg-[radial-gradient(closest-side,rgb(246_170_130/0.35),transparent)]"
                        />
                        <span
                            aria-hidden="true"
                            className="relative h-7 font-serif text-[64px] leading-[0.6] text-[#a8b2ff]"
                        >
                            “
                        </span>
                        <blockquote className="relative m-0 text-[clamp(22px,2.3vw,28px)] leading-[1.3] tracking-[-0.02em]">
                            {featured.quote}
                        </blockquote>
                        <Person item={featured} index={0} inverse />
                    </figure>
                    {rest.map((item, i) => (
                        <figure
                            key={item.name}
                            className="m-0 flex flex-col justify-between gap-6 rounded-[20px] bg-h-surface p-6 shadow-h-card sm:p-7"
                        >
                            <blockquote className="m-0 text-[16.5px] leading-[1.55]">
                                “{item.quote}”
                            </blockquote>
                            <Person item={item} index={i + 1} />
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ───────── Videos ───────── */

export function HomeVideos({ groups }: { groups: VideoGroup[] }) {
    const [active, setActive] = React.useState(0);
    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    if (groups.length === 0) {
        return null;
    }

    const select = (index: number) => {
        const next = (index + groups.length) % groups.length;
        setActive(next);
        tabRefs.current[next]?.focus();
    };

    return (
        <section aria-labelledby="videos-title" className="pb-20 sm:pb-[120px]">
            <div className={container}>
                <SectionHead
                    id="videos-title"
                    eyebrow="Watch & learn"
                    icon={Play}
                    title="See how it works before you start"
                    description="Short videos on getting started, using your portal, and hearing from clients."
                />
                <div
                    role="tablist"
                    aria-label="Video categories"
                    className="mb-6 inline-flex max-w-full gap-0.5 overflow-x-auto rounded-xl bg-h-sunken p-1 shadow-[inset_0_0_0_1px_var(--h-line)]"
                >
                    {groups.map((group, i) => (
                        <button
                            key={group.category}
                            ref={(el) => {
                                tabRefs.current[i] = el;
                            }}
                            type="button"
                            role="tab"
                            id={`video-tab-${i}`}
                            aria-selected={active === i}
                            aria-controls={`video-panel-${i}`}
                            tabIndex={active === i ? 0 : -1}
                            onClick={() => setActive(i)}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowRight') select(i + 1);
                                if (e.key === 'ArrowLeft') select(i - 1);
                            }}
                            className="h-9 cursor-pointer rounded-[9px] px-3.5 text-sm font-medium whitespace-nowrap text-h-fg-2 aria-selected:bg-h-surface aria-selected:text-h-fg aria-selected:shadow-h-chip"
                        >
                            {group.category}
                        </button>
                    ))}
                </div>
                {groups.map((group, i) => (
                    <div
                        key={group.category}
                        role="tabpanel"
                        id={`video-panel-${i}`}
                        aria-labelledby={`video-tab-${i}`}
                        hidden={active !== i}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        {group.videos.map((video, v) => (
                            <VideoCard
                                key={video.id}
                                video={video}
                                shifted={v % 2 === 1}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}

function VideoCard({ video, shifted }: { video: VideoItem; shifted: boolean }) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group cursor-pointer rounded-[20px] bg-h-surface p-2 text-left shadow-h-card"
            >
                <span
                    className={cn(
                        'home-sky relative grid aspect-video place-items-center rounded-xl outline outline-1 -outline-offset-1 outline-h-line',
                        shifted && 'bg-size-[100%_160%] bg-position-[0_30%]',
                    )}
                >
                    <span className="grid size-16 place-items-center rounded-full bg-white/90 text-[#0e1020] shadow-[0_10px_30px_-8px_rgb(16_19_60/0.45),inset_0_0_0_1px_rgb(255_255_255/0.8)] transition-[scale] duration-250 [@media(hover:hover)]:group-hover:scale-105">
                        <Play className="size-[22px] translate-x-0.5 fill-current" />
                    </span>
                </span>
                <span className="block px-2.5 pt-4 pb-2.5">
                    <span className="block text-lg font-medium tracking-[-0.02em]">
                        {video.title}
                    </span>
                    <span className="mt-1 block text-[14.5px] text-h-fg-2">
                        {video.description}
                    </span>
                </span>
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="border-border bg-card p-6 sm:max-w-[720px]">
                    <DialogHeader>
                        <DialogTitle>{video.title}</DialogTitle>
                        <DialogDescription>
                            {video.description}
                        </DialogDescription>
                    </DialogHeader>
                    {video.url ? (
                        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                            <iframe
                                src={video.url}
                                title={video.title}
                                className="size-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-secondary p-6 text-center">
                            <Video className="size-6 text-primary" />
                            <p className="max-w-[360px] text-sm text-muted-foreground">
                                This video is being produced. Check back soon,
                                or ask your preparer if you have questions.
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

/* ───────── Offices ───────── */

const roads = [
    ['top-[58%] h-2.5 -rotate-[8deg]', 'left-[30%] w-2 rotate-12'],
    ['top-[40%] h-2 rotate-[4deg]', 'left-[62%] w-2.5 -rotate-6'],
    ['top-[66%] h-[9px] -rotate-[14deg]', 'left-[44%] w-2 rotate-[20deg]'],
    ['top-1/2 h-2.5 rotate-[10deg]', 'left-[24%] w-[9px] -rotate-[4deg]'],
];

export function HomeOffices({ offices }: { offices: OfficeItem[] }) {
    return (
        <section
            id="offices"
            aria-labelledby="offices-title"
            className="scroll-mt-24 pb-20 sm:pb-[120px]"
        >
            <div className={container}>
                <SectionHead
                    id="offices-title"
                    eyebrow="Offices"
                    icon={MapPin}
                    title="Find us in person"
                    description="Three Philadelphia offices and one in Baltimore — or work with us entirely online."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {offices.map((office, i) => {
                        const [h, v] = roads[i % roads.length];

                        return (
                            <article
                                key={office.address}
                                className="flex flex-col rounded-[20px] bg-h-surface p-2 shadow-h-card"
                            >
                                <div
                                    aria-hidden="true"
                                    className="home-dots relative h-[120px] overflow-hidden rounded-xl bg-h-sunken"
                                >
                                    <span
                                        className={cn(
                                            'absolute -right-2.5 -left-2.5 bg-h-surface shadow-[0_0_0_1px_var(--h-line)]',
                                            h,
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'absolute -top-2.5 -bottom-2.5 bg-h-surface shadow-[0_0_0_1px_var(--h-line)]',
                                            v,
                                        )}
                                    />
                                    <span className="absolute top-1/2 left-1/2 grid size-[34px] -translate-x-1/2 -translate-y-[70%] -rotate-45 place-items-center rounded-[50%_50%_50%_4px] bg-h-accent shadow-h-btn">
                                        <span className="size-2.5 rounded-full bg-white" />
                                    </span>
                                </div>
                                <div className="grid content-start gap-2.5 px-2.5 pt-4 pb-2.5">
                                    <span className="justify-self-start">
                                        <StatusChip tone="neutral" dot={false}>
                                            {office.city}
                                        </StatusChip>
                                    </span>
                                    <h3 className="text-[17px] font-medium tracking-[-0.01em]">
                                        {office.address}
                                    </h3>
                                    <a
                                        href={`tel:${office.phone.replace(/[^\d+]/g, '')}`}
                                        className="flex items-center gap-2 text-sm tabular-nums"
                                    >
                                        <Phone className="size-[15px] text-h-fg-3" />
                                        {office.phone}
                                    </a>
                                    <span className="flex items-start gap-2 text-sm text-h-fg-2">
                                        <Clock className="mt-0.5 size-[15px] shrink-0 text-h-fg-3" />
                                        <span>
                                            {office.hours
                                                .split(' · ')
                                                .map((line) => (
                                                    <span
                                                        key={line}
                                                        className="block"
                                                    >
                                                        {line}
                                                    </span>
                                                ))}
                                        </span>
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                    <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-h-accent-soft p-6 shadow-[inset_0_0_0_1px_var(--h-line)] sm:col-span-2 sm:flex-row sm:items-center sm:px-7 lg:col-span-4">
                        <div>
                            <h3 className="text-xl font-medium tracking-[-0.02em]">
                                Prefer to stay home?
                            </h3>
                            <p className="mt-0.5 text-[15px] text-h-fg-2">
                                Our remote tiers work anywhere in the U.S., with
                                multi-state support for PA, MD, NJ, and DE.
                            </p>
                        </div>
                        <HomeLinkButton href={`${contact.url()}#start`}>
                            Start online
                        </HomeLinkButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
