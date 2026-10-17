import { Play, Video } from 'lucide-react';
import * as React from 'react';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { VideoItem } from '@/types/marketing';

interface VideoCardProps {
    video: VideoItem;
    className?: string;
}

export function VideoCard({ video, className }: VideoCardProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Card
                data-slot="video-card"
                className={cn(
                    'group flex h-full cursor-pointer flex-col overflow-hidden bg-card p-0 transition-all duration-200 hover:border-border-strong',
                    className,
                )}
                onClick={() => setIsOpen(true)}
            >
                {/* 16:9 Thumbnail Area */}
                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden border-b border-border/70 bg-gradient-to-br from-[#1c203b] via-[#16182c] to-[#0f101b]">
                    {/* Subtle grid accent */}
                    <div className="absolute inset-0 bg-[radial-gradient(#4f63e8_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                    {/* Centered 56px circular play button */}
                    <button
                        type="button"
                        className="relative z-10 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform duration-200 group-hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
                        aria-label={`Play video: ${video.title}`}
                    >
                        <Play className="size-6 translate-x-0.5 fill-white" />
                    </button>
                </div>

                {/* Card Content Below Thumbnail */}
                <div className="flex flex-col gap-2 p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="text-[17px] leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
                            {video.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                            {video.description}
                        </CardDescription>
                    </CardContent>
                </div>
            </Card>

            {/* Video Modal Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="border-border bg-card p-6 sm:max-w-[720px]">
                    <DialogHeader className="border-b border-border/60 pb-3">
                        <DialogTitle className="text-xl font-bold text-foreground">
                            {video.title}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            {video.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        {video.url ? (
                            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                                <iframe
                                    src={video.url}
                                    title={video.title}
                                    className="h-full w-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-secondary p-6 text-center">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                                    <Video className="size-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-foreground">
                                        Coming Soon
                                    </h4>
                                    <p className="mt-1 max-w-[360px] text-xs text-muted-foreground sm:text-sm">
                                        This video guide is currently being
                                        produced. Check back soon or contact
                                        your preparer if you have questions!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
