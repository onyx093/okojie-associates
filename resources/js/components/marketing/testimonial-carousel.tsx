import { Star } from 'lucide-react';
import * as React from 'react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { TestimonialItem } from '@/types/marketing';

interface TestimonialCarouselProps {
    testimonials: TestimonialItem[];
    className?: string;
}

export function TestimonialCarousel({
    testimonials,
    className,
}: TestimonialCarouselProps) {
    return (
        <div
            data-slot="testimonial-carousel"
            className={cn(
                'relative mx-auto w-full max-w-[1160px] px-4 sm:px-12',
                className,
            )}
        >
            <Carousel
                opts={{
                    align: 'start',
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-5">
                    {testimonials.map((item, idx) => (
                        <CarouselItem
                            key={idx}
                            className="basis-full pl-5 sm:basis-1/2 lg:basis-1/3"
                        >
                            <Card className="flex h-full flex-col justify-between bg-card p-7 transition-colors hover:border-border-strong">
                                <CardContent className="p-0">
                                    {/* Star Rating */}
                                    <div
                                        className="mb-4 flex items-center gap-1 text-[#5b6cf0]"
                                        aria-label={`${item.stars} out of 5 stars`}
                                    >
                                        {Array.from({ length: item.stars }).map(
                                            (_, starIdx) => (
                                                <Star
                                                    key={starIdx}
                                                    className="size-4 fill-current stroke-none"
                                                />
                                            ),
                                        )}
                                    </div>

                                    {/* Quote */}
                                    <blockquote className="text-base leading-relaxed text-foreground italic">
                                        "{item.quote}"
                                    </blockquote>
                                </CardContent>

                                <CardFooter className="mt-6 flex flex-col items-start border-t border-border/60 p-0 pt-6">
                                    <span className="text-sm font-semibold text-foreground">
                                        {item.name}
                                    </span>
                                    <span className="mt-0.5 text-xs text-muted-foreground">
                                        {item.location}
                                    </span>
                                </CardFooter>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="-left-4 hidden size-9 rounded-full border-border-strong bg-card text-foreground shadow-sm hover:border-white/40 hover:bg-secondary sm:-left-12 sm:flex" />
                <CarouselNext className="-right-4 hidden size-9 rounded-full border-border-strong bg-card text-foreground shadow-sm hover:border-white/40 hover:bg-secondary sm:-right-12 sm:flex" />
            </Carousel>
        </div>
    );
}
