import * as React from 'react';

import { type FixtureState, register } from '@/dev/fixtures';
import type {
    AppointmentData,
    DocumentData,
    InvoiceData,
    OverviewProps,
    ReturnStatusKey,
    StageDatesData,
    TaxReturnData,
} from '@/pages/portal/overview';

// Dynamic lazy import prevents Vite from converting pages/portal/overview into an internal chunk
const PortalOverview = React.lazy(() => import('@/pages/portal/overview'));

const STAGES: ReturnStatusKey[] = [
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

const NEXT_STEPS: Record<ReturnStatusKey, TaxReturnData['next_step']> = {
    intake_received: {
        key: 'intake_received',
        title: 'We have your intake',
        text: "A preparer will look over your details within one business day. Upload anything that's missing so we can start sooner.",
        cta: { label: 'Upload documents', target: 'documents' },
        tone: 'default',
    },
    in_preparation: {
        key: 'in_preparation',
        title: 'Your preparer is working on your return',
        text: "Nothing for you to do right now. We'll message you here as soon as it's ready to review.",
        cta: { label: 'Open messages', target: 'messages' },
        tone: 'default',
    },
    ready_for_review: {
        key: 'ready_for_review',
        title: 'Your return is ready to review',
        text: "Look it over, ask anything you're unsure about, then sign Form 8879 so we can e-file.",
        cta: { label: 'Review and e-sign', target: 'sign' },
        tone: 'action',
    },
    e_signed: {
        key: 'e_signed',
        title: "Signed. We're e-filing your return",
        text: "We'll confirm here as soon as it's filed. You don't need to do anything else.",
        cta: null,
        tone: 'default',
    },
    e_filed: {
        key: 'e_filed',
        title: 'Your return has been e-filed',
        text: 'Thank you for filing with Okojie. Most IRS refunds arrive within about 21 days of e-filing.',
        cta: { label: 'View documents', target: 'documents' },
        tone: 'done',
    },
};

const ALL_STAGE_DATES = [
    '2026-01-28T14:00:00Z',
    '2026-02-02T16:00:00Z',
    '2026-02-11T19:30:00Z',
    '2026-02-12T15:00:00Z',
    '2026-02-13T18:00:00Z',
];

const SAMPLE_DOCUMENTS: DocumentData[] = [
    {
        id: 'doc-1',
        type: 'w2',
        type_label: 'W-2',
        filename: 'W2_2026_TempleUniversity.pdf',
        mime: 'application/pdf',
        size_bytes: 219136,
        size_formatted: '214 KB',
        scan_status: 'clean',
        scan_status_label: 'Clean',
        created_at: '2026-02-02T12:00:00Z',
        created_at_formatted: 'Feb 2',
        download_url: '#',
    },
    {
        id: 'doc-2',
        type: '1099',
        type_label: '1099',
        filename: '1099-INT_PNC.pdf',
        mime: 'application/pdf',
        size_bytes: 90112,
        size_formatted: '88 KB',
        scan_status: 'clean',
        scan_status_label: 'Clean',
        created_at: '2026-02-02T12:05:00Z',
        created_at_formatted: 'Feb 2',
        download_url: '#',
    },
    {
        id: 'doc-3',
        type: 'id',
        type_label: 'ID',
        filename: 'drivers-license-front.jpg',
        mime: 'image/jpeg',
        size_bytes: 1258291,
        size_formatted: '1.2 MB',
        scan_status: 'clean',
        scan_status_label: 'Clean',
        created_at: '2026-02-02T12:10:00Z',
        created_at_formatted: 'Feb 2',
        download_url: '#',
    },
    {
        id: 'doc-4',
        type: 'prior_return',
        type_label: 'Prior return',
        filename: '2025_federal_return.pdf',
        mime: 'application/pdf',
        size_bytes: 655360,
        size_formatted: '640 KB',
        scan_status: 'pending',
        scan_status_label: 'Pending scan',
        created_at: '2026-02-12T14:20:00Z',
        created_at_formatted: 'Just now',
        download_url: '#',
    },
];

const SAMPLE_APPOINTMENT: AppointmentData = {
    id: 'appt-1',
    preferred_date: '2026-02-12',
    preferred_date_formatted: 'Feb 12, 2026',
    preferred_date_full: 'Thursday, February 12, 2026',
    time_window: 'afternoon',
    time_window_label: '4:30 PM',
    format: 'video',
    format_label: 'Video',
    topic: 'Review call with your preparer',
    notes: 'Going over preliminary deductions',
    status: 'confirmed',
    status_label: 'Confirmed',
    confirmed_at: '2026-02-08T10:00:00Z',
    scheduled_at: '2026-02-12T16:30:00Z',
    scheduled_at_formatted: 'Thu, Feb 12 · 4:30 PM',
    join_url: 'https://meet.google.com/xyz-okojie-call',
    created_at: '2026-02-05T09:00:00Z',
    created_at_formatted: 'Feb 5',
    can_cancel: false,
};

function buildFixtureProps(
    stage: ReturnStatusKey,
    feeState: 'quote' | 'open' | 'paid',
    dataState: 'data' | 'empty',
): OverviewProps {
    const stageIndex = STAGES.indexOf(stage);

    const stageDates: StageDatesData = {
        intake_received: stageIndex >= 0 ? ALL_STAGE_DATES[0] : null,
        in_preparation: stageIndex >= 1 ? ALL_STAGE_DATES[1] : null,
        ready_for_review: stageIndex >= 2 ? ALL_STAGE_DATES[2] : null,
        e_signed: stageIndex >= 3 ? ALL_STAGE_DATES[3] : null,
        e_filed: stageIndex >= 4 ? ALL_STAGE_DATES[4] : null,
    };

    const taxReturn: TaxReturnData = {
        id: 'tax-return-test-123',
        tax_year: 2026,
        status: stage,
        status_label: STAGE_LABELS[stage],
        next_step_text: NEXT_STEPS[stage].text,
        next_step: NEXT_STEPS[stage],
        tier: 'hybrid',
        signed_at: stageIndex >= 3 ? ALL_STAGE_DATES[3] : null,
        filed_at: stageIndex >= 4 ? ALL_STAGE_DATES[4] : null,
    };

    let invoice: InvoiceData | null = null;
    if (feeState === 'quote') {
        invoice = {
            id: 'inv-quote-1',
            amount_cents: null,
            amount_formatted: null,
            currency: 'USD',
            status: 'draft',
            paid_at: null,
            receipt_number: null,
            payment_method: null,
        };
    } else if (feeState === 'open') {
        invoice = {
            id: 'inv-open-1',
            amount_cents: 27500,
            amount_formatted: '$275',
            currency: 'USD',
            status: 'open',
            paid_at: null,
            receipt_number: null,
            payment_method: null,
        };
    } else {
        invoice = {
            id: 'inv-paid-1',
            amount_cents: 27500,
            amount_formatted: '$275',
            currency: 'USD',
            status: 'paid',
            paid_at: '2026-02-12T15:00:00Z',
            receipt_number: 'RCPT-2026-00001',
            payment_method: {
                brand: 'Visa',
                last4: '4242',
            },
        };
    }

    if (dataState === 'empty') {
        return {
            taxReturn,
            invoice,
            counts: { documents: 0, referrals: 0 },
            unreadMessages: 0,
            nextAppointment: null,
            recentDocuments: [],
            stageDates,
        };
    }

    return {
        taxReturn,
        invoice,
        counts: { documents: 4, referrals: 2 },
        unreadMessages: 1,
        nextAppointment: SAMPLE_APPOINTMENT,
        recentDocuments: SAMPLE_DOCUMENTS.slice(0, 3),
        stageDates,
    };
}

// Generate the 30 states (5 stages × 3 fee states × 2 data states)
const feeLabels: Record<'quote' | 'open' | 'paid', string> = {
    quote: 'Awaiting quote',
    open: 'Due ($275)',
    paid: 'Paid ($275, Visa)',
};

const fixtureStates: FixtureState[] = [];

for (const stage of STAGES) {
    for (const fee of ['quote', 'open', 'paid'] as const) {
        for (const data of ['data', 'empty'] as const) {
            const label = `${STAGE_LABELS[stage]} · ${feeLabels[fee]} · ${data === 'data' ? 'Data' : 'Empty'}`;
            const props = buildFixtureProps(stage, fee, data);

            fixtureStates.push({
                label,
                render: () => (
                    <React.Suspense fallback={null}>
                        <PortalOverview {...props} />
                    </React.Suspense>
                ),
            });
        }
    }
}

export const portalOverviewPageFixture = register({
    id: 'page-portal-overview',
    title: 'Page: Portal Overview (§3 Matrix — 30 States)',
    states: fixtureStates,
});
