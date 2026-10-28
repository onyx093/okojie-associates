import * as React from 'react';

import {
    LegalDocument,
    type LegalSection,
} from '@/components/legal/legal-document';
import type { User } from '@/types';

const SECURITY_SECTIONS: LegalSection[] = [
    {
        id: 'written-information-security-plan',
        title: 'Written information security plan',
        content: (
            <p>
                We maintain a formal WISP and a named security coordinator who
                oversees risk assessments, staff training and access controls.
            </p>
        ),
    },
    {
        id: 'encryption-and-storage',
        title: 'Encryption and storage',
        content: (
            <p>
                Tax data, returns and identity documents are encrypted in
                transit and at rest, and only you and your preparer can open
                your files.
            </p>
        ),
    },
    {
        id: 'multi-factor-authentication',
        title: 'Multi-factor authentication',
        content: (
            <p>
                Every portal account requires a one-time code from an
                authenticator app or a passkey, in addition to a password.
            </p>
        ),
    },
    {
        id: 'incident-response',
        title: 'Incident response',
        content: (
            <p>
                We keep an incident response plan for detecting, containing and
                reporting security events, and we notify affected clients and
                authorities as the law requires.
            </p>
        ),
    },
];

export interface SecurityPageProps {
    userOverride?: User | null;
}

export default function SecurityPage({ userOverride }: SecurityPageProps) {
    return (
        <LegalDocument
            currentDoc="security"
            eyebrow="Security (WISP)"
            title="Security and data safeguards"
            lastUpdated="Oct 22, 2026"
            intro="The administrative, technical and physical safeguards we use to protect your information, following IRS Publication 4557 and the FTC Safeguards Rule."
            sections={SECURITY_SECTIONS}
            userOverride={userOverride}
        />
    );
}
