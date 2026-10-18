import { Link } from '@inertiajs/react';
import { AlertCircle, Lock, Shield, UserCheck } from 'lucide-react';
import * as React from 'react';

import { SeoHead } from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { contact } from '@/routes';

export default function PrivacyPage() {
    return (
        <MarketingLayout>
            <SeoHead
                title="Privacy Policy"
                description="How Okojie & Associates protects, handles, and safeguards taxpayer data under IRC Section 7216 and GLBA."
                canonicalUrl={
                    typeof window !== 'undefined'
                        ? window.location.href
                        : 'https://okojieassociates.com/privacy'
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
                            This document is a placeholder template (REPLACE
                            WITH COUNSEL-REVIEWED TEXT). Certified legal counsel
                            must customize and review this policy for your state
                            regulations and practice specifics.
                        </div>
                    </div>

                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                            <Lock className="size-3.5" />
                            Privacy & Compliance
                        </div>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Privacy Policy
                        </h1>
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            Okojie & Associates, Inc. is committed to protecting
                            your confidential financial and tax information in
                            full compliance with the Gramm-Leach-Bliley Act
                            (GLBA) and Internal Revenue Code (IRC) Section 7216.
                        </p>
                    </div>

                    <div className="space-y-10 text-sm leading-relaxed text-body sm:text-base">
                        {/* Section 1 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Shield className="size-5 text-primary" />
                                1. Information We Collect
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] We collect
                                non-public personal information necessary to
                                prepare and file your tax returns, calculate
                                refunds or liabilities, and provide accounting
                                advisory services. This includes identification
                                numbers (SSN/ITIN), wage statements (W-2s,
                                1099s), bank account details for direct deposit,
                                and dependent records.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Lock className="size-5 text-primary" />
                                2. IRC Section 7216 Consent Requirements
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] Federal law
                                strictly restricts the disclosure or use of tax
                                return information by tax return preparers. We
                                do not disclose your tax information to third
                                parties or use it for non-tax preparation
                                purposes without your explicit, written consent
                                under IRC § 7216 and Treas. Reg. § 301.7216-3.
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <UserCheck className="size-5 text-primary" />
                                3. Information Sharing Policy
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] We do not
                                sell, rent, or lease client information under
                                any circumstances. Information is shared only
                                with authorized government taxing authorities
                                (IRS and state departments of revenue) upon your
                                signed e-file authorization (Form 8879) and with
                                verified technology service providers bound by
                                strict confidentiality agreements.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Lock className="size-5 text-primary" />
                                4. Record Retention & Disposal
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] Client
                                files and tax records are retained in compliance
                                with IRS professional standards and applicable
                                statutes of limitations. When records reach the
                                end of their required retention period, they are
                                securely shredded or digitally wiped in
                                accordance with FTC Safeguards requirements.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" asChild>
                            <Link href={contact.url()}>
                                Have questions about your privacy rights? Reach
                                out
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
