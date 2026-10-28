import { FileText, Lock, PenLine, Shield, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { cn } from '@/lib/utils';

interface SecurityItem {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    tileClasses: string;
}

const SECURITY_ITEMS: SecurityItem[] = [
    {
        icon: FileText,
        title: 'IRS Publication 4557',
        description: 'We follow the IRS guide to safeguarding taxpayer data.',
        tileClasses: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
    },
    {
        icon: ShieldCheck,
        title: 'FTC Safeguards Rule',
        description:
            'A written information security plan (WISP) governs how we protect client data.',
        tileClasses: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
        icon: Lock,
        title: 'Multi-factor authentication',
        description: 'Every client account is protected with MFA.',
        tileClasses: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
        icon: PenLine,
        title: 'IRS-compliant e-signature',
        description: 'Form 8879 e-file authorization with Form 7216 consent.',
        tileClasses: 'bg-rose-500/10 text-rose-500 dark:text-rose-400',
    },
];

export function AboutSecurity() {
    return (
        <section aria-labelledby="sec-t" className="pb-14 sm:pb-20">
            <div className={container}>
                <div className="mb-8 grid items-end gap-4 sm:mb-12 md:grid-cols-[1fr_auto] md:gap-8">
                    <div>
                        <Eyebrow icon={Shield}>Security</Eyebrow>
                        <h2
                            id="sec-t"
                            className="mt-4.5 max-w-[18ch] text-[clamp(32px,4vw,48px)] leading-[1.05] font-medium tracking-[-0.035em] text-foreground"
                        >
                            Your data is protected
                        </h2>
                    </div>
                    <p className="max-w-[40ch] text-[16.5px] text-muted-foreground md:text-right">
                        Security isn’t an afterthought. It’s built into every
                        step of how we work.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {SECURITY_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="flex items-start gap-4 rounded-2xl bg-card p-6 shadow-card"
                            >
                                <span
                                    className={cn(
                                        'grid size-11 shrink-0 place-items-center rounded-xl',
                                        item.tileClasses,
                                    )}
                                >
                                    <Icon className="size-[19px]" />
                                </span>
                                <div>
                                    <h3 className="text-[18px] font-medium text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
