import * as React from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { AddOnItem } from '@/types/marketing';

interface AddOnTableProps {
    addOns: AddOnItem[];
    className?: string;
}

export function AddOnTable({ addOns, className }: AddOnTableProps) {
    return (
        <div data-slot="add-on-table" className={cn('w-full', className)}>
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border bg-secondary/70">
                        <TableHead className="w-[280px] font-semibold text-foreground">
                            Service
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                            What it covers
                        </TableHead>
                        <TableHead className="w-[160px] text-right font-semibold text-foreground">
                            Starting at
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {addOns.map((addOn) => (
                        <TableRow
                            key={addOn.slug}
                            className="transition-colors hover:bg-secondary/30"
                        >
                            <TableCell className="py-4 align-top font-semibold text-foreground">
                                {addOn.name}
                            </TableCell>
                            <TableCell className="py-4 align-top leading-relaxed text-body">
                                {addOn.description}
                            </TableCell>
                            <TableCell className="py-4 text-right align-top font-bold whitespace-nowrap text-primary">
                                {addOn.price}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
