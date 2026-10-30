import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Check,
    CreditCard,
    FileText,
    Gift,
    Hourglass,
    Lock,
    MapPin,
    MessageSquare,
    PenLine,
    Phone,
    Receipt,
    Send,
    Sparkles,
    Upload,
    Video,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import {
    Button,
    CalendarTile,
    Chip,
    EmptyState,
    FileBadge,
    Inner,
    Metric,
    MetricStrip,
    NextStepCard,
    ReturnStepper,
    Row,
    RowList,
    Shell,
    ShellHead,
    StatusLabel,
} from '@/components/primitives';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import {
    appointments as portalAppointments,
    documents as portalDocuments,
    messages as portalMessages,
    referrals as portalReferrals,
    sign as portalSign,
} from '@/routes/portal';
import {
    checkout as invoiceCheckout,
    receipt as invoiceReceipt,
} from '@/routes/portal/invoices';
import type { SharedData } from '@/types';

export type ReturnStatusKey =
    | 'intake_received'
    | 'in_preparation'
    | 'ready_for_review'
    | 'e_signed'
    | 'e_filed';

export interface TaxReturnData {
    id: string;
    tax_year: number;
    status: ReturnStatusKey;
    status_label: string;
    next_step_text: string;
    next_step: {
        key: ReturnStatusKey;
        title: string;
        text: string;
        cta: {
            label: string;
            target: 'documents' | 'messages' | 'sign';
        } | null;
        tone: 'default' | 'action' | 'done';
    };
    tier: 'upload_and_go' | 'hybrid' | 'premium_remote' | null;
    signed_at: string | null;
    filed_at: string | null;
}

export interface InvoiceData {
    id: string;
    amount_cents: number | null;
    amount_formatted: string | null;
    currency: string;
    status: 'draft' | 'open' | 'paid' | 'void';
    paid_at: string | null;
    receipt_number: string | null;
    payment_method: {
        brand: string;
        last4: string;
    } | null;
}

export interface CountsData {
    documents: number;
    referrals: number;
}

export interface AppointmentData {
    id: string;
    preferred_date: string;
    preferred_date_formatted: string;
    preferred_date_full: string;
    time_window: string;
    time_window_label: string;
    format: 'video' | 'phone' | 'in_person';
    format_label: string;
    topic: string | null;
    notes: string | null;
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
    status_label: string;
    confirmed_at: string | null;
    scheduled_at: string | null;
    scheduled_at_formatted: string | null;
    join_url: string | null;
    created_at: string | null;
    created_at_formatted: string | null;
    can_cancel: boolean;
}

export interface DocumentData {
    id: string;
    type: string;
    type_label: string;
    filename: string;
    mime: string;
    size_bytes: number;
    size_formatted: string;
    scan_status: 'clean' | 'pending' | 'flagged';
    scan_status_label: string;
    created_at: string | null;
    created_at_formatted: string | null;
    download_url: string;
}

export interface StageDatesData {
    intake_received: string | null;
    in_preparation: string | null;
    ready_for_review: string | null;
    e_signed: string | null;
    e_filed: string | null;
}

export interface OverviewProps {
    taxReturn: TaxReturnData | null;
    invoice: InvoiceData | null;
    counts: CountsData;
    unreadMessages: number;
    nextAppointment: AppointmentData | null;
    recentDocuments: DocumentData[];
    stageDates: StageDatesData;
}

const STAGE_KEYS: ReturnStatusKey[] = [
    'intake_received',
    'in_preparation',
    'ready_for_review',
    'e_signed',
    'e_filed',
];

const STAGE_LABELS: Record<ReturnStatusKey, string> = {
    intake_received: 'Intake received',
    in_preparation: 'In preparation',
    ready_for_review: 'Ready for review',
    e_signed: 'E-signed',
    e_filed: 'E-filed',
};

function formatShortDate(isoString: string | null): string | null {
    if (!isoString) {
        return null;
    }
    try {
        const date = new Date(isoString);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
        });
    } catch {
        return null;
    }
}

