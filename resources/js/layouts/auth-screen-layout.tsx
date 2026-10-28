import { Head, Link } from '@inertiajs/react';
import { Lock, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import {
    Chip,
    Eyebrow,
    StatusLabel,
    ThemeToggle,
} from '@/components/primitives';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { SiteBrandMark, SkipLink } from '@/layouts/site-layout';
import { cn } from '@/lib/utils';
import { home, privacy, terms } from '@/routes';

export function AuthArt({ className }: { className?: string }) {
    return (
        <aside
            aria-hidden="true"
            className={cn(
                'relative isolate m-3 flex flex-col justify-between overflow-hidden rounded-panel bg-(image:--sky-hero) p-11 text-foreground before:pointer-events-none before:absolute before:inset-[-20%_-10%] before:-z-10 before:rotate-[-14deg] before:bg-[linear-gradient(112deg,transparent_28%,var(--sky-streak)_44%,transparent_54%),linear-gradient(112deg,transparent_58%,var(--sky-streak)_66%,transparent_74%)] max-split:hidden',
                className,
            )}
        >
            <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3 py-1.5 text-[12.5px] text-foreground shadow-glass backdrop-blur-md">
                    <Lock className="size-[15px]" />
                    Encrypted portal
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3 py-1.5 text-[12.5px] text-foreground shadow-glass backdrop-blur-md">
                    <ShieldCheck className="size-[15px]" />
                    2FA on every account
                </span>
            </div>

            <div className="mt-auto grid gap-6">
                <blockquote className="max-w-[38ch] text-[26px] leading-[1.2] font-medium tracking-[-0.025em] text-balance text-foreground">
                    “The convenience of online filing, with a real tax
                    professional who knows Philadelphia and Baltimore.”
                    <footer className="mt-3 font-mono text-[12px] font-normal tracking-[0.06em] text-muted-foreground uppercase">
                        Okojie &amp; Associates · Serving PA &amp; MD for 26+
                        years
                    </footer>
                </blockquote>

                <div className="max-w-[440px] rounded-[20px] bg-glass p-2 shadow-[0_30px_70px_-30px_rgb(20_25_60/0.35),inset_0_0_0_1px_var(--glass-ring)] backdrop-blur-xl">
                    <div className="rounded-[14px] bg-card p-5 shadow-card">
                        <div className="mb-3.5 flex items-center justify-between text-[13px] font-medium text-foreground">
                            <span>Your 2026 return</span>
                            <Chip tone="accent" dot>
                                In preparation
                            </Chip>
                        </div>

                        {[
                            ['PDF', 'W-2 · Temple University', '214 KB'],
                            ['PDF', '1099-INT · PNC Bank', '88 KB'],
                            ['JPG', 'Photo ID', '1.2 MB'],
                        ].map(([ext, label, size]) => (
                            <div
                                key={label}
                                className="flex items-center gap-2.5 border-t border-border py-2.5 text-[13.5px] first:border-t-0"
                            >
                                <span className="bg-accent-soft text-accent-fg grid h-7 w-9 shrink-0 place-items-center rounded-[7px] font-mono text-[10px] font-medium">
                                    {ext}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <b className="block truncate font-medium text-foreground">
                                        {label}
                                    </b>
                                    <small className="text-tertiary block text-[12.5px]">
                                        {size}
                                    </small>
                                </span>
                                <StatusLabel tone="ok">Clean</StatusLabel>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}

export type AuthScreenLayoutProps = {
    children?: React.ReactNode;
    headTitle?: string;
    disableNoIndex?: boolean;
    iconTile?: React.ReactNode;
    eyebrow?: React.ReactNode;
    title?: React.ReactNode;
    lead?: React.ReactNode;
    description?: React.ReactNode;
    switchLine?: React.ReactNode;
    className?: string;
};

export function AuthScreenLayout(props: AuthScreenLayoutProps) {
    useFlashToast();
    const {
        children,
        headTitle,
        disableNoIndex = false,
        iconTile,
        eyebrow,
        title,
        lead,
        description,
        switchLine,
        className,
    } = props;

    const effectiveLead = lead ?? description;

    return (
        <div
            className={cn(
                'grid min-h-screen grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-background text-foreground max-split:grid-cols-1',
                className,
            )}
        >
            <SkipLink />
            {(!disableNoIndex || headTitle) && (
                <Head title={headTitle}>
                    {!disableNoIndex && (
                        <meta name="robots" content="noindex, nofollow" />
                    )}
                </Head>
            )}

            <div className="flex flex-col justify-between px-12 py-9 max-sm:px-5 max-sm:py-6">
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href={home.url()}
                        className="inline-flex items-center gap-2.5"
                    >
                        <SiteBrandMark size="sm" />
                        <span>
                            <b className="block text-[13.5px] leading-[1.15] font-semibold tracking-[-0.015em] text-foreground">
                                Okojie Online
                            </b>
                            <small className="text-tertiary block text-[11.5px] font-normal">
                                Okojie &amp; Associates
                            </small>
                        </span>
                    </Link>

                    <ThemeToggle />
                </div>

                <main
                    id="main"
                    className="mx-auto my-auto w-full max-w-[400px] py-8"
                >
                    {iconTile && (
                        <div className="bg-accent-soft text-accent-fg mb-4 grid size-11 place-items-center rounded-xl">
                            {iconTile}
                        </div>
                    )}
                    {eyebrow && <Eyebrow className="block">{eyebrow}</Eyebrow>}
                    {title && (
                        <h1 className="mt-2.5 text-[28px] leading-[1.15] font-medium tracking-[-0.03em] text-foreground">
                            {title}
                        </h1>
                    )}
                    {effectiveLead && (
                        <p className="mt-2 text-[14.5px] text-muted-foreground">
                            {effectiveLead}
                        </p>
                    )}
                    <div className={cn((title || effectiveLead) && 'mt-6')}>
                        {children}
                    </div>
                    {switchLine && (
                        <p className="[&_a]:text-accent-fg mt-5 text-center text-[13.5px] text-muted-foreground [&_a]:font-medium [&_a:hover]:underline">
                            {switchLine}
                        </p>
                    )}
                </main>

                <div className="text-tertiary flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="size-[15px]" />
                        IRS Pub 4557 &amp; FTC Safeguards compliant
                    </span>
                    <span>
                        <Link
                            href={privacy.url()}
                            className="transition-colors hov:hover:text-foreground"
                        >
                            Privacy
                        </Link>{' '}
                        ·{' '}
                        <Link
                            href={terms.url()}
                            className="transition-colors hov:hover:text-foreground"
                        >
                            Terms
                        </Link>
                    </span>
                </div>
            </div>

            <AuthArt />
        </div>
    );
}

export default AuthScreenLayout;
