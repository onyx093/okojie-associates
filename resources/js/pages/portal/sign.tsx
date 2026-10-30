import { Head, Link, useForm } from '@inertiajs/react';
import {
    Check,
    Clock,
    CreditCard,
    FileText,
    Lock,
    MessageSquare,
    PenLine,
    Phone,
    Send,
    Shield,
    ShieldCheck,
    Video,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Chip,
    FileBadge,
    Inner,
    Note,
    Shell,
    ShellHead,
} from '@/components/primitives';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import { cn } from '@/lib/utils';
import { appointments, documents, overview } from '@/routes/portal';
import { submit as signSubmit } from '@/routes/portal/sign';

export type ReturnSummaryForm = {
    name: string;
    pages: number;
    document_id: string | null;
    open_url: string | null;
};

export type ReturnSummaryState = {
    code: string;
    name: string;
    result: 'refund' | 'owed' | 'even';
    result_label: string;
    amount_cents: number;
    amount_formatted: string;
} | null;

export type ReturnSummary = {
    federal: {
        result: 'refund' | 'owed' | 'even';
        result_label: string;
        amount_cents: number;
        amount_formatted: string;
    };
    state: ReturnSummaryState;
    bank_last4: string | null;
    filing_status: string;
    filing_status_label: string;
    filing_method: string;
    filing_method_label: string;
    forms: ReturnSummaryForm[];
} | null;

export type SignProps = {
    taxReturn: {
        id: string;
        taxYear: number;
        tier: string | null;
        tierLabel: string;
        status: string;
        statusLabel: string;
        preparerName: string;
    };
    clientName: string;
    clientEmail: string;
    returnSummary?: ReturnSummary;
    form7216ConsentText: string;
    form8879DeclarationText: string;
    signed?: boolean;
};

