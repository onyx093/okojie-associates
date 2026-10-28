import { ArrowRight } from 'lucide-react';
import * as React from 'react';

import { Eyebrow, HomeLinkButton } from '@/components/home/primitives';
import { SkyBackdrop } from '@/components/home/sky-backdrop';
import { contact } from '@/routes';

export function HomeFinalCta() {
    return (
        <section aria-labelledby="final-title" className="mx-2 sm:mx-3">
            <SkyBackdrop
                variant="cta"
                className="px-5 py-16 text-center sm:px-14 sm:py-24"
            >
                <div className="flex justify-center">
                    <Eyebrow
                        icon={ArrowRight}
                        className="bg-glass shadow-[inset_0_0_0_1px_var(--glass-ring)] backdrop-blur-md"
                    >
                        Start now
                    </Eyebrow>
                </div>
                <h2
                    id="final-title"
                    className="mx-auto mt-5 max-w-[16ch] text-[clamp(36px,5vw,64px)] leading-none font-medium tracking-[-0.04em] text-balance text-foreground"
                >
                    Same trusted preparers. No waiting room.
                </h2>
                <p className="mx-auto mt-[18px] max-w-[46ch] text-[17px] text-muted-foreground">
                    Start online in minutes and track every step of your return
                    in your portal.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2.5">
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
            </SkyBackdrop>
        </section>
    );
}
