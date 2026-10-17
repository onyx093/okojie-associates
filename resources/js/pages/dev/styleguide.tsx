import { Head } from '@inertiajs/react';
import {
    Sparkles,
    Calendar,
    CreditCard,
    Send,
    Copy,
    ChevronDown,
    Layers,
    Palette,
    Type,
    Maximize2,
    Bell,
    HelpCircle,
    Building,
    CheckCircle2,
    Video,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import {
    AddOnCards,
    AddOnTable,
    FaqList,
    HowItWorks,
    OfficeGrid,
    ReferralBanner,
    StatsStrip,
    TestimonialCarousel,
    TierGrid,
    VideoLibrary,
} from '@/components/marketing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { MarketingLayout } from '@/layouts/marketing-layout';
import type {
    AddOnItem,
    FaqItem,
    OfficeItem,
    StatItem,
    StepItem,
    TestimonialItem,
    TierItem,
    VideoGroup,
} from '@/types/marketing';

interface StyleguideProps {
    tiers?: TierItem[];
    addons?: AddOnItem[];
    faqs?: FaqItem[];
    testimonials?: TestimonialItem[];
    videos?: VideoGroup[];
    steps?: StepItem[];
    offices?: OfficeItem[];
}

const fallbackTiers: TierItem[] = [
    {
        slug: 'upload_and_go',
        name: 'Upload & Go',
        tagline: 'Fully remote, start to finish',
        price_range: 'starting at $150–$225',
        price_min: 150,
        price_max: 225,
        description:
            'Book online, upload your documents to the secure portal, and a credentialed preparer handles the rest. Review by video or phone, e-sign, and e-file — no office visit required.',
        features: [
            'Secure portal document upload',
            'Preparer-prepared federal + state return',
            'Review by video or phone',
            'IRS-compliant e-signature (Form 8879)',
            'E-file and online payment',
        ],
        best_for:
            'W-2 households, students, gig workers, and out-of-area clients',
        cta: 'Choose Upload & Go',
    },
    {
        slug: 'hybrid',
        name: 'Hybrid',
        tagline: 'Drop off or upload — review in office or by video',
        price_range: 'starting at $225–$350',
        price_min: 225,
        price_max: 350,
        description:
            'The best of both worlds. Bring your documents to a Philadelphia or Baltimore office, or upload them online. Sit down with your preparer in person or meet by video.',
        features: [
            'In-office drop-off or secure upload',
            'In-person or video review',
            'EITC and Child Tax Credit maximization',
            'Prior-year comparison',
            'IRS-compliant e-signature and e-file',
        ],
        best_for: 'Families, EITC/CTC filers, and first-time clients',
        cta: 'Choose Hybrid',
    },
    {
        slug: 'premium_remote',
        name: 'Premium Remote',
        tagline: 'A dedicated preparer, year-round',
        price_range: 'starting at $400–$900',
        price_min: 400,
        price_max: 900,
        description:
            'For complex returns and ongoing strategy. A dedicated preparer handles Schedule C/E, multi-state filings, and year-round planning so there are no surprises.',
        features: [
            'Dedicated preparer',
            'Schedule C and Schedule E support',
            'Multi-state (PA / MD / NJ / DE)',
            'Quarterly estimates and year-round planning',
            'Priority support',
        ],
        best_for: 'Self-employed, landlords, and small business owners',
        cta: 'Choose Premium Remote',
    },
];

const fallbackAddons: AddOnItem[] = [
    {
        slug: 'prior_year_amendments',
        name: 'Prior-year amendments',
        description:
            'Amend a previously filed return to claim missed credits or correct errors.',
        price: '$150–$500',
    },
    {
        slug: 'irs_notice_response',
        name: 'IRS notice response',
        description:
            'We read the notice, respond on your behalf, and keep you informed.',
        price: '$125–$400',
    },
    {
        slug: 'itin_applications',
        name: 'ITIN applications',
        description:
            'New or renewed ITIN applications with certified documentation review.',
        price: '$150–$300',
    },
    {
        slug: 'bookkeeping',
        name: 'Bookkeeping',
        description:
            'Monthly bookkeeping for small businesses and self-employed clients.',
        price: '$100–$500',
    },
    {
        slug: 'quarterly_estimates',
        name: 'Quarterly estimates',
        description:
            'Estimated tax calculations and payment reminders each quarter.',
        price: '$75–$250',
    },
];

const fallbackFaqs: FaqItem[] = [
    {
        question: 'Do I have to come into an office?',
        answer: 'No. Upload & Go and Premium Remote are fully remote: you upload documents to your secure portal, review by video or phone, and e-sign. Hybrid lets you drop off documents or meet in person at one of our Philadelphia or Baltimore offices if you prefer.',
    },
    {
        question: 'How do I send my documents securely?',
        answer: "Through your private client portal. Files are encrypted in transit and at rest and are visible only to you and your preparer. Please don't send W-2s, IDs, or Social Security numbers by regular email or text.",
    },
    {
        question: 'Is the e-signature legally valid?',
        answer: "Yes. We use IRS Form 8879 (IRS e-file Signature Authorization), which the IRS permits for electronically filed returns. You'll review your return and sign electronically in your portal before we file.",
    },
    {
        question: 'How much will my return cost?',
        answer: "Fees start in these ranges by tier — Upload & Go $150–$225, Hybrid $225–$350, Premium Remote $400–$900 — and depend on the complexity of your return. You'll always know your exact price before we file.",
    },
    {
        question: 'Can you help with back taxes or an IRS notice?',
        answer: 'Yes. Our IRS notice response add-on covers reading the notice, responding on your behalf, and keeping you informed. We can also prepare prior-year returns and amendments.',
    },
    {
        question: 'Do you serve clients outside Philadelphia and Baltimore?',
        answer: 'Yes. Our remote tiers work anywhere in the U.S., and Premium Remote supports multi-state filings including PA, MD, NJ, and DE.',
    },
    {
        question: 'How is my personal information protected?',
        answer: 'We follow IRS Publication 4557 and the FTC Safeguards Rule under a written information security plan (WISP). Every client account is protected with multi-factor authentication, and access to your files is limited and logged.',
    },
    {
        question: 'When will I get my refund?',
        answer: 'After we e-file, the IRS issues most refunds within about 21 days if there are no issues; direct deposit is fastest. Timing can vary with state processing, credits claimed (such as EITC/ACTC), and any IRS review.',
    },
];

const fallbackTestimonials: TestimonialItem[] = [
    {
        stars: 5,
        quote: 'I have been coming to Okojie for years. This year I did everything online from my phone and still talked to my preparer. Same people, way less hassle.',
        name: 'Denise R.',
        location: 'Germantown, Philadelphia',
    },
    {
        stars: 5,
        quote: 'They caught a credit my old preparer missed and handled an IRS letter for me. Worth every penny.',
        name: 'Marcus T.',
        location: 'Baltimore, MD',
    },
    {
        stars: 5,
        quote: 'I am self-employed with income in three states. The Premium Remote tier made it painless and I finally understand my quarterly estimates.',
        name: 'Priya S.',
        location: 'Cherry Hill, NJ',
    },
    {
        stars: 5,
        quote: 'Booking the consultation and uploading my 1099s took less than ten minutes. Having a real human review everything gave my family total peace of mind.',
        name: 'Terrence W.',
        location: 'West Philadelphia, PA',
    },
    {
        stars: 5,
        quote: 'The hybrid option let me drop off my paperwork and finish the review via video. Professional, transparent pricing, and zero stress.',
        name: 'Alicia M.',
        location: 'Towson, MD',
    },
];

const fallbackSteps: StepItem[] = [
    {
        step: 1,
        title: 'Book',
        body: 'Choose a service tier and book online in minutes.',
    },
    {
        step: 2,
        title: 'Upload',
        body: 'Securely upload your documents to your private portal.',
    },
    {
        step: 3,
        title: 'Prepare',
        body: 'A credentialed preparer builds your federal and state return.',
    },
    {
        step: 4,
        title: 'Review & e-sign',
        body: 'Review your return by video or phone, then sign electronically (Form 8879).',
    },
    {
        step: 5,
        title: 'E-file',
        body: 'We e-file your return and you pay online. Track every step in your portal.',
    },
];

const fallbackOffices: OfficeItem[] = [
    {
        city: 'Philadelphia, PA',
        address: '5601 Germantown Ave',
        phone: '(215) 555-0142',
        hours: 'Mon–Fri 9am–6pm · Sat 10am–2pm',
    },
    {
        city: 'Philadelphia, PA',
        address: '2301 N. Broad St',
        phone: '(215) 555-0178',
        hours: 'Mon–Fri 9am–6pm',
    },
    {
        city: 'Philadelphia, PA',
        address: '6300 W. Chelten Ave',
        phone: '(215) 555-0193',
        hours: 'Mon–Fri 9am–5pm · Sat 10am–1pm',
    },
    {
        city: 'Baltimore, MD',
        address: '4100 Liberty Heights Ave',
        phone: '(410) 555-0166',
        hours: 'Mon–Fri 9am–6pm',
    },
];

const fallbackVideos: VideoGroup[] = [
    {
        category: 'Getting Started',
        videos: [
            {
                id: 'how-it-works',
                title: 'How Okojie Online Works',
                description:
                    'A two-minute walkthrough of the online service line — from booking to e-file. Sample video; replace with your own.',
                url: null,
            },
            {
                id: 'choosing-tier',
                title: 'Choosing the Right Service Tier',
                description:
                    'Upload & Go, Hybrid, or Premium Remote? Here is how to pick. Sample video; replace with your own.',
                url: null,
            },
        ],
    },
    {
        category: 'How-To / Portal Guides',
        videos: [
            {
                id: 'how-to-upload',
                title: 'How to Upload Your Documents',
                description:
                    'A step-by-step guide to uploading W-2s, 1099s, and IDs to your secure portal. Sample video; replace with your own.',
                url: null,
            },
            {
                id: 'how-to-esign',
                title: 'How to E-Sign Form 8879',
                description:
                    'What the e-file authorization means and how to sign it in your portal. Sample video; replace with your own.',
                url: null,
            },
        ],
    },
    {
        category: 'Client Stories',
        videos: [
            {
                id: 'denise-story',
                title: "Denise's Story",
                description:
                    'A long-time Germantown client on filing online without losing her preparer. Sample video; replace with your own.',
                url: null,
            },
            {
                id: 'marcus-story',
                title: 'Marcus on IRS Notices',
                description:
                    'How a Baltimore client got an IRS letter resolved without the stress. Sample video; replace with your own.',
                url: null,
            },
        ],
    },
];

export default function Styleguide({
    tiers = fallbackTiers,
    addons = fallbackAddons,
    faqs = fallbackFaqs,
    testimonials = fallbackTestimonials,
    videos = fallbackVideos,
    steps = fallbackSteps,
    offices = fallbackOffices,
}: StyleguideProps) {
    const [otpValue, setOtpValue] = React.useState('123456');
    const [checked, setChecked] = React.useState(true);
    const [progress, setProgress] = React.useState(68);

    const sampleStats: StatItem[] = [
        { value: '26+', label: 'Years in business' },
        { value: '40,000+', label: 'Returns filed' },
        { value: '12', label: 'Credentialed preparers' },
        { value: '4', label: 'Offices in PA & MD' },
    ];

    return (
        <MarketingLayout>
            <Head title="Design System & Component Styleguide — Dev Only" />

            <div className="mx-auto max-w-[1160px] px-6 py-12 lg:py-16">
                {/* Header */}
                <div className="mb-14 border-b border-border pb-8">
                    <Badge variant="hero" className="mb-3">
                        Internal Dev Styleguide
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Design System & Shared Components
                    </h1>
                    <p className="mt-2 max-w-[760px] text-base text-body">
                        Comprehensive preview of all tokens, shadcn primitives,
                        and high-fidelity marketing components configured per
                        SPEC.md, DESIGN_SYSTEM.md, and CONTENT.md.
                    </p>
                </div>

                {/* Section 1: Color Tokens */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center gap-2">
                        <Palette className="size-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">
                            1. Color & Surface Tokens
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        <div className="rounded-xl border border-border bg-[#14151f] p-4 text-center">
                            <div className="mb-2 h-10 rounded-lg border border-border/60 bg-background" />
                            <div className="text-xs font-semibold text-foreground">
                                Background
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                                #14151f
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-[#14151f] p-4 text-center">
                            <div className="mb-2 h-10 rounded-lg border border-border/60 bg-card" />
                            <div className="text-xs font-semibold text-foreground">
                                Card / Elevated
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                                #1c1d2a
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-[#14151f] p-4 text-center">
                            <div className="mb-2 h-10 rounded-lg border border-border/60 bg-secondary" />
                            <div className="text-xs font-semibold text-foreground">
                                Secondary / Sunken
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                                #181925
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-[#14151f] p-4 text-center">
                            <div className="mb-2 h-10 rounded-lg bg-primary shadow-sm" />
                            <div className="text-xs font-semibold text-foreground">
                                Primary Accent
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                                #4f63e8
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-[#14151f] p-4 text-center">
                            <div className="mb-2 h-10 rounded-lg border border-primary/20 bg-[rgb(79_99_232/0.14)]" />
                            <div className="text-xs font-semibold text-foreground">
                                Brand Soft
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                                rgba(79,99,232,.14)
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-[#14151f] p-4 text-center">
                            <div className="mb-2 h-10 rounded-lg bg-[#2a2b3b]" />
                            <div className="text-xs font-semibold text-foreground">
                                Border
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                                #2a2b3b
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                            <span className="text-xs font-medium text-foreground">
                                Success
                            </span>
                            <span className="size-4 rounded-full bg-[#3ecf8e]" />
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                            <span className="text-xs font-medium text-foreground">
                                Warning
                            </span>
                            <span className="size-4 rounded-full bg-[#f5b942]" />
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                            <span className="text-xs font-medium text-foreground">
                                Danger
                            </span>
                            <span className="size-4 rounded-full bg-[#ef5b5b]" />
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                            <span className="text-xs font-medium text-foreground">
                                Star (Indigo)
                            </span>
                            <span className="size-4 rounded-full bg-[#5b6cf0]" />
                        </div>
                    </div>
                </section>

                {/* Section 2: Typography */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center gap-2">
                        <Type className="size-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">
                            2. Typography Hierarchy
                        </h2>
                    </div>

                    <Card>
                        <CardContent className="flex flex-col gap-6 pt-6">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Display / Hero H1 (56–64px)
                                </span>
                                <p className="text-4xl leading-[1.08] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                    The convenience of online filing.
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Page H1 (48px)
                                </span>
                                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                    A neighborhood firm, now online
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Section H2 (36–40px)
                                </span>
                                <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Three ways to file
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Card Title H3 (20–22px)
                                </span>
                                <p className="text-xl font-semibold text-foreground">
                                    Upload & Go — Fast remote filing
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Body Large (18–20px)
                                </span>
                                <p className="text-lg leading-relaxed text-body">
                                    Serving individuals, families, and small
                                    businesses across Philadelphia and Baltimore
                                    for over 26 years.
                                </p>
                            </div>

                            <div>
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Mono / Referral Link
                                </span>
                                <p className="w-fit rounded-lg border border-border bg-secondary px-3 py-1.5 font-mono text-sm text-foreground">
                                    https://okojieonline.com/contact?ref=OKJ-674SU5
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Section 3: Buttons */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center gap-2">
                        <Maximize2 className="size-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">
                            3. Buttons (Pill Radius, §4 Specs)
                        </h2>
                    </div>

                    <Card>
                        <CardContent className="flex flex-col gap-6 pt-6">
                            <div>
                                <h4 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Variants
                                </h4>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button variant="primary">
                                        Primary Pill
                                    </Button>
                                    <Button variant="outline">
                                        Outline Pill
                                    </Button>
                                    <Button variant="ghost">
                                        Ghost Button
                                    </Button>
                                    <Button variant="secondary">
                                        Secondary
                                    </Button>
                                    <Button variant="destructive">
                                        Destructive
                                    </Button>
                                    <Button variant="link">Link Style</Button>
                                    <Button disabled>Disabled</Button>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Sizes
                                </h4>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button size="lg">Large (48px)</Button>
                                    <Button size="default">
                                        Default (44px)
                                    </Button>
                                    <Button size="compact">
                                        Compact (36px)
                                    </Button>
                                    <Button size="sm">Small (32px)</Button>
                                    <Button
                                        size="icon"
                                        aria-label="Icon button"
                                    >
                                        <Send className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    With Icons & Full Width
                                </h4>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <Button variant="primary" fullWidth>
                                        <CreditCard className="mr-2 size-4" />
                                        Pay Now
                                    </Button>
                                    <Button variant="outline" fullWidth>
                                        <Calendar className="mr-2 size-4" />
                                        Book Consultation
                                    </Button>
                                    <Button variant="ghost" fullWidth>
                                        <Copy className="mr-2 size-4" />
                                        Copy Referral Link
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Section 4: Marketing Component — TierGrid & TierCard */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                4. TierCard + TierGrid (3-Col Grid)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §3</Badge>
                    </div>
                    <TierGrid tiers={tiers} featuredSlug="hybrid" />
                </section>

                {/* Section 5: Marketing Component — StatsStrip */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                5. StatsStrip (4 Columns)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §2</Badge>
                    </div>
                    <StatsStrip stats={sampleStats} />
                </section>

                {/* Section 6: Marketing Component — HowItWorks */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                6. HowItWorks (5 Step Cards)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §2</Badge>
                    </div>
                    <HowItWorks steps={steps} />
                </section>

                {/* Section 7: Marketing Component — TestimonialCarousel */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                7. TestimonialCarousel (Embla, 3-up)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §2</Badge>
                    </div>
                    <TestimonialCarousel testimonials={testimonials} />
                </section>

                {/* Section 8: Marketing Component — AddOnTable & AddOnCards */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                8. Add-ons (Table & 2-Col Cards)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §4</Badge>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="mb-3 text-lg font-semibold text-foreground">
                                AddOnTable (Services Page format)
                            </h3>
                            <AddOnTable addOns={addons} />
                        </div>

                        <div>
                            <h3 className="mb-3 text-lg font-semibold text-foreground">
                                AddOnCards (Pricing Page 2-col format)
                            </h3>
                            <AddOnCards addOns={addons} />
                        </div>
                    </div>
                </section>

                {/* Section 9: Marketing Component — OfficeCard & OfficeGrid */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                9. OfficeCard + OfficeGrid (4/2/1 Responsive)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §9</Badge>
                    </div>
                    <OfficeGrid offices={offices} />
                </section>

                {/* Section 10: Marketing Component — VideoLibrary & VideoCard */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Video className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                10. VideoLibrary & VideoCard (Dialog Playback)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §2</Badge>
                    </div>
                    <VideoLibrary groups={videos} />
                </section>

                {/* Section 11: Marketing Component — ReferralBanner */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                11. ReferralBanner (2-Column Panel)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §2</Badge>
                    </div>
                    <ReferralBanner />
                </section>

                {/* Section 12: Marketing Component — FaqList */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <HelpCircle className="size-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">
                                12. FaqList (type="multiple" Accordion)
                            </h2>
                        </div>
                        <Badge variant="hero">CONTENT.md §10</Badge>
                    </div>
                    <FaqList faqs={faqs} defaultOpenIndices={[0]} />
                </section>

                {/* Section 13: Primitive Inputs, Overlays & Feedback */}
                <section className="mb-16">
                    <div className="mb-6 flex items-center gap-2">
                        <Layers className="size-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">
                            13. Primitives, Inputs & Overlays
                        </h2>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Text Inputs, Select & Labels
                                </CardTitle>
                                <CardDescription>
                                    44px height, 12px radius, sunken surface
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="demo-name">Full name</Label>
                                    <Input
                                        id="demo-name"
                                        placeholder="Marcus Taylor"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="demo-email">
                                        Email address
                                    </Label>
                                    <Input
                                        id="demo-email"
                                        type="email"
                                        placeholder="marcus@example.com"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="demo-select">
                                        Service tier interest
                                    </Label>
                                    <Select defaultValue="hybrid">
                                        <SelectTrigger id="demo-select">
                                            <SelectValue placeholder="Select a tier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upload_and_go">
                                                Upload & Go ($150–$225)
                                            </SelectItem>
                                            <SelectItem value="hybrid">
                                                Hybrid ($225–$350)
                                            </SelectItem>
                                            <SelectItem value="premium_remote">
                                                Premium Remote ($400–$900)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Textarea, Checkbox & MFA OTP
                                </CardTitle>
                                <CardDescription>
                                    Multi-line input and security challenge
                                    inputs
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="demo-textarea">
                                        Brief situation
                                    </Label>
                                    <Textarea
                                        id="demo-textarea"
                                        placeholder="W-2 employee, self-employed, prior year taxes, IRS notice..."
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="terms"
                                        checked={checked}
                                        onCheckedChange={(val) =>
                                            setChecked(!!val)
                                        }
                                    />
                                    <Label
                                        htmlFor="terms"
                                        className="text-sm font-normal text-body"
                                    >
                                        I authorize Form 8879 electronic filing
                                        consent
                                    </Label>
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                    <Label>
                                        Multi-Factor Authentication (MFA OTP)
                                    </Label>
                                    <InputOTP
                                        maxLength={6}
                                        value={otpValue}
                                        onChange={setOtpValue}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Progress & Toast */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Progress & Sonner Toasts
                                </CardTitle>
                                <CardDescription>
                                    Indigo bar for uploads and toast bridges
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5">
                                <div>
                                    <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                                        <span>Uploading Form 1040.pdf</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} />
                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                setProgress(
                                                    Math.min(
                                                        100,
                                                        progress + 15,
                                                    ),
                                                )
                                            }
                                        >
                                            +15%
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                setProgress(
                                                    Math.max(0, progress - 15),
                                                )
                                            }
                                        >
                                            -15%
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            toast.success(
                                                'Document uploaded successfully!',
                                            )
                                        }
                                    >
                                        <Bell className="mr-1.5 size-4" />
                                        Success Toast
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            toast.error(
                                                'Upload failed. File size exceeds limit.',
                                            )
                                        }
                                    >
                                        Error Toast
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Overlays */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Dialog, Sheet & Dropdown
                                </CardTitle>
                                <CardDescription>
                                    Interactive overlay components
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            Open Dialog
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="border-border bg-card sm:max-w-[480px]">
                                        <DialogHeader>
                                            <DialogTitle>
                                                IRS Form 8879 E-Sign
                                            </DialogTitle>
                                            <DialogDescription>
                                                Authorize Okojie & Associates to
                                                electronically submit your
                                                return.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 text-sm text-body">
                                            Verify under penalties of perjury
                                            that you have examined a copy of
                                            your return.
                                        </div>
                                        <DialogFooter>
                                            <Button variant="primary">
                                                Confirm & E-Sign
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline">
                                            Open Sheet
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="right"
                                        className="border-border bg-card"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>
                                                Drawer Title
                                            </SheetTitle>
                                            <SheetDescription>
                                                Right slide-out sheet drawer.
                                            </SheetDescription>
                                        </SheetHeader>
                                        <div className="py-6 text-sm text-body">
                                            Mobile navigation uses this
                                            component.
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            Dropdown{' '}
                                            <ChevronDown className="ml-1 size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="border-border bg-card">
                                        <DropdownMenuLabel>
                                            My Account
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuItem>
                                            Portal Overview
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Documents
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </MarketingLayout>
    );
}
