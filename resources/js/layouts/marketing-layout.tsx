import * as React from 'react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from '@/components/ui/sonner';

interface MarketingLayoutProps {
    children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster />
        </div>
    );
}

export default MarketingLayout;
