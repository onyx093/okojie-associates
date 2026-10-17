import { MapPin, Phone, Clock } from 'lucide-react';
import * as React from 'react';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { OfficeItem } from '@/types/marketing';

interface OfficeCardProps {
    office: OfficeItem;
    className?: string;
}

export function OfficeCard({ office, className }: OfficeCardProps) {
    const cleanPhone = office.phone.replace(/[^0-9]/g, '');

    return (
        <Card
            data-slot="office-card"
            className={cn(
                'flex h-full flex-col justify-between p-6 transition-colors hover:border-border-strong',
                className,
            )}
        >
            <CardHeader className="p-0 pb-4">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
                    <MapPin className="size-4 shrink-0" />
                    <span>Office</span>
                </div>
                <CardTitle className="text-lg font-bold text-foreground">
                    {office.city}
                </CardTitle>
                <CardDescription className="mt-0.5 text-sm text-body">
                    {office.address}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2.5 border-t border-border p-0 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Phone className="size-3.5 shrink-0 text-primary" />
                    <a
                        href={`tel:${cleanPhone}`}
                        className="underline-offset-4 transition-colors hover:text-white hover:underline"
                        aria-label={`Call ${office.city} office at ${office.phone}`}
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
    );
}
