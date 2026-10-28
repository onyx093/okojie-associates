import * as React from 'react';

import { HomeIntake } from '@/components/home/home-intake';
import { register } from '@/dev/fixtures';
import { fixtureClientUser } from '@/dev/fixtures/layouts';
import type {
    FaqItem,
    OfficeItem,
    StatItem,
    StepItem,
    TestimonialItem,
    TierItem,
    VideoGroup,
} from '@/types/marketing';

const Home = React.lazy(() => import('@/pages/home'));

export const sampleTiers: TierItem[] = [
    {
        slug: 'upload_and_go',
        name: 'Upload & Go',
        tagline: 'Simple returns, fully remote',
        price_range: '$250–$400',
        price_min: 250,
        price_max: 400,
        description:
            'Upload your documents to the secure portal, we prepare and review by phone or video, you e-sign.',
        features: [
            'Secure document upload',
            'Federal + 1 state return',
            'Phone or video review call',
            'IRS e-file confirmation',
        ],
        best_for: 'W-2 employees and students',
        cta: 'Choose Upload & Go',
    },
    {
        slug: 'hybrid',
        name: 'Hybrid',
        tagline: 'Remote or in person with video review',
        price_range: '$450–$750',
        price_min: 450,
        price_max: 750,
        description:
            'Our most popular service. Meet in person or by video, with dedicated preparer support throughout the year.',
        features: [
            'Everything in Upload & Go',
            'In-person or video appointment',
            'Multi-state filing (PA, MD, NJ, DE)',
            'Year-round tax support',
        ],
        best_for: 'Families, homeowners, and itemizers',
        cta: 'Choose Hybrid',
    },
    {
        slug: 'premium_remote',
        name: 'Premium Remote',
        tagline: 'Business, rentals & year-round advisory',
        price_range: '$800–$1,500',
        price_min: 800,
        price_max: 1500,
        description:
            'Full-service tax preparation and quarterly planning for business owners, landlords, and 1099 contractors.',
        features: [
            'Everything in Hybrid',
            'Schedule C, E (rentals), or K-1',
            'Quarterly estimated tax vouchers',
            'Year-round audit defense support',
        ],
        best_for: 'Small businesses, landlords, and self-employed',
        cta: 'Choose Premium',
    },
];

export const sampleSteps: StepItem[] = [
    {
        step: 1,
        title: 'Book',
        body: 'Select your service tier and schedule an onboarding call in under 5 minutes.',
    },
    {
        step: 2,
        title: 'Upload',
        body: 'Snap photos or upload PDFs of your W-2s, 1099s, and IDs to your encrypted portal.',
    },
    {
        step: 3,
        title: 'Prepare',
        body: 'A real credentialed preparer reviews your documents and prepares your complete return.',
    },
    {
        step: 4,
        title: 'Review & e-sign',
        body: 'Meet with your preparer by video or phone, review line-by-line, and sign IRS Form 8879 online.',
    },
    {
        step: 5,
        title: 'E-file',
        body: 'We submit your return directly to the IRS and state, tracking acceptance every step.',
    },
];

export const sampleTestimonials: TestimonialItem[] = [
    {
        name: 'Marcus & Keisha Taylor',
        location: 'Philadelphia, PA',
        stars: 5,
        quote: 'We used to wait hours in an office with two toddlers. Okojie Online let us upload after bedtime, do a quick 20-minute video review on Thursday, and our refund was deposited 9 days later.',
    },
    {
        name: 'David Vance',
        location: 'Baltimore, MD',
        stars: 5,
        quote: 'As a 1099 contractor with Maryland and PA income, multi-state taxes were giving me nightmares. Adaeze sorted it out in days.',
    },
    {
        name: 'Elena Rostova',
        location: 'Upper Darby, PA',
        stars: 5,
        quote: 'Clear pricing from day one with zero surprises. The portal is clean, fast, and easy to use on my phone.',
    },
    {
        name: 'Franklin Moore',
        location: 'Philadelphia, PA',
        stars: 5,
        quote: 'Twenty years with Okojie & Associates. The transition to the online portal has made the experience even better.',
    },
    {
        name: 'Aisha Bello',
        location: 'Towson, MD',
        stars: 5,
        quote: 'Fast, professional, and knowledgeable. Having a real human who answers my questions is worth every penny.',
    },
];

export const sampleVideos: VideoGroup[] = [
    {
        category: 'Getting started',
        videos: [
            {
                id: 'how-it-works',
                title: 'How Okojie Online Works',
                description:
                    'A 2-minute walkthrough from document upload to IRS e-file confirmation.',
                url: null,
            },
            {
                id: 'document-prep',
                title: 'What Documents You Need',
                description:
                    'A checklist of tax forms, identification, and expense summaries.',
                url: null,
            },
        ],
    },
    {
        category: 'Using your portal',
        videos: [
            {
                id: 'portal-tour',
                title: 'Touring Your Secure Client Portal',
                description:
                    'How to upload documents, message your preparer, and track return status.',
                url: null,
            },
            {
                id: 'esign-guide',
                title: 'How to E-sign IRS Form 8879',
                description:
                    'Legally binding electronic signature on your phone or computer in seconds.',
                url: null,
            },
        ],
    },
    {
        category: 'Client stories',
        videos: [
            {
                id: 'client-story-1',
                title: 'Denise’s Story: 3 Years Filing Online',
                description:
                    'How a busy hospital nurse manages family tax filing from home.',
                url: null,
            },
        ],
    },
];

