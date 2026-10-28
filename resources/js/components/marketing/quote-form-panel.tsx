import { CheckCircle2, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuoteForm } from '@/hooks/use-quote-form';
import { cn } from '@/lib/utils';
import type { TierItem } from '@/types/marketing';

interface QuoteFormPanelProps {
    id?: string;
    variant?: 'default' | 'services';
    initialTier?: string;
    referralCode?: string;
    tiers?: TierItem[];
    className?: string;
}

export function QuoteFormPanel({
    id = 'start',
    variant = 'default',
    initialTier = '',
    referralCode = '',
    tiers = [],
    className,
}: QuoteFormPanelProps) {
    const isServicesVariant = variant === 'services';

    const {
        data,
        setData,
        processing,
        errors,
        submitted,
        startOver,
        activeRef,
        firstName,
        submit: handleSubmit,
    } = useQuoteForm({ initialTier, referralCode });

    return (
        <section id={id} className={cn('scroll-mt-24', className)}>
            <div className="rounded-[18px] border border-border bg-[#181925]/70 p-6 shadow-xl sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* Left Column: Copy & Trust Bullets */}
                    <div className="flex flex-col justify-center lg:col-span-5">
                        <Reveal direction="up">
                            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                {isServicesVariant
                                    ? 'Tier Guidance'
                                    : 'Fast Intake'}
                            </span>
                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                                {isServicesVariant
                                    ? 'Not sure which tier fits?'
                                    : 'Start My Return Online'}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-body sm:text-base">
                                {isServicesVariant
                                    ? 'Send us your situation and a preparer will recommend the right service — no obligation.'
                                    : 'Tell us about your situation and a preparer will follow up within one business day.'}
                            </p>

                            <ul className="mt-8 space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-1 text-primary">
                                        <CheckCircle2 className="size-4" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        No obligation, no pressure
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-1 text-primary">
                                        <UserCheck className="size-4" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        A real preparer reviews your situation
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-1 text-primary">
                                        <ShieldCheck className="size-4" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        Your information stays private and
                                        secure
                                    </span>
                                </li>
                            </ul>

                            {activeRef && (
                                <div className="mt-6 rounded-lg border border-border bg-[#14151f] p-3 text-xs text-muted-foreground">
                                    Applying referral code:{' '}
                                    <span className="font-mono font-semibold text-primary">
                                        {activeRef}
                                    </span>
                                </div>
                            )}
                        </Reveal>
                    </div>

                    {/* Right Column: Interactive Form */}
                    <div className="lg:col-span-7">
                        <Reveal direction="up" delay={80}>
                            {submitted ? (
                                <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center sm:p-10">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                                        <CheckCircle2 className="size-6" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-foreground">
                                        Quote Request Received!
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-body">
                                        Thanks, {firstName}! A preparer will
                                        follow up within one business day.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-6"
                                        onClick={startOver}
                                    >
                                        Submit another request
                                    </Button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    className="flex flex-col gap-4 rounded-xl border border-border bg-[#14151f] p-6 sm:p-8"
                                >
                                    {/* Honeypot field */}
                                    <div className="hidden" aria-hidden="true">
                                        <input
                                            type="text"
                                            name="my_name"
                                            value={data.my_name}
                                            onChange={(e) =>
                                                setData(
                                                    'my_name',
                                                    e.target.value,
                                                )
                                            }
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="quote-name">
                                                Full name{' '}
                                                <span className="text-primary">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="quote-name"
                                                name="name"
                                                placeholder="Marcus Taylor"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={!!errors.name}
                                                className={cn(
                                                    errors.name &&
                                                        'border-destructive focus-visible:ring-destructive',
                                                )}
                                            />
                                            {errors.name && (
                                                <span className="text-xs text-destructive">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="quote-phone">
                                                Phone
                                            </Label>
                                            <Input
                                                id="quote-phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="(215) 555-0142"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={!!errors.phone}
                                                className={cn(
                                                    errors.phone &&
                                                        'border-destructive focus-visible:ring-destructive',
                                                )}
                                            />
                                            {errors.phone && (
                                                <span className="text-xs text-destructive">
                                                    {errors.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="quote-email">
                                                Email{' '}
                                                <span className="text-primary">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="quote-email"
                                                name="email"
                                                type="email"
                                                placeholder="marcus@example.com"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={!!errors.email}
                                                className={cn(
                                                    errors.email &&
                                                        'border-destructive focus-visible:ring-destructive',
                                                )}
                                            />
                                            {errors.email && (
                                                <span className="text-xs text-destructive">
                                                    {errors.email}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="quote-tier">
                                                Service tier interest
                                            </Label>
                                            <Select
                                                value={data.tier_interest}
                                                onValueChange={(val) =>
                                                    setData(
                                                        'tier_interest',
                                                        val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger id="quote-tier">
                                                    <SelectValue placeholder="Select a tier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {tiers.length > 0 ? (
                                                        tiers.map((t) => (
                                                            <SelectItem
                                                                key={t.slug}
                                                                value={t.slug}
                                                            >
                                                                {t.name} (
                                                                {t.price_range})
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <SelectItem value="upload_and_go">
                                                                Upload & Go
                                                                ($150–$225)
                                                            </SelectItem>
                                                            <SelectItem value="hybrid">
                                                                Hybrid
                                                                ($225–$350)
                                                            </SelectItem>
                                                            <SelectItem value="premium_remote">
                                                                Premium Remote
                                                                ($400–$900)
                                                            </SelectItem>
                                                        </>
                                                    )}
                                                    <SelectItem value="not_sure">
                                                        Not sure
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.tier_interest && (
                                                <span className="text-xs text-destructive">
                                                    {errors.tier_interest}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="quote-situation">
                                            Brief situation
                                        </Label>
                                        <Textarea
                                            id="quote-situation"
                                            name="situation"
                                            rows={3}
                                            placeholder="W-2 employee, self-employed, back taxes, etc."
                                            value={data.situation}
                                            onChange={(e) =>
                                                setData(
                                                    'situation',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={!!errors.situation}
                                            className={cn(
                                                errors.situation &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {errors.situation && (
                                            <span className="text-xs text-destructive">
                                                {errors.situation}
                                            </span>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={processing}
                                        fullWidth
                                        className="mt-2"
                                    >
                                        {processing ? (
                                            'Sending…'
                                        ) : (
                                            <>
                                                Request my free quote
                                                <ArrowRight className="ml-2 size-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
