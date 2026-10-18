import { Head, usePage } from '@inertiajs/react';
import * as React from 'react';

import type { FaqItem, OfficeItem } from '@/types/marketing';

interface SeoHeadProps {
    title: string;
    description?: string;
    canonicalUrl?: string;
    ogImage?: string;
    noindex?: boolean;
    isHome?: boolean;
    faqs?: FaqItem[];
    offices?: OfficeItem[];
}

const DEFAULT_DESCRIPTION =
    'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Secure portal, e-sign, and e-file with Okojie & Associates.';

const DEFAULT_OG_IMAGE = '/og-image.png';

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
    ogImage = DEFAULT_OG_IMAGE,
    noindex = false,
    isHome = false,
    faqs,
    offices = DEFAULT_OFFICES,
}: SeoHeadProps) {
    const page = usePage();
    const cspNonce = (page.props as { cspNonce?: string }).cspNonce;
    const fullTitle = isHome ? title : `${title} | Okojie Online`;

    // Ensure fully-qualified or absolute OG image
    const resolvedOgImage = ogImage.startsWith('http')
        ? ogImage
        : `${typeof window !== 'undefined' ? window.location.origin : ''}${ogImage}`;

    // Build JSON-LD structured data for AccountingService / TaxService / LocalBusiness
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
            image: resolvedOgImage,
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

    // Add Organization Schema
    schemas.unshift({
        '@context': 'https://schema.org',
        '@type': 'TaxService',
        name: 'Okojie & Associates, Inc.',
        alternateName: 'Okojie Online',
        description,
        url:
            typeof window !== 'undefined'
                ? window.location.origin
                : 'https://okojieassociates.com',
        logo: resolvedOgImage,
        telephone: '(215) 555-0142',
        areaServed: ['Philadelphia, PA', 'Baltimore, MD'],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Tax Preparation Tiers',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Upload & Go',
                        description:
                            'Simple W-2 filing with secure document upload and preparer review.',
                    },
                    price: '225.00',
                    priceCurrency: 'USD',
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Hybrid Advisory',
                        description:
                            'Schedule C / small business filing with video review consultation.',
                    },
                    price: '375.00',
                    priceCurrency: 'USD',
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Premium Remote',
                        description:
                            'Comprehensive multi-state, rental, and strategic tax planning.',
                    },
                    price: '550.00',
                    priceCurrency: 'USD',
                },
            ],
        },
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
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph */}
            <meta property="og:site_name" content="Okojie Online" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:image" content={resolvedOgImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta
                property="og:image:alt"
                content="Okojie & Associates, Inc. — Online Tax Preparation & Advisory"
            />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={resolvedOgImage} />

            {/* JSON-LD Schemas */}
            {schemas.map((schema, idx) => (
                <script
                    key={idx}
                    type="application/ld+json"
                    nonce={cspNonce}
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </Head>
    );
}
