import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Home,
    RefreshCw,
    ShieldAlert,
} from 'lucide-react';
import * as React from 'react';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { contact, home, portal } from '@/routes';

interface ErrorPageProps {
    status: number;
}

export default function ErrorPage({ status }: ErrorPageProps) {
    const titles: Record<number, string> = {
        404: 'Page Not Found',
        403: 'Access Restricted',
        419: 'Session Expired',
        500: 'Internal Server Error',
        503: 'Service Unavailable',
    };

    const descriptions: Record<number, string> = {
        404: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
        403: 'You do not have authorization to view this page or document. If you believe this is in error, please contact your preparer.',
        419: 'Your security token or login session has expired due to inactivity. Please refresh the page and try again.',
        500: 'Something went wrong on our servers. Our support team has logged the issue and is looking into it.',
        503: 'We are currently performing routine maintenance or updates. Please check back in a few minutes.',
    };

    const title = titles[status] ?? 'An Error Occurred';
    const description =
        descriptions[status] ??
        'An unexpected condition was encountered. Please try navigating back.';

    return (
        <div className="flex min-h-screen flex-col bg-[#14151f] text-[#f4f5fa]">
            <Head title={`${status}: ${title} | Okojie Online`}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Header */}
            <header className="border-b border-[#2a2b3b] bg-[#14151f]/90 px-6 py-5 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1160px] items-center justify-between">
                    <BrandLogo showSublabel={true} href={home.url()} />
                    <Link
                        href={home.url()}
                        className="text-xs font-medium text-[#a3a6ba] transition-colors hover:text-white"
                    >
                        Return to site
                    </Link>
                </div>
            </header>

            {/* Main error container */}
            <main className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
                <div className="w-full max-w-lg rounded-[20px] border border-[#2a2b3b] bg-[#1c1d2a] p-8 text-center shadow-2xl sm:p-12">
                    {/* Status Badge & Icon */}
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#4f63e8]/10 text-[#4f63e8]">
                        {status === 403 ? (
                            <ShieldAlert className="size-8 text-[#ef5b5b]" />
                        ) : status === 419 ? (
                            <RefreshCw className="size-8 text-[#f5b942]" />
                        ) : (
                            <AlertTriangle className="size-8" />
                        )}
                    </div>

                    <div className="mt-5 inline-flex items-center rounded-full border border-[#2a2b3b] bg-[#181925] px-3.5 py-1 text-xs font-semibold text-[#a3a6ba]">
                        HTTP Status {status}
                    </div>

                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {title}
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-[#a3a6ba] sm:text-base">
                        {description}
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        {status === 419 ? (
                            <Button
                                variant="primary"
                                onClick={() => window.location.reload()}
                                className="w-full sm:w-auto"
                            >
                                <RefreshCw className="mr-2 size-4" />
                                Refresh Page
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                asChild
                                className="w-full sm:w-auto"
                            >
                                <Link href={home.url()}>
                                    <Home className="mr-2 size-4" />
                                    Back to Home
                                </Link>
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link href={portal.url()}>
                                <ArrowLeft className="mr-2 size-4" />
                                Client Portal
                            </Link>
                        </Button>
                    </div>

                    {/* Support note */}
                    <p className="mt-8 border-t border-[#2a2b3b]/60 pt-6 text-xs text-[#a3a6ba]">
                        Need assistance? Call{' '}
                        <a
                            href="tel:2155550142"
                            className="text-white hover:underline"
                        >
                            (215) 555-0142
                        </a>{' '}
                        or{' '}
                        <Link
                            href={contact.url()}
                            className="text-[#4f63e8] hover:underline"
                        >
                            contact support
                        </Link>
                        .
                    </p>
                </div>
            </main>
        </div>
    );
}
