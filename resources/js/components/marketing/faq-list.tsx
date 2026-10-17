import * as React from 'react';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/types/marketing';

interface FaqListProps {
    faqs: FaqItem[];
    defaultOpenIndices?: number[];
    className?: string;
}

export function FaqList({
    faqs,
    defaultOpenIndices = [0],
    className,
}: FaqListProps) {
    const defaultValues = defaultOpenIndices.map((idx) => `faq-${idx}`);

    return (
        <div
            data-slot="faq-list"
            className={cn('mx-auto w-full max-w-[800px]', className)}
        >
            <Accordion type="multiple" defaultValue={defaultValues}>
                {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`}>
                        <AccordionTrigger className="py-5 text-base font-semibold text-foreground sm:text-[17px]">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="max-w-[720px] pb-5 text-sm leading-relaxed text-body sm:text-base">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