export default function Sign({
    taxReturn,
    clientName,
    returnSummary = null,
    form7216ConsentText,
    form8879DeclarationText,
    signed = false,
}: SignProps) {
    const isSigned =
        signed ||
        taxReturn.status === 'e_signed' ||
        taxReturn.status === 'e_filed';

    const { data, setData, post, processing, errors } = useForm({
        consent_7216: false,
        typed_signature: '',
    });

    const isSubmitDisabled =
        processing ||
        !data.consent_7216 ||
        data.typed_signature.trim().length <= 3;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitDisabled) {
            return;
        }

        post(signSubmit.url({ taxReturn: taxReturn.id }));
    };

    return (
        <AppShellLayout
            area="portal"
            activeKey="overview"
            headTitle={`Review and e-sign — Tax Year ${taxReturn.taxYear} | Okojie Online`}
            backHref={overview.url()}
            backLabel="Back to overview"
            eyebrow={
                isSigned
                    ? `Step 3 of 5 · Signed`
                    : `Step 3 of 5 · Ready for review`
            }
            title="Review and e-sign your return"
            sub={
                <Chip tone="neutral">
                    <Shield className="size-3.5" />
                    IRS Pub 4557 &amp; 1345 protected
                </Chip>
            }
            actions={
                <Button variant="secondary" asChild>
                    <Link href={appointments.url()}>
                        <Video className="size-4" />
                        Talk it through first
                    </Link>
                </Button>
            }
        >
            <Head title={`Review and e-sign — Tax Year ${taxReturn.taxYear}`} />

            <div
                id="page"
                className="grid grid-cols-[1fr_320px] items-start gap-6 max-lg:grid-cols-1"
            >
                {/* Left Column: Prepared Return & Form / Done Card */}
                <div className="space-y-6">
                    {/* Shell 1: Your prepared return */}
                    <section aria-labelledby="sum-title">
                        <Shell>
                            <ShellHead
                                headingId="sum-title"
                                icon={<FileText className="size-[18px]" />}
                                title="Your prepared return"
                                right={
                                    isSigned ? (
                                        <Chip tone="success" dot>
                                            Signed
                                        </Chip>
                                    ) : (
                                        <Chip tone="accent" dot>
                                            Ready to sign
                                        </Chip>
                                    )
                                }
                            />
                            <Inner>
                                {returnSummary === null ? (
                                    <div className="space-y-4">
                                        <Note tone="neutral">
                                            Your preparer hasn't added the
                                            summary yet
                                        </Note>
                                        <div className="grid gap-2 text-[14px]">
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Taxpayer
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {clientName}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Tax year
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {taxReturn.taxYear}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Prepared by
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {taxReturn.preparerName}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Service tier
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {taxReturn.tierLabel}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Result Tiles */}
                                        <div className="mb-4.5 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
                                            {/* Federal Tile */}
                                            <div className="rounded-[12px] bg-sunken p-4 shadow-[inset_0_0_0_1px_var(--border)]">
                                                <span className="block font-mono text-xs tracking-wider text-fg-3 uppercase">
                                                    {returnSummary.federal
                                                        .result === 'refund'
                                                        ? 'Federal refund'
                                                        : returnSummary.federal
                                                                .result ===
                                                            'owed'
                                                          ? 'Federal tax owed'
                                                          : 'Federal return'}
                                                </span>
                                                <b
                                                    className={cn(
                                                        'mt-1.5 block text-[26px] font-medium tracking-[-0.03em] text-foreground tabular-nums',
                                                        returnSummary.federal
                                                            .result ===
                                                            'refund' &&
                                                            'text-success',
                                                    )}
                                                >
                                                    {
                                                        returnSummary.federal
                                                            .amount_formatted
                                                    }
                                                </b>
                                                <small className="mt-0.5 block text-[12.5px] text-fg-3">
                                                    {returnSummary.bank_last4
                                                        ? `Direct deposit · PNC ••••${returnSummary.bank_last4}`
                                                        : 'Paper check / mail'}
                                                </small>
                                            </div>

                                            {/* State Tile */}
                                            {returnSummary.state ? (
                                                <div className="rounded-[12px] bg-sunken p-4 shadow-[inset_0_0_0_1px_var(--border)]">
                                                    <span className="block font-mono text-xs tracking-wider text-fg-3 uppercase">
                                                        {returnSummary.state
                                                            .result === 'refund'
                                                            ? `${returnSummary.state.name} refund`
                                                            : returnSummary
                                                                    .state
                                                                    .result ===
                                                                'owed'
                                                              ? `${returnSummary.state.name} tax owed`
                                                              : returnSummary
                                                                    .state.name}
                                                    </span>
                                                    <b
                                                        className={cn(
                                                            'mt-1.5 block text-[26px] font-medium tracking-[-0.03em] text-foreground tabular-nums',
                                                            returnSummary.state
                                                                .result ===
                                                                'refund' &&
                                                                'text-success',
                                                        )}
                                                    >
                                                        {
                                                            returnSummary.state
                                                                .amount_formatted
                                                        }
                                                    </b>
                                                    <small className="mt-0.5 block text-[12.5px] text-fg-3">
                                                        {returnSummary.state
                                                            .result === 'even'
                                                            ? 'Nothing owed, no refund'
                                                            : returnSummary.bank_last4
                                                              ? `Direct deposit · ••••${returnSummary.bank_last4}`
                                                              : 'State return'}
                                                    </small>
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Key-Value Breakdown */}
                                        <div className="grid gap-2 text-[14px]">
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Taxpayer
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {clientName}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Tax year
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {taxReturn.taxYear}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Filing status
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {
                                                        returnSummary.filing_status_label
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Filing method
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {
                                                        returnSummary.filing_method_label
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-fg-2">
                                                <span className="text-fg-3">
                                                    Prepared by
                                                </span>
                                                <span className="font-medium text-foreground">
                                                    {taxReturn.preparerName}
                                                </span>
                                            </div>
                                            {returnSummary.bank_last4 ? (
                                                <div className="flex items-center justify-between text-fg-2">
                                                    <span className="text-fg-3">
                                                        Bank account
                                                    </span>
                                                    <span className="font-mono font-medium text-foreground">
                                                        ••••{' '}
                                                        {
                                                            returnSummary.bank_last4
                                                        }
                                                    </span>
                                                </div>
                                            ) : null}
                                        </div>

                                        <Separator className="my-4" />

                                        {/* Forms List */}
                                        <div>
                                            <p className="mb-2 text-xs text-fg-3">
                                                Open each form and check it
                                                before you sign.
                                            </p>
                                            <div className="divide-y divide-border">
                                                {returnSummary.forms.map(
                                                    (form, idx) => (
                                                        <div
                                                            key={`${form.name}-${idx}`}
                                                            className="flex items-center justify-between gap-3 py-2.5"
                                                        >
                                                            <div className="flex min-w-0 items-center gap-2.5">
                                                                <FileBadge ext="PDF" />
                                                                <div className="min-w-0">
                                                                    <b className="block truncate text-[14px] font-medium text-foreground">
                                                                        {
                                                                            form.name
                                                                        }
                                                                    </b>
                                                                    <small className="block text-xs text-fg-3">
                                                                        {
                                                                            form.pages
                                                                        }{' '}
                                                                        {form.pages ===
                                                                        1
                                                                            ? 'page'
                                                                            : 'pages'}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            {form.open_url ? (
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    asChild
                                                                    className="h-8 shrink-0 text-[13px]"
                                                                >
                                                                    <a
                                                                        href={
                                                                            form.open_url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        Open
                                                                    </a>
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    disabled
                                                                    className="h-8 shrink-0 text-[13px]"
                                                                >
                                                                    Open
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Inner>
                        </Shell>
                    </section>

                    {/* Shell 2: Sign Form 8879 or Done Card */}
                    {isSigned ? (
                        <section aria-labelledby="done-title">
                            <Shell>
                                <Inner>
                                    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                                        <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-success-soft text-success shadow-none">
                                            <ShieldCheck className="size-6" />
                                        </span>
                                        <h3
                                            id="done-title"
                                            className="text-[20px] font-medium tracking-[-0.02em] text-foreground"
                                        >
                                            Signed. We’re e-filing your return.
                                        </h3>
                                        <p className="mt-1.5 max-w-[46ch] text-[14px] text-fg-2">
                                            We’ll confirm in your portal as soon
                                            as the IRS accepts it. A copy of
                                            your signed Form 8879 is in
                                            Documents.
                                        </p>
                                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                                            <Button variant="primary" asChild>
                                                <Link href={overview.url()}>
                                                    Back to overview
                                                </Link>
                                            </Button>
                                            <Button variant="secondary" asChild>
                                                <Link href={documents.url()}>
                                                    View documents
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </Inner>
                            </Shell>
                        </section>
                    ) : (
                        <section aria-labelledby="sign-title">
                            <Shell>
                                <ShellHead
                                    headingId="sign-title"
                                    icon={<PenLine className="size-[18px]" />}
                                    title="Sign Form 8879"
                                />
                                <Inner>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                        id="sign-form"
                                    >
                                        {/* Scrollable Focusable Form 8879 Legal Box */}
                                        <div
                                            tabIndex={0}
                                            role="region"
                                            aria-label="Form 8879 declaration"
                                            className="max-h-[220px] overflow-y-auto rounded-[12px] bg-sunken p-4 text-[13.5px] leading-relaxed text-fg-2 shadow-[inset_0_0_0_1px_var(--border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                        >
                                            <h4 className="mb-1.5 text-[13px] font-medium text-foreground">
                                                IRS e-file Signature
                                                Authorization (Form 8879)
                                            </h4>
                                            <div className="space-y-2 whitespace-pre-line text-fg-2">
                                                {form8879DeclarationText}
                                            </div>
                                        </div>

                                        {/* Form 7216 Consent Checkbox */}
                                        <div className="space-y-1.5">
                                            <label
                                                htmlFor="consent_7216"
                                                className="flex cursor-pointer items-start gap-3 select-none"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id="consent_7216"
                                                    name="consent_7216"
                                                    checked={data.consent_7216}
                                                    onChange={(e) =>
                                                        setData(
                                                            'consent_7216',
                                                            e.target.checked,
                                                        )
                                                    }
                                                    className="mt-0.5 size-4.5 rounded border-border-strong text-primary accent-primary"
                                                />
                                                <span className="text-[13.5px] leading-normal text-fg-2">
                                                    <b className="font-medium text-foreground">
                                                        Consent to use my tax
                                                        information (Form 7216).
                                                    </b>{' '}
                                                    {form7216ConsentText}
                                                </span>
                                            </label>
                                            {errors.consent_7216 ? (
                                                <p
                                                    role="alert"
                                                    className="pl-7 text-xs font-medium text-destructive"
                                                >
                                                    {errors.consent_7216}
                                                </p>
                                            ) : null}
                                        </div>

                                        {/* Typed Legal Name Signature Input */}
                                        <div className="space-y-1.5">
                                            <label
                                                htmlFor="typed_signature"
                                                className="block text-[13.5px] font-medium text-foreground"
                                            >
                                                Type your full legal name to
                                                sign
                                            </label>
                                            <Input
                                                id="typed_signature"
                                                name="typed_signature"
                                                autoComplete="name"
                                                placeholder={clientName}
                                                value={data.typed_signature}
                                                onChange={(e) =>
                                                    setData(
                                                        'typed_signature',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-[52px] font-serif text-[18px] tracking-[-0.01em] italic"
                                            />
                                            <p className="text-xs text-fg-3">
                                                By typing your name you declare,
                                                under penalties of perjury, that
                                                you’ve examined this return and
                                                authorize us to e-file it.
                                            </p>
                                            {errors.typed_signature ? (
                                                <p
                                                    role="alert"
                                                    className="text-xs font-medium text-destructive"
                                                >
                                                    {errors.typed_signature}
                                                </p>
                                            ) : null}
                                        </div>

                                        {/* Form Footer & Audit Note */}
                                        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                            <span className="flex items-center gap-1.5 text-[12.5px] text-fg-3">
                                                <Lock className="size-3.5 text-fg-3" />
                                                We record the time, IP address
                                                and browser with your signature.
                                            </span>
                                            <Button
                                                type="submit"
                                                id="sign-btn"
                                                variant="primary"
                                                disabled={isSubmitDisabled}
                                                className="shrink-0"
                                            >
                                                <PenLine className="size-4" />
                                                {processing
                                                    ? 'Signing…'
                                                    : 'Sign and authorize e-file'}
                                            </Button>
                                        </div>
                                    </form>
                                </Inner>
                            </Shell>
                        </section>
                    )}
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-6">
                    {/* After you sign timeline */}
                    <section aria-labelledby="after-title">
                        <Shell>
                            <ShellHead
                                headingId="after-title"
                                icon={<Clock className="size-[18px]" />}
                                title="After you sign"
                            />
                            <Inner>
                                <div className="grid gap-0">
                                    {/* Step 1 */}
                                    <div className="relative flex items-start gap-3 pb-4 after:absolute after:top-[28px] after:bottom-1 after:left-[13px] after:w-[2px] after:bg-border-strong">
                                        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-brand-soft text-primary">
                                            <PenLine className="size-3.5" />
                                        </span>
                                        <div>
                                            <b className="block text-[14px] font-medium text-foreground">
                                                You sign Form 8879
                                            </b>
                                            <small className="block text-[13px] text-fg-3">
                                                Takes about a minute
                                            </small>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="relative flex items-start gap-3 pb-4 after:absolute after:top-[28px] after:bottom-1 after:left-[13px] after:w-[2px] after:bg-border-strong">
                                        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-brand-soft text-primary">
                                            <Send className="size-3.5" />
                                        </span>
                                        <div>
                                            <b className="block text-[14px] font-medium text-foreground">
                                                We e-file
                                            </b>
                                            <small className="block text-[13px] text-fg-3">
                                                Usually the same business day
                                            </small>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="relative flex items-start gap-3 pb-4 after:absolute after:top-[28px] after:bottom-1 after:left-[13px] after:w-[2px] after:bg-border-strong">
                                        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-success-soft text-success">
                                            <Check className="size-3.5" />
                                        </span>
                                        <div>
                                            <b className="block text-[14px] font-medium text-foreground">
                                                IRS accepts
                                            </b>
                                            <small className="block text-[13px] text-fg-3">
                                                We confirm it in your portal
                                            </small>
                                        </div>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="relative flex items-start gap-3">
                                        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-success-soft text-success">
                                            <CreditCard className="size-3.5" />
                                        </span>
                                        <div>
                                            <b className="block text-[14px] font-medium text-foreground">
                                                Refund arrives
                                            </b>
                                            <small className="block text-[13px] text-fg-3">
                                                Most within about 21 days
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </Inner>
                        </Shell>
                    </section>

                    {/* Something look wrong? card */}
                    <section aria-labelledby="q-title">
                        <Shell>
                            <ShellHead
                                headingId="q-title"
                                icon={<MessageSquare className="size-[18px]" />}
                                title="Something look wrong?"
                            />
                            <Inner>
                                <p className="text-[14px] text-fg-2">
                                    Don’t sign yet. Tell your preparer what you
                                    noticed and they’ll fix it first.
                                </p>
                                <Button
                                    variant="secondary"
                                    className="mt-3.5 w-full font-mono font-medium"
                                    asChild
                                >
                                    <a href="tel:+12155550142">
                                        <Phone className="size-4" />
                                        (215) 555-0142
                                    </a>
                                </Button>
                            </Inner>
                        </Shell>
                    </section>
                </div>
            </div>
        </AppShellLayout>
    );
}
