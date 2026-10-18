import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    CheckCircle2,
    FileCheck,
    FileText,
    Lock,
    PenLine,
    Shield,
    ShieldCheck,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PortalLayout } from '@/layouts/portal-layout';

/**
 * NOTE FOR COMPLIANCE & LEGAL COUNSEL:
 * Real IRS Form 8879 (IRS e-file Signature Authorization) wording, Practitioner PIN or
 * Self-Select PIN handling, and electronic filing verification rules (IRS Publication 1345:
 * Handbook for Authorized IRS e-file Providers) must be reviewed and certified by qualified
 * legal counsel and your Authorized IRS e-file Provider prior to production filing.
 */

interface SignProps {
    taxReturn: {
        id: string;
        taxYear: number;
        tier: string | null;
        tierLabel: string;
        status: string;
        statusLabel: string;
        preparerName: string;
    };
    clientName: string;
    clientEmail: string;
    form7216ConsentText: string;
    form8879DeclarationText: string;
}

export default function Sign({
    taxReturn,
    clientName,
    clientEmail,
    form7216ConsentText,
    form8879DeclarationText,
}: SignProps) {
    const { data, setData, post, processing, errors } = useForm({
        consent_7216: false,
        typed_signature: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/portal/sign/${taxReturn.id}`);
    };

    return (
        <PortalLayout>
            <Head title={`Review & E-Sign Tax Return ${taxReturn.taxYear}`} />

            <div className="mx-auto max-w-4xl space-y-8">
                {/* Back button & header */}
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-xs text-muted-foreground">
                        <Link href="/portal/overview">
                            <ArrowLeft className="mr-1.5 size-3.5" />
                            Back to Portal Overview
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                    Step 3 of 5
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Tax Year {taxReturn.taxYear}
                                </span>
                            </div>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Review & Electronic Signature
                            </h1>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                            <ShieldCheck className="size-4" />
                            IRS Pub 4557 & 1345 Protected
                        </div>
                    </div>
                </div>

                {/* Return Summary & PDF Preview Placeholder Card */}
                <Card className="border-border bg-card">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <FileText className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">
                                        Prepared Return Summary
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Prepared by {taxReturn.preparerName} ({taxReturn.tierLabel})
                                    </CardDescription>
                                </div>
                            </div>
                            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                                Ready for Signature
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 p-6">
                        {/* PDF Preview Placeholder */}
                        <div className="rounded-xl border border-border bg-secondary/20 p-6 text-center">
                            <div className="mx-auto flex max-w-lg flex-col items-center">
                                <div className="mb-3 flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-background text-primary shadow-xs">
                                    <FileCheck className="size-7" />
                                </div>
                                <h3 className="text-sm font-bold text-foreground">
                                    Form 1040 U.S. Individual Income Tax Return ({taxReturn.taxYear})
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Your tax preparer has assembled and verified your federal Form 1040, state schedules, and attachments.
                                </p>

                                <div className="mt-4 grid w-full grid-cols-2 gap-3 text-left sm:grid-cols-3">
                                    <div className="rounded-lg border border-border/60 bg-background/80 p-3">
                                        <span className="text-[10px] text-muted-foreground block">Taxpayer</span>
                                        <span className="text-xs font-semibold text-foreground truncate block">{clientName}</span>
                                    </div>
                                    <div className="rounded-lg border border-border/60 bg-background/80 p-3">
                                        <span className="text-[10px] text-muted-foreground block">Tax Year</span>
                                        <span className="text-xs font-semibold text-foreground block">{taxReturn.taxYear}</span>
                                    </div>
                                    <div className="rounded-lg border border-border/60 bg-background/80 p-3 col-span-2 sm:col-span-1">
                                        <span className="text-[10px] text-muted-foreground block">Filing Method</span>
                                        <span className="text-xs font-semibold text-primary block">IRS E-File</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statutory Disclosure: Form 8879 declaration */}
                        <div className="rounded-xl border border-border/80 bg-background p-4.5 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                <Shield className="size-4 text-primary" />
                                Form 8879 E-File Signature Declaration
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {form8879DeclarationText}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* E-Signature & Form 7216 Consent Form */}
                <Card className="border-border bg-card">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <div className="flex items-center gap-2">
                            <PenLine className="size-5 text-primary" />
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    Affirmative Consent & Signature
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Complete the consent acknowledgment and type your name below.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Form 7216 Consent Checkbox */}
                            <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-4.5 space-y-3">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="consent_7216"
                                        checked={data.consent_7216}
                                        onCheckedChange={(checked) => setData('consent_7216', !!checked)}
                                        className="mt-1"
                                    />
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="consent_7216"
                                            className="text-xs font-semibold text-foreground cursor-pointer"
                                        >
                                            IRC Section 7216 Disclosure & Use Consent <span className="text-destructive">*</span>
                                        </Label>
                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                            {form7216ConsentText}
                                        </p>
                                    </div>
                                </div>
                                {errors.consent_7216 && (
                                    <p className="text-xs text-destructive font-medium pl-7 flex items-center gap-1">
                                        <AlertCircle className="size-3.5" />
                                        {errors.consent_7216}
                                    </p>
                                )}
                            </div>

                            {/* Typed Signature Input */}
                            <div className="space-y-2">
                                <Label htmlFor="typed_signature" className="text-xs font-semibold">
                                    Type your full legal name as your electronic signature <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <PenLine className="absolute top-3 left-3 size-4 text-muted-foreground" />
                                    <Input
                                        id="typed_signature"
                                        type="text"
                                        placeholder={clientName}
                                        value={data.typed_signature}
                                        onChange={(e) => setData('typed_signature', e.target.value)}
                                        className="pl-9 text-sm font-serif"
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    By typing your legal name, you declare under penalties of perjury that you have examined this tax return and authorize Okojie & Associates, Inc. to transmit your return electronically.
                                </p>
                                {errors.typed_signature && (
                                    <p className="text-xs text-destructive font-medium flex items-center gap-1">
                                        <AlertCircle className="size-3.5" />
                                        {errors.typed_signature}
                                    </p>
                                )}
                            </div>

                            {/* Notice & Submit */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Lock className="size-3 text-muted-foreground" />
                                    Captures timestamp, verified IP address, and browser signature.
                                </span>

                                <Button
                                    type="submit"
                                    disabled={processing || !data.consent_7216 || !data.typed_signature.trim()}
                                    className="rounded-full px-6 py-5 text-sm font-semibold shadow-xs"
                                >
                                    <Check className="mr-2 size-4" />
                                    {processing ? 'Signing & Storing Record...' : 'Sign & Authorize E-File'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </PortalLayout>
    );
}
