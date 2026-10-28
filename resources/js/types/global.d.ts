import type { Auth } from '@/types/auth';
import type {
    FlashSharedProp,
    HoneypotSharedProp,
    NavCountsSharedProp,
    SiteConfig,
} from '@/types/index';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            site?: SiteConfig;
            auth: Auth;
            flash?: FlashSharedProp;
            navCounts?: NavCountsSharedProp;
            honeypot?: HoneypotSharedProp;
            cspNonce?: string | null;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
