import {
    ArrowRight,
    Check,
    CheckCircle2,
    Lock,
    Sparkles,
    Users,
} from 'lucide-react';
import * as React from 'react';

import {
    container,
    Eyebrow,
    homeButtonClass,
} from '@/components/home/primitives';
import { useQuoteForm } from '@/hooks/use-quote-form';
import { cn } from '@/lib/utils';
import type { TierItem } from '@/types/marketing';

const inputClass =
    'h-[46px] w-full rounded-[11px] bg-sunken px-3.5 text-[15px] text-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[box-shadow,background-color] placeholder:text-tertiary focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--accent-solid),0_0_0_4px_var(--accent-soft)] focus-visible:outline-none aria-invalid:shadow-[inset_0_0_0_1.5px_var(--danger-solid)]';

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) {
        return null;
    }

    return (
        <span id={id} className="text-danger-fg text-xs" role="alert">
            {message}
        </span>
    );
}

export function HomeIntake({
    tiers,
    initialSubmitted,
}: {
    tiers: TierItem[];
    initialSubmitted?: boolean;
}) {
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
    } = useQuoteForm({ initialSubmitted });

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
                        className="mt-5 text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-foreground"
                    >
                        Start your return online
                    </h2>
                    <p className="mt-4 max-w-[42ch] text-[17px] text-muted-foreground">
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
                                    className="flex items-center gap-3 text-foreground"
                                >
                                    <span className="text-accent-fg grid size-7 place-items-center rounded-lg bg-card shadow-chip">
                                        <I className="size-[15px]" />
                                    </span>
                                    {label as string}
                                </li>
                            );
                        })}
                    </ul>
                    {activeRef && (
                        <p className="mt-6 rounded-[10px] bg-sunken px-3.5 py-3 text-[13.5px] text-muted-foreground">
                            Applying referral code{' '}
                            <span className="text-accent-fg font-mono font-medium">
                                {activeRef}
                            </span>
                        </p>
                    )}
                    <p className="mt-9 border-t border-border pt-6 text-[14.5px] text-muted-foreground">
                        Rather talk it through? Call{' '}
                        <a
                            href="tel:+12155550142"
                            className="hover:text-accent-fg font-medium text-foreground tabular-nums"
                        >
                            (215) 555-0142
                        </a>{' '}
                        or visit any office.
                    </p>
                </div>

                {submitted ? (
                    <div
                        role="status"
                        className="grid justify-items-center gap-3 rounded-[20px] bg-card p-10 text-center shadow-card"
                    >
                        <span className="bg-accent-soft text-accent-fg grid size-12 place-items-center rounded-full">
                            <CheckCircle2 className="size-6" />
                        </span>
                        <h3 className="text-xl font-medium text-foreground">
                            Quote request received
                        </h3>
                        <p className="text-[15px] text-muted-foreground">
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
                        className="grid gap-[18px] rounded-[20px] bg-card p-5 shadow-card sm:p-7"
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
                            <input
                                type="hidden"
                                name="valid_from"
                                value={data.valid_from}
                            />
                        </div>
                        <div className="grid gap-[7px]">
                            <label
                                htmlFor="home-name"
                                className="text-[13.5px] font-medium text-foreground"
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
                                    className="text-[13.5px] font-medium text-foreground"
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
                                    className="text-[13.5px] font-medium text-foreground"
                                >
                                    Phone{' '}
                                    <span className="text-tertiary font-normal">
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
                            <legend className="text-[13.5px] font-medium text-foreground">
                                Which tier interests you?{' '}
                                <span className="text-tertiary font-normal">
                                    (optional)
                                </span>
                            </legend>
                            <div className="mt-[7px] grid gap-2 sm:grid-cols-2">
                                {tierOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className="has-checked:bg-accent-soft has-focus-visible:outline-accent-solid relative grid cursor-pointer gap-0.5 rounded-[11px] bg-sunken py-3 pr-3.5 pl-10 text-sm font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[box-shadow,background-color] has-checked:shadow-[inset_0_0_0_1.5px_var(--accent-solid)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
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
                                            className="accent-accent-solid absolute top-3.5 left-3.5 m-0 size-4"
                                        />
                                        {option.label}
                                        <small className="text-tertiary text-[12.5px] font-normal">
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
                                className="text-[13.5px] font-medium text-foreground"
                            >
                                Your situation{' '}
                                <span className="text-tertiary font-normal">
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
                            <small className="text-tertiary inline-flex items-center gap-1.5 text-[13px]">
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
