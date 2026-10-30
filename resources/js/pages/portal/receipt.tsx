import { Head } from '@inertiajs/react';
import { Download, Printer } from 'lucide-react';
import * as React from 'react';

import { Chip, Inner, Shell } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import { SiteBrandMark } from '@/layouts/site-layout';
import { overview } from '@/routes/portal';

export type ReceiptPaymentMethod = {
    brand: string;
    last4: string;
} | null;

export type ReceiptInvoice = {
    id: string;
    amountCents: number | null;
    amountFormatted: string;
    paidAt: string;
    taxYear: number;
    clientName: string;
    clientEmail: string;
    stripeSessionId: string | null;
    receiptNumber?: string;
    paymentMethod?: ReceiptPaymentMethod;
    lineItem?: string;
};

export interface ReceiptProps {
    invoice: ReceiptInvoice;
    receiptNumber?: string;
    paymentMethod?: ReceiptPaymentMethod;
    lineItem?: string;
}

export default function Receipt({
    invoice,
    receiptNumber: topReceiptNumber,
    paymentMethod: topPaymentMethod,
    lineItem: topLineItem,
}: ReceiptProps) {
    const resolvedReceiptNumber =
        topReceiptNumber ?? invoice.receiptNumber ?? invoice.id;
    const resolvedPaymentMethod =
        topPaymentMethod !== undefined
            ? topPaymentMethod
            : invoice.paymentMethod;
    const resolvedLineItem =
        topLineItem ??
        invoice.lineItem ??
        `Tax preparation — ${invoice.taxYear} return`;

    const formattedDate = React.useMemo(() => {
        return (
            invoice.paidAt?.split(/ · | \d{1,2}:\d{2}/)[0] ||
            invoice.paidAt ||
            'Paid'
        );
    }, [invoice.paidAt]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        window.print();
    };

    return (
        <AppShellLayout
            area="portal"
            activeKey="overview"
            headTitle={`Payment Receipt — Invoice #${invoice.id} | Okojie Online`}
            backHref={overview.url()}
            backLabel="Back to overview"
            eyebrow="Payment"
            title="Receipt"
            headClassName="print:hidden"
            actions={
                <>
                    <Button
                        variant="secondary"
                        size="compact"
                        onClick={handleDownloadPdf}
                        title="Choose 'Save as PDF' in the print dialog"
                        className="print:hidden"
                    >
                        <Download className="size-4" />
                        Download PDF
                    </Button>
                    <Button
                        variant="primary"
                        size="compact"
                        onClick={handlePrint}
                        className="print:hidden"
                    >
                        <Printer className="size-4" />
                        Print
                    </Button>
                </>
            }
        >
            <Head title={`Payment Receipt — Invoice #${invoice.id}`} />

            <div className="receipt-wrap mx-auto max-w-[720px]">
                <Shell className="print:bg-transparent print:p-0 print:shadow-none">
                    <Inner
                        variant="paper"
                        className="p-10 max-sm:p-5.5 print:bg-white print:p-0 print:shadow-none"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-5 max-sm:flex-col">
                            <div className="flex items-center gap-3">
                                <SiteBrandMark className="size-10 rounded-[11px] text-[18px]" />
                                <span>
                                    <b className="block text-[15px] font-semibold text-foreground">
                                        Okojie &amp; Associates, Inc.
                                    </b>
                                    <small className="block text-[12.5px] text-muted-foreground">
                                        Philadelphia &amp; Baltimore offices
                                    </small>
                                </span>
                            </div>
                            <div className="text-right text-[13px] text-muted-foreground max-sm:text-left">
                                <span>Receipt</span>
                                <b className="block font-mono text-[13px] font-medium text-foreground">
                                    {resolvedReceiptNumber}
                                </b>
                                <span>{formattedDate}</span>
                            </div>
                        </div>

                        {/* Amount Paid Banner */}
                        <div className="my-7 flex items-center justify-between gap-4 rounded-[14px] bg-success-soft p-5 print:border print:border-emerald-600">
                            <div>
                                <span className="block text-[11px] font-semibold tracking-[0.05em] text-success uppercase">
                                    Amount paid
                                </span>
                                <b className="mt-0.5 block text-[30px] font-medium tracking-[-0.035em] text-foreground tabular-nums">
                                    {invoice.amountFormatted}
                                </b>
                            </div>
                            <Chip tone="success" dot className="bg-card">
                                Paid in full
                            </Chip>
                        </div>

                        {/* Two-Column Metadata Breakdown */}
                        <div className="mb-6 grid grid-cols-2 gap-5 text-[14px] max-sm:grid-cols-1">
                            <div>
                                <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                                    Billed to
                                </span>
                                <p className="leading-relaxed text-muted-foreground">
                                    <b className="font-medium text-foreground">
                                        {invoice.clientName}
                                    </b>
                                    <br />
                                    {invoice.clientEmail}
                                    <br />
                                    Philadelphia, PA
                                </p>
                            </div>
                            <div>
                                <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.05em] text-muted-foreground uppercase">
                                    Payment
                                </span>
                                {resolvedPaymentMethod ? (
                                    <p className="leading-relaxed text-muted-foreground">
                                        <b className="font-medium text-foreground">
                                            {resolvedPaymentMethod.brand} ending{' '}
                                            {resolvedPaymentMethod.last4}
                                        </b>
                                        <br />
                                        Paid {invoice.paidAt}
                                        <br />
                                        Secure card processing by Stripe
                                    </p>
                                ) : (
                                    <p className="leading-relaxed text-muted-foreground">
                                        <b className="font-medium text-foreground">
                                            Paid in person / offline
                                        </b>
                                        <br />
                                        Paid {invoice.paidAt}
                                        <br />
                                        Recorded by your preparer
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13.5px]">
                                <thead>
                                    <tr className="border-b border-border text-[12px] font-medium text-muted-foreground">
                                        <th className="py-2.5 font-medium">
                                            Description
                                        </th>
                                        <th className="py-2.5 text-right font-medium">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    <tr>
                                        <td className="py-3.5 pr-4">
                                            <b className="block font-medium text-foreground">
                                                {resolvedLineItem}
                                            </b>
                                            <small className="block text-[12px] text-muted-foreground">
                                                Federal Form 1040 and state
                                                return preparation, review and
                                                e-file authorization
                                            </small>
                                        </td>
                                        <td className="py-3.5 text-right font-mono font-medium text-foreground tabular-nums">
                                            {invoice.amountFormatted}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="totals mt-3.5 ml-auto w-full max-w-[280px]">
                            <div className="grid gap-2 text-[13.5px]">
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-mono text-foreground tabular-nums">
                                        {invoice.amountFormatted}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span>Tax</span>
                                    <span className="font-mono text-foreground tabular-nums">
                                        $0.00
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-border pt-2.5 font-medium text-foreground">
                                    <span>Total paid</span>
                                    <span className="font-mono text-foreground tabular-nums">
                                        {invoice.amountFormatted}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4.5 text-[12.5px] text-muted-foreground">
                            <span className="font-mono">
                                (215) 555-0142 · hello@okojieonline.com
                            </span>
                            <span>Keep this receipt for your records.</span>
                        </div>
                    </Inner>
                </Shell>
            </div>
        </AppShellLayout>
    );
}
