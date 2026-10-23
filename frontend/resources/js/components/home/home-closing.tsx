import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    CheckCircle2,
    Gift,
    Lock,
    MessageSquare,
    Plus,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { BrandMark } from '@/components/home/home-nav';
import {
    container,
    Eyebrow,
    homeButtonClass,
    HomeLinkButton,
} from '@/components/home/primitives';
import { useHoneypotFields } from '@/hooks/use-honeypot';
import { useQuoteForm } from '@/hooks/use-quote-form';
import { cn } from '@/lib/utils';
import {
    about,
    contact,
    home,
    login,
    pricing,
    privacy,
    register,
    security,
    services,
    terms,
} from '@/routes';
import { subscribe } from '@/routes/newsletter';
import { referrals } from '@/routes/portal';
import type { FaqItem, OfficeItem, TierItem } from '@/types/marketing';

/* ───────── Referral ───────── */

export function HomeReferral() {
    const { props } = usePage<{ auth?: { user?: unknown } }>();
    const href = props.auth?.user
        ? referrals.url()
        : register.url({ query: { next: referrals.url() } });

    return (
        <section aria-labelledby="ref-title" className={container}>
            <div className="relative isolate grid items-center gap-10 overflow-hidden rounded-[22px] bg-[#0c0d16] px-5 py-7 text-[#f2f3f7] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] sm:rounded-[28px] sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-14">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_100%_0%,rgb(94_112_240/0.45),transparent_60%),radial-gradient(50%_70%_at_85%_110%,rgb(246_150_110/0.35),transparent_60%)]"
                />
                <div>
                    <Eyebrow
                        icon={Gift}
                        className="bg-white/8 text-[#f2f3f7] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] [&>span]:bg-[#f2f3f7] [&>span]:text-[#0c0d16]"
                    >
                        Refer a friend
                    </Eyebrow>
                    <h2
                        id="ref-title"
                        className="mt-5 text-[clamp(32px,4vw,48px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance"
                    >
                        Earn $25–$50 for every friend you refer
                    </h2>
                    <p className="mt-4 max-w-[46ch] text-[16.5px] text-pretty text-white/70">
                        Know someone who dreads tax season? When they file with
                        Okojie Online, you earn a reward — and they get a real
                        tax professional who knows Philadelphia and Baltimore.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2.5">
                        <HomeLinkButton href={href}>
                            Get my referral link
                        </HomeLinkButton>
                        <Link
                            href={href}
                            className={homeButtonClass(
                                'secondary',
                                'bg-white/8 text-[#f2f3f7] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] [@media(hover:hover)]:hover:bg-white/14',
                            )}
                        >
                            Refer someone now
                        </Link>
                    </div>
                </div>
                <div className="rounded-[20px] bg-white/6 p-2 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] backdrop-blur-md">
                    <div className="rounded-xl bg-[#15161f] p-[18px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]">
                        <span className="font-mono text-[10.5px] tracking-[0.08em] text-white/50 uppercase">
                            How it works
                        </span>
                        <ol className="mt-2 grid">
                            {[
                                [
                                    'Share your link',
                                    'Every client gets a unique code and link in their portal.',
                                ],
                                [
                                    'They file, you earn',
                                    'When your friend becomes a client, you earn $25–$50.',
                                ],
                            ].map(([title, body], i) => (
                                <li
                                    key={title}
                                    className="flex items-start gap-3 border-t border-white/7 px-1 py-3 first:border-t-0"
                                >
                                    <span className="grid size-6 shrink-0 place-items-center rounded-[7px] bg-white/8 font-mono text-[11px]">
                                        0{i + 1}
                                    </span>
                                    <span>
                                        <b className="block text-[14.5px] font-medium">
                                            {title}
                                        </b>
                                        <small className="text-[13.5px] text-white/60">
                                            {body}
                                        </small>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ───────── Intake ───────── */

const inputClass =
    'h-[46px] w-full rounded-[11px] bg-h-sunken px-3.5 text-[15px] text-h-fg shadow-[inset_0_0_0_1px_var(--h-line)] transition-[box-shadow,background-color] placeholder:text-h-fg-3 focus-visible:bg-h-surface focus-visible:shadow-[inset_0_0_0_1.5px_var(--h-accent),0_0_0_4px_var(--h-accent-soft)] focus-visible:outline-none aria-invalid:shadow-[inset_0_0_0_1.5px_#e5484d]';

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) {
        return null;
    }

    return (
        <span id={id} className="text-xs text-[#e5484d]">
            {message}
        </span>
    );
}

export function HomeIntake({ tiers }: { tiers: TierItem[] }) {
    const {
        data,
        setData,
        errors,
        processing,
        submitted,
        startOver,
        activeRef,
        firstName,
        submit,
    } = useQuoteForm();

    const tierOptions = [
        ...tiers.map((tier) => ({
            value: tier.slug,
            label: tier.name,
            meta: `From $${tier.price_min}–$${tier.price_max}`,
        })),
        {
            value: 'not_sure',
            label: 'Not sure yet',
            meta: 'We’ll recommend one',
        },
    ];

    return (
        <section
            id="start"
            aria-labelledby="start-title"
            className="scroll-mt-24 py-20 sm:py-[120px]"
        >
            <div
                className={cn(
                    container,
                    'grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16',
                )}
            >
                <div>
                    <Eyebrow icon={Sparkles}>Fast intake</Eyebrow>
                    <h2
                        id="start-title"
                        className="mt-5 text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance"
                    >
                        Start your return online
                    </h2>
                    <p className="mt-4 max-w-[42ch] text-[17px] text-h-fg-2">
                        Tell us about your situation and a preparer will follow
                        up within one business day.
                    </p>
                    <ul className="mt-7 grid gap-3.5 text-[15.5px]">
                        {[
                            [Check, 'No obligation, no pressure'],
                            [Users, 'A real preparer reviews your situation'],
                            [Lock, 'Your information stays private and secure'],
                        ].map(([Icon, label]) => {
                            const I = Icon as typeof Check;

                            return (
                                <li
                                    key={label as string}
                                    className="flex items-center gap-3"
                                >
                                    <span className="grid size-7 place-items-center rounded-lg bg-h-surface text-h-accent-fg shadow-h-chip">
                                        <I className="size-[15px]" />
                                    </span>
                                    {label as string}
                                </li>
                            );
                        })}
                    </ul>
                    {activeRef && (
                        <p className="mt-6 rounded-[10px] bg-h-sunken px-3.5 py-3 text-[13.5px] text-h-fg-2">
                            Applying referral code{' '}
                            <span className="font-mono font-medium text-h-accent-fg">
                                {activeRef}
                            </span>
                        </p>
                    )}
                    <p className="mt-9 border-t border-h-line pt-6 text-[14.5px] text-h-fg-2">
                        Rather talk it through? Call{' '}
                        <a
                            href="tel:+12155550142"
                            className="font-medium text-h-fg tabular-nums"
                        >
                            (215) 555-0142
                        </a>{' '}
                        or visit any office.
                    </p>
                </div>

                {submitted ? (
                    <div
                        role="status"
                        className="grid justify-items-center gap-3 rounded-[20px] bg-h-surface p-10 text-center shadow-h-card"
                    >
                        <span className="grid size-12 place-items-center rounded-full bg-h-accent-soft text-h-accent-fg">
                            <CheckCircle2 className="size-6" />
                        </span>
                        <h3 className="text-xl font-medium">
                            Quote request received
                        </h3>
                        <p className="text-[15px] text-h-fg-2">
                            Thanks, {firstName}! A preparer will follow up
                            within one business day.
                        </p>
                        <button
                            type="button"
                            onClick={startOver}
                            className={homeButtonClass('secondary', 'mt-3')}
                        >
                            Submit another request
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        noValidate
                        className="grid gap-[18px] rounded-[20px] bg-h-surface p-5 shadow-h-card sm:p-7"
                    >
                        <div className="hidden" aria-hidden="true">
                            <input
                                type="text"
                                name="my_name"
                                tabIndex={-1}
                                autoComplete="off"
                                value={data.my_name}
                                onChange={(e) =>
                                    setData('my_name', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-[7px]">
                            <label
                                htmlFor="home-name"
                                className="text-[13.5px] font-medium"
                            >
                                Full name
                            </label>
                            <input
                                id="home-name"
                                name="name"
                                autoComplete="name"
                                required
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                aria-invalid={!!errors.name}
                                aria-describedby={
                                    errors.name ? 'home-name-error' : undefined
                                }
                                className={inputClass}
                            />
                            <FieldError
                                id="home-name-error"
                                message={errors.name}
                            />
                        </div>
                        <div className="grid gap-3.5 sm:grid-cols-2">
                            <div className="grid content-start gap-[7px]">
                                <label
                                    htmlFor="home-email"
                                    className="text-[13.5px] font-medium"
                                >
                                    Email
                                </label>
                                <input
                                    id="home-email"
                                    name="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    required
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    aria-invalid={!!errors.email}
                                    aria-describedby={
                                        errors.email
                                            ? 'home-email-error'
                                            : undefined
                                    }
                                    className={inputClass}
                                />
                                <FieldError
                                    id="home-email-error"
                                    message={errors.email}
                                />
                            </div>
                            <div className="grid content-start gap-[7px]">
                                <label
                                    htmlFor="home-phone"
                                    className="text-[13.5px] font-medium"
                                >
                                    Phone{' '}
                                    <span className="font-normal text-h-fg-3">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    id="home-phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    aria-invalid={!!errors.phone}
                                    aria-describedby={
                                        errors.phone
                                            ? 'home-phone-error'
                                            : undefined
                                    }
                                    className={inputClass}
                                />
                                <FieldError
                                    id="home-phone-error"
                                    message={errors.phone}
                                />
                            </div>
                        </div>
                        <fieldset className="m-0 min-w-0 border-0 p-0">
                            <legend className="text-[13.5px] font-medium">
                                Which tier interests you?{' '}
                                <span className="font-normal text-h-fg-3">
                                    (optional)
                                </span>
                            </legend>
                            <div className="mt-[7px] grid gap-2 sm:grid-cols-2">
                                {tierOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="relative grid cursor-pointer gap-0.5 rounded-[11px] bg-h-sunken py-3 pr-3.5 pl-10 text-sm font-medium shadow-[inset_0_0_0_1px_var(--h-line)] transition-[box-shadow,background-color] has-checked:bg-h-accent-soft has-checked:shadow-[inset_0_0_0_1.5px_var(--h-accent)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-h-accent"
                                    >
                                        <input
                                            type="radio"
                                            name="tier_interest"
                                            value={option.value}
                                            checked={
                                                data.tier_interest ===
                                                option.value
                                            }
                                            onChange={() =>
                                                setData(
                                                    'tier_interest',
                                                    option.value,
                                                )
                                            }
                                            className="absolute top-3.5 left-3.5 m-0 size-4 accent-h-accent"
                                        />
                                        {option.label}
                                        <small className="text-[12.5px] font-normal text-h-fg-3">
                                            {option.meta}
                                        </small>
                                    </label>
                                ))}
                            </div>
                            <FieldError
                                id="home-tier-error"
                                message={errors.tier_interest}
                            />
                        </fieldset>
                        <div className="grid gap-[7px]">
                            <label
                                htmlFor="home-situation"
                                className="text-[13.5px] font-medium"
                            >
                                Your situation{' '}
                                <span className="font-normal text-h-fg-3">
                                    (optional)
                                </span>
                            </label>
                            <textarea
                                id="home-situation"
                                name="situation"
                                rows={3}
                                placeholder="e.g. W-2 job plus a rental property in Maryland"
                                value={data.situation}
                                onChange={(e) =>
                                    setData('situation', e.target.value)
                                }
                                aria-invalid={!!errors.situation}
                                aria-describedby={
                                    errors.situation
                                        ? 'home-situation-error'
                                        : undefined
                                }
                                className={cn(
                                    inputClass,
                                    'h-[104px] resize-y py-3',
                                )}
                            />
                            <FieldError
                                id="home-situation-error"
                                message={errors.situation}
                            />
                        </div>
                        <div className="mt-1 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                            <small className="inline-flex items-center gap-1.5 text-[13px] text-h-fg-3">
                                <Lock className="size-[15px]" />
                                Never share your SSN here.
                            </small>
                            <button
                                type="submit"
                                disabled={processing}
                                className={homeButtonClass(
                                    'primary',
                                    'h-12 cursor-pointer pr-4',
                                )}
                            >
                                {processing
                                    ? 'Sending…'
                                    : 'Request my free quote'}
                                {!processing && (
                                    <ArrowRight className="size-[15px]" />
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}

/* ───────── FAQ ───────── */

export function HomeFaq({ faqs }: { faqs: FaqItem[] }) {
    return (
        <section aria-labelledby="faq-title" className="pb-20 sm:pb-[120px]">
            <div
                className={cn(
                    container,
                    'grid items-start gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16',
                )}
            >
                <div>
                    <Eyebrow icon={MessageSquare}>FAQ</Eyebrow>
                    <h2
                        id="faq-title"
                        className="mt-5 text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance"
                    >
                        Questions, answered
                    </h2>
                    <p className="mt-4 max-w-[34ch] text-[17px] text-h-fg-2">
                        Filing online, security, and fees — here’s how it works.
                    </p>
                </div>
                <div className="grid gap-2">
                    {faqs.map((faq, i) => (
                        <details
                            key={faq.question}
                            open={i === 0}
                            className="group rounded-2xl bg-h-surface shadow-h-card"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-[18px] text-base font-medium [&::-webkit-details-marker]:hidden">
                                {faq.question}
                                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-h-sunken text-h-fg-2 transition-[rotate,background-color] duration-250 group-open:rotate-45 group-open:bg-h-accent-soft group-open:text-h-accent-fg">
                                    <Plus className="size-[15px]" />
                                </span>
                            </summary>
                            <p className="max-w-[65ch] px-5 pb-5 text-[15px] text-h-fg-2">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ───────── Closing CTA ───────── */

export function HomeFinalCta() {
    return (
        <section
            aria-labelledby="final-title"
            className="home-sky mx-2 rounded-[22px] px-5 py-16 text-center sm:mx-3 sm:rounded-[28px] sm:px-14 sm:py-24"
        >
            <Eyebrow
                icon={ArrowRight}
                className="bg-h-glass shadow-[inset_0_0_0_1px_var(--h-glass-ring)] backdrop-blur-md"
            >
                Start now
            </Eyebrow>
            <h2
                id="final-title"
                className="mx-auto mt-5 max-w-[16ch] text-[clamp(36px,5vw,64px)] leading-none font-medium tracking-[-0.04em] text-balance"
            >
                Same trusted preparers. No waiting room.
            </h2>
            <p className="mx-auto mt-[18px] max-w-[46ch] text-[17px] text-h-fg-2">
                Start online in minutes and track every step of your return in
                your portal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                <HomeLinkButton
                    href={`${contact.url()}#start`}
                    className="h-12 flex-[1_1_100%] pr-4 sm:flex-none"
                >
                    Start my return online
                    <ArrowRight className="size-[15px]" />
                </HomeLinkButton>
                <HomeLinkButton
                    href={`${contact.url()}#consult`}
                    variant="secondary"
                    className="h-12 flex-[1_1_100%] sm:flex-none"
                >
                    Book a free consultation
                </HomeLinkButton>
            </div>
        </section>
    );
}

/* ───────── Footer ───────── */

interface SiteProps {
    footer_blurb?: string;
    compliance?: string;
    offices?: OfficeItem[];
}

export function HomeFooter({ offices }: { offices: OfficeItem[] }) {
    const { props } = usePage<{ site?: SiteProps }>();
    const site = props.site;
    const honeypot = useHoneypotFields();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        ...honeypot,
    });

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
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

    const links = [
        ['Home', home.url()],
        ['Services', services.url()],
        ['Pricing', pricing.url()],
        ['About', about.url()],
        ['Contact', contact.url()],
        ['Client login', login.url()],
    ];

    return (
        <footer className="m-2 rounded-[22px] bg-h-surface px-5 pt-9 pb-6 shadow-h-card sm:m-3 sm:rounded-[28px] sm:px-12 sm:pt-14 sm:pb-7">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
                <div>
                    <Link
                        href={home.url()}
                        className="flex items-center gap-2.5"
                    >
                        <BrandMark />
                        <span className="text-[15px] leading-tight font-semibold">
                            Okojie &amp; Associates, Inc.
                            <small className="block text-xs font-normal text-h-fg-3">
                                Okojie Online
                            </small>
                        </span>
                    </Link>
                    <p className="mt-4 max-w-[36ch] text-[14.5px] text-h-fg-2">
                        {site?.footer_blurb ??
                            'Online filing with a real tax professional who knows Philadelphia and Baltimore. Serving individuals, families, and small businesses for 26+ years.'}
                    </p>
                    <form
                        onSubmit={handleSubscribe}
                        noValidate
                        className="mt-6 flex max-w-[360px] gap-1.5 rounded-[13px] bg-h-sunken p-[5px] shadow-[inset_0_0_0_1px_var(--h-line)] focus-within:shadow-[inset_0_0_0_1.5px_var(--h-accent),0_0_0_4px_var(--h-accent-soft)]"
                    >
                        <div className="hidden" aria-hidden="true">
                            <input
                                type="text"
                                name="my_name"
                                tabIndex={-1}
                                autoComplete="off"
                                value={data.my_name}
                                onChange={(e) =>
                                    setData('my_name', e.target.value)
                                }
                            />
                        </div>
                        <label htmlFor="footer-email" className="sr-only">
                            Email for tax tips and deadline reminders
                        </label>
                        <input
                            id="footer-email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="Your email for deadline reminders"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            aria-invalid={!!errors.email}
                            className="min-w-0 flex-1 bg-transparent px-2.5 text-[14.5px] text-h-fg placeholder:text-h-fg-3 focus-visible:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className={homeButtonClass(
                                'primary',
                                'h-9 cursor-pointer rounded-[10px] px-3.5 text-sm',
                            )}
                        >
                            {processing ? 'Sending…' : 'Subscribe'}
                        </button>
                    </form>
                    {errors.email && (
                        <p className="mt-2 text-xs text-[#e5484d]">
                            {errors.email}
                        </p>
                    )}
                </div>
                <FooterCol title="Explore">
                    {links.map(([label, href]) => (
                        <li key={label}>
                            <Link
                                href={href}
                                className="[@media(hover:hover)]:hover:text-h-accent-fg"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </FooterCol>
                <FooterCol title="Get in touch">
                    <li>
                        <a href="tel:+12155550142" className="tabular-nums">
                            (215) 555-0142
                        </a>
                    </li>
                    <li>
                        <a href="tel:+14105550166" className="tabular-nums">
                            (410) 555-0166
                        </a>
                    </li>
                    <li>
                        <Link href={`${contact.url()}#consult`}>
                            Book a consultation
                        </Link>
                    </li>
                </FooterCol>
                <FooterCol title="Offices">
                    {offices.map((office) => (
                        <li key={office.address}>
                            {office.address}
                            <small className="block text-[13px] text-h-fg-3">
                                {office.city}
                            </small>
                        </li>
                    ))}
                </FooterCol>
            </div>
            <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-h-line pt-[22px] text-[13px] text-h-fg-3">
                <span>
                    © {new Date().getFullYear()} Okojie &amp; Associates, Inc.
                </span>
                <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="size-[15px]" />
                    {site?.compliance ??
                        'IRS Publication 4557 & FTC Safeguards compliant'}
                </span>
                <nav aria-label="Legal" className="flex flex-wrap gap-5">
                    <Link href={privacy.url()}>Privacy policy</Link>
                    <Link href={terms.url()}>Terms of service</Link>
                    <Link href={security.url()}>Security (WISP)</Link>
                </nav>
            </div>
        </footer>
    );
}

function FooterCol({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="mb-4 font-mono text-[11.5px] font-medium tracking-[0.08em] text-h-fg-3 uppercase">
                {title}
            </h3>
            <ul className="grid gap-2.5 text-[14.5px]">{children}</ul>
        </div>
    );
}
