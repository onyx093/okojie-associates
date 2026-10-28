import type { SharedAuth } from './auth';
import type { OfficeItem, TierSlug } from './marketing';
import type { FlashSharedProp } from './ui';

export type * from './auth';
export type * from './marketing';
export type * from './navigation';
export type * from './ui';

export type ClientNavCounts = {
    documents: number;
    unreadMessages: number;
};

export type StaffNavCounts = {
    clients: number;
    newLeads: number;
};

export type NavCountsSharedProp = ClientNavCounts | StaffNavCounts | null;

export type HoneypotSharedProp = {
    name: string;
    validFromName: string;
    validFrom: string;
} | null;

export type SiteConfig = {
    brand: {
        legal_name: string;
        product: string;
        mark: string;
    };
    tagline: string;
    footer_blurb: string;
    contact: {
        phone: string;
        email: string;
        staff_email?: string;
        hours: string;
    };
    stats: {
        years: string;
        returns: string;
        preparers: string;
        offices: string;
    };
    referral: {
        code_prefix: string;
        reward_range: string;
        reward_cents: Record<TierSlug, number>;
    };
    compliance: string;
    seo: {
        title: string;
        description: string;
    };
    offices: OfficeItem[];
};

export type SharedData = {
    name: string;
    site: SiteConfig;
    auth: SharedAuth;
    flash: FlashSharedProp;
    navCounts: NavCountsSharedProp;
    honeypot: HoneypotSharedProp;
    cspNonce?: string | null;
    sidebarOpen?: boolean;
};
