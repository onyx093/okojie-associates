import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Lock,
    Shield,
    ShieldCheck,
} from 'lucide-react';
import * as React from 'react';

import { SeoHead } from '@/components/seo-head';
import { Button } from '@/components/ui/button';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { contact } from '@/routes';

export default function SecurityPage() {
    return (
        <MarketingLayout>
            <SeoHead
                title="Security & Data Protection"
                description="Our commitment to safeguarding taxpayer information under IRS Publication 4557 and the FTC Safeguards Rule."
                canonicalUrl={
                    typeof window !== 'undefined'
                        ? window.location.href
                        : 'https://okojieassociates.com/security'
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
                            This security disclosure is a template placeholder
                            (REPLACE WITH COUNSEL-REVIEWED TEXT). Certified
                            legal counsel and e-file security specialists must
                            review this policy for your specific operational
                            context.
                        </div>
                    </div>

                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                            <Shield className="size-3.5" />
                            Security Framework
                        </div>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Security & Data Safeguards
                        </h1>
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            Okojie & Associates, Inc. implements administrative,
                            technical, and physical safeguards designed to
                            protect non-public personal information (NPI) in
                            accordance with IRS Publication 4557 and the FTC
                            Safeguards Rule (16 CFR Part 314).
                        </p>
                    </div>

                    <div className="space-y-10 text-sm leading-relaxed text-body sm:text-base">
                        {/* Section 1 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Lock className="size-5 text-primary" />
                                1. Written Information Security Plan (WISP)
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] Our firm
                                maintains a formal Written Information Security
                                Plan (WISP) as mandated by IRS Publication 4557.
                                We designate a qualified security coordinator
                                responsible for overseeing safeguards,
                                identifying internal and external data risks,
                                and routinely auditing third-party systems.
                            </p>
                        </div>

                        {/* Section 2 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <ShieldCheck className="size-5 text-primary" />
                                2. Encryption Standards & Storage
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] Taxpayer
                                data, tax returns, and client identity documents
                                are encrypted both in transit and at rest:
                            </p>
                            <ul className="mt-4 space-y-2.5 pl-2">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-success" />
                                    <span>
                                        <strong>In Transit:</strong> Enforced
                                        TLS 1.3 / HTTPS encryption with HTTP
                                        Strict Transport Security (HSTS).
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-success" />
                                    <span>
                                        <strong>At Rest:</strong> AES-256 bit
                                        encryption on private disks with
                                        isolated storage containers per client.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-success" />
                                    <span>
                                        <strong>Antivirus & Malware:</strong>{' '}
                                        Uploaded documents undergo automated
                                        anti-malware verification prior to
                                        preparer review.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Lock className="size-5 text-primary" />
                                3. Multi-Factor Authentication (MFA)
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] To mitigate
                                credential theft and unauthorized access, client
                                portal sessions require mandatory Time-based
                                One-Time Password (TOTP) or WebAuthn passkey
                                authentication. Session tokens are strictly
                                encrypted, rotated, and monitored with audit
                                logging.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="rounded-[18px] border border-border bg-card p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Shield className="size-5 text-primary" />
                                4. Incident Response & Reporting
                            </h2>
                            <p className="mt-3">
                                [REPLACE WITH COUNSEL-REVIEWED TEXT] In
                                compliance with federal and state regulations,
                                our practice maintains a comprehensive Incident
                                Response Plan that outlines procedures for
                                detecting, containing, investigating, and
                                reporting any unauthorized access or potential
                                compromise of taxpayer information.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" asChild>
                            <Link href={contact.url()}>
                                Questions about our security practices? Contact
                                us
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
