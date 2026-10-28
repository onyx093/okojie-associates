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
    sublabel = 'Okojie & Associates',
    markTone = 'primary',
}: BrandLogoProps & {
    sublabel?: string;
    markTone?: 'primary' | 'dark';
}) {
    const content = (
        <div
            className={cn(
                'group inline-flex items-center gap-2.5 select-none',
                className,
            )}
        >
            <div
                className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-[9px] font-medium text-white transition-transform duration-150 group-hover:scale-[1.03]',
                    markTone === 'dark'
                        ? 'bg-foreground text-background shadow-chip'
                        : 'bg-primary text-primary-foreground shadow-btn',
                )}
            >
                <span className="text-[15px] leading-none font-semibold">
                    O
                </span>
            </div>

            <div className="flex flex-col text-left">
                <span className="text-[14.5px] leading-tight font-medium tracking-[-0.02em] text-foreground">
                    Okojie Online
                </span>
                {showSublabel && (
                    <span className="mt-0.5 text-[11.5px] leading-none text-fg-3">
                        {sublabel}
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