export const sampleOffices: OfficeItem[] = [
    {
        slug: 'germantown-ave',
        city: 'Philadelphia, PA',
        address: '5601 Germantown Ave',
        phone: '(215) 555-0142',
        hours: 'Mon–Fri 9am–6pm · Sat 10am–2pm',
    },
    {
        slug: 'n-broad-st',
        city: 'Philadelphia, PA',
        address: '2301 N. Broad St',
        phone: '(215) 555-0178',
        hours: 'Mon–Fri 9am–6pm',
    },
    {
        slug: 'w-chelten-ave',
        city: 'Philadelphia, PA',
        address: '6300 W. Chelten Ave',
        phone: '(215) 555-0193',
        hours: 'Mon–Fri 9am–5pm · Sat 10am–1pm',
    },
    {
        slug: 'liberty-heights-baltimore',
        city: 'Baltimore, MD',
        address: '4100 Liberty Heights Ave',
        phone: '(410) 555-0166',
        hours: 'Mon–Fri 9am–6pm',
    },
];

export const sampleFaqs: FaqItem[] = [
    {
        question: 'Do I ever need to visit an office in person?',
        answer: 'No. The entire process — document submission, preparer consultation, identity verification, e-signature, and e-filing — is available 100% online through your secure portal.',
    },
    {
        question: 'Who actually prepares my tax return?',
        answer: 'A credentialed tax professional (Enrolled Agent or CPA) based in our Philadelphia or Baltimore offices. We never outsource your taxes or rely on automated generation.',
    },
    {
        question: 'How do I send my sensitive documents safely?',
        answer: 'You upload directly into our bank-grade encrypted client portal. We comply with IRS Publication 4557 and FTC Safeguards guidelines.',
    },
    {
        question: 'What if I live outside PA or MD?',
        answer: 'Our remote tiers support all 50 states and federal returns. We have deep expertise in multi-state returns including PA, MD, NJ, DE, and DC.',
    },
    {
        question: 'When is payment due?',
        answer: 'You pay only after you have reviewed your prepared return and are ready to approve e-filing. There are no upfront fees to request a quote or get started.',
    },
    {
        question: 'How does the video review work?',
        answer: 'Your preparer schedules a convenient 15–30 minute video call. They share their screen to walk through deductions, credits, and answer questions.',
    },
    {
        question: 'Can I drop off papers in person instead?',
        answer: 'Yes! If you choose the Hybrid tier, you can drop off physical paperwork at any of our 4 offices and complete the rest online.',
    },
    {
        question: 'What happens if the IRS sends a notice?',
        answer: 'We stand behind our work. Our credentialed preparers will help you understand and respond to IRS or state tax correspondence.',
    },
];

export const sampleStats: StatItem[] = [
    { value: '26+', label: 'Years in business' },
    { value: '40,000+', label: 'Returns filed' },
    { value: '12', label: 'Credentialed preparers' },
    { value: '4', label: 'Offices in PA & MD' },
];

export const homePageFixture = register({
    id: 'page-home',
    title: 'Page: Home (§4.1 & §5 Landing Page)',
    states: [
        {
            label: 'Guest (default, sky-only fallback)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Home
                        tiers={sampleTiers}
                        steps={sampleSteps}
                        testimonials={sampleTestimonials}
                        videos={sampleVideos}
                        offices={sampleOffices}
                        faqs={sampleFaqs}
                        stats={sampleStats}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Authenticated client (portal tier current)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Home
                        tiers={sampleTiers}
                        steps={sampleSteps}
                        testimonials={sampleTestimonials}
                        videos={sampleVideos}
                        offices={sampleOffices}
                        faqs={sampleFaqs}
                        stats={sampleStats}
                        userOverride={fixtureClientUser}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'With photo layer (D-08 opt-in)',
            render: () => (
                <React.Suspense fallback={null}>
                    <Home
                        tiers={sampleTiers}
                        steps={sampleSteps}
                        testimonials={sampleTestimonials}
                        videos={sampleVideos}
                        offices={sampleOffices}
                        faqs={sampleFaqs}
                        stats={sampleStats}
                        photoSrc="/og-image.png"
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Intake submitted status state',
            render: () => (
                <div className="bg-background py-12 text-foreground">
                    <HomeIntake tiers={sampleTiers} initialSubmitted />
                </div>
            ),
        },
    ],
});
