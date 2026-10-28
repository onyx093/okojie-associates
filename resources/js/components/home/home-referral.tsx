import { Link, usePage } from '@inertiajs/react';
import { Gift } from 'lucide-react';
import * as React from 'react';

import {
    container,
    Eyebrow,
    homeButtonClass,
    HomeLinkButton,
} from '@/components/home/primitives';
import { register } from '@/routes';
import { referrals } from '@/routes/portal';

export function HomeReferral() {
    const { props } = usePage<{ auth?: { user?: unknown } }>();
    const href = props.auth?.user
        ? referrals.url()
        : register.url({ query: { next: referrals.url() } });

    return (
        <section aria-labelledby="ref-title" className={container}>
            <div className="relative isolate grid items-center gap-10 overflow-hidden rounded-[22px] bg-[#0c0d16] px-5 py-7 text-[#f2f3f7] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] sm:rounded-[28px] sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-14">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_100%_0%,rgb(94_112_240/0.45),transparent_60%),radial-gradient(50%_70%_at_85%_110%,rgb(246_150_110/0.35),transparent_60%)]"
                />
                <div>
                    <Eyebrow
                        icon={Gift}
                        className="bg-white/8 text-[#f2f3f7] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] [&>span]:bg-[#f2f3f7] [&>span]:text-[#0c0d16]"
                    >
                        Refer a friend
                    </Eyebrow>
                    <h2
                        id="ref-title"
                        className="mt-5 text-[clamp(32px,4vw,48px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance"
                    >
                        Earn $25–$50 for every friend you refer
                    </h2>
                    <p className="mt-4 max-w-[46ch] text-[16.5px] text-pretty text-white/70">
                        Know someone who dreads tax season? When they file with
                        Okojie Online, you earn a reward — and they get a real
                        tax professional who knows Philadelphia and Baltimore.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-2.5">
                        <HomeLinkButton href={href}>
                            Get my referral link
                        </HomeLinkButton>
                        <Link
                            href={href}
                            className={homeButtonClass(
                                'secondary',
                                'bg-white/8 text-[#f2f3f7] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] hover:bg-white/14',
                            )}
                        >
                            Refer someone now
                        </Link>
                    </div>
                </div>
                <div className="rounded-[20px] bg-white/6 p-2 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)] backdrop-blur-md">
                    <div className="rounded-xl bg-[#15161f] p-[18px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06)]">
                        <span className="font-mono text-[10.5px] tracking-[0.08em] text-white/50 uppercase">
                            How it works
                        </span>
                        <ol className="mt-2 grid">
                            {[
                                [
                                    'Share your link',
                                    'Every client gets a unique code and link in their portal.',
                                ],
                                [
                                    'They file, you earn',
                                    'When your friend becomes a client, you earn $25–$50.',
                                ],
                            ].map(([title, body], i) => (
                                <li
                                    key={title}
                                    className="flex items-start gap-3 border-t border-white/7 px-1 py-3 first:border-t-0"
                                >
                                    <span className="grid size-6 shrink-0 place-items-center rounded-[7px] bg-white/8 font-mono text-[11px]">
                                        0{i + 1}
                                    </span>
                                    <span>
                                        <b className="block text-[14.5px] font-medium">
                                            {title}
                                        </b>
                                        <small className="text-[13.5px] text-white/60">
                                            {body}
                                        </small>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
}
