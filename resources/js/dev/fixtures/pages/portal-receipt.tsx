import * as React from 'react';

import { register } from '@/dev/fixtures';
import type { ReceiptProps } from '@/pages/portal/receipt';

// Dynamic lazy import prevents Vite from converting pages/portal/receipt into an internal chunk
const PortalReceipt = React.lazy(() => import('@/pages/portal/receipt'));

const CARD_PAID_INVOICE: ReceiptProps['invoice'] = {
    id: 'inv-2026-card',
    amountCents: 27500,
    amountFormatted: '$275.00',
    paidAt: 'Feb 12, 2026 · 4:52 PM',
    taxYear: 2026,
    clientName: 'Denise Robinson',
    clientEmail: 'denise.robinson@example.com',
    stripeSessionId: 'cs_test_mockup123',
    receiptNumber: 'RCPT-2026-00418',
    paymentMethod: { brand: 'Visa', last4: '4242' },
    lineItem: '2026 tax preparation · Hybrid',
};

const OFFLINE_PAID_INVOICE: ReceiptProps['invoice'] = {
    id: 'inv-2026-offline',
    amountCents: 18000,
    amountFormatted: '$180.00',
    paidAt: 'Jan 28, 2026 · 11:30 AM',
    taxYear: 2026,
    clientName: 'Marcus Vance',
    clientEmail: 'marcus.v@example.com',
    stripeSessionId: null,
    receiptNumber: 'RCPT-2026-00089',
    paymentMethod: null,
    lineItem: '2026 tax preparation · Standard',
};

register({
    id: 'page-portal-receipt',
    title: 'Portal / Receipt',
    states: [
        {
            label: 'Paid with card (Default / Mockup)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalReceipt
                        invoice={CARD_PAID_INVOICE}
                        receiptNumber={CARD_PAID_INVOICE.receiptNumber}
                        paymentMethod={CARD_PAID_INVOICE.paymentMethod}
                        lineItem={CARD_PAID_INVOICE.lineItem}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Paid offline / in person',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalReceipt
                        invoice={OFFLINE_PAID_INVOICE}
                        receiptNumber={OFFLINE_PAID_INVOICE.receiptNumber}
                        paymentMethod={OFFLINE_PAID_INVOICE.paymentMethod}
                        lineItem={OFFLINE_PAID_INVOICE.lineItem}
                    />
                </React.Suspense>
            ),
        },
    ],
});
