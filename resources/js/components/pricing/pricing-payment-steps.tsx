import { Receipt } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';

interface StepCard {
    num: string;
    title: string;
    description: string;
}

const PAYMENT_STEPS: StepCard[] = [
    {
        num: '01',
        title: 'We review your documents',
        description:
            'Your preparer looks at what you uploaded and sets an exact fee inside your tier’s range.',
    },
    {
        num: '02',
        title: 'You approve and pay online',
        description:
            'Pay by card in your portal before we e-file. Prefer the office? Pay in person.',
    },
    {
        num: '03',
        title: 'Your receipt is saved',
        description: 'Download or print it from your portal any time.',
    },
];

export function PricingPaymentSteps() {
    return (
        <section
            id="how-it-works"
            aria-labelledby="how-title"
            className="py-14 sm:py-20"
        >
            <div className={container}>
                <div className="mb-10 flex flex-col items-center text-center sm:mb-14">
                    <Eyebrow icon={Receipt}>How payment works</Eyebrow>
                    <h2
                        id="how-title"
                        className="mt-5 max-w-[20ch] text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-foreground"
                    >
                        You see the price before you pay
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {PAYMENT_STEPS.map((step) => (
                        <div
                            key={step.num}
                            className="rounded-[20px] bg-card p-6 shadow-card"
                        >
                            <span className="font-mono text-xs tracking-[0.06em] text-muted-foreground">
                                {step.num}
                            </span>
                            <h3 className="mt-3 text-[19px] font-medium tracking-[-0.02em] text-foreground">
                                {step.title}
                            </h3>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
