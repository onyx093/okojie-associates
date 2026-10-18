import { Link } from '@inertiajs/react';
import { AlertCircle, FileText, Scale, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { SeoHead } from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { contact } from '@/routes';

export default function TermsPage() {
    return (
        <MarketingLayout>
            <SeoHead
                title="Terms of Service"
                description="Terms, engagement conditions, and mutual responsibilities for tax preparation and advisory services."
                canonicalUrl={
                    typeof window !== 'undefined'
                        ? window.location.href
                        : 'https://okojieassociates.com/terms'
                }
            />

            <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
                <div className="mx-auto max-w-[840px] px-6">
                    {/* Notice Callout */}
                    <div className="mb-10 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-200">
                        <AlertCircle className="size-5 shrink-0 text-amber-400" />
                        <div>
                            <span className="font-semibold tracking-wider uppercase">
                                Legal Notice:{' '}
                            </span>
                            This terms of service document is a template
                            placeholder (REPLACE WITH COUNSEL-REVIEWED TEXT).
                            Practice engagement letters, power of attorney
                            rules, and limitation of liability clauses must be
                            reviewed by legal counsel.
                        </div>
                    </div>

                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                            <Scale className="size-3.5" />
                            Client Engagement
                        </div>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Terms of Service
                        </h1>
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            Please review these terms and engagement terms
                            governing tax preparation, consultation, and portal
                            utilization with Okojie & Associates, Inc.
                        </p>
                    </div>

                    <div className="space-y-10 text-sm leading-relaxed text-body sm:text-base">
                        {/* Section 1 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <FileText className="size-5 text-primary" />
                                1. Scope of Engagement & Services
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] Okojie &
                                Associates provides federal, state, and local
                                income tax preparation, tax planning, and
                                consultation services based exclusively on the
                                information, receipts, and records furnished by
                                the client. Our engagement does not constitute
                                an audit or forensic accounting review.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Scale className="size-5 text-primary" />
                                2. Taxpayer Responsibilities & Accuracy
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] You affirm
                                that all information provided to us is true,
                                complete, and accurate to the best of your
                                knowledge. Under federal tax law, taxpayers
                                remain ultimately responsible for the
                                truthfulness and accuracy of all items reported
                                on their tax returns.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <ShieldCheck className="size-5 text-primary" />
                                3. E-Signature & Form 8879 Authorization
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] In
                                accordance with IRS Publication 1345 guidelines,
                                returns cannot be transmitted electronically
                                until you have carefully reviewed the completed
                                tax return, executed the IRS e-file Signature
                                Authorization (Form 8879), and provided
                                affirmative Form 7216 disclosure consent.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Scale className="size-5 text-primary" />
                                4. Invoicing, Payments, & Refunds
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] Tax
                                preparation fees are based on the complexity of
                                the return, forms required, and selected service
                                tier. Invoices must be paid in full prior to
                                electronic transmission (e-filing) to the
                                Internal Revenue Service and state taxing
                                authorities.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" asChild>
                            <Link href={contact.url()}>
                                Questions regarding terms? Contact our office
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
