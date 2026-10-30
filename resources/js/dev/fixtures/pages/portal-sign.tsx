import * as React from 'react';

import { register } from '@/dev/fixtures';
import type { SignProps } from '@/pages/portal/sign';

// Dynamic lazy import prevents Vite from converting pages/portal/sign into an internal chunk
const PortalSign = React.lazy(() => import('@/pages/portal/sign'));

const SAMPLE_DECLARATION = `Under penalties of perjury, I declare that I have examined a copy of the income tax return I am now authorizing, including accompanying schedules and statements, and to the best of my knowledge and belief, it is true, correct, and complete.

I authorize Okojie & Associates, Inc., as my electronic return originator, to send my return to the IRS and to receive an acknowledgement of receipt or reason for rejection of the transmission, and the reason for any delay in processing the return or refund.

I am signing this authorization by typing my name below, which serves as my electronic signature.`;

const SAMPLE_CONSENT =
    'I agree that Okojie & Associates may use the information on my return to prepare and file it. This consent is valid for one year.';

const BASE_TAX_RETURN: SignProps['taxReturn'] = {
    id: 'ret-2026',
    taxYear: 2026,
    tier: 'hybrid',
    tierLabel: 'Hybrid Filing',
    status: 'ready_for_review',
    statusLabel: 'Ready for review',
    preparerName: 'Adaeze Okojie, EA',
};

const BASE_RETURN_SUMMARY: NonNullable<SignProps['returnSummary']> = {
    federal: {
        result: 'refund',
        result_label: 'Refund',
        amount_cents: 241800,
        amount_formatted: '$2,418',
    },
    state: {
        code: 'PA',
        name: 'Pennsylvania',
        result: 'even',
        result_label: 'Even ($0)',
        amount_cents: 0,
        amount_formatted: '$0',
    },
    bank_last4: '4471',
    filing_status: 'head_of_household',
    filing_status_label: 'Head of household',
    filing_method: 'e_file',
    filing_method_label: 'IRS e-file',
    forms: [
        {
            name: 'Form 1040 · U.S. Individual Income Tax Return',
            pages: 14,
            document_id: 'doc-1040',
            open_url: '#',
        },
        {
            name: 'PA-40 · Pennsylvania Income Tax Return',
            pages: 4,
            document_id: 'doc-pa40',
            open_url: '#',
        },
    ],
};

register({
    id: 'page-portal-sign',
    title: 'Portal / Review & E-Sign',
    states: [
        {
            label: 'Ready for review (Not signed)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalSign
                        taxReturn={BASE_TAX_RETURN}
                        clientName="Denise Robinson"
                        clientEmail="denise.robinson@example.com"
                        returnSummary={BASE_RETURN_SUMMARY}
                        form7216ConsentText={SAMPLE_CONSENT}
                        form8879DeclarationText={SAMPLE_DECLARATION}
                        signed={false}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Without return summary (Pending preparer summary)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalSign
                        taxReturn={BASE_TAX_RETURN}
                        clientName="Denise Robinson"
                        clientEmail="denise.robinson@example.com"
                        returnSummary={null}
                        form7216ConsentText={SAMPLE_CONSENT}
                        form8879DeclarationText={SAMPLE_DECLARATION}
                        signed={false}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Signed (Done card)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalSign
                        taxReturn={{
                            ...BASE_TAX_RETURN,
                            status: 'e_signed',
                            statusLabel: 'E-signed',
                        }}
                        clientName="Denise Robinson"
                        clientEmail="denise.robinson@example.com"
                        returnSummary={BASE_RETURN_SUMMARY}
                        form7216ConsentText={SAMPLE_CONSENT}
                        form8879DeclarationText={SAMPLE_DECLARATION}
                        signed={true}
                    />
                </React.Suspense>
            ),
        },
    ],
});
