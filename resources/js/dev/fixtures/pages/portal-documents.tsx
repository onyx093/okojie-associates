import * as React from 'react';

import { register } from '@/dev/fixtures';
import type { DocumentItem } from '@/pages/portal/documents';

// Dynamic lazy import prevents Vite from converting pages/portal/documents into an internal chunk
const PortalDocuments = React.lazy(() => import('@/pages/portal/documents'));

const SAMPLE_DOCUMENTS: DocumentItem[] = [
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
        created_at: '2027-02-02T10:00:00Z',
        created_at_formatted: 'Feb 2, 2027',
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
        created_at: '2027-02-02T10:05:00Z',
        created_at_formatted: 'Feb 2, 2027',
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
        created_at: '2027-02-02T10:10:00Z',
        created_at_formatted: 'Feb 2, 2027',
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
        scan_status_label: 'Scanning…',
        created_at: '2027-02-12T14:20:00Z',
        created_at_formatted: 'Just now',
        download_url: '#',
    },
    {
        id: 'doc-5',
        type: 'other',
        type_label: 'Other',
        filename: 'receipts_bundle.zip',
        mime: 'application/zip',
        size_bytes: 3565158,
        size_formatted: '3.4 MB',
        scan_status: 'infected',
        scan_status_label: 'Blocked',
        created_at: '2027-02-01T09:00:00Z',
        created_at_formatted: 'Feb 1, 2027',
        download_url: '#',
    },
];

export const portalDocumentsPageFixture = register({
    id: 'page-portal-documents',
    title: 'Page: Portal Documents (§3 Matrix)',
    states: [
        {
            label: 'Open with documents (can delete)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalDocuments
                        documents={SAMPLE_DOCUMENTS}
                        canDelete={true}
                        taxReturnStatus="in_preparation"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Locked with documents (ready for review, cannot delete)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalDocuments
                        documents={SAMPLE_DOCUMENTS}
                        canDelete={false}
                        taxReturnStatus="ready_for_review"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Empty state (no documents uploaded)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalDocuments
                        documents={[]}
                        canDelete={true}
                        taxReturnStatus="intake_received"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Locked empty state',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalDocuments
                        documents={[]}
                        canDelete={false}
                        taxReturnStatus="ready_for_review"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'All clean documents',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalDocuments
                        documents={SAMPLE_DOCUMENTS.slice(0, 3)}
                        canDelete={true}
                        taxReturnStatus="in_preparation"
                    />
                </React.Suspense>
            ),
        },
    ],
});
