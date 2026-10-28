import { Info, Users } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { TEAM_MEMBERS } from '@/content/team';

export function AboutTeam() {
    return (
        <section aria-labelledby="team-t" className="pb-14 sm:pb-20">
            <div className={container}>
                <div className="mb-8 grid items-end gap-4 sm:mb-12 md:grid-cols-[1fr_auto] md:gap-8">
                    <div>
                        <Eyebrow icon={Users}>The team</Eyebrow>
                        <h2
                            id="team-t"
                            className="mt-4.5 max-w-[18ch] text-[clamp(32px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.035em] text-foreground"
                        >
                            Meet your preparers
                        </h2>
                    </div>
                    <p className="max-w-[40ch] text-[16.5px] text-muted-foreground md:text-right">
                        Enrolled Agents and experienced preparers, many of whom
                        have served the same families for years.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {TEAM_MEMBERS.map((member) => (
                        <div
                            key={member.name}
                            className="rounded-2xl bg-card p-2 shadow-card"
                        >
                            <div
                                className="flex aspect-[4/5] items-end justify-start rounded-[14px] p-3.5 text-[44px] font-medium tracking-[-0.04em] text-[#0e1020]/55 outline outline-1 -outline-offset-1 outline-border select-none"
                                style={{ background: member.gradient }}
                                aria-label={`${member.name} portrait`}
                            >
                                {member.initials}
                            </div>
                            <div className="pt-3.5 pr-2 pb-2 pl-2">
                                <b className="block text-[15px] font-medium text-foreground">
                                    {member.name}
                                </b>
                                <small className="mt-0.5 block text-[13.5px] text-muted-foreground">
                                    {member.role} · {member.office}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-4 flex items-start gap-2.5 rounded-[10px] bg-sunken p-3 text-[13.5px] text-muted-foreground shadow-[inset_0_0_0_1px_var(--color-border)] sm:px-3.5">
                    <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground/70" />
                    <span>
                        Sample team. Replace with real names, titles and photos.
                    </span>
                </p>
            </div>
        </section>
    );
}
