import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import * as React from 'react';

import {
    Button,
    Chip,
    Field,
    Inner,
    Shell,
    ShellHead,
} from '@/components/primitives';
import { Input } from '@/components/ui/input';
import { register } from '@/dev/fixtures';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';
import { SettingsShellLayout } from '@/layouts/settings-shell-layout';
import { SiteLayout } from '@/layouts/site-layout';
import type { User } from '@/types';

export const fixtureClientUser: User = {
    id: 101,
    name: 'Denise Robinson',
    email: 'denise.r@example.com',
    role: 'client',
    tier: 'hybrid',
    tierLabel: 'Hybrid',
    twoFactorEnabled: true,
    title: null,
    office: 'germantown-ave',
    officeLabel: '5601 Germantown Ave, Philadelphia',
    avatarUrl: null,
    preferences: {
        compactTables: false,
        reduceMotion: false,
    },
};

export const fixtureStaffUser: User = {
    id: 202,
    name: 'Adaeze Okojie',
    email: 'adaeze@okojieonline.com',
    role: 'admin',
    tier: null,
    tierLabel: null,
    twoFactorEnabled: true,
    title: 'Enrolled Agent',
    office: 'germantown-ave',
    officeLabel: '5601 Germantown Ave, Philadelphia',
    avatarUrl: null,
    preferences: {
        compactTables: false,
        reduceMotion: false,
    },
};

export const siteLayoutFixture = register({
    id: 'layout-site',
    title: 'SiteLayout (§4.1 Public Marketing Shell)',
    states: [
        {
            label: 'Guest (with band & CTA)',
            render: () => (
                <SiteLayout
                    userOverride={null}
                    currentUrlOverride="/services"
                    band={{
                        eyebrow: 'Services',
                        icon: Sparkles,
                        title: (
                            <>
                                Tax help that fits <em>your situation.</em>
                            </>
                        ),
                        lead: 'From a simple W-2 return to multi-state small-business filings. Choose the tier that matches how you want to work.',
                        ctas: (
                            <>
                                <Button variant="primary" size="lg">
                                    Help me choose
                                    <ArrowRight className="size-[15px]" />
                                </Button>
                                <Button variant="secondary" size="lg">
                                    Compare prices
                                </Button>
                            </>
                        ),
                    }}
                    ctaBand
                >
                    <div className="mx-auto max-w-site px-10 py-12 max-sm:px-5">
                        <Shell>
                            <ShellHead title="Marketing page body slot" />
                            <Inner>
                                <p className="text-sm text-muted-foreground">
                                    Public page content renders inside{' '}
                                    <code className="font-mono text-xs">
                                        #main
                                    </code>{' '}
                                    between the sky band and closing CTA /
                                    4-column footer.
                                </p>
                            </Inner>
                        </Shell>
                    </div>
                </SiteLayout>
            ),
        },
        {
            label: 'Authed (client)',
            render: () => (
                <SiteLayout
                    userOverride={fixtureClientUser}
                    currentUrlOverride="/pricing"
                    band={{
                        eyebrow: 'Pricing',
                        title: (
                            <>
                                Transparent fees, <em>no surprises.</em>
                            </>
                        ),
                        lead: 'Signed-in clients see the “My portal” action in the navigation bar.',
                    }}
                >
                    <div className="mx-auto max-w-site px-10 py-12 max-sm:px-5">
                        <Shell>
                            <Inner>
                                <p className="text-sm text-muted-foreground">
                                    Authenticated client state on marketing
                                    pages.
                                </p>
                            </Inner>
                        </Shell>
                    </div>
                </SiteLayout>
            ),
        },
        {
            label: 'Authed (staff)',
            render: () => (
                <SiteLayout
                    userOverride={fixtureStaffUser}
                    currentUrlOverride="/about"
                    band={{
                        eyebrow: 'About Okojie & Associates',
                        title: (
                            <>
                                26+ years in{' '}
                                <em>Philadelphia &amp; Baltimore.</em>
                            </>
                        ),
                    }}
                    noFooter
                >
                    <div className="mx-auto max-w-site px-10 py-12 max-sm:px-5">
                        <Shell>
                            <Inner>
                                <p className="text-sm text-muted-foreground">
                                    Staff authenticated state with{' '}
                                    <code className="font-mono text-xs">
                                        noFooter
                                    </code>{' '}
                                    enabled.
                                </p>
                            </Inner>
                        </Shell>
                    </div>
                </SiteLayout>
            ),
        },
    ],
});

export const authScreenLayoutFixture = register({
    id: 'layout-auth-screen',
    title: 'AuthScreenLayout (§4.2 Split Auth Shell)',
    states: [
        {
            label: 'Default (Sign in)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    eyebrow="Secure client portal"
                    title="Sign in to Okojie Online"
                    lead="Upload documents, check your return, e-sign and pay, all in one place."
                    switchLine={
                        <>
                            New to Okojie Online?{' '}
                            <a href="/register">Start your return</a>
                        </>
                    }
                >
                    <div className="grid gap-4">
                        <Field id="fix-auth-email" label="Email address">
                            <Input
                                id="fix-auth-email"
                                type="email"
                                defaultValue="denise.r@example.com"
                            />
                        </Field>
                        <Button variant="primary" block>
                            Sign in
                        </Button>
                    </div>
                </AuthScreenLayout>
            ),
        },
        {
            label: 'With icon tile (2FA challenge)',
            render: () => (
                <AuthScreenLayout
                    disableNoIndex
                    iconTile={<Shield className="size-5" />}
                    eyebrow="Step 2 of 2"
                    title="Two-factor verification"
                    lead="Enter the 6-digit code from your authenticator app to continue."
                >
                    <div className="grid gap-4">
                        <Field id="fix-auth-code" label="Authentication code">
                            <Input
                                id="fix-auth-code"
                                inputMode="numeric"
                                placeholder="000 000"
                            />
                        </Field>
                        <Button variant="primary" block>
                            Verify &amp; continue
                        </Button>
                    </div>
                </AuthScreenLayout>
            ),
        },
    ],
});

