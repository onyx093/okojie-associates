import { Head, Link, usePage } from '@inertiajs/react';
import { Gift, Home, Inbox, LogOut, Shield, Users } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { home, logout } from '@/routes';
import { index as adminIndex } from '@/routes/admin';
import { index as adminClients } from '@/routes/admin/clients';
import { index as adminLeads } from '@/routes/admin/leads';
import { index as adminReferrals } from '@/routes/admin/referrals';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const NAV_ITEMS = [
    { name: 'Clients', href: adminClients.url(), icon: Users },
    { name: 'Leads', href: adminLeads.url(), icon: Inbox },
    { name: 'Referrals', href: adminReferrals.url(), icon: Gift },
];

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const { url, props } = usePage();
    const pageProps = props as unknown as {
        flash?: {
            success?: string | null;
            error?: string | null;
        };
    };

    React.useEffect(() => {
        if (pageProps.flash?.success) {
            toast.success(pageProps.flash.success);
        }
        if (pageProps.flash?.error) {
            toast.error(pageProps.flash.error);
        }
    }, [pageProps.flash?.success, pageProps.flash?.error]);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <BrandLogo
                                showSublabel={false}
                                href={adminIndex.url()}
                            />
                            <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                Staff Console
                            </span>
                        </div>

                        <nav
                            className="hidden items-center gap-1 sm:flex"
                            aria-label="Admin Navigation"
                        >
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    url === item.href ||
                                    url.startsWith(item.href + '/') ||
                                    url.startsWith(item.href + '?');

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                                            isActive
                                                ? 'bg-primary font-semibold text-primary-foreground shadow-xs'
                                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                        )}
                                        aria-current={
                                            isActive ? 'page' : undefined
                                        }
                                    >
                                        <Icon className="size-3.5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={home.url()}>
                                <Home className="mr-1.5 size-4" />
                                Live Site
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={logout.url()} method="post" as="button">
                                <LogOut className="mr-1.5 size-4" />
                                Sign out
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation bar */}
                <div className="flex border-t border-border px-6 py-2 sm:hidden">
                    <div className="flex w-full items-center justify-around gap-1">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                url === item.href ||
                                url.startsWith(item.href + '/') ||
                                url.startsWith(item.href + '?');

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium',
                                        isActive
                                            ? 'bg-primary font-semibold text-primary-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    <Icon className="size-3.5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="flex-1 py-8">
                <div className="mx-auto max-w-[1240px] px-6">
                    {title && (
                        <div className="mb-6">
                            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
                                <Shield className="size-6 text-primary" />
                                {title}
                            </h1>
                        </div>
                    )}
                    {children}
                </div>
            </main>
            <Toaster />
        </div>
    );
}

export default AdminLayout;
