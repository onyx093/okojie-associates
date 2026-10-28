import { Link, useForm, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, Menu, ShieldCheck } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button, ChipEyebrow, ThemeToggle } from '@/components/primitives';
import { SeoHead } from '@/components/seo-head';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { useHoneypotFields } from '@/hooks/use-honeypot';
import { cn } from '@/lib/utils';
import {
    about,
    contact,
    home,
    login,
    pricing,
    privacy,
    security,
    services,
    terms,
} from '@/routes';
import { subscribe } from '@/routes/newsletter';
import { overview } from '@/routes/portal';
import type {
    HoneypotSharedProp,
    OfficeItem,
    SharedData,
    SiteConfig,
    User,
} from '@/types';

const DEFAULT_OFFICES: OfficeItem[] = [
    {
        slug: 'germantown-ave',
        city: 'Philadelphia, PA',
        address: '5601 Germantown Ave',
        phone: '(215) 555-0142',
        hours: 'Mon–Fri 9am–6pm · Sat 10am–2pm',
    },
    {
        slug: 'n-broad-st',
        city: 'Philadelphia, PA',
        address: '2301 N. Broad St',
        phone: '(215) 555-0178',
        hours: 'Mon–Fri 9am–6pm',
    },
    {
        slug: 'w-chelten-ave',
        city: 'Philadelphia, PA',
        address: '6300 W. Chelten Ave',
        phone: '(215) 555-0193',
        hours: 'Mon–Fri 9am–5pm · Sat 10am–1pm',
    },
    {
        slug: 'liberty-heights-baltimore',
        city: 'Baltimore, MD',
        address: '4100 Liberty Heights Ave',
        phone: '(410) 555-0166',
        hours: 'Mon–Fri 9am–6pm',
    },
];

export function SkipLink({ href = '#main' }: { href?: string }) {
    return (
        <a
            href={href}
            className="focus:bg-accent-solid sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:px-3.5 focus:py-2 focus:text-[13px] focus:font-medium focus:text-white focus:shadow-card print:hidden"
        >
            Skip to content
        </a>
    );
}

export function SiteBrandMark({
    tone = 'accent',
    size = 'md',
    className,
}: {
    tone?: 'accent' | 'dark';
    size?: 'sm' | 'md';
    className?: string;
}) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'grid shrink-0 place-items-center font-semibold tracking-[-0.03em] text-white',
                size === 'sm'
                    ? 'size-7 rounded-lg text-[13px]'
                    : 'size-[30px] rounded-[9px] text-[14px] shadow-[0_6px_16px_-4px_rgb(79_99_232/0.55),inset_0_1px_0_rgb(255_255_255/0.35)]',
                tone === 'dark'
                    ? 'dark:bg-accent-solid bg-[#101328]'
                    : 'bg-accent-solid',
                className,
            )}
        >
            O
        </span>
    );
}

export type SiteNavProps = {
    user?: User | null;
    currentUrl?: string;
    defaultMobileOpen?: boolean;
    className?: string;
};