export const appShellLayoutFixture = register({
    id: 'layout-app-shell',
    title: 'AppShellLayout (§4.3 Client Portal & Staff Console)',
    states: [
        {
            label: 'Client (with counts)',
            render: () => (
                <AppShellLayout
                    disableNoIndex
                    area="portal"
                    userOverride={fixtureClientUser}
                    navCountsOverride={{ documents: 4, unreadMessages: 2 }}
                    currentUrlOverride="/portal/overview"
                    eyebrow="Overview"
                    title="Welcome back, Denise"
                    sub={
                        <>
                            <Chip tone="accent">Hybrid</Chip>
                            <span>2026 federal + PA return</span>
                        </>
                    }
                >
                    <Shell>
                        <ShellHead title="2026 Tax Return Progress" />
                        <Inner>
                            <p className="text-sm text-muted-foreground">
                                Client portal shell with document count (4) and
                                unread message count (2).
                            </p>
                        </Inner>
                    </Shell>
                </AppShellLayout>
            ),
        },
        {
            label: 'Client (without counts)',
            render: () => (
                <AppShellLayout
                    disableNoIndex
                    area="portal"
                    userOverride={fixtureClientUser}
                    navCountsOverride={{ documents: 0, unreadMessages: 0 }}
                    currentUrlOverride="/portal/documents"
                    eyebrow="Your return"
                    title="Documents"
                    sub="Upload W-2s, 1099s, and supporting receipts."
                >
                    <Shell>
                        <Inner>
                            <p className="text-sm text-muted-foreground">
                                Client portal shell when badge counts are zero.
                            </p>
                        </Inner>
                    </Shell>
                </AppShellLayout>
            ),
        },
        {
            label: 'Staff (with counts)',
            render: () => (
                <AppShellLayout
                    disableNoIndex
                    area="admin"
                    userOverride={fixtureStaffUser}
                    navCountsOverride={{ clients: 28, newLeads: 5 }}
                    currentUrlOverride="/admin/clients"
                    eyebrow="Workspace"
                    title="Clients"
                    sub="Manage client returns, documents, and invoices."
                >
                    <Shell>
                        <ShellHead title="Assigned Clients (28)" />
                        <Inner>
                            <p className="text-sm text-muted-foreground">
                                Staff console shell with client count (28) and
                                new lead count (5).
                            </p>
                        </Inner>
                    </Shell>
                </AppShellLayout>
            ),
        },
        {
            label: 'Staff (without counts)',
            render: () => (
                <AppShellLayout
                    disableNoIndex
                    area="admin"
                    userOverride={fixtureStaffUser}
                    navCountsOverride={{ clients: 0, newLeads: 0 }}
                    currentUrlOverride="/admin/referrals"
                    eyebrow="Workspace"
                    title="Referrals"
                >
                    <Shell>
                        <Inner>
                            <p className="text-sm text-muted-foreground">
                                Staff console shell when counts are zero.
                            </p>
                        </Inner>
                    </Shell>
                </AppShellLayout>
            ),
        },
        {
            label: 'Client (drawer open)',
            render: () => (
                <AppShellLayout
                    disableNoIndex
                    area="portal"
                    userOverride={fixtureClientUser}
                    navCountsOverride={{ documents: 4, unreadMessages: 2 }}
                    currentUrlOverride="/portal/overview"
                    defaultDrawerOpen
                    eyebrow="Overview"
                    title="Welcome back, Denise"
                >
                    <Shell>
                        <Inner>
                            <p className="text-sm text-muted-foreground">
                                Mobile drawer pre-opened for off-canvas
                                inspection below 900px.
                            </p>
                        </Inner>
                    </Shell>
                </AppShellLayout>
            ),
        },
    ],
});

export const settingsShellLayoutFixture = register({
    id: 'layout-settings-shell',
    title: 'SettingsShellLayout (§4.4 Settings Sub-Navigation)',
    states: [
        {
            label: 'Staff — Profile tab',
            render: () => (
                <SettingsShellLayout
                    disableNoIndex
                    area="admin"
                    userOverride={fixtureStaffUser}
                    navCountsOverride={{ clients: 28, newLeads: 5 }}
                    currentUrlOverride="/settings/profile"
                    activeTab="profile"
                >
                    <Shell>
                        <ShellHead title="Profile" />
                        <Inner>
                            <p className="text-sm text-muted-foreground">
                                Staff settings shell with Profile tab active.
                            </p>
                        </Inner>
                    </Shell>
                </SettingsShellLayout>
            ),
        },
        {
            label: 'Client — Appearance tab',
            render: () => (
                <SettingsShellLayout
                    disableNoIndex
                    area="portal"
                    userOverride={fixtureClientUser}
                    navCountsOverride={{ documents: 4, unreadMessages: 1 }}
                    currentUrlOverride="/settings/appearance"
                    activeTab="appearance"
                >
                    <Shell>
                        <ShellHead title="Appearance" />
                        <Inner>
                            <p className="text-sm text-muted-foreground">
                                Client settings shell with Appearance tab
                                active.
                            </p>
                        </Inner>
                    </Shell>
                </SettingsShellLayout>
            ),
        },
    ],
});
