import { Link, usePage, router } from '@inertiajs/react';
import { Menu, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import * as React from 'react';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export function SiteHeader() {
    const { url } = usePage();
    const pageProps = usePage().props as unknown as {
        auth?: {
            user?: {
                name: string;
                email: string;
            } | null;
        };
    };

    const user = pageProps.auth?.user;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const isActive = (href: string) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
    };

    const handleSignOut = () => {
        setMobileOpen(false);
        router.post('/logout');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-[1160px] items-center justify-between px-6">
                {/* Left: Brand Logo */}
                <BrandLogo showSublabel={true} href="/" />

                {/* Center: Desktop Navigation */}
                <nav
                    className="hidden items-center gap-8 md:flex"
                    aria-label="Main Navigation"
                >
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative py-1 text-sm font-medium transition-colors hover:text-white',
                                    active
                                        ? 'font-semibold text-white after:absolute after:right-0 after:bottom-[-2px] after:left-0 after:h-[2px] after:rounded-full after:bg-primary'
                                        : 'text-body',
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Desktop Auth Actions */}
                <div className="hidden items-center gap-4 md:flex">
                    {user ? (
                        <>
                            <Link
                                href="/portal"
                                className="px-2 py-1.5 text-sm font-medium text-body transition-colors hover:text-white"
                            >
                                My Portal
                            </Link>
                            <Button
                                variant="outline"
                                size="default"
                                onClick={handleSignOut}
                                className="rounded-full"
                            >
                                <LogOut className="mr-1 size-4 text-muted-foreground" />
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-2 py-1.5 text-sm font-medium text-body transition-colors hover:text-white"
                            >
                                Client Login
                            </Link>
                            <Button
                                variant="primary"
                                size="default"
                                asChild
                                className="rounded-full shadow-sm"
                            >
                                <Link href="/contact#start">
                                    Start My Return Online
                                </Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Drawer */}
                <div className="flex items-center md:hidden">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground hover:bg-card"
                                aria-label="Open navigation menu"
                            >
                                <Menu className="size-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="flex w-[320px] flex-col justify-between border-l border-border bg-card p-6 sm:w-[380px]"
                        >
                            <div className="flex flex-col gap-6">
                                <SheetHeader className="border-b border-border pb-4 text-left">
                                    <SheetTitle className="sr-only">
                                        Navigation Menu
                                    </SheetTitle>
                                    <BrandLogo showSublabel={true} href="/" />
                                </SheetHeader>

                                {/* Mobile Links */}
                                <nav
                                    className="flex flex-col gap-1.5"
                                    aria-label="Mobile Navigation"
                                >
                                    {navItems.map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                                className={cn(
                                                    'flex items-center justify-between rounded-xl px-3.5 py-3 text-base font-medium transition-colors',
                                                    active
                                                        ? 'bg-secondary font-semibold text-white'
                                                        : 'text-body hover:bg-secondary/50 hover:text-white',
                                                )}
                                            >
                                                <span>{item.label}</span>
                                                <ChevronRight className="size-4 text-muted-foreground" />
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Mobile Auth Actions at bottom */}
                            <div className="flex flex-col gap-3 border-t border-border pt-6">
                                {user ? (
                                    <>
                                        <div className="truncate px-1 text-xs text-muted-foreground">
                                            Signed in as{' '}
                                            <span className="font-semibold text-foreground">
                                                {user.email || user.name}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            fullWidth
                                            asChild
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Link href="/portal">
                                                <LayoutDashboard className="mr-2 size-4" />
                                                My Portal
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            fullWidth
                                            onClick={handleSignOut}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <LogOut className="mr-2 size-4" />
                                            Sign out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            asChild
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Link href="/contact#start">
                                                Start My Return Online
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            fullWidth
                                            asChild
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Link href="/login">
                                                Client Login
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
