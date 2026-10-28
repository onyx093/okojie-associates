import { Play, Video } from 'lucide-react';
import * as React from 'react';

import { container, SectionHead } from '@/components/home/primitives';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { VideoGroup, VideoItem } from '@/types/marketing';

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
                    className="mb-6 inline-flex max-w-full gap-0.5 overflow-x-auto rounded-xl bg-sunken p-1 shadow-[inset_0_0_0_1px_var(--border)]"
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
                                if (e.key === 'ArrowRight') {
                                    select(i + 1);
                                }
                                if (e.key === 'ArrowLeft') {
                                    select(i - 1);
                                }
                            }}
                            className="h-9 cursor-pointer rounded-[9px] px-3.5 text-sm font-medium whitespace-nowrap text-muted-foreground aria-selected:bg-card aria-selected:text-foreground aria-selected:shadow-chip"
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
                className="group cursor-pointer rounded-[20px] bg-card p-2 text-left shadow-card"
            >
                <span
                    className={cn(
                        'relative grid aspect-video place-items-center rounded-xl bg-(image:--sky-band) outline outline-1 -outline-offset-1 outline-border',
                        shifted && 'bg-size-[100%_160%] bg-position-[0_30%]',
                    )}
                >
                    <span className="grid size-16 place-items-center rounded-full bg-white/90 text-[#0e1020] shadow-[0_10px_30px_-8px_rgb(16_19_60/0.45),inset_0_0_0_1px_rgb(255_255_255/0.8)] transition-[transform] duration-250 [@media(hover:hover)]:group-hover:scale-105">
                        <Play className="size-[22px] translate-x-0.5 fill-current" />
                    </span>
                </span>
                <span className="block px-2.5 pt-4 pb-2.5">
                    <span className="block text-lg font-medium tracking-[-0.02em] text-foreground">
                        {video.title}
                    </span>
                    <span className="mt-1 block text-[14.5px] text-muted-foreground">
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
                        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-sunken p-6 text-center">
                            <Video className="text-accent-fg size-6" />
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
