import { Head, usePage } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Copy,
    CreditCard,
    FileText,
    Layers,
    Monitor,
    Palette,
    Send,
    Sparkles,
    Trash2,
    Type,
    Upload,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { BrandLogo } from '@/components/brand-logo';
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
import {
    AppIcon,
    Avatar,
    Button,
    CalendarTile,
    Check,
    Chip,
    ChipEyebrow,
    ChoiceGroup,
    ConfirmDialog,
    DataTable,
    Divider,
    EmptyState,
    Eyebrow,
    Field,
    FileBadge,
    FileDropzone,
    FilterButton,
    ICON_MAP,
    IconButton,
    Inner,
    KeyValue,
    Metric,
    MetricStrip,
    NextStepCard,
    Note,
    Pager,
    PasswordInput,
    ReturnStepper,
    Row,
    RowList,
    SearchInput,
    Seg,
    SegLinks,
    Shell,
    ShellHead,
    SkipLink,
    StatusLabel,
    Switch,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableToolbar,
    ThemeToggle,
    Timeline,
    type IconName,
    type StepperStage,
} from '@/components/primitives';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { getFixtures, type FixtureDefinition } from '@/dev/fixtures';
import '@/dev/fixtures/layouts';
import '@/dev/fixtures/pages/home';
import '@/dev/fixtures/pages/services';
import '@/dev/fixtures/pages/pricing';
import '@/dev/fixtures/pages/about';
import '@/dev/fixtures/pages/contact';
import '@/dev/fixtures/pages/legal';
import '@/dev/fixtures/pages/sign-in';
import '@/dev/fixtures/pages/register';
import '@/dev/fixtures/pages/verify-email';
import '@/dev/fixtures/pages/two-factor';
import '@/dev/fixtures/pages/forgot-password';
import '@/dev/fixtures/pages/reset-password';
import '@/dev/fixtures/pages/confirm-password';
import '@/dev/fixtures/pages/portal-overview';
import '@/dev/fixtures/pages/portal-documents';
import '@/dev/fixtures/pages/portal-appointments';
import '@/dev/fixtures/pages/portal-messages';
import '@/dev/fixtures/pages/portal-referrals';
import '@/dev/fixtures/pages/portal-security';
import { useAppearance, type Appearance } from '@/hooks/use-appearance';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { cn } from '@/lib/utils';
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

type ViewportPreset = '390' | '768' | '1024' | '1440' | 'full';

const VIEWPORT_WIDTHS: Record<ViewportPreset, string> = {
    '390': 'max-w-[390px]',
    '768': 'max-w-[768px]',
    '1024': 'max-w-[1024px]',
    '1440': 'max-w-[1440px]',
    full: 'max-w-none',
};

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
                    'A two-minute walkthrough of the online service line — from booking to e-file.',
                url: null,
            },
            {
                id: 'choosing-tier',
                title: 'Choosing the Right Service Tier',
                description:
                    'Upload & Go, Hybrid, or Premium Remote? Here is how to pick.',
                url: null,
            },
        ],
    },
];

interface SampleInvoiceRow {
    id: string;
    invoiceNumber: string;
    description: string;
    status: 'paid' | 'open';
    amount: string;
}

const sampleInvoiceRows: SampleInvoiceRow[] = [
    {
        id: 'inv-1',
        invoiceNumber: 'INV-2026-0104',
        description: 'TY 2025 Hybrid Preparation — Federal + PA',
        status: 'open',
        amount: '$275.00',
    },
    {
        id: 'inv-2',
        invoiceNumber: 'INV-2025-0882',
        description: 'TY 2024 Upload & Go — Federal + PA',
        status: 'paid',
        amount: '$185.00',
    },
    {
        id: 'inv-3',
        invoiceNumber: 'INV-2025-0419',
        description: 'IRS Notice CP2000 Response Add-on',
        status: 'paid',
        amount: '$150.00',
    },
];

const sampleReturnStages: StepperStage[] = [
    { key: 'booked', label: 'Booked', date: 'Oct 18' },
    { key: 'documents', label: 'Documents', date: 'Oct 21' },
    { key: 'in_preparation', label: 'In preparation', date: 'Now' },
    { key: 'ready_to_sign', label: 'Ready to sign' },
    { key: 'filed', label: 'Filed & accepted' },
];