export function SiteNav({
    user: userProp,
    currentUrl: currentUrlProp,
    defaultMobileOpen = false,
    className,
}: SiteNavProps) {
    const page = usePage<Partial<SharedData>>();
    const user =
        userProp !== undefined ? userProp : (page.props.auth?.user ?? null);
    const currentUrl = currentUrlProp ?? page.url ?? '/';
    const [mobileOpen, setMobileOpen] = React.useState(defaultMobileOpen);

    const navLinks = React.useMemo(
        () => [
            { key: 'home', label: 'Home', href: home.url() },
            { key: 'services', label: 'Services', href: services.url() },
            { key: 'pricing', label: 'Pricing', href: pricing.url() },
            { key: 'about', label: 'About', href: about.url() },
            { key: 'contact', label: 'Contact', href: contact.url() },
        ],
        [],
    );

    const isLinkActive = React.useCallback(
        (href: string) => {
            const cleanUrl = currentUrl.split('?')[0].split('#')[0] || '/';
            if (href === '/') {
                return cleanUrl === '/';
            }

            return cleanUrl === href || cleanUrl.startsWith(`${href}/`);
        },
        [currentUrl],
    );

    const startReturnHref = `${contact.url()}#start`;
    const portalHref = overview.url();

    return (
        <nav
            aria-label="Primary"
            className={cn(
                'mx-auto flex max-w-site items-center justify-between gap-4 px-10 py-5 max-sm:px-5 max-sm:py-4 print:hidden',
                className,
            )}
        >
            <Link
                href={home.url()}
                className="inline-flex items-center gap-2.5 text-[15px] leading-[1.15] font-semibold tracking-[-0.02em] text-foreground"
            >
                <SiteBrandMark />
                <span>
                    Okojie &amp; Associates
                    <small className="text-tertiary block font-sans text-[11.5px] font-normal tracking-normal">
                        Okojie Online
                    </small>
                </span>
            </Link>

            <ul className="m-0 hidden list-none items-center gap-7 p-0 nav:flex">
                {navLinks.map((item) => {
                    const active = isLinkActive(item.href);

                    return (
                        <li key={item.key}>
                            <Link
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.06em] uppercase transition-colors',
                                    active
                                        ? 'font-medium text-foreground'
                                        : 'text-foreground/78 hov:hover:text-foreground',
                                )}
                            >
                                {active && (
                                    <span
                                        aria-hidden="true"
                                        className="bg-accent-solid size-[5px] rounded-full"
                                    />
                                )}
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="flex items-center gap-2">
                <ThemeToggle className="rounded-[10px] bg-glass shadow-glass backdrop-blur-md" />

                {user ? (
                    <Button
                        asChild
                        variant="primary"
                        size="md"
                        className="hidden rounded-[11px] nav:inline-flex"
                    >
                        <Link href={portalHref}>
                            My portal
                            <ArrowRight className="size-[15px]" />
                        </Link>
                    </Button>
                ) : (
                    <>
                        <Link
                            href={login.url()}
                            className="hov:hover:text-accent-fg hidden px-2.5 py-2 text-[14px] font-medium text-foreground transition-colors nav:inline-flex"
                        >
                            Client login
                        </Link>
                        <Button
                            asChild
                            variant="primary"
                            size="md"
                            className="hidden rounded-[11px] nav:inline-flex"
                        >
                            <Link href={startReturnHref}>
                                Start my return
                                <ArrowRight className="size-[15px]" />
                            </Link>
                        </Button>
                    </>
                )}

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            aria-label="Open menu"
                            aria-expanded={mobileOpen}
                            className="inline-grid size-9 cursor-pointer place-items-center rounded-[10px] bg-glass text-foreground shadow-glass backdrop-blur-md transition-colors nav:hidden hov:hover:bg-card"
                        >
                            <Menu className="size-[18px]" />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="flex w-[min(320px,88vw)] flex-col justify-between p-6"
                    >
                        <div className="grid gap-6">
                            <SheetHeader className="p-0 text-left">
                                <SheetTitle className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em]">
                                    <SiteBrandMark />
                                    <span>
                                        Okojie &amp; Associates
                                        <small className="text-tertiary block font-sans text-[11.5px] font-normal tracking-normal">
                                            Okojie Online
                                        </small>
                                    </span>
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    Site navigation menu
                                </SheetDescription>
                            </SheetHeader>

                            <nav aria-label="Mobile navigation">
                                <ul className="m-0 grid list-none gap-1 p-0">
                                    {navLinks.map((item) => {
                                        const active = isLinkActive(item.href);

                                        return (
                                            <li key={item.key}>
                                                <Link
                                                    href={item.href}
                                                    aria-current={
                                                        active
                                                            ? 'page'
                                                            : undefined
                                                    }
                                                    onClick={() =>
                                                        setMobileOpen(false)
                                                    }
                                                    className={cn(
                                                        'flex h-10 items-center justify-between rounded-[10px] px-3 font-mono text-[12px] tracking-[0.06em] uppercase transition-colors',
                                                        active
                                                            ? 'bg-accent-soft text-accent-fg font-medium'
                                                            : 'text-foreground/80 hov:hover:bg-sunken hov:hover:text-foreground',
                                                    )}
                                                >
                                                    <span>{item.label}</span>
                                                    {active && (
                                                        <span
                                                            aria-hidden="true"
                                                            className="bg-accent-solid size-1.5 rounded-full"
                                                        />
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>

                        <div className="grid gap-2.5 border-t border-border pt-4">
                            {user ? (
                                <Button
                                    asChild
                                    variant="primary"
                                    size="lg"
                                    block
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Link href={portalHref}>
                                        My portal
                                        <ArrowRight className="size-[15px]" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant="primary"
                                        size="lg"
                                        block
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <Link href={startReturnHref}>
                                            Start my return
                                            <ArrowRight className="size-[15px]" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        size="lg"
                                        block
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <Link href={login.url()}>
                                            Client login
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}

export type SiteBandProps = {
    eyebrow?: string;
    icon?: LucideIcon;
    title: React.ReactNode;
    lead?: React.ReactNode;
    ctas?: React.ReactNode;
    children?: React.ReactNode;
};

export type CtaBandProps = {
    eyebrow?: string;
    icon?: LucideIcon;
    title?: React.ReactNode;
    lead?: React.ReactNode;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string } | null;
    children?: React.ReactNode;
    className?: string;
};

export function CtaBand({
    eyebrow = 'Start now',
    icon = ArrowRight,
    title = 'Same trusted preparers. No waiting room.',
    lead = 'Start online in minutes and track every step of your return in your portal.',
    primaryCta = {
        label: 'Start my return online',
        href: `${contact.url()}#start`,
    },
    secondaryCta = {
        label: 'Book a free consultation',
        href: `${contact.url()}#consult`,
    },
    children,
    className,
}: CtaBandProps) {
    const titleId = React.useId();

    return (
        <section
            aria-labelledby={titleId}
            className={cn(
                'relative isolate mx-3 my-9 overflow-hidden rounded-band bg-(image:--sky-band) px-10 py-[72px] text-center text-foreground before:pointer-events-none before:absolute before:inset-[-20%_-10%] before:-z-10 before:rotate-[-14deg] before:bg-[linear-gradient(112deg,transparent_30%,var(--sky-streak)_46%,transparent_58%)] max-sm:mx-2 max-sm:rounded-[22px] max-sm:px-5 max-sm:py-12',
                className,
            )}
        >
            <ChipEyebrow
                icon={
                    icon
                        ? React.createElement(icon, {
                              className: 'size-3',
                              strokeWidth: 1.9,
                          })
                        : undefined
                }
                className="bg-glass shadow-glass backdrop-blur-md"
            >
                {eyebrow}
            </ChipEyebrow>
            <h2
                id={titleId}
                className="mx-auto mt-4 max-w-[18ch] text-[clamp(32px,4.4vw,52px)] leading-[1.03] font-medium tracking-[-0.035em] text-balance"
            >
                {title}
            </h2>
            {lead && (
                <p className="mx-auto mt-3.5 max-w-[46ch] text-[16.5px] leading-[1.55] text-pretty text-muted-foreground">
                    {lead}
                </p>
            )}
            {children ?? (
                <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                    {primaryCta && (
                        <Button asChild variant="primary" size="lg">
                            <Link href={primaryCta.href}>
                                {primaryCta.label}
                                <ArrowRight className="size-[15px]" />
                            </Link>
                        </Button>
                    )}
                    {secondaryCta && (
                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="bg-glass shadow-glass backdrop-blur-md"
                        >
                            <Link href={secondaryCta.href}>
                                {secondaryCta.label}
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </section>
    );
}

export type SiteFooterProps = {
    offices?: OfficeItem[];
    site?: Partial<SiteConfig>;
    honeypot?: HoneypotSharedProp;
    className?: string;
};

export function SiteFooter({
    offices: officesProp,
    site: siteProp,
    honeypot: honeypotProp,
    className,
}: SiteFooterProps) {
    const { props } = usePage<Partial<SharedData>>();
    const site = siteProp ?? props.site;
    const honeypotConfig =
        honeypotProp !== undefined ? honeypotProp : props.honeypot;
    const honeypotFields = useHoneypotFields(honeypotConfig);
    const honeypotName = honeypotConfig?.name ?? 'my_name';
    const validFromName = honeypotConfig?.validFromName ?? 'valid_from';

    const offices =
        officesProp && officesProp.length > 0
            ? officesProp
            : site?.offices && site.offices.length > 0
              ? site.offices
              : DEFAULT_OFFICES;

    const emailInputId = React.useId();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        ...honeypotFields,
    });

    const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(subscribe.url(), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Thanks for subscribing to tax updates.');
                setData('email', '');
            },
            onError: () => {
                toast.error('Enter a valid email address.');
            },
        });
    };

    const exploreLinks: Array<[string, string]> = [
        ['Home', home.url()],
        ['Services', services.url()],
        ['Pricing', pricing.url()],
        ['About', about.url()],
        ['Contact', contact.url()],
        ['Client login', login.url()],
    ];

    return (
        <footer
            className={cn(
                'm-3 rounded-band bg-card px-12 pt-14 pb-7 text-foreground shadow-card max-sm:m-2 max-sm:rounded-[22px] max-sm:px-5 max-sm:pt-9 max-sm:pb-6 print:hidden',
                className,
            )}
        >
            <div className="grid gap-10 max-nav:grid-cols-2 max-sm:grid-cols-1 nav:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                <div>
                    <Link
                        href={home.url()}
                        className="inline-flex items-center gap-2.5"
                    >
                        <SiteBrandMark />
                        <span className="text-[15px] leading-tight font-semibold tracking-[-0.02em]">
                            {site?.brand?.legal_name ??
                                'Okojie & Associates, Inc.'}
                            <small className="text-tertiary block font-sans text-xs font-normal tracking-normal">
                                {site?.brand?.product ?? 'Okojie Online'}
                            </small>
                        </span>
                    </Link>
                    <p className="mt-3.5 max-w-[36ch] text-[14.5px] leading-[1.55] text-muted-foreground">
                        {site?.footer_blurb ??
                            'Online filing with a real tax professional who knows Philadelphia and Baltimore. Serving individuals, families, and small businesses for 26+ years.'}
                    </p>
                    <form
                        onSubmit={handleSubscribe}
                        noValidate
                        className="mt-5 flex max-w-[360px] gap-1.5 rounded-[13px] bg-sunken p-[5px] shadow-[inset_0_0_0_1px_var(--border)] transition-shadow focus-within:shadow-[inset_0_0_0_1.5px_var(--accent-solid),0_0_0_4px_var(--accent-soft)]"
                    >
                        <div className="hidden" aria-hidden="true">
                            <input
                                type="text"
                                name={honeypotName}
                                tabIndex={-1}
                                autoComplete="off"
                                value={data.my_name}
                                onChange={(event) =>
                                    setData('my_name', event.target.value)
                                }
                            />
                            <input
                                type="hidden"
                                name={validFromName}
                                value={data.valid_from}
                            />
                        </div>
                        <label htmlFor={emailInputId} className="sr-only">
                            Email for tax tips and deadline reminders
                        </label>
                        <input
                            id={emailInputId}
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="Your email for deadline reminders"
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            aria-invalid={Boolean(errors.email)}
                            className="placeholder:text-tertiary min-w-0 flex-1 border-0 bg-transparent px-2.5 text-[14px] text-foreground focus-visible:outline-none"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            loading={processing}
                            className="h-9 rounded-[9px] px-3.5 text-[13.5px]"
                        >
                            {processing ? 'Sending…' : 'Subscribe'}
                        </Button>
                    </form>
                    {errors.email && (
                        <p className="text-danger-fg mt-2 text-xs" role="alert">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <h3 className="text-tertiary mb-3.5 font-mono text-[11.5px] font-medium tracking-[0.08em] uppercase">
                        Explore
                    </h3>
                    <ul className="m-0 grid list-none gap-2.5 p-0 text-[14.5px]">
                        {exploreLinks.map(([label, href]) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className="hov:hover:text-accent-fg text-foreground transition-colors"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-tertiary mb-3.5 font-mono text-[11.5px] font-medium tracking-[0.08em] uppercase">
                        Get in touch
                    </h3>
                    <ul className="m-0 grid list-none gap-2.5 p-0 text-[14.5px]">
                        <li>
                            <a
                                href="tel:+12155550142"
                                className="hov:hover:text-accent-fg text-foreground tabular-nums transition-colors"
                            >
                                (215) 555-0142
                            </a>
                        </li>
                        <li>
                            <a
                                href="tel:+14105550166"
                                className="hov:hover:text-accent-fg text-foreground tabular-nums transition-colors"
                            >
                                (410) 555-0166
                            </a>
                        </li>
                        <li>
                            <Link
                                href={`${contact.url()}#consult`}
                                className="hov:hover:text-accent-fg text-foreground transition-colors"
                            >
                                Book a consultation
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-tertiary mb-3.5 font-mono text-[11.5px] font-medium tracking-[0.08em] uppercase">
                        Offices
                    </h3>
                    <ul className="m-0 grid list-none gap-2.5 p-0 text-[14.5px]">
                        {offices.map((office) => (
                            <li key={office.address}>
                                <span className="text-foreground">
                                    {office.address}
                                </span>
                                <small className="text-tertiary block text-[12.5px]">
                                    {office.city}
                                </small>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="text-tertiary mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-[13px]">
                <span>
                    © {new Date().getFullYear()} Okojie &amp; Associates, Inc.
                </span>
                <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="size-[15px]" />
                    IRS Publication 4557 &amp; FTC Safeguards compliant
                </span>
                <nav aria-label="Legal" className="flex flex-wrap gap-5">
                    <Link
                        href={privacy.url()}
                        className="transition-colors hov:hover:text-foreground"
                    >
                        Privacy policy
                    </Link>
                    <Link
                        href={terms.url()}
                        className="transition-colors hov:hover:text-foreground"
                    >
                        Terms of service
                    </Link>
                    <Link
                        href={security.url()}
                        className="transition-colors hov:hover:text-foreground"
                    >
                        Security (WISP)
                    </Link>
                </nav>
            </div>
        </footer>
    );
}

export type SiteLayoutProps = {
    children?: React.ReactNode;
    seo?: React.ComponentProps<typeof SeoHead>;
    band?: SiteBandProps | null;
    hero?: React.ReactNode;
    ctaBand?: boolean | CtaBandProps;
    noFooter?: boolean;
    offices?: OfficeItem[];
    userOverride?: User | null;
    currentUrlOverride?: string;
    defaultMobileOpen?: boolean;
    headerClassName?: string;
    mainClassName?: string;
};

export function SiteLayout(props: SiteLayoutProps) {
    useFlashToast();
    const {
        children,
        seo,
        band,
        hero,
        ctaBand,
        noFooter = false,
        offices,
        userOverride,
        currentUrlOverride,
        defaultMobileOpen,
        headerClassName,
        mainClassName,
    } = props;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SkipLink />
            {seo && <SeoHead {...seo} />}

            <div className="p-3 pb-0 max-sm:p-2 max-sm:pb-0 print:m-0 print:p-0">
                <header
                    className={cn(
                        'relative isolate overflow-hidden rounded-band bg-(image:--sky-band) text-foreground before:pointer-events-none before:absolute before:inset-[-20%_-10%] before:-z-10 before:rotate-[-14deg] before:bg-[linear-gradient(112deg,transparent_28%,var(--sky-streak)_44%,transparent_54%),linear-gradient(112deg,transparent_58%,var(--sky-streak)_66%,transparent_74%)] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:-z-10 after:h-[120px] after:bg-[linear-gradient(180deg,transparent,var(--sky-veil))] max-sm:rounded-[22px] print:rounded-none print:border-none print:bg-none print:shadow-none print:before:hidden print:after:hidden',
                        headerClassName,
                    )}
                >
                    <SiteNav
                        user={userOverride}
                        currentUrl={currentUrlOverride}
                        defaultMobileOpen={defaultMobileOpen}
                    />

                    {band && (
                        <div className="mx-auto max-w-site px-10 pt-11 pb-16 max-sm:px-5 max-sm:pt-5 max-sm:pb-10 print:px-0 print:pt-4 print:pb-4">
                            {band.eyebrow && (
                                <ChipEyebrow
                                    icon={
                                        band.icon
                                            ? React.createElement(band.icon, {
                                                  className: 'size-3',
                                                  strokeWidth: 1.9,
                                              })
                                            : undefined
                                    }
                                >
                                    {band.eyebrow}
                                </ChipEyebrow>
                            )}
                            <h1 className="[&_em]:text-accent-fg mt-4 max-w-[18ch] text-[clamp(38px,5.2vw,64px)] leading-none font-medium tracking-[-0.04em] text-balance [&_em]:font-normal [&_em]:not-italic">
                                {band.title}
                            </h1>
                            {band.lead && (
                                <p className="mt-4 max-w-[54ch] text-[17.5px] leading-[1.55] text-pretty text-muted-foreground">
                                    {band.lead}
                                </p>
                            )}
                            {band.ctas && (
                                <div className="mt-6 flex flex-wrap gap-2.5">
                                    {band.ctas}
                                </div>
                            )}
                            {band.children}
                        </div>
                    )}

                    {hero}
                </header>
            </div>

            <main id="main" className={mainClassName}>
                {children}
            </main>

            {ctaBand && (
                <CtaBand
                    {...(typeof ctaBand === 'object' ? ctaBand : undefined)}
                />
            )}

            {!noFooter && <SiteFooter offices={offices} />}
        </div>
    );
}

export default SiteLayout;
