import { Head, Link, router } from '@inertiajs/react';
import { Check, CreditCard, FileText, Gift, PenLine } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { PortalLayout } from '@/layouts/portal-layout';
import { cn } from '@/lib/utils';
import { documents, referrals, sign } from '@/routes/portal';
import {
    checkout as invoiceCheckout,
    receipt as invoiceReceipt,
} from '@/routes/portal/invoices';

interface TaxReturnData {
    id: string;
    tax_year: number;
    status: string;
    status_label: string;
    next_step_text: string;
    tier: string | null;
    signed_at: string | null;
    filed_at: string | null;
}

interface InvoiceData {
    id: string;
    amount_cents: number | null;
    amount_formatted: string | null;
    currency: string;
    status: string;
    paid_at: string | null;
}

interface CountsData {
    documents: number;
    referrals: number;
}

interface OverviewProps {
    taxReturn: TaxReturnData | null;
    invoice: InvoiceData | null;
    counts: CountsData;
}

const STAGES = [
    { key: 'intake_received', label: 'Intake received' },
    { key: 'in_preparation', label: 'In preparation' },
    { key: 'ready_for_review', label: 'Ready for review' },
    { key: 'e_signed', label: 'E-signed' },
    { key: 'e_filed', label: 'E-filed' },
];

export default function PortalOverview({
    taxReturn,
    invoice,
    counts,
}: OverviewProps) {
    const currentStatus = taxReturn?.status ?? 'intake_received';
    const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);
    const activeIndex = currentIndex !== -1 ? currentIndex : 0;

    const nextStepMessage =
        taxReturn?.next_step_text ||
        "We're moving to: In preparation. We'll keep you posted here.";

    const formattedAmount =
        invoice?.amount_formatted ||
        (invoice?.amount_cents !== null && invoice?.amount_cents !== undefined
            ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
              }).format(invoice.amount_cents / 100)
            : null);

    const isPaid = invoice?.status === 'paid';
    const isAwaitingQuote = !invoice || invoice.amount_cents === null;

    return (
        <PortalLayout>
            <Head title="Client Portal — Overview | Okojie Online" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Left 2/3: Return Status Card with Stepper and NextStepBox */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    Your return status
                                </h2>
                                <p className="mt-0.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Tax Year{' '}
                                    {taxReturn?.tax_year ??
                                        new Date().getFullYear()}
                                </p>
                            </div>
                        </div>

                        {/* Status Stepper */}
                        <div className="relative py-2">
                            <div className="space-y-5">
                                {STAGES.map((stage, idx) => {
                                    const isCompleted = idx <= activeIndex;
                                    const isLast = idx === STAGES.length - 1;

                                    return (
                                        <div
                                            key={stage.key}
                                            className="relative flex items-center gap-4"
                                        >
                                            {/* Vertical connector line */}
                                            {!isLast && (
                                                <div
                                                    className={cn(
                                                        'absolute top-[26px] left-[11px] h-[calc(100%+8px)] w-[2px]',
                                                        idx < activeIndex
                                                            ? 'bg-primary'
                                                            : 'bg-border',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            )}

                                            {/* Stepper Node */}
                                            <div
                                                className={cn(
                                                    'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors',
                                                    isCompleted
                                                        ? 'bg-primary/15 text-primary ring-2 ring-primary'
                                                        : 'border-2 border-border-strong bg-transparent',
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                                ) : (
                                                    <span className="sr-only">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>

                                            {/* Label */}
                                            <span
                                                className={cn(
                                                    'text-base transition-colors',
                                                    isCompleted
                                                        ? 'font-semibold text-foreground'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                {stage.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Next Step Box */}
                        <div className="mt-8 rounded-[14px] border border-border bg-secondary/50 p-4 sm:p-5">
                            <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                                NEXT STEP
                            </p>
                            <p className="mt-1.5 text-sm font-medium text-foreground sm:text-base">
                                {nextStepMessage}
                            </p>
                            {currentStatus === 'ready_for_review' &&
                                taxReturn && (
                                    <div className="mt-4">
                                        <Button
                                            asChild
                                            className="rounded-full shadow-sm"
                                        >
                                            <Link
                                                href={sign.url({
                                                    taxReturn: taxReturn.id,
                                                })}
                                            >
                                                <PenLine className="mr-2 size-4" />
                                                Review & E-Sign Return
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {/* Right 1/3: Invoice Card & Stat Tiles */}
                <div className="space-y-6">
                    {/* Invoice Card */}
                    <div className="rounded-[18px] border border-border bg-card p-6 sm:p-7">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    Invoice
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Your fee for your return.
                                </p>
                            </div>
                        </div>

                        <div className="my-6">
                            {isAwaitingQuote ? (
                                <div>
                                    <span className="text-2xl font-semibold text-muted-foreground">
                                        Awaiting quote
                                    </span>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Your preparer will review your files and
                                        set your fee before filing.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                                        {formattedAmount}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            {isPaid ? (
                                <Link
                                    href={
                                        invoice
                                            ? invoiceReceipt.url({
                                                  invoice: invoice.id,
                                              })
                                            : '#'
                                    }
                                    className="flex w-full items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 py-3 text-sm font-semibold text-emerald-500 transition-colors hover:bg-emerald-500/20"
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Paid ✓ · View receipt
                                </Link>
                            ) : isAwaitingQuote ? (
                                <Button
                                    disabled
                                    className="w-full cursor-not-allowed rounded-full py-5 text-sm font-semibold opacity-50"
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Awaiting quote
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        if (!invoice) return;
                                        router.post(
                                            invoiceCheckout.url({
                                                invoice: invoice.id,
                                            }),
                                        );
                                    }}
                                    className="w-full rounded-full py-5 text-sm font-semibold"
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Pay Now
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Two Stat Tiles */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href={documents.url()}
                            className="group block rounded-[18px] border border-border bg-card p-5 transition hover:border-primary/50 sm:p-6"
                        >
                            <FileText className="h-6 w-6 text-primary" />
                            <div className="mt-3">
                                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">
                                    {counts.documents}
                                </p>
                                <p className="mt-0.5 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                                    Documents
                                </p>
                            </div>
                        </Link>

                        <Link
                            href={referrals.url()}
                            className="group block rounded-[18px] border border-border bg-card p-5 transition hover:border-primary/50 sm:p-6"
                        >
                            <Gift className="h-6 w-6 text-primary" />
                            <div className="mt-3">
                                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">
                                    {counts.referrals}
                                </p>
                                <p className="mt-0.5 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                                    Referrals
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
