import * as React from 'react';

import { register } from '@/dev/fixtures';
import type {
    AssignedPreparer,
    PortalMessageItem,
} from '@/pages/portal/messages';

// Dynamic lazy import prevents Vite from converting pages/portal/messages into an internal chunk
const PortalMessages = React.lazy(() => import('@/pages/portal/messages'));

const SAMPLE_PREPARER: AssignedPreparer = {
    name: 'Adaeze Okojie, EA',
    title: 'Enrolled Agent',
    office: 'germantown-ave',
    officeLabel: '5601 Germantown Ave, Philadelphia',
    avatarUrl: null,
};

const SAMPLE_MESSAGES: PortalMessageItem[] = [
    {
        id: 'msg-1',
        fromUserId: 2,
        toUserId: 1,
        fromName: 'Adaeze Okojie, EA',
        isFromStaff: true,
        body: 'Hi Denise, your return is almost done. I noticed page 2 of your 1098-T is missing. Could you upload it before our call on Thursday? It may add to your education credit.',
        readAt: null,
        isUnread: true,
        createdAt: new Date().toISOString(),
        formattedDate: 'Today, 9:12 AM',
        attachments: [],
    },
    {
        id: 'msg-2',
        fromUserId: 2,
        toUserId: 1,
        fromName: 'Adaeze Okojie, EA',
        isFromStaff: true,
        body: 'Thanks for uploading everything so quickly. I’ve started on your federal and PA return. I’ll message you here if anything else comes up.',
        readAt: '2026-02-03T14:40:00Z',
        isUnread: false,
        createdAt: '2026-02-03T14:40:00Z',
        formattedDate: 'Feb 3, 2026, 2:40 PM',
        attachments: [],
    },
    {
        id: 'msg-3',
        fromUserId: 2,
        toUserId: 1,
        fromName: 'Adaeze Okojie, EA',
        isFromStaff: true,
        body: 'Welcome to Okojie Online! I’ll be your preparer this year. Here’s the checklist we talked about at the office.',
        readAt: '2026-01-28T11:05:00Z',
        isUnread: false,
        createdAt: '2026-01-28T11:05:00Z',
        formattedDate: 'Jan 28, 2026, 11:05 AM',
        attachments: [
            {
                id: 'att-1',
                filename: '2026 document checklist.pdf',
                size_formatted: '214 KB',
                download_url: '#',
            },
        ],
    },
];

export const portalMessagesPageFixture = register({
    id: 'page-portal-messages',
    title: 'Page: Portal Messages (§3 Matrix)',
    states: [
        {
            label: 'Thread with unread message, attachments & assigned preparer',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalMessages
                        messages={SAMPLE_MESSAGES}
                        preparer={SAMPLE_PREPARER}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'All messages read (no New chip or Mark Read action)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalMessages
                        messages={SAMPLE_MESSAGES.map((m) => ({
                            ...m,
                            isUnread: false,
                        }))}
                        preparer={SAMPLE_PREPARER}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Empty state (no messages yet)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalMessages messages={[]} preparer={SAMPLE_PREPARER} />
                </React.Suspense>
            ),
        },
        {
            label: 'Unassigned preparer (generic preparer fallback card)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalMessages
                        messages={SAMPLE_MESSAGES}
                        preparer={null}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Thread with multiple attachments',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalMessages
                        messages={[
                            ...SAMPLE_MESSAGES,
                            {
                                id: 'msg-4',
                                fromUserId: 2,
                                toUserId: 1,
                                fromName: 'Adaeze Okojie, EA',
                                isFromStaff: true,
                                body: 'Attached are the preliminary estimates and summary schedule for your records.',
                                readAt: '2026-01-25T10:00:00Z',
                                isUnread: false,
                                createdAt: '2026-01-25T10:00:00Z',
                                formattedDate: 'Jan 25, 2026, 10:00 AM',
                                attachments: [
                                    {
                                        id: 'att-2',
                                        filename: 'Tax_Estimate_2026.xlsx',
                                        size_formatted: '48 KB',
                                        download_url: '#',
                                    },
                                    {
                                        id: 'att-3',
                                        filename: 'Schedule_Draft.pdf',
                                        size_formatted: '1.2 MB',
                                        download_url: '#',
                                    },
                                ],
                            },
                        ]}
                        preparer={SAMPLE_PREPARER}
                    />
                </React.Suspense>
            ),
        },
    ],
});
