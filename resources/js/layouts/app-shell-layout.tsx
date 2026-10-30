import { Head, Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowLeft,
    Calendar,
    FileText,
    Gift,
    Home,
    Inbox,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import * as React from 'react';

import {
    Avatar,
    Eyebrow,
    IconButton,
    ThemeToggle,
} from '@/components/primitives';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { SiteBrandMark, SkipLink } from '@/layouts/site-layout';
import { cn } from '@/lib/utils';
import { home, logout } from '@/routes';
import { index as adminClients } from '@/routes/admin/clients';
import { index as adminLeads } from '@/routes/admin/leads';
import { index as adminReferrals } from '@/routes/admin/referrals';
import {
    appointments as portalAppointments,
    documents as portalDocuments,
    messages as portalMessages,
    overview as portalOverview,
    referrals as portalReferrals,
    security as portalSecurity,
} from '@/routes/portal';
import { edit as profileEdit } from '@/routes/profile';
import type {
    ClientNavCounts,
    NavCountsSharedProp,
    SharedData,
    StaffNavCounts,
    User,
} from '@/types';

export type AppShellArea = 'portal' | 'admin';

export type PageHeadProps = {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    sub?: React.ReactNode;
    actions?: React.ReactNode;
    backHref?: string;
    backLabel?: React.ReactNode;
    hideThemeToggle?: boolean;
    className?: string;
};

export function PageHead({
    eyebrow,
    title,
    sub,
    actions,
    backHref,
    backLabel = 'Back',
    hideThemeToggle = false,
    className,
}: PageHeadProps) {
    return (
        <header
            className={cn(
                'mb-6 flex flex-wrap items-end justify-between gap-4',
                className,
            )}
        >
            <div>
                {backHref && (
                    <Link
                        href={backHref}
                        className="mb-1.5 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hov:hover:text-foreground"
                    >
                        <ArrowLeft className="size-[15px]" />
                        {backLabel}
                    </Link>
                )}
                {eyebrow && <Eyebrow className="block">{eyebrow}</Eyebrow>}
                <h1 className="mt-1 text-[clamp(22px,2.4vw,28px)] leading-[1.15] font-medium tracking-[-0.025em] text-foreground">
                    {title}
                </h1>
                {sub && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-[13.5px] text-muted-foreground">
                        {sub}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {actions}
                {!hideThemeToggle && (
                    <ThemeToggle className="max-shell:hidden" />
                )}
            </div>
        </header>
    );
}

type ShellNavItem = {
    key: string;
    label: string;
    href: string;
    icon: LucideIcon;
    count?: number;
    countTone?: 'muted' | 'primary';
};

type ShellNavGroup = {
    label: string;
    items: ShellNavItem[];
};

function isClientNavCounts(
    counts: NavCountsSharedProp | undefined,
): counts is ClientNavCounts {
    return Boolean(counts && 'documents' in counts);
}

function isStaffNavCounts(
    counts: NavCountsSharedProp | undefined,
): counts is StaffNavCounts {
    return Boolean(counts && 'clients' in counts);
}

export type AppShellLayoutProps = {
    children?: React.ReactNode;
    headTitle?: string;
    disableNoIndex?: boolean;
    area?: AppShellArea;
    activeKey?: string;
    pageHead?: PageHeadProps | null;
    eyebrow?: React.ReactNode;
    title?: React.ReactNode;
    sub?: React.ReactNode;
    actions?: React.ReactNode;
    backHref?: string;
    backLabel?: React.ReactNode;
    userOverride?: User | null;
    navCountsOverride?: NavCountsSharedProp;
    currentUrlOverride?: string;
    defaultDrawerOpen?: boolean;
    className?: string;
    mainClassName?: string;
    headClassName?: string;
};

export function AppShellLayout(props: AppShellLayoutProps) {
    useFlashToast();
    const {
        children,
        headTitle,
        disableNoIndex = false,
        area: areaProp,
        activeKey: activeKeyProp,
        pageHead,
        eyebrow,
        title,
        sub,
        actions,
        backHref,
        backLabel,
        userOverride,
        navCountsOverride,
        currentUrlOverride,
        defaultDrawerOpen = false,
        className,
        mainClassName,
        headClassName,
    } = props;

    const page = usePage<Partial<SharedData>>();
    const user =
        userOverride !== undefined
            ? userOverride
            : (page.props.auth?.user ?? null);
    const navCounts =
        navCountsOverride !== undefined
            ? navCountsOverride
            : (page.props.navCounts ?? null);
    const currentUrl = currentUrlOverride ?? page.url ?? '/portal/overview';

    const area: AppShellArea =
        areaProp ??
        (user?.role === 'admin' || user?.role === 'preparer'
            ? 'admin'
            : 'portal');

    const [drawerOpen, setDrawerOpen] = React.useState(defaultDrawerOpen);
    const sidebarId = React.useId();
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const asideRef = React.useRef<HTMLElement | null>(null);
    const wasDrawerOpenRef = React.useRef(defaultDrawerOpen);

    React.useEffect(() => {
        if (drawerOpen) {
            wasDrawerOpenRef.current = true;
            const firstLink = asideRef.current?.querySelector<HTMLElement>(
                'nav a[aria-current="page"], nav a, a, button',
            );
            firstLink?.focus();
        } else if (wasDrawerOpenRef.current) {
            wasDrawerOpenRef.current = false;
            triggerRef.current?.focus();
        }
    }, [drawerOpen]);

    React.useEffect(() => {
        if (!drawerOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setDrawerOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [drawerOpen]);

    const navGroups: ShellNavGroup[] = React.useMemo(() => {
        if (area === 'admin') {
            const counts = isStaffNavCounts(navCounts) ? navCounts : null;

            return [
                {
                    label: 'Workspace',
                    items: [
                        {
                            key: 'clients',
                            label: 'Clients',
                            href: adminClients.url(),
                            icon: Users,
                            count:
                                counts && counts.clients > 0
                                    ? counts.clients
                                    : undefined,
                            countTone: 'muted',
                        },
                        {
                            key: 'leads',
                            label: 'Leads',
                            href: adminLeads.url(),
                            icon: Inbox,
                            count:
                                counts && counts.newLeads > 0
                                    ? counts.newLeads
                                    : undefined,
                            countTone: 'primary',
                        },
                        {
                            key: 'referrals',
                            label: 'Referrals',
                            href: adminReferrals.url(),
                            icon: Gift,
                        },
                    ],
                },
                {
                    label: 'Account',
                    items: [
                        {
                            key: 'settings',
                            label: 'Settings',
                            href: profileEdit.url(),
                            icon: Settings,
                        },
                    ],
                },
            ];
        }

        const counts = isClientNavCounts(navCounts) ? navCounts : null;

        return [
            {
                label: 'Your return',
                items: [
                    {
                        key: 'overview',
                        label: 'Overview',
                        href: portalOverview.url(),
                        icon: Home,
                    },
                    {
                        key: 'documents',
                        label: 'Documents',
                        href: portalDocuments.url(),
                        icon: FileText,
                        count:
                            counts && counts.documents > 0
                                ? counts.documents
                                : undefined,
                        countTone: 'muted',
                    },
                    {
                        key: 'appointments',
                        label: 'Appointments',
                        href: portalAppointments.url(),
                        icon: Calendar,
                    },
                    {
                        key: 'messages',
                        label: 'Messages',
                        href: portalMessages.url(),
                        icon: MessageSquare,
                        count:
                            counts && counts.unreadMessages > 0
                                ? counts.unreadMessages
                                : undefined,
                        countTone: 'primary',
                    },
                ],
            },
            {
                label: 'Account',
                items: [
                    {
                        key: 'referrals',
                        label: 'Referrals',
                        href: portalReferrals.url(),
                        icon: Gift,
                    },
                    {
                        key: 'security',
                        label: 'Security & 2FA',
                        href: portalSecurity.url(),
                        icon: Shield,
                    },
                ],
            },
        ];
    }, [area, navCounts]);

    const isItemActive = React.useCallback(
        (item: ShellNavItem) => {
            if (activeKeyProp) {
                return item.key === activeKeyProp;
            }

            const cleanUrl = currentUrl.split('?')[0].split('#')[0] || '/';
            if (item.key === 'settings' && cleanUrl.startsWith('/settings')) {
                return true;
            }

            if (
                item.key === 'overview' &&
                (cleanUrl === '/portal' ||
                    cleanUrl === '/portal/overview' ||
                    cleanUrl.startsWith('/portal/sign') ||
                    cleanUrl.startsWith('/portal/invoices'))
            ) {
                return true;
            }

            return (
                cleanUrl === item.href || cleanUrl.startsWith(`${item.href}/`)
            );
        },
        [activeKeyProp, currentUrl],
    );

    const userName = user?.name || user?.email || 'Account';
    const userSub = React.useMemo(() => {
        if (area === 'admin') {
            const roleLabel =
                user?.title || (user?.role === 'admin' ? 'Admin' : 'Preparer');
            const officeShort =
                user?.officeLabel?.split(',')[0] || 'Philadelphia';
            return `${roleLabel} · ${officeShort}`;
        }

        if (user?.tierLabel && user?.email) {
            return `${user.tierLabel} · ${user.email}`;
        }

        return user?.email ?? 'Client portal';
    }, [area, user]);

    const resolvedPageHead: PageHeadProps | null =
        pageHead !== undefined
            ? pageHead
            : title
              ? {
                    eyebrow,
                    title,
                    sub,
                    actions,
                    backHref,
                    backLabel,
                    className: headClassName,
                }
              : null;

    return (
        <div
            data-area={area}
            data-compact-tables={
                user?.preferences?.compactTables ? 'true' : undefined
            }
            data-reduce-motion={
                user?.preferences?.reduceMotion ? 'true' : undefined
            }
            className={cn(
                'grid min-h-screen grid-cols-[248px_minmax(0,1fr)] bg-background text-foreground max-shell:grid-cols-1 print:block print:bg-white',
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

            {drawerOpen && (
                <div
                    aria-hidden="true"
                    data-testid="app-shell-scrim"
                    onClick={() => setDrawerOpen(false)}
                    className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] shell:hidden print:hidden"
                />
            )}

            <aside
                id={sidebarId}
                ref={asideRef}
                tabIndex={-1}
                aria-label={
                    area === 'admin'
                        ? 'Staff navigation'
                        : 'Client portal navigation'
                }
                data-open={drawerOpen ? 'true' : 'false'}
                className={cn(
                    'sticky top-0 flex h-screen flex-col gap-5 overflow-y-auto border-r border-border bg-shell px-3.5 py-[18px] transition-transform duration-220 ease-out outline-none max-shell:fixed max-shell:inset-y-0 max-shell:left-0 max-shell:z-50 max-shell:w-[min(280px,86vw)] print:hidden',
                    drawerOpen
                        ? 'max-shell:shadow-float max-shell:translate-x-0'
                        : 'max-shell:-translate-x-full',
                )}
            >
                <div className="flex items-center justify-between gap-2 px-1.5">
                    <Link
                        href={home.url()}
                        className="inline-flex min-w-0 items-center gap-2.5"
                    >
                        <SiteBrandMark
                            size="sm"
                            tone={area === 'admin' ? 'dark' : 'accent'}
                        />
                        <span className="min-w-0">
                            <b className="block truncate text-[13.5px] leading-[1.15] font-semibold tracking-[-0.015em] text-foreground">
                                {area === 'admin'
                                    ? 'Okojie Staff'
                                    : 'Okojie Online'}
                            </b>
                            <small className="text-tertiary block truncate text-[11.5px] font-normal">
                                {area === 'admin' ? 'Admin' : 'Client portal'}
                            </small>
                        </span>
                    </Link>
                </div>

                {navGroups.map((group) => (
                    <div key={group.label}>
                        <div className="text-tertiary mb-1.5 px-2.5 font-mono text-[10.5px] tracking-[0.08em] uppercase">
                            {group.label}
                        </div>
                        <nav aria-label={group.label} className="grid gap-0.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const active = isItemActive(item);

                                return (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        aria-current={
                                            active ? 'page' : undefined
                                        }
                                        onClick={() => setDrawerOpen(false)}
                                        className={cn(
                                            'flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13.5px] transition-colors [&_svg]:size-[17px]',
                                            active
                                                ? '[&_svg]:text-accent-fg bg-card font-medium text-foreground shadow-card'
                                                : '[&_svg]:text-tertiary text-muted-foreground hov:hover:bg-neutral-500/8 hov:hover:text-foreground',
                                        )}
                                    >
                                        <Icon />
                                        <span className="truncate">
                                            {item.label}
                                        </span>
                                        {item.count !== undefined && (
                                            <span
                                                className={cn(
                                                    'ml-auto inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-medium tabular-nums',
                                                    item.countTone === 'primary'
                                                        ? 'bg-accent-solid text-white'
                                                        : 'bg-sunken text-muted-foreground',
                                                )}
                                            >
                                                {item.count}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}

                {area === 'portal' && (
                    <div className="mt-auto rounded-xl bg-sunken p-3 text-[12.5px] text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]">
                        <b className="mb-0.5 block text-[13px] font-medium text-foreground">
                            Questions about your return?
                        </b>
                        Reply in{' '}
                        <Link
                            href={portalMessages.url()}
                            className="text-accent-fg font-medium hov:hover:underline"
                        >
                            Messages
                        </Link>{' '}
                        or call{' '}
                        <a
                            href="tel:+12155550142"
                            className="text-accent-fg font-medium tabular-nums hov:hover:underline"
                        >
                            (215) 555-0142
                        </a>
                        .
                    </div>
                )}

                <div
                    className={cn(
                        'flex items-center gap-2.5 border-t border-border px-1.5 pt-2.5',
                        area === 'admin' && 'mt-auto',
                    )}
                >
                    <Avatar
                        name={userName}
                        src={user?.avatarUrl}
                        size="sm"
                        variant={area === 'admin' ? 2 : undefined}
                    />
                    <div className="min-w-0 flex-1">
                        <b className="block truncate text-[13px] font-medium text-foreground">
                            {userName}
                        </b>
                        <small className="text-tertiary block truncate text-[11.5px]">
                            {userSub}
                        </small>
                    </div>
                    <IconButton
                        asChild
                        aria-label="Sign out"
                        className="text-tertiary size-[30px] rounded-lg bg-transparent shadow-none hov:hover:bg-neutral-500/10 hov:hover:text-foreground"
                    >
                        <Link href={logout.url()} method="post" as="button">
                            <LogOut className="size-4" />
                        </Link>
                    </IconButton>
                </div>
            </aside>

            <div className="min-w-0">
                <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-shell px-4 py-3 shell:hidden print:hidden">
                    <IconButton
                        ref={triggerRef}
                        aria-label="Open navigation"
                        aria-expanded={drawerOpen}
                        aria-controls={sidebarId}
                        onClick={() => setDrawerOpen((prev: boolean) => !prev)}
                    >
                        <Menu className="size-[18px]" />
                    </IconButton>

                    <Link
                        href={home.url()}
                        className="inline-flex items-center gap-2.5"
                    >
                        <SiteBrandMark
                            size="sm"
                            tone={area === 'admin' ? 'dark' : 'accent'}
                        />
                        <span>
                            <b className="block text-[13.5px] leading-[1.15] font-semibold tracking-[-0.015em] text-foreground">
                                {area === 'admin'
                                    ? 'Okojie Staff'
                                    : 'Okojie Online'}
                            </b>
                            <small className="text-tertiary block text-[11.5px] font-normal">
                                {area === 'admin' ? 'Admin' : 'Client portal'}
                            </small>
                        </span>
                    </Link>

                    <ThemeToggle />
                </div>

                <main
                    id="main"
                    className={cn(
                        'max-w-page mx-auto w-full min-w-0 px-9 pt-7 pb-16 max-sm:px-4 max-sm:pt-5 max-sm:pb-12 print:max-w-none print:p-0',
                        mainClassName,
                    )}
                >
                    {resolvedPageHead && <PageHead {...resolvedPageHead} />}
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppShellLayout;
