import { Link, usePage } from '@inertiajs/react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import * as React from 'react';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Office {
    city: string;
    address: string;
    phone: string;
    hours: string;
}

interface SiteProps {
    brand?: {
        legal_name?: string;
        product?: string;
    };
    tagline?: string;
    footer_blurb?: string;
    compliance?: string;
    offices?: Office[];
}

const defaultOffices: Office[] = [
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

export function SiteFooter() {
    const pageProps = usePage().props as unknown as {
        site?: SiteProps;
        auth?: {
            user?: {
                name: string;
                email: string;
            } | null;
        };
    };

    const site = pageProps.site;
    const user = pageProps.auth?.user;
    const offices =
        site?.offices && site.offices.length > 0
            ? site.offices
            : defaultOffices;
    const currentYear = new Date().getFullYear();

    const [newsletterEmail, setNewsletterEmail] = React.useState('');
    const [newsletterStatus, setNewsletterStatus] = React.useState<
        'idle' | 'submitting' | 'success' | 'error'
    >('idle');
    const [newsletterMessage, setNewsletterMessage] = React.useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            setNewsletterStatus('error');
            setNewsletterMessage('Please enter a valid email address.');
            return;
        }

        setNewsletterStatus('submitting');
        // Client-side shell handling for newsletter subscription
        setTimeout(() => {
            setNewsletterStatus('success');
            setNewsletterMessage("Thanks — you're subscribed!");
            setNewsletterEmail('');
        }, 400);
    };

    return (
        <footer className="w-full border-t border-border bg-card/60 text-body">
            <div className="mx-auto max-w-[1160px] px-6 py-16 lg:py-20">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
                    {/* Column 1: Brand & Newsletter Shell (5 cols) */}
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        <BrandLogo showSublabel={false} href="/" />
                        <p className="max-w-[420px] text-sm leading-relaxed text-body">
                            {site?.footer_blurb ||
                                'The convenience of online filing, with a real tax professional who knows Philadelphia and Baltimore. Serving individuals, families, and small businesses for 26+ years.'}
                        </p>

                        {/* Newsletter Form Shell */}
                        <div className="mt-2 flex max-w-[420px] flex-col gap-2">
                            <form
                                onSubmit={handleSubscribe}
                                className="relative flex items-center"
                            >
                                <Input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => {
                                        setNewsletterEmail(e.target.value);
                                        if (newsletterStatus !== 'idle')
                                            setNewsletterStatus('idle');
                                    }}
                                    placeholder="Email for tax tips & deadlines"
                                    className="h-11 rounded-full border-border bg-secondary pr-28 pl-4 text-xs placeholder:text-muted-foreground focus-visible:border-primary sm:text-sm"
                                    aria-label="Email for tax tips & deadlines"
                                    disabled={
                                        newsletterStatus === 'submitting' ||
                                        newsletterStatus === 'success'
                                    }
                                />
                                <Button
                                    type="submit"
                                    size="compact"
                                    variant="primary"
                                    disabled={
                                        newsletterStatus === 'submitting' ||
                                        newsletterStatus === 'success'
                                    }
                                    className="absolute right-1.5 h-8 rounded-full px-3.5 text-xs font-semibold shadow-xs"
                                >
                                    <Send className="mr-1 size-3" />
                                    Subscribe
                                </Button>
                            </form>

                            {newsletterStatus === 'success' && (
                                <div className="flex items-center gap-1.5 text-xs text-success">
                                    <CheckCircle2 className="size-3.5 shrink-0" />
                                    <span>{newsletterMessage}</span>
                                </div>
                            )}
                            {newsletterStatus === 'error' && (
                                <div className="flex items-center gap-1.5 text-xs text-destructive">
                                    <AlertCircle className="size-3.5 shrink-0" />
                                    <span>{newsletterMessage}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Explore Navigation (3 cols) */}
                    <div className="flex flex-col gap-4 lg:col-span-3">
                        <h4 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                            Explore
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-muted-foreground transition-colors hover:text-white"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="text-muted-foreground transition-colors hover:text-white"
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pricing"
                                    className="text-muted-foreground transition-colors hover:text-white"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-muted-foreground transition-colors hover:text-white"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-muted-foreground transition-colors hover:text-white"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                {user ? (
                                    <Link
                                        href="/portal"
                                        className="text-muted-foreground transition-colors hover:text-white"
                                    >
                                        My Portal
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="text-muted-foreground transition-colors hover:text-white"
                                    >
                                        Client Login
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Offices (4 cols) */}
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        <h4 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
                            Offices
                        </h4>
                        <div className="grid grid-cols-1 gap-3.5 text-sm sm:grid-cols-2 lg:grid-cols-1">
                            {offices.map((office, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <span className="text-[13px] font-medium text-foreground">
                                        {office.city}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {office.address}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
                    <p>
                        © {currentYear} Okojie & Associates, Inc. All rights
                        reserved.
                    </p>
                    <p className="text-center sm:text-right">
                        {site?.compliance ||
                            'IRS Publication 4557 & FTC Safeguards compliant · Written Information Security Plan (WISP)'}
                    </p>
                </div>
            </div>
        </footer>
    );
}