function FixtureCard({ fixture }: { fixture: FixtureDefinition }) {
    const [activeIdx, setActiveIdx] = React.useState('0');
    const activeState = fixture.states[Number(activeIdx)] ?? fixture.states[0];

    return (
        <Shell>
            <ShellHead
                title={`${fixture.title} (${fixture.id})`}
                right={
                    fixture.states.length > 1 ? (
                        <Seg
                            value={activeIdx}
                            onValueChange={setActiveIdx}
                            items={fixture.states.map((st, idx) => ({
                                value: String(idx),
                                label: st.label,
                            }))}
                        />
                    ) : (
                        <Chip tone="neutral">
                            {activeState?.label ?? 'Default'}
                        </Chip>
                    )
                }
            />
            <Inner className="overflow-x-auto">
                {activeState ? activeState.render() : null}
            </Inner>
        </Shell>
    );
}

export default function Styleguide({
    tiers = fallbackTiers,
    addons = fallbackAddons,
    faqs = fallbackFaqs,
    testimonials = fallbackTestimonials,
    videos = fallbackVideos,
    steps = fallbackSteps,
    offices = fallbackOffices,
}: StyleguideProps) {
    const { appearance, resolvedAppearance, updateAppearance } =
        useAppearance();
    const [viewport, setViewport] = React.useState<ViewportPreset>('full');
    const [otpValue, setOtpValue] = React.useState('123456');
    const [checked, setChecked] = React.useState(true);
    const [switchOn, setSwitchOn] = React.useState(true);
    const [choiceTier, setChoiceTier] = React.useState('hybrid');
    const [passwordDemo, setPasswordDemo] = React.useState('TaxSeason2026!');
    const progress = 68;
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
    const [compactTable, setCompactTable] = React.useState(false);
    const [segTab, setSegTab] = React.useState('all');
    const [stepperIndex, setStepperIndex] = React.useState('2');
    const [selectedFile, setSelectedFile] = React.useState<File | null>(() => {
        if (typeof File !== 'undefined') {
            return new File(['sample pdf content'], '2025_Form_W2_Acme.pdf', {
                type: 'application/pdf',
            });
        }
        return null;
    });

    const fixtures = getFixtures();
    const iconNames = Object.keys(ICON_MAP) as IconName[];

    const page = usePage();
    const isolatedFixtureNode = React.useMemo(() => {
        const rawUrl =
            page.url ||
            (typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : '');
        const queryIndex = rawUrl.indexOf('?');
        if (queryIndex === -1) {
            return null;
        }
        const params = new URLSearchParams(rawUrl.slice(queryIndex));
        const fixtureId = params.get('fixture');
        if (!fixtureId) {
            return null;
        }
        const matched = fixtures.find((item) => item.id === fixtureId);
        if (!matched) {
            return null;
        }
        const stateParam = params.get('state');
        const stateItem = stateParam
            ? (matched.states.find(
                  (st, idx) =>
                      String(idx) === stateParam ||
                      st.label.toLowerCase() === stateParam.toLowerCase(),
              ) ?? matched.states[0])
            : matched.states[0];

        return stateItem ? stateItem.render() : null;
    }, [fixtures, page.url]);

    const filteredInvoices = React.useMemo(() => {
        return sampleInvoiceRows.filter((row) => {
            if (statusFilter && row.status !== statusFilter) {
                return false;
            }
            if (!searchQuery.trim()) {
                return true;
            }
            const q = searchQuery.toLowerCase();
            return (
                row.invoiceNumber.toLowerCase().includes(q) ||
                row.description.toLowerCase().includes(q)
            );
        });
    }, [searchQuery, statusFilter]);

    const sampleStats: StatItem[] = [
        { value: '26+', label: 'Years in business' },
        { value: '40,000+', label: 'Returns filed' },
        { value: '12', label: 'Credentialed preparers' },
        { value: '4', label: 'Offices in PA & MD' },
    ];

    if (isolatedFixtureNode) {
        return <>{isolatedFixtureNode}</>;
    }

    return (
        <MarketingLayout>
            <Head title="Design System & Component Styleguide — Dev Only" />
            <SkipLink target="#styleguide-main" />

            {/* Sticky Harness Toolbar */}
            <div className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-3">
                    <div className="flex items-center gap-3">
                        <BrandLogo />
                        <Chip tone="accent" dot>
                            v2 Design System Harness
                        </Chip>
                        <span className="hidden font-mono text-xs text-fg-3 sm:inline">
                            Resolved: {resolvedAppearance}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Viewport Width Selector */}
                        <div className="flex items-center gap-2">
                            <Monitor className="size-4 text-fg-3" />
                            <Seg
                                aria-label="Viewport width preset"
                                value={viewport}
                                onValueChange={setViewport}
                                items={[
                                    { value: '390', label: '390px' },
                                    { value: '768', label: '768px' },
                                    { value: '1024', label: '1024px' },
                                    { value: '1440', label: '1440px' },
                                    { value: 'full', label: 'Full' },
                                ]}
                            />
                        </div>

                        {/* Theme Switcher + Crossfade Toggle */}
                        <div className="flex items-center gap-2">
                            <Seg
                                aria-label="Theme mode"
                                value={appearance}
                                onValueChange={(v) =>
                                    updateAppearance(v as Appearance)
                                }
                                items={[
                                    { value: 'light', label: 'Light' },
                                    { value: 'dark', label: 'Dark' },
                                    { value: 'system', label: 'System' },
                                ]}
                            />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>

            {/* Resizable Viewport Container */}
            <div
                id="styleguide-main"
                className={cn(
                    'mx-auto w-full px-6 py-10 transition-all duration-200',
                    VIEWPORT_WIDTHS[viewport],
                    viewport !== 'full' &&
                        'my-6 rounded-2xl border border-dashed border-border-strong bg-background shadow-lg',
                )}
            >
                {/* Header */}
                <div className="mb-12 border-b border-border pb-8">
                    <ChipEyebrow className="mb-3">
                        Redesign 2026 · docs/DESIGN_SYSTEM.md §3–§7
                    </ChipEyebrow>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        Okojie Online — Primitives & Fixture Harness
                    </h1>
                    <p className="mt-2 max-w-[68ch] text-base text-fg-2">
                        Interactive verification harness for every v2 design
                        token, restyled shadcn component, custom primitive in{' '}
                        <code className="font-mono text-xs text-foreground">
                            resources/js/components/primitives/
                        </code>
                        , and registered page fixture in{' '}
                        <code className="font-mono text-xs text-foreground">
                            resources/js/dev/fixtures/
                        </code>
                        .
                    </p>
                </div>

                {/* Section 1: Color & Surface Tokens */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <Palette className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            1. Color & Surface Tokens (Light + Near-Black Dark)
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        <Shell>
                            <Inner className="p-3.5 text-center">
                                <div className="mb-2 h-10 rounded-md border border-border bg-background" />
                                <div className="text-xs font-medium text-foreground">
                                    Canvas
                                </div>
                                <div className="font-mono text-[11px] text-fg-3">
                                    #FAFAFB / #09090C
                                </div>
                            </Inner>
                        </Shell>
                        <Shell>
                            <Inner className="p-3.5 text-center">
                                <div className="mb-2 h-10 rounded-md border border-border bg-card" />
                                <div className="text-xs font-medium text-foreground">
                                    Surface
                                </div>
                                <div className="font-mono text-[11px] text-fg-3">
                                    #FFFFFF / #121217
                                </div>
                            </Inner>
                        </Shell>
                        <Shell>
                            <Inner className="p-3.5 text-center">
                                <div className="mb-2 h-10 rounded-md border border-border bg-shell" />
                                <div className="text-xs font-medium text-foreground">
                                    Shell
                                </div>
                                <div className="font-mono text-[11px] text-fg-3">
                                    #F4F4F7 / #0E0E12
                                </div>
                            </Inner>
                        </Shell>
                        <Shell>
                            <Inner className="p-3.5 text-center">
                                <div className="mb-2 h-10 rounded-md border border-border bg-sunken" />
                                <div className="text-xs font-medium text-foreground">
                                    Sunken
                                </div>
                                <div className="font-mono text-[11px] text-fg-3">
                                    #EEEEF2 / #1A1A21
                                </div>
                            </Inner>
                        </Shell>
                        <Shell>
                            <Inner className="p-3.5 text-center">
                                <div className="mb-2 h-10 rounded-md bg-primary" />
                                <div className="text-xs font-medium text-foreground">
                                    Brand
                                </div>
                                <div className="font-mono text-[11px] text-fg-3">
                                    #4F63E8 / #6878F5
                                </div>
                            </Inner>
                        </Shell>
                        <Shell>
                            <Inner className="p-3.5 text-center">
                                <div className="mb-2 h-10 rounded-md bg-brand-soft" />
                                <div className="text-xs font-medium text-foreground">
                                    Brand Soft
                                </div>
                                <div className="font-mono text-[11px] text-fg-3">
                                    --brand-soft
                                </div>
                            </Inner>
                        </Shell>
                    </div>
                </section>

                {/* Section 2: Typography & Eyebrows */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <Type className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            2. Typography, Eyebrow & ChipEyebrow
                        </h2>
                    </div>

                    <Shell>
                        <Inner className="flex flex-col gap-5">
                            <div className="flex flex-wrap items-center gap-4">
                                <Eyebrow>Standard Eyebrow</Eyebrow>
                                <ChipEyebrow>TY 2025 Filing Open</ChipEyebrow>
                            </div>
                            <Divider className="my-1" />
                            <div className="flex flex-col gap-3">
                                <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                    Display / Hero H1 — Geist Sans (-0.03em)
                                </p>
                                <p className="text-xl font-semibold tracking-tight text-foreground">
                                    Section H2 — Credentialed preparers in PA &
                                    MD
                                </p>
                                <p className="text-sm leading-relaxed text-fg-2">
                                    Body copy uses{' '}
                                    <code className="font-mono text-xs text-foreground">
                                        --fg-2
                                    </code>{' '}
                                    for comfortable reading density and{' '}
                                    <code className="font-mono text-xs text-foreground">
                                        tabular-nums
                                    </code>{' '}
                                    on all financial figures ($1,450.00 ·
                                    OKJ-674SU5).
                                </p>
                            </div>
                        </Inner>
                    </Shell>
                </section>

                {/* Section 3: Buttons & IconButton */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <Sparkles className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            3. Button & IconButton Variants
                        </h2>
                    </div>

                    <Shell>
                        <Inner className="flex flex-col gap-6">
                            <div>
                                <Eyebrow className="mb-3 block">
                                    Variants (primary / secondary / ghost /
                                    danger / danger-ghost)
                                </Eyebrow>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button variant="primary">
                                        Primary Action
                                    </Button>
                                    <Button variant="secondary">
                                        Secondary
                                    </Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="danger">
                                        Danger Soft
                                    </Button>
                                    <Button variant="danger-ghost">
                                        Danger Ghost
                                    </Button>
                                    <Button variant="primary" loading>
                                        Submitting
                                    </Button>
                                    <Button variant="secondary" disabled>
                                        Disabled
                                    </Button>
                                </div>
                            </div>

                            <Divider className="my-0" />

                            <div>
                                <Eyebrow className="mb-3 block">
                                    Sizes (xs / sm / md / lg / xl) & Icon
                                    Placement
                                </Eyebrow>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button size="xs" variant="secondary">
                                        XS (32px)
                                    </Button>
                                    <Button size="sm" variant="secondary">
                                        Small (36px)
                                    </Button>
                                    <Button size="md" variant="primary">
                                        Medium (40px)
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="primary"
                                        iconLeft={<Calendar />}
                                    >
                                        Large (44px)
                                    </Button>
                                    <Button
                                        size="xl"
                                        variant="secondary"
                                        iconRight={<Send />}
                                    >
                                        XL (46px)
                                    </Button>
                                    <IconButton
                                        size="sm"
                                        aria-label="Copy link"
                                    >
                                        <Copy className="size-4" />
                                    </IconButton>
                                    <IconButton
                                        size="default"
                                        aria-label="Notifications"
                                    >
                                        <Bell className="size-4" />
                                    </IconButton>
                                    <IconButton
                                        variant="danger-ghost"
                                        aria-label="Delete item"
                                    >
                                        <Trash2 className="size-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </Inner>
                    </Shell>
                </section>

                {/* Section 4: Chips, StatusLabels & Avatars */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            4. Chip, StatusLabel & Avatar (av-1…av-6)
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Shell>
                            <ShellHead title="Chips & StatusLabels" />
                            <Inner className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Chip tone="neutral">Neutral</Chip>
                                    <Chip tone="accent" dot>
                                        In review
                                    </Chip>
                                    <Chip tone="success" dot>
                                        Filed & accepted
                                    </Chip>
                                    <Chip tone="warning" dot>
                                        Action required
                                    </Chip>
                                    <Chip tone="danger" dot>
                                        Rejected
                                    </Chip>
                                </div>
                                <Divider className="my-1" />
                                <div className="flex flex-wrap items-center gap-4">
                                    <StatusLabel tone="wait">
                                        Waiting on client
                                    </StatusLabel>
                                    <StatusLabel tone="info">
                                        Preparer assigned
                                    </StatusLabel>
                                    <StatusLabel tone="ok">
                                        Verified
                                    </StatusLabel>
                                    <StatusLabel tone="warn">
                                        Pending 8879
                                    </StatusLabel>
                                    <StatusLabel tone="bad">
                                        Rejected
                                    </StatusLabel>
                                </div>
                            </Inner>
                        </Shell>

                        <Shell>
                            <ShellHead title="Avatars (av-1…av-6 + broken image fallback)" />
                            <Inner className="flex flex-wrap items-center gap-3">
                                <Avatar
                                    name="Adaeze Okojie"
                                    variant={1}
                                    size="sm"
                                />
                                <Avatar
                                    name="Marcus Taylor"
                                    variant={2}
                                    size="default"
                                />
                                <Avatar
                                    name="Denise Robinson"
                                    variant={3}
                                    size="default"
                                />
                                <Avatar
                                    name="Priya Sharma"
                                    variant={4}
                                    size="lg"
                                />
                                <Avatar
                                    name="Terrence Williams"
                                    variant={5}
                                    size="xl"
                                />
                                <Avatar
                                    name="Chidi Okojie"
                                    variant={6}
                                    size="default"
                                    src="/non-existent-avatar.png"
                                />
                            </Inner>
                        </Shell>
                    </div>
                </section>

                {/* Section 5: Form Fields, ChoiceGroup, Check, Switch, FileDropzone */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <Layers className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            5. Field, ChoiceGroup, Check, Switch & FileDropzone
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Shell>
                            <ShellHead title="Field + Inputs + PasswordInput" />
                            <Inner className="flex flex-col gap-4">
                                <Field
                                    label="Email address"
                                    htmlFor="sg-email"
                                    hint="We send your portal invite and receipt here."
                                >
                                    <Input
                                        id="sg-email"
                                        type="email"
                                        defaultValue="marcus@example.com"
                                    />
                                </Field>

                                <Field
                                    label="Social Security / ITIN last 4"
                                    htmlFor="sg-ssn"
                                    error="Please enter exactly 4 digits."
                                >
                                    <Input id="sg-ssn" defaultValue="12" />
                                </Field>

                                <Field
                                    label="Password with strength meter"
                                    htmlFor="sg-password"
                                    labelRight={
                                        <span className="text-xs text-fg-3">
                                            Min 12 chars
                                        </span>
                                    }
                                >
                                    <PasswordInput
                                        id="sg-password"
                                        value={passwordDemo}
                                        onChange={(e) =>
                                            setPasswordDemo(e.target.value)
                                        }
                                        showStrengthMeter
                                    />
                                </Field>

                                <Field label="Filing state" htmlFor="sg-state">
                                    <Select defaultValue="PA">
                                        <SelectTrigger id="sg-state">
                                            <SelectValue placeholder="Choose state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PA">
                                                Pennsylvania (PA)
                                            </SelectItem>
                                            <SelectItem value="MD">
                                                Maryland (MD)
                                            </SelectItem>
                                            <SelectItem value="NJ">
                                                New Jersey (NJ)
                                            </SelectItem>
                                            <SelectItem value="DE">
                                                Delaware (DE)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field
                                    label="Notes for your preparer"
                                    htmlFor="sg-notes"
                                    optional
                                >
                                    <Textarea
                                        id="sg-notes"
                                        placeholder="Sold rental property in 2025..."
                                    />
                                </Field>
                            </Inner>
                        </Shell>

                        <Shell>
                            <ShellHead title="ChoiceGroup, Check, Switch & FileDropzone" />
                            <Inner className="flex flex-col gap-5">
                                <ChoiceGroup
                                    aria-label="Service tier"
                                    value={choiceTier}
                                    onValueChange={setChoiceTier}
                                    cols={1}
                                    options={[
                                        {
                                            value: 'upload_and_go',
                                            label: 'Upload & Go ($150–$225)',
                                            description:
                                                'Fully remote for W-2 and simple returns',
                                        },
                                        {
                                            value: 'hybrid',
                                            label: 'Hybrid ($225–$350)',
                                            description:
                                                'Drop off or upload; review in office or video',
                                        },
                                        {
                                            value: 'premium_remote',
                                            label: 'Premium Remote ($400–$900)',
                                            description:
                                                'Schedule C/E, multi-state, year-round support',
                                        },
                                    ]}
                                />

                                <div className="flex flex-col gap-3">
                                    <Check
                                        checked={checked}
                                        onCheckedChange={(val) =>
                                            setChecked(Boolean(val))
                                        }
                                        label="I consent to electronic Form 8879 signature"
                                        description="Required by IRS e-file regulations before transmission."
                                    />
                                    <div className="flex items-center justify-between gap-3 rounded-control bg-sunken px-3.5 py-2.5">
                                        <Label
                                            htmlFor="sg-switch"
                                            className="cursor-pointer text-[13.5px] font-medium text-foreground"
                                        >
                                            Compact table density
                                        </Label>
                                        <Switch
                                            id="sg-switch"
                                            checked={switchOn}
                                            onCheckedChange={setSwitchOn}
                                        />
                                    </div>
                                </div>

                                <FileDropzone
                                    file={selectedFile}
                                    onFileSelect={setSelectedFile}
                                    accept=".pdf,.png,.jpg"
                                />
                            </Inner>
                        </Shell>
                    </div>
                </section>

                {/* Section 6: MetricStrip, RowList & DataTable */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <CreditCard className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            6. MetricStrip, RowList & DataTable
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Shell>
                            <MetricStrip columns={4}>
                                <Metric
                                    label="Tax Year"
                                    value="2025"
                                    context="Filing in progress"
                                    tone="indigo"
                                />
                                <Metric
                                    label="Documents Uploaded"
                                    value="6"
                                    context="All verified"
                                    tone="green"
                                />
                                <Metric
                                    label="Balance Due"
                                    value="$275.00"
                                    context="INV-2026-0104"
                                    hot
                                    tone="amber"
                                />
                                <Metric
                                    label="Referral Rewards"
                                    value="$50.00"
                                    context="2 friends referred"
                                    tone="rose"
                                />
                            </MetricStrip>
                        </Shell>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Shell>
                                <ShellHead title="RowList + FileBadge" />
                                <Inner className="p-2">
                                    <RowList footer="Files are encrypted in transit and at rest per IRS Pub. 4557.">
                                        <Row
                                            leading={<FileBadge ext="pdf" />}
                                            title="2025_Form_W2_Employer.pdf"
                                            meta="Uploaded Oct 24, 2026 · 248 KB"
                                            status={
                                                <Chip tone="success" dot>
                                                    Verified
                                                </Chip>
                                            }
                                        />
                                        <Row
                                            leading={<FileBadge ext="png" />}
                                            title="PA_Drivers_License_Front.png"
                                            meta="Uploaded Oct 25, 2026 · 1.2 MB"
                                            status={
                                                <Chip tone="accent" dot>
                                                    New
                                                </Chip>
                                            }
                                        />
                                        <Row
                                            leading={<FileBadge ext="csv" />}
                                            title="2025_Schedule_C_Expenses.csv"
                                            meta="Uploaded Oct 26, 2026 · 44 KB"
                                            status={
                                                <Chip tone="neutral">
                                                    Archived
                                                </Chip>
                                            }
                                        />
                                    </RowList>
                                </Inner>
                            </Shell>

                            <Shell>
                                <ShellHead
                                    title="DataTable + TableToolbar + Pager"
                                    right={
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-fg-3">
                                                Compact
                                            </span>
                                            <Switch
                                                checked={compactTable}
                                                onCheckedChange={
                                                    setCompactTable
                                                }
                                                aria-label="Toggle compact table rows"
                                            />
                                        </div>
                                    }
                                />
                                <Inner>
                                    <TableToolbar
                                        left={
                                            <SearchInput
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                onClear={() =>
                                                    setSearchQuery('')
                                                }
                                                placeholder="Search invoices…"
                                            />
                                        }
                                        right={
                                            <>
                                                <Seg
                                                    value={segTab}
                                                    onValueChange={setSegTab}
                                                    items={[
                                                        {
                                                            value: 'all',
                                                            label: 'All',
                                                            count: 3,
                                                        },
                                                        {
                                                            value: 'open',
                                                            label: 'Open',
                                                            count: 1,
                                                        },
                                                    ]}
                                                />
                                                <FilterButton
                                                    label="Status"
                                                    value={statusFilter}
                                                    onSelect={setStatusFilter}
                                                    options={[
                                                        {
                                                            value: 'open',
                                                            label: 'Balance due',
                                                        },
                                                        {
                                                            value: 'paid',
                                                            label: 'Paid',
                                                        },
                                                    ]}
                                                />
                                            </>
                                        }
                                    />

                                    <DataTable compact={compactTable}>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Invoice</TableHead>
                                                <TableHead>
                                                    Description
                                                </TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">
                                                    Amount
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredInvoices.map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="font-mono text-xs">
                                                        {row.invoiceNumber}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-foreground">
                                                        {row.description}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.status ===
                                                        'paid' ? (
                                                            <Chip
                                                                tone="success"
                                                                dot
                                                            >
                                                                Paid
                                                            </Chip>
                                                        ) : (
                                                            <Chip
                                                                tone="warning"
                                                                dot
                                                            >
                                                                Balance due
                                                            </Chip>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono font-medium tabular-nums">
                                                        {row.amount}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </DataTable>

                                    <Pager
                                        from={1}
                                        to={filteredInvoices.length}
                                        total={filteredInvoices.length}
                                        noun="invoices"
                                    />
                                </Inner>
                            </Shell>
                        </div>
                    </div>
                </section>

                {/* Section 7: Stepper, NextStepCard, Timeline, CalendarTile, KeyValue, Note, EmptyState */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <Calendar className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            7. ReturnStepper, NextStepCard, Timeline,
                            CalendarTile & EmptyState
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Shell>
                            <ShellHead
                                title="5-Step ReturnStepper + NextStepCard"
                                right={
                                    <Seg
                                        value={stepperIndex}
                                        onValueChange={setStepperIndex}
                                        items={[
                                            { value: '0', label: 'Step 1' },
                                            { value: '1', label: 'Step 2' },
                                            { value: '2', label: 'Step 3' },
                                            { value: '3', label: 'Step 4' },
                                            { value: '4', label: 'Step 5' },
                                        ]}
                                    />
                                }
                            />
                            <Inner className="flex flex-col gap-6">
                                <ReturnStepper
                                    steps={sampleReturnStages}
                                    currentIndex={Number(stepperIndex)}
                                />
                                <NextStepCard
                                    tone="action"
                                    eyebrow="Next step for TY 2025"
                                    title="Upload your remaining 1099-INT statement"
                                    body="Your preparer Adaeze Okojie is reviewing your W-2s. Upload your bank interest statement so we can finalize your draft."
                                    action={
                                        <Button
                                            variant="primary"
                                            iconLeft={<Upload />}
                                        >
                                            Upload document
                                        </Button>
                                    }
                                />
                            </Inner>
                        </Shell>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <Shell>
                                <ShellHead title="Timeline & CalendarTile" />
                                <Inner className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <CalendarTile month="Nov" day={4} />
                                        <div>
                                            <div className="text-sm font-medium text-foreground">
                                                Video Review Call
                                            </div>
                                            <div className="text-xs text-fg-3">
                                                Wed, Nov 4 · 2:00 PM EST
                                            </div>
                                        </div>
                                    </div>
                                    <Divider className="my-1" />
                                    <Timeline
                                        items={[
                                            {
                                                title: 'Engagement letter signed',
                                                meta: 'Oct 20, 2026',
                                            },
                                            {
                                                title: 'Documents in preparer review',
                                                meta: 'Adaeze Okojie, EA · Today',
                                                active: true,
                                            },
                                            {
                                                title: 'Form 8879 e-signature',
                                                meta: 'Up next',
                                            },
                                        ]}
                                    />
                                </Inner>
                            </Shell>

                            <Shell>
                                <ShellHead title="KeyValue & Notes" />
                                <Inner className="flex flex-col gap-4">
                                    <KeyValue
                                        items={[
                                            {
                                                label: 'Service tier',
                                                value: 'Hybrid',
                                            },
                                            {
                                                label: 'Preparer',
                                                value: 'Adaeze Okojie, EA',
                                            },
                                            {
                                                label: 'Referral code',
                                                value: 'OKJ-674SU5',
                                                mono: true,
                                            },
                                        ]}
                                    />
                                    <Note tone="accent">
                                        All portal uploads are encrypted in
                                        transit and at rest per IRS Pub. 4557.
                                    </Note>
                                    <Note tone="warn">
                                        Please do not email Social Security
                                        numbers.
                                    </Note>
                                </Inner>
                            </Shell>

                            <Shell>
                                <Inner variant="flush-empty">
                                    <EmptyState
                                        icon={<FileText />}
                                        title="No tax returns filed yet"
                                        body="Once your preparer finalizes your return, your signed copies and transcripts will appear here."
                                        actions={
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Upload first document
                                            </Button>
                                        }
                                    />
                                </Inner>
                            </Shell>
                        </div>
                    </div>
                </section>

                {/* Section 8: Overlays, ConfirmDialog, OTP, Skeleton & Toasts */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <Bell className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            8. Overlays, ConfirmDialog, OTP, Skeleton & Toasts
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Shell>
                            <ShellHead title="ConfirmDialog, Dialog, Sheet & DropdownMenu" />
                            <Inner className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <ConfirmDialog
                                        trigger={
                                            <Button variant="danger" size="sm">
                                                Cancel appointment
                                            </Button>
                                        }
                                        title="Cancel this consultation?"
                                        description="Your preparer will be notified immediately. You can book a new time whenever you are ready."
                                        confirmLabel="Yes, cancel appointment"
                                        variant="danger"
                                        onConfirm={() =>
                                            toast.success(
                                                'Appointment cancelled.',
                                            )
                                        }
                                    />

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Open Dialog
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    IRS Form 8879 E-Sign
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Authorize Okojie &
                                                    Associates to electronically
                                                    submit your return.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-2 text-sm text-fg-2">
                                                Verify under penalties of
                                                perjury that you have examined a
                                                copy of your return.
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
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Open Sheet
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="right">
                                            <SheetHeader>
                                                <SheetTitle>
                                                    Drawer Title
                                                </SheetTitle>
                                                <SheetDescription>
                                                    Slide-out drawer panel.
                                                </SheetDescription>
                                            </SheetHeader>
                                        </SheetContent>
                                    </Sheet>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                iconRight={<ChevronDown />}
                                            >
                                                Menu
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>
                                                Portal Actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                Overview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Documents
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Billing
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <Divider className="my-1" />

                                <div className="flex flex-wrap items-center gap-3">
                                    <SegLinks
                                        items={[
                                            {
                                                href: '#styleguide-main',
                                                label: 'Profile',
                                                active: true,
                                            },
                                            {
                                                href: '#styleguide-main',
                                                label: 'Security & Passkeys',
                                                active: false,
                                            },
                                            {
                                                href: '#styleguide-main',
                                                label: 'Appearance',
                                                active: false,
                                            },
                                        ]}
                                    />
                                </div>
                            </Inner>
                        </Shell>

                        <Shell>
                            <ShellHead title="InputOTP, Progress, Skeleton & Sonner" />
                            <Inner className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
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

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                toast.success(
                                                    'Document uploaded to vault.',
                                                )
                                            }
                                        >
                                            Success Toast
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() =>
                                                toast.error(
                                                    'Upload failed: unsupported file.',
                                                )
                                            }
                                        >
                                            Error Toast
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1.5 flex justify-between text-xs text-fg-3">
                                        <span>Upload progress</span>
                                        <span className="font-mono">
                                            {progress}%
                                        </span>
                                    </div>
                                    <Progress value={progress} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-9 rounded-full" />
                                    <div className="flex flex-1 flex-col gap-1.5">
                                        <Skeleton className="h-3.5 w-1/3" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                </div>
                            </Inner>
                        </Shell>
                    </div>
                </section>

                {/* Section 9: Icon System (§6) */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center gap-2">
                        <Sparkles className="size-5 text-primary" />
                        <h2 className="text-xl font-semibold text-foreground">
                            9. Icon System (docs/DESIGN_SYSTEM.md §6 —{' '}
                            {iconNames.length} Icons)
                        </h2>
                    </div>

                    <Shell>
                        <Inner>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                                {iconNames.map((name) => (
                                    <div
                                        key={name}
                                        className="flex flex-col items-center gap-1.5 rounded-lg bg-sunken/70 p-2.5 text-center shadow-[inset_0_0_0_1px_var(--border)]"
                                    >
                                        <AppIcon
                                            name={name}
                                            className="text-foreground"
                                        />
                                        <span className="w-full truncate font-mono text-[10px] text-fg-3">
                                            {name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Inner>
                    </Shell>
                </section>

                {/* Section 10: Registered Page Fixtures */}
                <section className="mb-14">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="size-5 text-primary" />
                            <h2 className="text-xl font-semibold text-foreground">
                                10. Registered Page Fixtures ({fixtures.length})
                            </h2>
                        </div>
                        <Chip tone="accent">
                            resources/js/dev/fixtures/index.ts
                        </Chip>
                    </div>

                    {fixtures.length === 0 ? (
                        <Shell>
                            <Inner variant="flush-empty">
                                <EmptyState
                                    title="No page fixtures registered yet"
                                    body="Page prompts UI-05 through UI-35 register their presentational view states here via register({ id, title, states })."
                                />
                            </Inner>
                        </Shell>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {fixtures.map((fixture) => (
                                <FixtureCard
                                    key={fixture.id}
                                    fixture={fixture}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Section 11: Marketing Components Reference */}
                <section className="mb-14 flex flex-col gap-12">
                    <div className="flex items-center justify-between border-t border-border pt-10">
                        <div>
                            <Eyebrow>Marketing Components</Eyebrow>
                            <h2 className="mt-1 text-xl font-semibold text-foreground">
                                11. Shared Marketing Sections
                            </h2>
                        </div>
                        <Chip tone="neutral">Migrated in UI-05…UI-12</Chip>
                    </div>

                    <TierGrid tiers={tiers} featuredSlug="hybrid" />
                    <StatsStrip stats={sampleStats} />
                    <HowItWorks steps={steps} />
                    <TestimonialCarousel testimonials={testimonials} />
                    <div className="grid grid-cols-1 gap-8">
                        <AddOnTable addOns={addons} />
                        <AddOnCards addOns={addons} />
                    </div>
                    <OfficeGrid offices={offices} />
                    <VideoLibrary groups={videos} />
                    <ReferralBanner />
                    <FaqList faqs={faqs} defaultOpenIndices={[0]} />
                </section>
            </div>
        </MarketingLayout>
    );
}
