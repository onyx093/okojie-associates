import * as React from 'react';

import {
    LegalDocument,
    type LegalSection,
} from '@/components/legal/legal-document';
import type { User } from '@/types';

const PRIVACY_SECTIONS: LegalSection[] = [
    {
        id: 'information-we-collect',
        title: 'Information we collect',
        content: (
            <p>
                The personal information we need to prepare and file your
                returns: identification numbers, wage and income statements,
                bank details for direct deposit, and dependent records.
            </p>
        ),
    },
    {
        id: 'irc-section-7216-consent',
        title: 'IRC Section 7216 consent',
        content: (
            <p>
                Federal law restricts how tax preparers use and disclose return
                information. We never use or share it for anything other than
                preparing your return without your written consent.
            </p>
        ),
    },
    {
        id: 'how-we-share-information',
        title: 'How we share information',
        content: (
            <p>
                We never sell, rent or lease client information. We share it
                only with the IRS and state tax agencies once you sign your
                e-file authorization (Form 8879), or when the law requires it.
            </p>
        ),
    },
    {
        id: 'record-retention-and-disposal',
        title: 'Record retention and disposal',
        content: (
            <p>
                We keep client files as IRS professional standards and statutes
                of limitations require, then securely destroy them.
            </p>
        ),
    },
];

export interface PrivacyPageProps {
    userOverride?: User | null;
}

export default function PrivacyPage({ userOverride }: PrivacyPageProps) {
    return (
        <LegalDocument
            currentDoc="privacy"
            eyebrow="Privacy & compliance"
            title="Privacy policy"
            lastUpdated="Oct 22, 2026"
            intro="We protect your confidential financial and tax information under the Gramm-Leach-Bliley Act (GLBA) and Internal Revenue Code Section 7216."
            sections={PRIVACY_SECTIONS}
            userOverride={userOverride}
        />
    );
}
