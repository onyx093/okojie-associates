import { Head, Link } from '@inertiajs/react';
import {
    ShieldCheck,
    UserCheck,
    MapPin,
    ArrowRight,
    Phone,
    Clock,
    Sparkles,
} from 'lucide-react';

import { Reveal } from '@/components/reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { contact } from '@/routes';

interface WelcomeProps {
    site?: {
        tagline?: string;
        stats?: {
            years?: string;
            returns?: string;
            preparers?: string;
            offices?: string;
        };
        offices?: Array<{
            city: string;
            address: string;
            phone: string;
            hours: string;
        }>;
    };
}

export default function Welcome({ site }: WelcomeProps) {
    const stats = [
        { value: site?.stats?.years || '26+', label: 'Years in business' },
        { value: site?.stats?.returns || '40,000+', label: 'Returns filed' },
        {
            value: site?.stats?.preparers || '12',
            label: 'Credentialed preparers',
        },
        { value: site?.stats?.offices || '4', label: 'Offices in PA & MD' },
    ];

    return (
        <MarketingLayout>
            <Head title="Okojie & Associates, Inc. — Okojie Online Tax Preparation" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-border bg-[#14151f] py-20 lg:py-28">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                <div className="relative z-10 mx-auto max-w-[1160px] px-6 text-center">
                    <Reveal delay={0} direction="up">
                        <Badge variant="hero" className="mb-6">
                            <Sparkles className="mr-1 size-3 text-primary" />
                            26+ years · Philadelphia & Baltimore
                        </Badge>
                    </Reveal>

                    <Reveal delay={80} direction="up">
                        <h1 className="mx-auto max-w-[820px] text-4xl leading-[1.08] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            The convenience of online filing, with a real tax
                            professional.
                        </h1>
                    </Reveal>

                    <Reveal delay={160} direction="up">
                        <p className="mx-auto mt-6 max-w-[700px] text-lg leading-relaxed text-body">
                            {site?.tagline ||
                                'Okojie Online brings 26+ years of Philadelphia and Baltimore tax expertise to a secure, fully remote experience — upload, review, e-sign, and file without leaving home.'}
                        </p>
                    </Reveal>

                    <Reveal delay={240} direction="up">
                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                variant="primary"
                                size="lg"
                                asChild
                                className="w-full rounded-full shadow-md sm:w-auto"
                            >
                                <Link href={`${contact.url()}#start`}>
                                    Start My Return Online
                                    <ArrowRight className="ml-1 size-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                asChild
                                className="w-full rounded-full sm:w-auto"
                            >
                                <Link href={`${contact.url()}#consult`}>
                                    Book a Free Consultation
                                </Link>
                            </Button>
                        </div>
                    </Reveal>

                    {/* Trust indicators */}
                    <Reveal delay={320} direction="up">
                        <div className="mx-auto mt-12 flex max-w-[760px] flex-wrap items-center justify-center gap-6 border-t border-border/50 pt-8 text-xs text-muted-foreground sm:gap-10 sm:text-sm">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-4 text-primary" />
                                <span>Secure client portal</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserCheck className="size-4 text-primary" />
                                <span>Credentialed preparers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="size-4 text-primary" />
                                <span>Local PA & MD knowledge</span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="border-b border-border bg-[#181925]/50 py-12">
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
                        {stats.map((stat, idx) => (
                            <Reveal key={idx} delay={idx * 60} direction="up">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                                        {stat.value}
                                    </span>
                                    <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                        {stat.label}
                                    </span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Find Us In Person Section */}
            <section className="py-20 lg:py-24">
                <div className="mx-auto max-w-[1160px] px-6">
                    <div className="mx-auto mb-14 max-w-[680px] text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Find us in person
                        </h2>
                        <p className="mt-3 text-body">
                            Three Philadelphia offices and one in Baltimore — or
                            work with us entirely online.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {(
                            site?.offices || [
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
                            ]
                        ).map((office, idx) => (
                            <Reveal key={idx} delay={idx * 60} direction="up">
                                <Card className="h-full">
                                    <CardHeader className="pb-3">
                                        <div className="mb-1 flex items-center gap-2 text-primary">
                                            <MapPin className="size-4" />
                                            <span className="text-xs font-semibold tracking-wider uppercase">
                                                Office
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg">
                                            {office.city}
                                        </CardTitle>
                                        <CardDescription>
                                            {office.address}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-2 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Phone className="size-3.5 shrink-0 text-primary" />
                                            <a
                                                href={`tel:${office.phone.replace(/[^0-9]/g, '')}`}
                                                className="transition-colors hover:text-white"
                                            >
                                                {office.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Clock className="mt-0.5 size-3.5 shrink-0 text-primary" />
                                            <span>{office.hours}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}
