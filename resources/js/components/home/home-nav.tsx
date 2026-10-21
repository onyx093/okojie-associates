import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Menu, Moon, Sun } from 'lucide-react';
import * as React from 'react';

import { homeButtonClass } from '@/components/home/primitives';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
    about,
    contact,
    home,
    login,
    logout,
    portal,
    pricing,
    services,
} from '@/routes';

export type HomeTheme = 'light' | 'dark';

const navItems = [
    { label: 'Home', href: home.url() },
    { label: 'Services', href: services.url() },
    { label: 'Pricing', href: pricing.url() },
    { label: 'About', href: about.url() },
    { label: 'Contact', href: contact.url() },
];

export function BrandMark({ size = 32 }: { size?: number }) {
    return (
        <span
            aria-hidden="true"
            style={{ width: size, height: size, fontSize: size / 2 }}
            className="grid shrink-0 place-items-center rounded-[9px] bg-h-accent leading-none font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_2px_6px_-2px_rgb(79_99_232/0.6)]"
        >
            O
        </span>
    );
}

function ThemeToggle({
    theme,
    onToggle,
}: {
    theme: HomeTheme;
    onToggle: () => void;
}) {
    const iconClass =
        'col-start-1 row-start-1 size-[18px] transition-[opacity,scale,filter] duration-200';

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={
                theme === 'dark'
                    ? 'Switch to light theme'
                    : 'Switch to dark theme'
            }
            className="grid size-10 cursor-pointer place-items-center rounded-[11px] bg-h-surface text-h-fg shadow-h-chip transition-[scale] active:scale-95"
        >
            <Moon
                className={cn(
                    iconClass,
                    theme === 'dark' && 'scale-25 opacity-0 blur-[4px]',
                )}
            />
            <Sun
                className={cn(
                    iconClass,
                    theme === 'light' && 'scale-25 opacity-0 blur-[4px]',
                )}
            />
        </button>
    );
}

export function HomeNav({
    theme,
    onToggleTheme,
}: {
    theme: HomeTheme;
    onToggleTheme: () => void;
}) {
    const { url, props } = usePage<{ auth?: { user?: unknown } }>();
    const user = props.auth?.user;
    const [open, setOpen] = React.useState(false);

    const isActive = (href: string) =>
        href === home.url() ? url === href : url.startsWith(href);

    return (
        <nav
            aria-label="Primary"
            className="relative z-10 flex items-center justify-between gap-6 px-4 py-3.5 sm:px-7 sm:py-5"
        >
            <Link
                href={home.url()}
                className="flex items-center gap-2.5 rounded-lg"
                aria-label="Okojie & Associates home"
            >
                <BrandMark />
                <span className="text-[15px] leading-tight font-semibold tracking-[-0.01em]">
                    Okojie &amp; Associates
                    <small className="block text-xs font-normal tracking-normal text-h-fg-3">
                        Okojie Online
                    </small>
                </span>
            </Link>

            <div className="hidden gap-1 font-mono text-xs tracking-[0.06em] uppercase lg:flex">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className="rounded-lg px-3 py-2 text-h-fg-2 transition-colors aria-[current=page]:font-medium aria-[current=page]:text-h-fg [@media(hover:hover)]:hover:bg-h-fg/5 [@media(hover:hover)]:hover:text-h-fg"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                <div className="hidden items-center gap-2 sm:flex">
                    {user ? (
                        <Link
                            href={portal.url()}
                            className={homeButtonClass(
                                'primary',
                                'h-9 rounded-[10px] px-3.5 text-sm',
                            )}
                        >
                            My portal
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login.url()}
                                className={homeButtonClass(
                                    'secondary',
                                    'h-9 rounded-[10px] px-3.5 text-sm',
                                )}
                            >
                                Client login
                            </Link>
                            <Link
                                href={`${contact.url()}#start`}
                                className={homeButtonClass(
                                    'primary',
                                    'h-9 rounded-[10px] px-3.5 text-sm',
                                )}
                            >
                                Start my return
                            </Link>
                        </>
                    )}
                </div>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            aria-label="Open menu"
                            className="grid size-10 cursor-pointer place-items-center rounded-[11px] bg-h-surface text-h-fg shadow-h-chip lg:hidden"
                        >
                            <Menu className="size-[18px]" />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        data-theme={theme}
                        className="home flex w-[320px] flex-col justify-between gap-6 border-l border-h-line bg-h-surface p-6 text-h-fg"
                    >
                        <div className="flex flex-col gap-6">
                            <SheetTitle className="flex items-center gap-2.5 text-[15px] font-semibold !text-h-fg">
                                <BrandMark size={28} />
                                Okojie &amp; Associates
                            </SheetTitle>
                            <div className="flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        aria-current={
                                            isActive(item.href)
                                                ? 'page'
                                                : undefined
                                        }
                                        className="flex items-center justify-between rounded-xl px-3.5 py-3 text-base font-medium text-h-fg-2 aria-[current=page]:bg-h-sunken aria-[current=page]:text-h-fg"
                                    >
                                        {item.label}
                                        <ChevronRight className="size-4 text-h-fg-3" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5 border-t border-h-line pt-6">
                            {user ? (
                                <>
                                    <Link
                                        href={portal.url()}
                                        className={homeButtonClass('primary')}
                                    >
                                        My portal
                                    </Link>
                                    <Link
                                        href={logout.url()}
                                        method="post"
                                        as="button"
                                        className={homeButtonClass('secondary')}
                                    >
                                        Sign out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={`${contact.url()}#start`}
                                        onClick={() => setOpen(false)}
                                        className={homeButtonClass('primary')}
                                    >
                                        Start my return
                                    </Link>
                                    <Link
                                        href={login.url()}
                                        className={homeButtonClass('secondary')}
                                    >
                                        Client login
                                    </Link>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
