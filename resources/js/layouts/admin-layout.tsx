import { Link } from '@inertiajs/react';
import { Shield, Home, LogOut } from 'lucide-react';
import * as React from 'react';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <BrandLogo showSublabel={false} href="/admin" />
                        <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            Staff Console
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/">
                                <Home className="mr-1.5 size-4" />
                                Live Site
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/logout" method="post" as="button">
                                <LogOut className="mr-1.5 size-4" />
                                Sign out
                            </Link>
                        </Button>
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
