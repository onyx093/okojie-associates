import * as React from 'react';

import { Reveal } from '@/components/reveal';
import { VideoCard } from '@/components/marketing/video-card';
import { cn } from '@/lib/utils';
import type { VideoGroup } from '@/types/marketing';

interface VideoLibraryProps {
    groups: VideoGroup[];
    className?: string;
}

export function VideoLibrary({ groups, className }: VideoLibraryProps) {
    return (
        <div
            data-slot="video-library"
            className={cn('flex flex-col gap-14', className)}
        >
            {groups.map((group, groupIdx) => (
                <div key={group.category} className="flex flex-col gap-6">
                    <Reveal delay={groupIdx * 60} direction="up">
                        <h3 className="border-b border-border/70 pb-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            {group.category}
                        </h3>
                    </Reveal>

                    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
                        {group.videos.map((video, videoIdx) => (
                            <Reveal
                                key={video.id}
                                delay={(groupIdx * 2 + videoIdx) * 70}
                                direction="up"
                                className="h-full"
                            >
                                <VideoCard video={video} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
