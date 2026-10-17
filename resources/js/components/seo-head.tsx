import { Head } from '@inertiajs/react';
import * as React from 'react';

import type { FaqItem, OfficeItem } from '@/types/marketing';

interface SeoHeadProps {
    title: string;
    description?: string;
    canonicalUrl?: string;
    isHome?: boolean;
    faqs?: FaqItem[];
    offices?: OfficeItem[];
}

const DEFAULT_DESCRIPTION =
    'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Secure portal, e-sign, and e-file with Okojie & Associates.';

const DEFAULT_OFFICES: OfficeItem[] = [
    {
        city: 'Philadelphia, PA',
        address: '5601 Germantown Ave',
        phone: '(215) 555-0142',
        hours: 'Mon–Fri 9am–6pm · Sat 10am–2pm',
    },
    {
        city: 'Philadelphia, PA',
        address: '2301 N. Broad St',
        phone: '(215) 555-0178',
        hours: 'Mon–Fri 9am–6pm',
    },
    {
        city: 'Philadelphia, PA',
        address: '6300 W. Chelten Ave',
        phone: '(215) 555-0193',
        hours: 'Mon–Fri 9am–5pm · Sat 10am–1pm',
    },
    {
        city: 'Baltimore, MD',
        address: '4100 Liberty Heights Ave',
        phone: '(410) 555-0166',
        hours: 'Mon–Fri 9am–6pm',
    },
];

export function SeoHead({
    title,
    description = DEFAULT_DESCRIPTION,
    canonicalUrl,
    isHome = false,
    faqs,
    offices = DEFAULT_OFFICES,
}: SeoHeadProps) {
    const fullTitle = isHome ? title : `${title} | Okojie Online`;

    // Build JSON-LD structured data for AccountingService / LocalBusiness
    const schemas: Record<string, unknown>[] = (
        offices.length > 0 ? offices : DEFAULT_OFFICES
    ).map((office) => {
        const [locality, region] = office.city.split(',').map((s) => s.trim());
        return {
            '@context': 'https://schema.org',
            '@type': 'AccountingService',
            name: `Okojie & Associates, Inc. — ${office.city} Office`,
            description,
            telephone: office.phone,
            address: {
                '@type': 'PostalAddress',
                streetAddress: office.address,
                addressLocality: locality,
                addressRegion: region,
                addressCountry: 'US',
            },
            openingHours: office.hours,
            priceRange: '$$',
        };
    });

    if (faqs && faqs.length > 0) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                },
            })),
        });
    }

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:site_name" content="Okojie Online" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />

            {/* JSON-LD Schemas */}
            {schemas.map((schema, idx) => (
                <script
                    key={idx}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </Head>
    );
}
