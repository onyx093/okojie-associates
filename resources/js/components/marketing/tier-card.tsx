import { Link, usePage, router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardBestFor,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import { update as updateTier } from '@/routes/portal/tier';
import type { TierItem } from '@/types/marketing';

interface TierCardProps {
    tier: TierItem;
    featured?: boolean;
    className?: string;
}

export function TierCard({ tier, featured = false, className }: TierCardProps) {
    const pageProps = usePage().props as unknown as {
        auth?: {
            user?: {
                id: number;
                tier?: string | null;
            } | null;
        };
    };

    const user = pageProps.auth?.user;
    const isCurrentTier = user?.tier === tier.slug;
    const [isUpdating, setIsUpdating] = React.useState(false);

    const handleSelectTier = () => {
        if (!user) return;
        setIsUpdating(true);
        router.patch(
            updateTier.url(),
            { tier: tier.slug },
            {
                onFinish: () => setIsUpdating(false),
            },
        );
    };

    return (
        <Card
            data-slot="tier-card"
            className={cn(
                'flex h-full flex-col justify-between transition-all duration-200',
                featured
                    ? 'relative border-primary/50 shadow-[0_0_24px_rgba(79,99,232,0.12)]'
                    : 'hover:border-border-strong',
                className,
            )}
        >
            <div>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-xl font-bold text-foreground md:text-2xl">
                            {tier.name}
                        </CardTitle>
                        {featured && (
                            <span className="rounded-full border border-primary/30 bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                Popular
                            </span>
                        )}
                    </div>
                    <CardDescription className="mt-1 min-h-[40px] text-sm text-muted-foreground">
                        {tier.tagline}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                    {/* Price Range */}
                    <div className="border-y border-border/70 py-4">
                        <span className="mb-1 block text-xs text-muted-foreground">
                            starting at
                        </span>
                        <div className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                            {tier.price_range.replace(/^starting at /i, '')}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-body">
                        {tier.description}
                    </p>

                    {/* Feature Checklist */}
                    <ul
                        className="flex flex-col gap-2.5 text-sm"
                        aria-label={`${tier.name} features`}
                    >
                        {tier.features.map((feature, idx) => (
                            <li
                                key={idx}
                                className="flex items-start gap-2.5 text-body"
                            >
                                <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                    <Check className="size-2.5 stroke-[2.5]" />
                                </div>
                                <span className="leading-snug">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Best For Callout */}
                    {tier.best_for && (
                        <CardBestFor label="Best for:">
                            {tier.best_for}
                        </CardBestFor>
                    )}
                </CardContent>
            </div>

            <CardFooter className="pt-6">
                {user ? (
                    <Button
                        variant={
                            featured || isCurrentTier ? 'primary' : 'outline'
                        }
                        fullWidth
                        disabled={isUpdating || isCurrentTier}
                        onClick={handleSelectTier}
                        className="rounded-full shadow-sm"
                    >
                        {isCurrentTier
                            ? 'Current Tier'
                            : isUpdating
                              ? 'Updating...'
                              : tier.cta || `Choose ${tier.name}`}
                    </Button>
                ) : (
                    <Button
                        variant={featured ? 'primary' : 'outline'}
                        fullWidth
                        asChild
                        className="rounded-full shadow-sm"
                    >
                        <Link
                            href={register.url({
                                query: { tier: tier.slug },
                            })}
                        >
                            {tier.cta || `Choose ${tier.name}`}
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
