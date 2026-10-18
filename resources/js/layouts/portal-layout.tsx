import { Head, Link, usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { portal } from '@/routes';
import {
    appointments,
    documents,
    messages,
    overview,
    referrals,
    security,
} from '@/routes/portal';

interface PortalLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const TABS = [
    { name: 'Overview', href: overview.url() },
    { name: 'Documents', href: documents.url() },
    { name: 'Appointments', href: appointments.url() },
    { name: 'Referrals', href: referrals.url() },
    { name: 'Messages', href: messages.url() },
];

export function PortalLayout({ children }: PortalLayoutProps) {
    const { url, props } = usePage();
    const pageProps = props as unknown as {
        auth?: {
            user?: {
                id?: number;
                name?: string;
                email?: string;
                tier?: string | null;
                tierLabel?: string | null;
                twoFactorEnabled?: boolean;
            } | null;
        };
        flash?: {
            success?: string | null;
            error?: string | null;
        };
    };

    const user = pageProps.auth?.user;
    const titleText = user?.name || user?.email || 'Client';

    // Show flash toasts
    React.useEffect(() => {
        if (pageProps.flash?.success) {
            toast.success(pageProps.flash.success);
        }
        if (pageProps.flash?.error) {
            toast.error(pageProps.flash.error);
        }
    }, [pageProps.flash?.success, pageProps.flash?.error]);

    const isSecurityActive = url.startsWith(security.url());

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <SiteHeader />
            <main className="flex-1 py-10 lg:py-12">
                <div className="mx-auto max-w-[1160px] px-6">
                    {/* Header area for Portal */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                                Welcome back
                            </p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {titleText}
                            </h1>
                            {user?.name && user?.email && (
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <Badge
                                variant="portalTier"
                                className="px-3.5 py-1 text-xs"
                            >
                                {user?.tierLabel || 'No tier selected'}
                            </Badge>
                        </div>
                    </div>

                    {/* Segmented tab nav */}
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <nav
                            aria-label="Portal Navigation"
                            className="overflow-x-auto pb-1 sm:pb-0"
                        >
                            <div className="inline-flex items-center rounded-full border border-border bg-secondary/60 p-1">
                                {TABS.map((tab) => {
                                    const isActive =
                                        url === tab.href ||
                                        url.startsWith(tab.href + '?') ||
                                        (tab.href === overview.url() &&
                                            url === portal.url());

                                    return (
                                        <Link
                                            key={tab.name}
                                            href={tab.href}
                                            aria-current={
                                                isActive ? 'page' : undefined
                                            }
                                            className={cn(
                                                'rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-150',
                                                isActive
                                                    ? 'border border-border/60 bg-card text-foreground shadow-xs'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            {tab.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        <div className="flex items-center">
                            <Link
                                href={security.url()}
                                aria-current={
                                    isSecurityActive ? 'page' : undefined
                                }
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                                    isSecurityActive
                                        ? 'border-border bg-card text-foreground'
                                        : 'border-border/60 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground',
                                )}
                            >
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                Security & 2FA
                            </Link>
                        </div>
                    </div>

                    {children}
                </div>
            </main>
            <SiteFooter />
            <Toaster />
        </div>
    );
}

export default PortalLayout;
