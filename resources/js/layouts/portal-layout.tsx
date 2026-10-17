import { usePage } from '@inertiajs/react';
import * as React from 'react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';

interface PortalLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function PortalLayout({ children, title }: PortalLayoutProps) {
    const pageProps = usePage().props as unknown as {
        auth?: {
            user?: {
                name?: string;
                email?: string;
                tier?: string | null;
                tierLabel?: string | null;
            } | null;
        };
    };

    const user = pageProps.auth?.user;

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1 py-10 lg:py-12">
                <div className="mx-auto max-w-[1160px] px-6">
                    {/* Header area for Portal */}
                    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                                Client Portal
                            </p>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {title ||
                                    `Welcome back${user?.name ? `, ${user.name}` : ''}`}
                            </h1>
                            {user?.email && (
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <Badge variant="portalTier" className="px-3 py-1">
                                {user?.tierLabel || 'No tier selected'}
                            </Badge>
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
