import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, Shield } from 'lucide-react';
import * as React from 'react';

import { SiteLayout } from '@/layouts/site-layout';
import { cn } from '@/lib/utils';
import { privacy, security, terms } from '@/routes';
import type { SharedData, User } from '@/types';

export type LegalDocType = 'privacy' | 'terms' | 'security';

export interface LegalTabItem {
    id: LegalDocType;
    label: string;
    href: string;
}

export const LEGAL_TABS: LegalTabItem[] = [
    { id: 'privacy', label: 'Privacy', href: privacy.url() },
    { id: 'terms', label: 'Terms', href: terms.url() },
    { id: 'security', label: 'Security', href: security.url() },
];

export interface LegalSection {
    id: string;
    title: string;
    tocTitle?: string;
    content: React.ReactNode;
}

export interface LegalDocumentProps {
    currentDoc: LegalDocType;
    eyebrow: string;
    title: string;
    lastUpdated?: string;
    intro: React.ReactNode;
    sections: LegalSection[];
    draftNote?: React.ReactNode;
    contactPhone?: string;
    contactEmail?: string;
    includeQuestionsSection?: boolean;
    userOverride?: User | null;
}

export function LegalDocument({
    currentDoc,
    eyebrow,
    title,
    lastUpdated = 'Oct 22, 2026',
    intro,
    sections,
    draftNote,
    contactPhone,
    contactEmail,
    includeQuestionsSection = true,
    userOverride,
}: LegalDocumentProps) {
    const { props } = usePage<Partial<SharedData>>();
    const site = props.site;

    const phone = contactPhone ?? site?.contact?.phone ?? '(215) 555-0142';
    const email =
        contactEmail ?? site?.contact?.email ?? 'hello@okojieonline.com';
    const normalizedPhone = phone.startsWith('+')
        ? phone
        : `+1${phone.replace(/\D/g, '').replace(/^1/, '')}`;

    const allSections = React.useMemo<LegalSection[]>(() => {
        if (!includeQuestionsSection) {
            return sections;
        }

        const questionsSection: LegalSection = {
            id: 'contact',
            title: 'Questions',
            tocTitle: 'Questions',
            content: (
                <p>
                    Call{' '}
                    <a
                        href={`tel:${normalizedPhone}`}
                        className="text-accent-fg font-medium tabular-nums hover:underline"
                    >
                        {phone}
                    </a>{' '}
                    or email{' '}
                    <a
                        href={`mailto:${email}`}
                        className="text-accent-fg font-medium hover:underline"
                    >
                        {email}
                    </a>
                    .
                </p>
            ),
        };

        // If the caller already provided an id="contact", don't duplicate it
        const hasContact = sections.some((s) => s.id === 'contact');
        return hasContact ? sections : [...sections, questionsSection];
    }, [sections, includeQuestionsSection, phone, email, normalizedPhone]);

    const [activeSectionId, setActiveSectionId] = React.useState<string>(
        () => allSections[0]?.id ?? '',
    );

    React.useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !('IntersectionObserver' in window)
        ) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveSectionId(entry.target.id);
                    }
                }
            },
            {
                rootMargin: '-80px 0% -60% 0%',
                threshold: 0,
            },
        );

        for (const section of allSections) {
            const el = document.getElementById(section.id);
            if (el) {
                observer.observe(el);
            }
        }

        return () => observer.disconnect();
    }, [allSections]);

    return (
        <SiteLayout
            userOverride={userOverride}
            seo={{
                title: `${title} — Okojie Online`,
                description:
                    typeof intro === 'string'
                        ? intro
                        : 'How Okojie & Associates protects, handles, and safeguards taxpayer data under IRC Section 7216 and GLBA.',
                canonicalUrl:
                    typeof window !== 'undefined'
                        ? window.location.href
                        : `https://okojieonline.com/${currentDoc}`,
            }}
            band={{
                eyebrow,
                icon: Shield,
                title,
                children: (
                    <div
                        role="tablist"
                        aria-label="Legal documents"
                        className="seg legal-tabs mt-6 inline-flex overflow-x-auto rounded-[11px] bg-sunken p-[3px] shadow-[inset_0_0_0_1px_var(--color-border)] print:hidden"
                    >
                        {LEGAL_TABS.map((tab) => {
                            const isSelected = tab.id === currentDoc;
                            return (
                                <Link
                                    key={tab.id}
                                    role="tab"
                                    href={tab.href}
                                    aria-selected={isSelected}
                                    className={cn(
                                        'inline-flex h-8 items-center rounded-[8px] px-3 text-[13.5px] font-medium transition-all',
                                        isSelected
                                            ? 'bg-card text-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </div>
                ),
            }}
        >
            <section className="section tight py-10 lg:py-14 print:py-4">
                <div className="container mx-auto max-w-site px-6 sm:px-10 print:px-0">
                    <div className="legal grid grid-cols-1 items-start gap-8 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-14 print:block">
                        {/* Table of Contents */}
                        <nav
                            aria-label="On this page"
                            className="toc sticky top-6 grid gap-0.5 max-lg:static print:hidden"
                        >
                            <span className="eyebrow px-2.5 pb-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                                On this page
                            </span>
                            {allSections.map((section) => {
                                const isActive = activeSectionId === section.id;
                                return (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className={cn(
                                            'rounded-[9px] px-2.5 py-2 text-[14px] transition-colors',
                                            isActive
                                                ? 'bg-foreground/[0.08] font-medium text-foreground'
                                                : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground',
                                        )}
                                    >
                                        {section.tocTitle ?? section.title}
                                    </a>
                                );
                            })}
                        </nav>

                        {/* Document Content */}
                        <article className="doc min-w-0 [&_.intro]:mt-6 [&_.intro]:text-[19px] [&_.intro]:leading-[1.5] [&_.intro]:font-normal [&_.intro]:tracking-[-0.01em] [&_.intro]:text-foreground [&_h2]:mt-10 [&_h2]:flex [&_h2]:scroll-mt-6 [&_h2]:items-baseline [&_h2]:gap-3 [&_h2]:text-[22px] [&_h2]:font-medium [&_h2]:tracking-[-0.02em] [&_h2]:text-foreground [&_h2_span]:font-mono [&_h2_span]:text-[13px] [&_h2_span]:text-muted-foreground [&_li]:text-muted-foreground [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:text-[16px] [&_ol]:leading-[1.7] [&_ol]:text-muted-foreground [&_p]:mt-3 [&_p]:max-w-[65ch] [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:text-muted-foreground [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border-t [&_td]:border-border [&_td]:py-2 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-[16px] [&_ul]:leading-[1.7] [&_ul]:text-muted-foreground">
                            {/* Draft Warning Banner (D-06) */}
                            {draftNote ?? (
                                <div
                                    role="note"
                                    className="note warn flex items-start gap-3 rounded-xl border border-amber-500/35 bg-amber-500/10 p-3.5 text-[13.5px] leading-relaxed text-amber-900 sm:p-4 dark:text-amber-200"
                                >
                                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                    <span>
                                        <strong className="font-medium text-amber-950 dark:text-amber-100">
                                            Draft wording.
                                        </strong>{' '}
                                        This page needs to be reviewed and
                                        replaced by legal counsel before launch.
                                    </span>
                                </div>
                            )}

                            {/* Metadata Row */}
                            <div className="meta-row mt-4.5 flex flex-wrap items-center gap-2.5 text-[13.5px] text-muted-foreground print:hidden">
                                <span>Last updated {lastUpdated}</span>
                                <span aria-hidden="true">·</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (typeof window !== 'undefined') {
                                            window.print();
                                        }
                                    }}
                                    className="text-accent-fg cursor-pointer font-medium transition-colors hover:underline"
                                >
                                    Print this page
                                </button>
                            </div>

                            {/* Intro text */}
                            <p className="intro">{intro}</p>

                            {/* Numbered Sections */}
                            {allSections.map((section, index) => {
                                const num = String(index + 1).padStart(2, '0');
                                return (
                                    <div key={section.id}>
                                        <h2 id={section.id}>
                                            <span>{num}</span>
                                            {section.title}
                                        </h2>
                                        {section.content}
                                    </div>
                                );
                            })}
                        </article>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}

export default LegalDocument;
