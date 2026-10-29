import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AppShellLayout from '@/layouts/app-shell-layout';
import AuthLayout from '@/layouts/auth-layout';
import AuthScreenLayout from '@/layouts/auth-screen-layout';
import SettingsShellLayout from '@/layouts/settings-shell-layout';
import SettingsLayout from '@/layouts/settings/layout';
import SiteLayout from '@/layouts/site-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Okojie Online';

export const v2Layouts = {
    site: SiteLayout,
    auth: AuthScreenLayout,
    app: AppShellLayout,
    settings: SettingsShellLayout,
} as const;

const migratedV2Pages = new Set<string>();

void createInertiaApp({
    title: (title) =>
        title
            ? title.includes('Okojie')
                ? title
                : `${title} | ${appName}`
            : 'Okojie & Associates, Inc. — Okojie Online Tax Preparation',
    layout: (name) => {
        if (migratedV2Pages.has(name)) {
            if (name.startsWith('settings/')) {
                return SettingsShellLayout;
            }
            if (name.startsWith('auth/')) {
                return AuthScreenLayout;
            }
            if (name.startsWith('portal/') || name.startsWith('admin/')) {
                return AppShellLayout;
            }

            return SiteLayout;
        }

        switch (true) {
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case name === 'auth/access' ||
                name === 'auth/verify-email' ||
                name === 'auth/two-factor-challenge' ||
                name === 'auth/forgot-password' ||
                name === 'auth/reset-password' ||
                name === 'auth/confirm-password':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4F63E8',
    },
});

// This will set light / dark mode on load...
initializeTheme();