function getNextStepIcon(
    statusKey: ReturnStatusKey,
    tone: 'default' | 'action' | 'done',
) {
    if (tone === 'action') {
        return <PenLine className="size-[18px]" strokeWidth={2} />;
    }
    if (tone === 'done') {
        return <Check className="size-[18px]" strokeWidth={2.4} />;
    }

    switch (statusKey) {
        case 'intake_received':
            return <Upload className="size-[18px]" strokeWidth={2} />;
        case 'in_preparation':
            return <Hourglass className="size-[18px]" strokeWidth={2} />;
        case 'e_signed':
            return <Send className="size-[18px]" strokeWidth={2} />;
        default:
            return <Sparkles className="size-[18px]" strokeWidth={2} />;
    }
}

export default function PortalOverview({
    taxReturn,
    invoice,
    counts,
    unreadMessages,
    nextAppointment,
    recentDocuments,
    stageDates,
}: OverviewProps) {
    const page = usePage<Partial<SharedData>>();
    const authUser = page.props.auth?.user ?? null;
    const [isCheckingOut, setIsCheckingOut] = React.useState(false);

    // Client first name for personalized greeting
    const firstName = React.useMemo(() => {
        if (!authUser?.name) {
            return 'there';
        }
        return authUser.name.trim().split(/\s+/)[0] || 'there';
    }, [authUser]);

    // Handle incoming payment status redirect reactions
    React.useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const paymentResult = urlParams.get('payment');

        if (paymentResult === 'success') {
            toast.success('Payment received! Thank you for your payment.');
            urlParams.delete('payment');
            const cleanSearch = urlParams.toString();
            const cleanUrl =
                window.location.pathname +
                (cleanSearch ? `?${cleanSearch}` : '');
            window.history.replaceState({}, '', cleanUrl);
        } else if (paymentResult === 'cancelled') {
            toast.info(
                'Payment was cancelled. You can complete checkout whenever you’re ready.',
            );
            urlParams.delete('payment');
            const cleanSearch = urlParams.toString();
            const cleanUrl =
                window.location.pathname +
                (cleanSearch ? `?${cleanSearch}` : '');
            window.history.replaceState({}, '', cleanUrl);
        }
    }, []);

    // Active stepper index calculation (0 to 4)
    const currentStatus: ReturnStatusKey =
        taxReturn?.status ?? 'intake_received';
    const activeIndex = React.useMemo(() => {
        const found = STAGE_KEYS.indexOf(currentStatus);
        return found !== -1 ? found : 0;
    }, [currentStatus]);

    // Build the 5 stepper stages with formatted dates
    const stepperStages = React.useMemo(() => {
        return STAGE_KEYS.map((key, idx) => {
            const rawDate = stageDates[key];
            const formattedDate = formatShortDate(rawDate);

            let displayDate: string | null = null;
            if (idx < activeIndex) {
                displayDate = formattedDate;
            } else if (idx === activeIndex) {
                if (activeIndex === 4) {
                    displayDate = formattedDate ?? 'Filed';
                } else {
                    displayDate = 'Now';
                }
            }

            return {
                key,
                label: STAGE_LABELS[key],
                date: displayDate,
            };
        });
    }, [activeIndex, stageDates]);

    // Resolved next step data
    const nextStep = React.useMemo(() => {
        if (taxReturn?.next_step) {
            return taxReturn.next_step;
        }

        return {
            key: 'intake_received' as const,
            title: 'We have your intake',
            text: "A preparer will look over your details within one business day. Upload anything that's missing so we can start sooner.",
            cta: {
                label: 'Upload documents',
                target: 'documents' as const,
            },
            tone: 'default' as const,
        };
    }, [taxReturn]);

    // Resolve CTA URL based on target
    const ctaUrl = React.useMemo(() => {
        if (!nextStep.cta) {
            return null;
        }
        if (nextStep.cta.target === 'sign') {
            return taxReturn
                ? portalSign.url({ taxReturn: taxReturn.id })
                : portalDocuments.url();
        }
        if (nextStep.cta.target === 'messages') {
            return portalMessages.url();
        }
        return portalDocuments.url();
    }, [nextStep.cta, taxReturn]);

    // Eyebrow based on tone
    const nextStepEyebrow =
        nextStep.tone === 'action'
            ? 'Action needed'
            : nextStep.tone === 'done'
              ? 'All done'
              : 'What happens next';

    // Fee state resolution
    const isPaid = invoice?.status === 'paid';
    const isAwaitingQuote = !invoice || invoice.amount_cents === null;
    const formattedAmount =
        invoice?.amount_formatted ??
        (invoice?.amount_cents !== null && invoice?.amount_cents !== undefined
            ? `$${Math.round(invoice.amount_cents / 100)}`
            : null);

    const paidDateFormatted = React.useMemo(() => {
        if (!invoice?.paid_at) {
            return null;
        }
        return formatShortDate(invoice.paid_at);
    }, [invoice?.paid_at]);

    const handleCheckout = () => {
        if (!invoice || isCheckingOut) {
            return;
        }
        setIsCheckingOut(true);
        router.post(
            invoiceCheckout.url({ invoice: invoice.id }),
            {},
            {
                onFinish: () => setIsCheckingOut(false),
            },
        );
    };

    // Subhead text
    const taxYear = taxReturn?.tax_year ?? new Date().getFullYear();
    const tierLabel =
        authUser?.tierLabel ?? (taxReturn?.tier ? 'Hybrid' : null);

    // Appointment date parsing for CalendarTile
    const appointmentCalendar = React.useMemo(() => {
        if (!nextAppointment) {
            return null;
        }
        try {
            const dateStr =
                nextAppointment.scheduled_at ??
                `${nextAppointment.preferred_date}T12:00:00Z`;
            const date = new Date(dateStr);
            if (Number.isNaN(date.getTime())) {
                return null;
            }
            return {
                month: date.toLocaleDateString('en-US', {
                    month: 'short',
                    timeZone: 'UTC',
                }),
                day: date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    timeZone: 'UTC',
                }),
            };
        } catch {
            return null;
        }
    }, [nextAppointment]);

    // Format icon for appointment
    const appointmentFormatIcon = React.useMemo(() => {
        if (!nextAppointment) {
            return null;
        }
        if (nextAppointment.format === 'video') {
            return <Video className="size-3.5 text-fg-3" />;
        }
        if (nextAppointment.format === 'phone') {
            return <Phone className="size-3.5 text-fg-3" />;
        }
        return <MapPin className="size-3.5 text-fg-3" />;
    }, [nextAppointment]);

    // Documents context calculation
    const documentsContext = React.useMemo(() => {
        if (counts.documents === 0) {
            return 'No data yet';
        }
        if (recentDocuments.length > 0) {
            const pendingCount = recentDocuments.filter(
                (d) => d.scan_status === 'pending',
            ).length;
            const cleanCount = recentDocuments.filter(
                (d) => d.scan_status === 'clean',
            ).length;

            if (pendingCount > 0) {
                return `${cleanCount} clean · ${pendingCount} scanning`;
            }
        }
        return `${counts.documents} uploaded`;
    }, [counts.documents, recentDocuments]);

    return (
        <AppShellLayout
            area="portal"
            activeKey="overview"
            headTitle="Client Portal — Overview | Okojie Online"
            eyebrow="Overview"
            title={`Welcome back, ${firstName}`}
            sub={
                <>
                    {tierLabel && <Chip tone="accent">{tierLabel}</Chip>}
                    <span>{taxYear} federal + PA return</span>
                </>
            }
            actions={
                <>
                    <Button variant="secondary" asChild>
                        <Link href={portalAppointments.url()}>
                            <Calendar className="mr-2 size-4" />
                            Book a call
                        </Link>
                    </Button>
                    <Button variant="primary" asChild>
                        <Link href={portalDocuments.url()}>
                            <Upload className="mr-2 size-4" />
                            Upload documents
                        </Link>
                    </Button>
                </>
            }
        >
            <Head>
                <title>Client Portal — Overview | Okojie Online</title>
            </Head>

            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,340px)] items-start gap-4 max-shell:grid-cols-1">
                {/* Left Column: Return Status, Metrics Strip, Recent Documents */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Return Status Card */}
                    <Shell aria-labelledby="status-title">
                        <ShellHead
                            headingId="status-title"
                            icon={<FileText className="size-[18px]" />}
                            title="Your return"
                            right={
                                <span className="font-mono text-[11px] tracking-[0.06em] text-fg-3 uppercase">
                                    Tax year {taxYear}
                                </span>
                            }
                        />
                        <Inner className="space-y-5">
                            <ReturnStepper
                                id="stepper"
                                steps={stepperStages}
                                currentIndex={activeIndex}
                            />

                            <NextStepCard
                                id="next"
                                tone={nextStep.tone}
                                icon={getNextStepIcon(
                                    nextStep.key,
                                    nextStep.tone,
                                )}
                                eyebrow={nextStepEyebrow}
                                title={nextStep.title}
                                body={nextStep.text}
                                action={
                                    nextStep.cta && ctaUrl ? (
                                        <Button
                                            variant={
                                                nextStep.tone === 'action'
                                                    ? 'primary'
                                                    : 'secondary'
                                            }
                                            asChild
                                        >
                                            <Link href={ctaUrl}>
                                                {nextStep.cta.label}
                                                {nextStep.tone === 'action' && (
                                                    <ArrowRight className="ml-1.5 size-4" />
                                                )}
                                            </Link>
                                        </Button>
                                    ) : null
                                }
                            />
                        </Inner>
                    </Shell>

                    {/* Metrics Strip */}
                    <Shell aria-label="At a glance">
                        <MetricStrip columns={4}>
                            <Metric
                                label="Documents"
                                icon={<FileText className="size-4" />}
                                tone="indigo"
                                value={counts.documents}
                                context={documentsContext}
                                href={portalDocuments.url()}
                            />
                            <Metric
                                label="Messages"
                                icon={<MessageSquare className="size-4" />}
                                tone="green"
                                value={unreadMessages}
                                hot={unreadMessages > 0}
                                context={
                                    unreadMessages > 0
                                        ? 'Unread from your preparer'
                                        : 'All caught up'
                                }
                                href={portalMessages.url()}
                            />
                            <Metric
                                label="Next call"
                                icon={<Calendar className="size-4" />}
                                tone="amber"
                                value={
                                    nextAppointment
                                        ? nextAppointment.scheduled_at_formatted
                                              ?.split('·')[0]
                                              ?.trim() ||
                                          nextAppointment.preferred_date_formatted
                                        : 'None booked'
                                }
                                valueSize="sm"
                                context={
                                    nextAppointment
                                        ? `${nextAppointment.scheduled_at_formatted?.split('·')[1]?.trim() || nextAppointment.time_window_label} · ${nextAppointment.format_label}`
                                        : 'No data yet'
                                }
                                href={portalAppointments.url()}
                            />
                            <Metric
                                label="Referrals"
                                icon={<Gift className="size-4" />}
                                tone="rose"
                                value={counts.referrals}
                                context="Earn $25–$50 each"
                                href={portalReferrals.url()}
                            />
                        </MetricStrip>
                    </Shell>

                    {/* Recent Documents */}
                    <Shell aria-labelledby="docs-title">
                        <ShellHead
                            headingId="docs-title"
                            icon={<Upload className="size-[18px]" />}
                            title="Recent documents"
                            right={
                                recentDocuments.length > 0 ? (
                                    <Link
                                        href={portalDocuments.url()}
                                        className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
                                    >
                                        View all
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                ) : null
                            }
                        />

                        {recentDocuments.length > 0 ? (
                            <Inner className="overflow-hidden p-0">
                                <RowList footer="Encrypted and visible only to you and your preparer">
                                    {recentDocuments.map((doc) => {
                                        const ext = doc.filename.includes('.')
                                            ? doc.filename.split('.').pop() ||
                                              'PDF'
                                            : 'FILE';

                                        return (
                                            <Row
                                                key={doc.id}
                                                leading={
                                                    <FileBadge ext={ext} />
                                                }
                                                title={doc.filename}
                                                meta={`${doc.size_formatted} · ${doc.created_at_formatted ?? 'Just now'}`}
                                                status={
                                                    <div className="flex items-center gap-3">
                                                        <Chip tone="neutral">
                                                            {doc.type_label}
                                                        </Chip>
                                                        {doc.scan_status ===
                                                            'clean' && (
                                                            <StatusLabel tone="ok">
                                                                Clean
                                                            </StatusLabel>
                                                        )}
                                                        {doc.scan_status ===
                                                            'pending' && (
                                                            <StatusLabel tone="wait">
                                                                Pending scan
                                                            </StatusLabel>
                                                        )}
                                                        {doc.scan_status ===
                                                            'flagged' && (
                                                            <StatusLabel tone="bad">
                                                                Flagged
                                                            </StatusLabel>
                                                        )}
                                                    </div>
                                                }
                                            />
                                        );
                                    })}
                                </RowList>
                            </Inner>
                        ) : (
                            <Inner variant="flush-empty">
                                <EmptyState
                                    icon={<FileText className="size-5" />}
                                    title="No documents yet"
                                    body="Upload your W-2s, 1099s and ID, and your preparer can start on your return."
                                    actions={
                                        <Button variant="primary" asChild>
                                            <Link href={portalDocuments.url()}>
                                                <Upload className="mr-2 size-4" />
                                                Upload documents
                                            </Link>
                                        </Button>
                                    }
                                />
                            </Inner>
                        )}
                    </Shell>
                </div>

                {/* Right Column: Fee and Appointment Cards */}
                <div className="grid grid-cols-1 gap-4 max-shell:grid-cols-2 max-sm:grid-cols-1">
                    {/* Fee Card */}
                    <Shell aria-labelledby="inv-title">
                        <ShellHead
                            headingId="inv-title"
                            icon={<CreditCard className="size-[18px]" />}
                            title="Your fee"
                            right={
                                isPaid ? (
                                    <Chip tone="success" dot>
                                        Paid
                                    </Chip>
                                ) : isAwaitingQuote ? (
                                    <Chip tone="neutral">Awaiting quote</Chip>
                                ) : (
                                    <Chip tone="warning" dot>
                                        Due
                                    </Chip>
                                )
                            }
                        />
                        <Inner>
                            {isAwaitingQuote ? (
                                <div>
                                    <div className="text-[22px] font-normal tracking-[-0.02em] text-fg-2">
                                        Not set yet
                                    </div>
                                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-3">
                                        Your preparer sets your fee after
                                        reviewing your documents. Hybrid returns
                                        usually cost{' '}
                                        <span className="font-medium text-foreground tabular-nums">
                                            $225–$350
                                        </span>
                                        .
                                    </p>
                                    <div className="my-4 grid gap-2.5 border-t border-border pt-3.5 text-[13.5px]">
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-fg-3">
                                                You pay
                                            </span>
                                            <span className="font-medium text-foreground">
                                                Before we e-file
                                            </span>
                                        </div>
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-fg-3">
                                                Payment
                                            </span>
                                            <span className="font-medium text-foreground">
                                                Card, online
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-fg-3">
                                        You’ll always see the exact price before
                                        we file.
                                    </p>
                                </div>
                            ) : isPaid ? (
                                <div>
                                    <div className="text-[34px] leading-[1.1] font-medium tracking-[-0.035em] text-foreground tabular-nums">
                                        {formattedAmount}
                                    </div>
                                    <p className="mt-1.5 text-[13.5px] text-fg-3">
                                        Paid {paidDateFormatted ?? 'recently'}
                                        {invoice?.payment_method
                                            ? ` · ${invoice.payment_method.brand} ending ${invoice.payment_method.last4}`
                                            : ''}
                                    </p>
                                    <div className="my-4 grid gap-2.5 border-t border-border pt-3.5 text-[13.5px]">
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-fg-3">
                                                Preparation
                                            </span>
                                            <span className="font-medium text-foreground tabular-nums">
                                                {formattedAmount}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-fg-3">
                                                Status
                                            </span>
                                            <span className="font-medium text-foreground">
                                                Paid in full
                                            </span>
                                        </div>
                                    </div>
                                    {invoice && (
                                        <Button
                                            variant="secondary"
                                            className="mt-3.5 w-full"
                                            asChild
                                        >
                                            <Link
                                                href={invoiceReceipt.url({
                                                    invoice: invoice.id,
                                                })}
                                            >
                                                <Receipt className="mr-2 size-4" />
                                                View receipt
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="text-[34px] leading-[1.1] font-medium tracking-[-0.035em] text-foreground tabular-nums">
                                        {formattedAmount}
                                    </div>
                                    <p className="mt-1.5 text-[13.5px] text-fg-3">
                                        {tierLabel ?? 'Hybrid'} · {taxYear}{' '}
                                        federal + PA return
                                    </p>
                                    <div className="my-4 grid gap-2.5 border-t border-border pt-3.5 text-[13.5px]">
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-fg-3">
                                                Preparation
                                            </span>
                                            <span className="font-medium text-foreground tabular-nums">
                                                {formattedAmount}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-fg-3">
                                                Due
                                            </span>
                                            <span className="font-medium text-foreground">
                                                Before we e-file
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="mt-3.5 w-full"
                                        disabled={isCheckingOut}
                                        onClick={handleCheckout}
                                    >
                                        <CreditCard className="mr-2 size-4" />
                                        {isCheckingOut
                                            ? 'Opening checkout…'
                                            : `Pay ${formattedAmount}`}
                                    </Button>
                                    <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[12px] text-fg-3">
                                        <Lock className="size-3.5" />
                                        Secure checkout
                                    </p>
                                </div>
                            )}
                        </Inner>
                    </Shell>

                    {/* Upcoming Call Card */}
                    <Shell aria-labelledby="appt-title">
                        <ShellHead
                            headingId="appt-title"
                            icon={<Calendar className="size-[18px]" />}
                            title="Upcoming call"
                            right={
                                nextAppointment ? (
                                    <Chip
                                        tone={
                                            nextAppointment.status ===
                                            'confirmed'
                                                ? 'success'
                                                : 'neutral'
                                        }
                                        dot={
                                            nextAppointment.status ===
                                            'confirmed'
                                        }
                                    >
                                        {nextAppointment.status_label}
                                    </Chip>
                                ) : null
                            }
                        />

                        {nextAppointment && appointmentCalendar ? (
                            <Inner>
                                <div className="flex items-center gap-3.5">
                                    <CalendarTile
                                        month={appointmentCalendar.month}
                                        day={appointmentCalendar.day}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <b className="block truncate text-[14.5px] font-medium text-foreground">
                                            {nextAppointment.topic ||
                                                'Review call with your preparer'}
                                        </b>
                                        <small className="mt-0.5 flex items-center gap-1.5 truncate text-[13px] text-fg-3">
                                            {appointmentFormatIcon}
                                            <span>
                                                {nextAppointment.format_label} ·{' '}
                                                {nextAppointment.scheduled_at_formatted ??
                                                    `${nextAppointment.preferred_date_formatted} (${nextAppointment.time_window_label})`}
                                            </span>
                                        </small>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    {nextAppointment.join_url && (
                                        <Button
                                            variant="primary"
                                            className="h-9 flex-1 text-[13.5px]"
                                            asChild
                                        >
                                            <a
                                                href={nextAppointment.join_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Join call
                                            </a>
                                        </Button>
                                    )}
                                    <Button
                                        variant="secondary"
                                        className="h-9 flex-1 text-[13.5px]"
                                        asChild
                                    >
                                        <Link href={portalAppointments.url()}>
                                            Reschedule
                                        </Link>
                                    </Button>
                                </div>
                            </Inner>
                        ) : (
                            <Inner variant="flush-empty">
                                <EmptyState
                                    size="sm"
                                    icon={<Calendar className="size-5" />}
                                    title="No calls booked"
                                    body="Talk through your return by video, phone or in person."
                                    actions={
                                        <Button variant="secondary" asChild>
                                            <Link
                                                href={portalAppointments.url()}
                                            >
                                                Book a call
                                            </Link>
                                        </Button>
                                    }
                                />
                            </Inner>
                        )}
                    </Shell>
                </div>
            </div>
        </AppShellLayout>
    );
}
