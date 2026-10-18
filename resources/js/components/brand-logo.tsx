import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
    className?: string;
    showSublabel?: boolean;
    href?: string;
}

export function BrandLogo({
    className,
    showSublabel = true,
    href = home.url(),
}: BrandLogoProps) {
    const content = (
        <div
            className={cn(
                'group inline-flex items-center gap-3 select-none',
                className,
            )}
        >
            {/* 32px indigo disc with white bold 'O' */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white shadow-sm ring-1 ring-white/15 transition-transform duration-150 group-hover:scale-105">
                <span className="translate-y-[-0.5px] text-base leading-none font-bold">
                    O
                </span>
            </div>

            <div className="flex flex-col text-left">
                <span className="text-base leading-tight font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-white">
                    Okojie & Associates, Inc.
                </span>
                {showSublabel && (
                    <span className="mt-0.5 text-[11px] leading-none font-medium tracking-normal text-muted-foreground">
                        Okojie Online
                    </span>
                )}
            </div>
        </div>
    );

    if (href) {
        return (
            <Link
                href={href}
                className="inline-flex items-center rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                {content}
            </Link>
        );
    }

    return content;
}
