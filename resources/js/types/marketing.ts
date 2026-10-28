export type TierSlug = 'upload_and_go' | 'hybrid' | 'premium_remote';

export type OfficeSlug =
    | 'germantown-ave'
    | 'n-broad-st'
    | 'w-chelten-ave'
    | 'liberty-heights-baltimore';

export interface TierItem {
    slug: TierSlug;
    name: string;
    tagline: string;
    price_range: string;
    price_min: number;
    price_max: number;
    description: string;
    features: string[];
    best_for: string;
    cta: string;
}

export interface AddOnItem {
    slug: string;
    name: string;
    description: string;
    price: string;
}

export interface OfficeItem {
    slug?: OfficeSlug;
    city: string;
    address: string;
    phone: string;
    hours: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface StatItem {
    value: string;
    label: string;
}

export interface StepItem {
    step: number;
    title: string;
    body: string;
}

export interface TestimonialItem {
    stars: number;
    quote: string;
    name: string;
    location: string;
}

export interface VideoItem {
    id: string;
    title: string;
    description: string;
    url: string | null;
}

export interface VideoGroup {
    category: string;
    videos: VideoItem[];
}
