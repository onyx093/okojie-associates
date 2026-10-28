import type { OfficeSlug, TierSlug } from '@/types/marketing';

export type UserRole = 'client' | 'preparer' | 'admin';

export type UserPreferences = {
    compactTables: boolean;
    reduceMotion: boolean;
};

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    tier: TierSlug | null;
    tierLabel: string | null;
    twoFactorEnabled: boolean;
    title: string | null;
    office: OfficeSlug | null;
    officeLabel: string | null;
    avatarUrl: string | null;
    preferences: UserPreferences;
    avatar?: string;
    email_verified_at?: string | null;
    two_factor_enabled?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type Auth = {
    user: User;
};

export type SharedAuth = {
    user: User | null;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
