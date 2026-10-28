import { Link, usePage } from '@inertiajs/react';
import { Lock, Monitor, User as UserIcon } from 'lucide-react';
import * as React from 'react';

import {
    AppShellLayout,
    type AppShellLayoutProps,
} from '@/layouts/app-shell-layout';
import { cn } from '@/lib/utils';
import { edit as appearanceEdit } from '@/routes/appearance';
import { edit as profileEdit } from '@/routes/profile';
import { edit as securityEdit } from '@/routes/security';
import type { SharedData } from '@/types';

export type SettingsTabKey = 'profile' | 'security' | 'appearance';

export type SettingsShellLayoutProps = Omit<
    AppShellLayoutProps,
    'title' | 'eyebrow' | 'sub'
> & {
    eyebrow?: React.ReactNode;
    title?: React.ReactNode;
    sub?: React.ReactNode;
    activeTab?: SettingsTabKey;
};

const SETTINGS_NAV_ITEMS = [
    {
        key: 'profile' as const,
        label: 'Profile',
        href: profileEdit.url(),
        icon: UserIcon,
    },
    {
        key: 'security' as const,
        label: 'Security',
        href: securityEdit.url(),
        icon: Lock,
    },
    {
        key: 'appearance' as const,
        label: 'Appearance',
        href: appearanceEdit.url(),
        icon: Monitor,
    },
];

export function SettingsShellLayout(props: SettingsShellLayoutProps) {
    const {
        children,
        eyebrow = 'Account',
        title = 'Settings',
        sub = 'Manage your profile, sign-in and display preferences.',
        activeTab,
        currentUrlOverride,
        ...shellProps
    } = props;

    const page = usePage<Partial<SharedData>>();
    const currentUrl = currentUrlOverride ?? page.url ?? '/settings/profile';

    const resolvedTab: SettingsTabKey = React.useMemo(() => {
        if (activeTab) {
            return activeTab;
        }

        const cleanUrl = currentUrl.split('?')[0].split('#')[0] || '';
        if (cleanUrl.startsWith('/settings/security')) {
            return 'security';
        }
        if (cleanUrl.startsWith('/settings/appearance')) {
            return 'appearance';
        }

        return 'profile';
    }, [activeTab, currentUrl]);

    return (
        <AppShellLayout
            eyebrow={eyebrow}
            title={title}
            sub={sub}
            currentUrlOverride={currentUrlOverride}
            {...shellProps}
        >
            <div className="grid grid-cols-[200px_minmax(0,720px)] items-start gap-6 max-shell:grid-cols-1">
                <nav
                    aria-label="Settings"
                    className="sticky top-6 grid gap-0.5 max-shell:static max-shell:grid-flow-col max-shell:justify-start max-shell:overflow-x-auto"
                >
                    {SETTINGS_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = resolvedTab === item.key;

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'flex h-[38px] items-center gap-2.5 rounded-[10px] px-2.5 text-[14px] whitespace-nowrap transition-colors [&_svg]:size-[17px]',
                                    active
                                        ? '[&_svg]:text-accent-fg bg-card font-medium text-foreground shadow-card'
                                        : '[&_svg]:text-tertiary text-muted-foreground hov:hover:bg-neutral-500/8 hov:hover:text-foreground',
                                )}
                            >
                                <Icon />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="grid min-w-0 gap-4">{children}</div>
            </div>
        </AppShellLayout>
    );
}

export default SettingsShellLayout;
