import * as React from 'react';

import {
    LegalDocument,
    type LegalSection,
} from '@/components/legal/legal-document';
import type { User } from '@/types';

const TERMS_SECTIONS: LegalSection[] = [
    {
        id: 'scope-of-engagement',
        title: 'Scope of engagement',
        content: (
            <p>
                We prepare federal, state and local income tax returns and
                provide planning and consultation, based on the information and
                documents you give us.
            </p>
        ),
    },
    {
        id: 'your-responsibilities',
        title: 'Your responsibilities',
        content: (
            <p>
                You confirm that the information you provide is true, complete
                and accurate. Under federal law, you remain responsible for the
                accuracy of your return.
            </p>
        ),
    },
    {
        id: 'e-signature-and-form-8879',
        title: 'E-signature and Form 8879',
        content: (
            <p>
                Following IRS Publication 1345, we can’t e-file your return
                until you’ve reviewed it and signed Form 8879 in your portal.
            </p>
        ),
    },
    {
        id: 'invoices-payments-and-refunds',
        title: 'Invoices, payments and refunds',
        content: (
            <p>
                Fees depend on your return’s complexity and your tier. Invoices
                are paid in full before we e-file.
            </p>
        ),
    },
];

export interface TermsPageProps {
    userOverride?: User | null;
}

export default function TermsPage({ userOverride }: TermsPageProps) {
    return (
        <LegalDocument
            currentDoc="terms"
            eyebrow="Engagement terms"
            title="Terms of service"
            lastUpdated="Oct 22, 2026"
            intro="The terms that govern tax preparation, consultations and use of the client portal with Okojie & Associates, Inc."
            sections={TERMS_SECTIONS}
            userOverride={userOverride}
        />
    );
}
