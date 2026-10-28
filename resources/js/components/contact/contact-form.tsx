import { useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    Check,
    CreditCard,
    Lock,
    Phone,
    Sparkles,
    Video,
} from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { Button } from '@/components/primitives';
import { useHoneypotFields } from '@/hooks/use-honeypot';
import { cn } from '@/lib/utils';
import { consult, quote } from '@/routes/leads';
import type { HoneypotSharedProp } from '@/types';
import type { TierItem } from '@/types/marketing';

interface ContactFormProps {
    tiers: TierItem[];
    initialTier?: string;
    referralCode?: string;
    honeypotOverride?: HoneypotSharedProp;
}

export interface ContactFormData {
    name: string;
    phone: string;
    email: string;
    ref: string;
    tier_interest: string;
    situation: string;
    preferred_date: string;
    time_window: string;
    format: string;
    my_name: string;
    valid_from: string;
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }
    return (
        <span className="text-xs font-medium text-danger" role="alert">
            {message}
        </span>
    );
}

export function ContactForm({
    tiers,
    initialTier = '',
    referralCode = '',
    honeypotOverride,
}: ContactFormProps) {
    const todayIso = React.useMemo(
        () => new Date().toISOString().split('T')[0],
        [],
    );

    const honeypot = useHoneypotFields(honeypotOverride);

    // D-03 Option 2 defaults:
    // Quote tier: hybrid (overridden by initialTier or ?tier=)
    // Consult format: video
    // Consult time: any
    // Consult date: empty
    const [tab, setTab] = React.useState<'quote' | 'consult'>(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            const params = new URLSearchParams(window.location.search);
            if (hash === '#consult' || params.get('type') === 'consult') {
                return 'consult';
            }
        }
        return 'quote';
    });

    const form = useForm<ContactFormData>({
        name: '',
        phone: '',
        email: '',
        ref: referralCode || '',
        // Quote tab
        tier_interest: initialTier || 'hybrid',
        situation: '',
        // Consult tab
        preferred_date: '',
        time_window: 'any',
        format: 'video',
        // Honeypot
        my_name: '',
        valid_from: honeypot.valid_from,
    });

    const { data, setData, post, processing, errors, clearErrors, reset } =
        form;

    // Synchronize deep links and URL parameters on mount
    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const hash = window.location.hash;
        const params = new URLSearchParams(window.location.search);
        const queryType = params.get('type');
        const queryTier = params.get('tier');
        const queryRef = params.get('ref');

        if (hash === '#consult' || queryType === 'consult') {
            setTab('consult');
            const el = document.getElementById('start');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (hash === '#start' || queryType === 'quote') {
            setTab('quote');
            const el = document.getElementById('start');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }

        if (queryTier && queryTier !== data.tier_interest) {
            setData('tier_interest', queryTier);
        }

        if (queryRef && queryRef !== data.ref) {
            setData('ref', queryRef);
        }
    }, [data.ref, data.tier_interest, setData]);

    // Handle hash change events (e.g. navigation links clicking #consult or #start)
    React.useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#consult') {
                setTab('consult');
            } else if (window.location.hash === '#start') {
                setTab('quote');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleTabChange = (nextTab: 'quote' | 'consult') => {
        setTab(nextTab);
        clearErrors();
        if (typeof window !== 'undefined') {
            window.history.replaceState(
                null,
                '',
                nextTab === 'consult' ? '#consult' : '#start',
            );
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (tab === 'quote') {
            form.transform((d) => ({
                name: d.name,
                phone: d.phone,
                email: d.email,
                tier_interest: d.tier_interest,
                situation: d.situation,
                ref: d.ref,
                my_name: d.my_name,
                valid_from: d.valid_from,
            }));

            post(quote.url(), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('situation');
                },
            });
        } else {
            form.transform((d) => ({
                name: d.name,
                phone: d.phone,
                email: d.email,
                preferred_date: d.preferred_date,
                time_window: d.time_window,
                format: d.format,
                ref: d.ref,
                my_name: d.my_name,
                valid_from: d.valid_from,
            }));

            post(consult.url(), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('preferred_date');
                },
            });
        }
    };

    const quoteTierOptions = [
        ...tiers.map((t) => ({ value: t.slug, label: t.name })),
        { value: 'not_sure', label: 'Not sure' },
    ];

    return (
        <section
            id="start"
            aria-labelledby="start-t"
            className="scroll-mt-24 pb-16 sm:pb-24"
        >
            <div
                className={cn(
                    container,
                    'grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14',
                )}
            >
                {/* Left Column: Context & Confidence */}
                <div>
                    <Eyebrow icon={Sparkles}>Get started</Eyebrow>
                    <h2
                        id="start-t"
                        className="mt-4.5 text-[clamp(32px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.035em] text-foreground"
                    >
                        Tell us what you need
                    </h2>
                    <p className="mt-3.5 max-w-[40ch] text-[16.5px] leading-relaxed text-muted-foreground">
                        A preparer will follow up within one business day. No
                        obligation, no pressure.
                    </p>

                    <ul className="mt-6 grid gap-3">
                        <li className="flex items-center gap-3 text-[15px] text-foreground">
                            <span className="text-accent-text grid size-7 shrink-0 place-items-center rounded-lg bg-card shadow-chip">
                                <Check className="size-3.5" />
                            </span>
                            <span>A real preparer reviews your situation</span>
                        </li>
                        <li className="flex items-center gap-3 text-[15px] text-foreground">
                            <span className="text-accent-text grid size-7 shrink-0 place-items-center rounded-lg bg-card shadow-chip">
                                <Lock className="size-3.5" />
                            </span>
                            <span>Your information stays private</span>
                        </li>
                        <li className="flex items-center gap-3 text-[15px] text-foreground">
                            <span className="text-accent-text grid size-7 shrink-0 place-items-center rounded-lg bg-card shadow-chip">
                                <CreditCard className="size-3.5" />
                            </span>
                            <span>
                                You see your price before anything is filed
                            </span>
                        </li>
                    </ul>

                    {data.ref && (
                        <p className="mt-6 rounded-[10px] bg-sunken p-3 text-[13.5px] text-muted-foreground shadow-[inset_0_0_0_1px_var(--color-border)]">
                            Applying referral code{' '}
                            <span className="font-mono font-medium text-foreground">
                                {data.ref}
                            </span>
                        </p>
                    )}
                </div>

                {/* Right Column: Unified Form Card */}
                <div className="rounded-2xl bg-card p-2 shadow-card sm:p-2.5">
                    <div className="p-4 sm:p-6">
                        {/* Segmented Switcher */}
                        <div
                            className="mb-5 inline-flex w-full overflow-x-auto rounded-[11px] bg-sunken p-[3px] shadow-[inset_0_0_0_1px_var(--color-border)]"
                            role="tablist"
                            aria-label="Request type"
                        >
                            <button
                                type="button"
                                role="tab"
                                id="tab-quote"
                                aria-selected={tab === 'quote'}
                                aria-controls="panel-quote"
                                onClick={() => handleTabChange('quote')}
                                className={cn(
                                    'inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-[13.5px] font-medium whitespace-nowrap transition-colors',
                                    tab === 'quote'
                                        ? 'bg-card text-foreground shadow-chip'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <CreditCard className="size-3.5 shrink-0" />
                                Get a free quote
                            </button>
                            <button
                                type="button"
                                role="tab"
                                id="tab-consult"
                                aria-selected={tab === 'consult'}
                                aria-controls="panel-consult"
                                onClick={() => handleTabChange('consult')}
                                className={cn(
                                    'inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-[13.5px] font-medium whitespace-nowrap transition-colors',
                                    tab === 'consult'
                                        ? 'bg-card text-foreground shadow-chip'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <Calendar className="size-3.5 shrink-0" />
                                Book a consultation
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            {/* Honeypot fields */}
                            <input
                                type="text"
                                name="my_name"
                                value={data.my_name}
                                onChange={(e) =>
                                    setData('my_name', e.target.value)
                                }
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete="off"
                            />
                            <input
                                type="hidden"
                                name="valid_from"
                                value={data.valid_from}
                            />

                            {/* Shared: Name & Phone */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <label
                                        htmlFor="contact-name"
                                        className="text-[13.5px] font-medium text-foreground"
                                    >
                                        Full name
                                    </label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        aria-invalid={Boolean(errors.name)}
                                        className="h-[42px] w-full rounded-[10px] bg-sunken px-3 text-[14.5px] text-foreground shadow-[inset_0_0_0_1px_var(--color-border)] transition-all placeholder:text-muted-foreground/60 focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-accent-solid),0_0_0_4px_var(--color-accent-soft)] focus-visible:outline-none aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-danger-text)]"
                                    />
                                    <FieldError message={errors.name} />
                                </div>

                                <div className="grid gap-1.5">
                                    <label
                                        htmlFor="contact-phone"
                                        className="text-[13.5px] font-medium text-foreground"
                                    >
                                        Phone{' '}
                                        <span className="font-normal text-muted-foreground">
                                            (optional)
                                        </span>
                                    </label>
                                    <input
                                        id="contact-phone"
                                        name="phone"
                                        type="tel"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        aria-invalid={Boolean(errors.phone)}
                                        className="h-[42px] w-full rounded-[10px] bg-sunken px-3 text-[14.5px] text-foreground shadow-[inset_0_0_0_1px_var(--color-border)] transition-all placeholder:text-muted-foreground/60 focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-accent-solid),0_0_0_4px_var(--color-accent-soft)] focus-visible:outline-none aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-danger-text)]"
                                    />
                                    <FieldError message={errors.phone} />
                                </div>
                            </div>

                            {/* Shared: Email */}
                            <div className="grid gap-1.5">
                                <label
                                    htmlFor="contact-email"
                                    className="text-[13.5px] font-medium text-foreground"
                                >
                                    Email
                                </label>
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    inputMode="email"
                                    autoComplete="email"
                                    required
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    aria-invalid={Boolean(errors.email)}
                                    className="h-[42px] w-full rounded-[10px] bg-sunken px-3 text-[14.5px] text-foreground shadow-[inset_0_0_0_1px_var(--color-border)] transition-all placeholder:text-muted-foreground/60 focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-accent-solid),0_0_0_4px_var(--color-accent-soft)] focus-visible:outline-none aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-danger-text)]"
                                />
                                <FieldError message={errors.email} />
                            </div>

                            {/* Tab 1: Quote Specific Fields */}
                            {tab === 'quote' && (
                                <div
                                    id="panel-quote"
                                    role="tabpanel"
                                    aria-labelledby="tab-quote"
                                >
                                    <fieldset>
                                        <legend className="text-[13.5px] font-medium text-foreground">
                                            Tier you’re interested in{' '}
                                            <span className="font-normal text-muted-foreground">
                                                (optional)
                                            </span>
                                        </legend>
                                        <div className="mt-1.5 grid grid-cols-2 gap-2">
                                            {quoteTierOptions.map((t) => {
                                                const isChecked =
                                                    data.tier_interest ===
                                                    t.value;
                                                return (
                                                    <label
                                                        key={t.value}
                                                        className={cn(
                                                            'relative flex cursor-pointer items-center gap-2 rounded-[10px] p-2.5 text-[13.5px] font-medium shadow-[inset_0_0_0_1px_var(--color-border)] transition-all sm:px-3',
                                                            isChecked
                                                                ? 'bg-accent-soft text-accent-text shadow-[inset_0_0_0_1.5px_var(--color-accent-solid)]'
                                                                : 'hover:bg-surface-sunken bg-sunken text-foreground',
                                                        )}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="tier_interest"
                                                            value={t.value}
                                                            checked={isChecked}
                                                            onChange={() =>
                                                                setData(
                                                                    'tier_interest',
                                                                    t.value,
                                                                )
                                                            }
                                                            className="sr-only"
                                                        />
                                                        <span>{t.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <FieldError
                                            message={errors.tier_interest}
                                        />
                                    </fieldset>

                                    <div className="mt-4 grid gap-1.5">
                                        <label
                                            htmlFor="contact-situation"
                                            className="text-[13.5px] font-medium text-foreground"
                                        >
                                            Your situation{' '}
                                            <span className="font-normal text-muted-foreground">
                                                (optional)
                                            </span>
                                        </label>
                                        <textarea
                                            id="contact-situation"
                                            name="situation"
                                            value={data.situation}
                                            onChange={(e) =>
                                                setData(
                                                    'situation',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. W-2 job plus a rental property in Maryland"
                                            aria-invalid={Boolean(
                                                errors.situation,
                                            )}
                                            className="h-24 w-full resize-y rounded-[10px] bg-sunken px-3 py-2.5 text-[14.5px] text-foreground shadow-[inset_0_0_0_1px_var(--color-border)] transition-all placeholder:text-muted-foreground/60 focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-accent-solid),0_0_0_4px_var(--color-accent-soft)] focus-visible:outline-none aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-danger-text)]"
                                        />
                                        <FieldError
                                            message={errors.situation}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Tab 2: Consultation Specific Fields */}
                            {tab === 'consult' && (
                                <div
                                    id="panel-consult"
                                    role="tabpanel"
                                    aria-labelledby="tab-consult"
                                >
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="grid gap-1.5">
                                            <label
                                                htmlFor="contact-date"
                                                className="text-[13.5px] font-medium text-foreground"
                                            >
                                                Preferred date
                                            </label>
                                            <input
                                                id="contact-date"
                                                name="preferred_date"
                                                type="date"
                                                min={todayIso}
                                                required
                                                value={data.preferred_date}
                                                onChange={(e) =>
                                                    setData(
                                                        'preferred_date',
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={Boolean(
                                                    errors.preferred_date,
                                                )}
                                                className="h-[42px] w-full rounded-[10px] bg-sunken px-3 text-[14.5px] text-foreground shadow-[inset_0_0_0_1px_var(--color-border)] transition-all focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-accent-solid),0_0_0_4px_var(--color-accent-soft)] focus-visible:outline-none aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-danger-text)]"
                                            />
                                            <FieldError
                                                message={errors.preferred_date}
                                            />
                                        </div>

                                        <div className="grid gap-1.5">
                                            <label
                                                htmlFor="contact-time"
                                                className="text-[13.5px] font-medium text-foreground"
                                            >
                                                Time
                                            </label>
                                            <select
                                                id="contact-time"
                                                name="time_window"
                                                value={data.time_window}
                                                onChange={(e) =>
                                                    setData(
                                                        'time_window',
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={Boolean(
                                                    errors.time_window,
                                                )}
                                                className="h-[42px] w-full cursor-pointer rounded-[10px] bg-sunken px-3 text-[14.5px] text-foreground shadow-[inset_0_0_0_1px_var(--color-border)] transition-all focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-accent-solid),0_0_0_4px_var(--color-accent-soft)] focus-visible:outline-none aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-danger-text)]"
                                            >
                                                <option value="any">
                                                    Any time
                                                </option>
                                                <option value="morning">
                                                    Morning (9am–12pm)
                                                </option>
                                                <option value="afternoon">
                                                    Afternoon (12pm–4pm)
                                                </option>
                                                <option value="evening">
                                                    Evening (4pm–6pm)
                                                </option>
                                            </select>
                                            <FieldError
                                                message={errors.time_window}
                                            />
                                        </div>
                                    </div>

                                    <fieldset className="mt-4">
                                        <legend className="text-[13.5px] font-medium text-foreground">
                                            Format
                                        </legend>
                                        <div className="mt-1.5 grid grid-cols-3 gap-2">
                                            {[
                                                {
                                                    value: 'video',
                                                    label: 'Video',
                                                    icon: Video,
                                                },
                                                {
                                                    value: 'phone',
                                                    label: 'Phone',
                                                    icon: Phone,
                                                },
                                                {
                                                    value: 'in_person',
                                                    label: 'In person',
                                                    icon: Building2,
                                                },
                                            ].map((f) => {
                                                const Icon = f.icon;
                                                const isChecked =
                                                    data.format === f.value;
                                                return (
                                                    <label
                                                        key={f.value}
                                                        className={cn(
                                                            'relative flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] p-2.5 text-[13.5px] font-medium shadow-[inset_0_0_0_1px_var(--color-border)] transition-all',
                                                            isChecked
                                                                ? 'bg-accent-soft text-accent-text shadow-[inset_0_0_0_1.5px_var(--color-accent-solid)]'
                                                                : 'hover:bg-surface-sunken bg-sunken text-foreground',
                                                        )}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="format"
                                                            value={f.value}
                                                            checked={isChecked}
                                                            onChange={() =>
                                                                setData(
                                                                    'format',
                                                                    f.value,
                                                                )
                                                            }
                                                            className="sr-only"
                                                        />
                                                        <Icon className="size-3.5 shrink-0" />
                                                        <span>{f.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <FieldError message={errors.format} />
                                    </fieldset>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2">
                                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Lock className="size-3.5 shrink-0" />
                                    Never share your SSN here.
                                </span>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={processing}
                                    className="h-11 rounded-xl px-5 font-medium"
                                >
                                    {tab === 'quote'
                                        ? 'Request my free quote'
                                        : 'Request a consultation'}
                                    <ArrowRight className="size-4" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
