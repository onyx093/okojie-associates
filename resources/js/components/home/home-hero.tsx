import { ArrowRight, Award, Lock, MapPin } from 'lucide-react';
import * as React from 'react';

import { HomeLinkButton } from '@/components/home/primitives';
import { PortalPreview } from '@/components/home/portal-preview';
import { contact } from '@/routes';

export interface HomeHeroProps {
    photoSrc?: string | null;
    photoSrcSet?: string;
}

export function HomeHero({ photoSrc, photoSrcSet }: HomeHeroProps = {}) {
    return (
        <>
            {photoSrc && (
                <img
                    src={photoSrc}
                    srcSet={photoSrcSet}
                    alt=""
                    aria-hidden="true"
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    loading="eager"
                    className="pointer-events-none absolute inset-0 -z-15 size-full object-cover opacity-25 mix-blend-multiply dark:opacity-15 dark:mix-blend-luminosity"
                />
            )}

            <div className="relative z-[2] max-w-[760px] px-5 pt-9 sm:px-14 sm:pt-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-glass py-1.5 pr-3 pl-2 text-[13px] text-muted-foreground shadow-[inset_0_0_0_1px_var(--glass-ring)] backdrop-blur-md">
                    <span className="bg-ok size-2 rounded-full shadow-[0_0_0_3px_rgb(60_196_135/0.2)]" />
                    26+ years · Philadelphia & Baltimore
                </span>

                <h1 className="mt-6 text-[clamp(42px,6.4vw,80px)] leading-[0.98] font-medium tracking-[-0.04em] text-balance">
                    The convenience of online filing, with a{' '}
                    <em className="text-accent-fg not-italic">
                        real tax professional.
                    </em>
                </h1>

                <p className="mt-6 max-w-[52ch] text-[16.5px] text-pretty text-muted-foreground sm:text-lg">
                    Upload your documents, review with your preparer by video,
                    e-sign and file — all from home, backed by a team that knows
                    Pennsylvania and Maryland.
                </p>

                <div className="mt-8 flex flex-wrap gap-2.5">
                    <HomeLinkButton
                        href={`${contact.url()}#start`}
                        className="h-12 flex-[1_1_100%] pr-4 sm:flex-none"
                    >
                        Start my return online
                        <ArrowRight className="size-[15px]" />
                    </HomeLinkButton>
                    <HomeLinkButton
                        href={`${contact.url()}#consult`}
                        variant="secondary"
                        className="h-12 flex-[1_1_100%] sm:flex-none"
                    >
                        Book a free consultation
                    </HomeLinkButton>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                        <Lock className="text-accent-fg size-[15px]" />
                        Secure client portal
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Award className="text-accent-fg size-[15px]" />
                        Credentialed preparers
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <MapPin className="text-accent-fg size-[15px]" />
                        Local PA & MD knowledge
                    </span>
                </div>
            </div>

            <PortalPreview />
        </>
    );
}
