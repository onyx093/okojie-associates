import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortalLayout } from '@/layouts/portal-layout';

interface ReceiptProps {
    invoice: {
        id: string;
        amountCents: number | null;
        amountFormatted: string;
        paidAt: string;
        taxYear: number;
        clientName: string;
        clientEmail: string;
        stripeSessionId: string | null;
    };
}

export default function Receipt({ invoice }: ReceiptProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <PortalLayout>
            <Head title={`Payment Receipt - Invoice #${invoice.id}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="-ml-2 text-xs text-muted-foreground">
                        <Link href="/portal/overview">
                            <ArrowLeft className="mr-1.5 size-3.5" />
                            Back to Overview
                        </Link>
                    </Button>

                    <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs">
                        <Printer className="mr-1.5 size-3.5" />
                        Print Receipt
                    </Button>
                </div>

                <Card className="border-border bg-card p-4 sm:p-8 shadow-xs">
                    <CardHeader className="border-b border-border/60 pb-6 px-0 pt-0">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <BrandLogo showSublabel={false} href="/" />
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Okojie & Associates, Inc.<br />
                                    Philadelphia & Baltimore Offices<br />
                                    (215) 555-0142 · hello@okojieonline.com
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                                    <CheckCircle2 className="size-3.5" />
                                    Payment Received
                                </span>
                                <div className="mt-2 text-xs text-muted-foreground">
                                    Receipt #: <span className="font-mono text-foreground">{invoice.id}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Date: {invoice.paidAt}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-0 py-6 space-y-6">
                        <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                            <div className="text-xs text-muted-foreground">Billed To:</div>
                            <div className="font-semibold text-sm text-foreground mt-0.5">{invoice.clientName}</div>
                            <div className="text-xs text-muted-foreground">{invoice.clientEmail}</div>
                        </div>

                        <div>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-border text-muted-foreground">
                                        <th className="py-2 text-left font-semibold">Description</th>
                                        <th className="py-2 text-right font-semibold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border/40">
                                        <td className="py-4">
                                            <div className="font-semibold text-foreground text-sm">
                                                Tax Preparation Services — Tax Year {invoice.taxYear}
                                            </div>
                                            <div className="text-muted-foreground text-xs mt-0.5">
                                                Federal Form 1040 & State Preparation, Review, E-File Authorization
                                            </div>
                                        </td>
                                        <td className="py-4 text-right font-semibold text-foreground text-sm">
                                            {invoice.amountFormatted}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="pt-4 text-right font-bold text-sm text-foreground">Total Paid:</td>
                                        <td className="pt-4 text-right font-bold text-base text-primary">
                                            {invoice.amountFormatted}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="pt-6 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="size-3.5 text-emerald-500" />
                                Paid via Stripe Secure Card Processing
                            </span>
                            <span>Status: Completed</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PortalLayout>
    );
}
