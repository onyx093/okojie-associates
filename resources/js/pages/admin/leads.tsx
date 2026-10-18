import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Filter,
    Mail,
    Phone,
    UserPlus,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';

interface LeadItem {
    id: string;
    kind: string;
    kindLabel: string;
    name: string;
    email: string;
    phone: string | null;
    tierInterest: string | null;
    situation: string | null;
    preferredDate: string | null;
    timeWindow: string | null;
    format: string | null;
    notes: string | null;
    refCode: string | null;
    status: string;
    statusLabel: string;
    createdAt: string;
}

interface LeadsProps {
    leads: {
        data: LeadItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        total: number;
    };
    filters: {
        kind: string;
        status: string;
    };
    kinds: Array<{ value: string; label: string }>;
    statuses: Array<{ value: string; label: string }>;
}

export default function Leads({ leads, filters, kinds, statuses }: LeadsProps) {
    const [selectedLeadForNotes, setSelectedLeadForNotes] = React.useState<LeadItem | null>(null);
    const [notesText, setNotesText] = React.useState('');
    const [isSavingNotes, setIsSavingNotes] = React.useState(false);

    const handleFilterChange = (key: string, value: string) => {
        const nextFilters = {
            ...filters,
            [key]: value === 'all' ? '' : value,
        };

        const params = new URLSearchParams();
        if (nextFilters.kind) params.set('kind', nextFilters.kind);
        if (nextFilters.status) params.set('status', nextFilters.status);

        router.get(`/admin/leads?${params.toString()}`, {}, { preserveState: true });
    };

    const handleStatusChange = (leadId: string, newStatus: string) => {
        router.patch(`/admin/leads/${leadId}/status`, { status: newStatus }, { preserveScroll: true });
    };

    const handleConvert = (leadId: string) => {
        if (confirm('Convert this lead to a registered client with an active tax return?')) {
            router.post(`/admin/leads/${leadId}/convert`);
        }
    };

    const openNotesDialog = (lead: LeadItem) => {
        setSelectedLeadForNotes(lead);
        setNotesText(lead.notes || '');
    };

    const handleSaveNotes = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLeadForNotes) return;

        setIsSavingNotes(true);
        router.patch(
            `/admin/leads/${selectedLeadForNotes.id}/notes`,
            { notes: notesText },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedLeadForNotes(null);
                    setIsSavingNotes(false);
                },
                onError: () => {
                    setIsSavingNotes(false);
                },
            }
        );
    };

    return (
        <AdminLayout title="Leads Inbox">
            <Head title="Admin - Leads Inbox" />

            <div className="space-y-6">
                {/* Filter bar */}
                <Card className="border-border bg-card">
                    <CardHeader className="py-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <Filter className="size-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-semibold">Filter Inquiries</CardTitle>
                                <span className="text-xs text-muted-foreground">
                                    ({leads.total} total)
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="w-40">
                                    <Select
                                        value={filters.kind || 'all'}
                                        onValueChange={(val) => handleFilterChange('kind', val)}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="All kinds" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All kinds</SelectItem>
                                            {kinds.map((k) => (
                                                <SelectItem key={k.value} value={k.value}>
                                                    {k.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-40">
                                    <Select
                                        value={filters.status || 'all'}
                                        onValueChange={(val) => handleFilterChange('status', val)}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All statuses</SelectItem>
                                            {statuses.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Leads Table */}
                <Card className="border-border bg-card">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="w-[120px]">Kind</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Details / Preference</TableHead>
                                        <TableHead className="w-[140px]">Status</TableHead>
                                        <TableHead className="w-[100px]">Notes</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leads.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                                                No leads matching the selected filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        leads.data.map((lead) => {
                                            const isConverted = lead.status === 'converted';

                                            return (
                                                <TableRow key={lead.id} className="border-border">
                                                    <TableCell>
                                                        <Badge
                                                            variant={lead.kind === 'quote' ? 'outline' : 'secondary'}
                                                            className="text-[11px]"
                                                        >
                                                            {lead.kindLabel}
                                                        </Badge>
                                                        <div className="mt-1 text-[10px] text-muted-foreground">
                                                            {lead.createdAt}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="font-medium text-foreground">{lead.name}</div>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Mail className="size-3" />
                                                            {lead.email}
                                                        </div>
                                                        {lead.phone && (
                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                <Phone className="size-3" />
                                                                {lead.phone}
                                                            </div>
                                                        )}
                                                        {lead.refCode && (
                                                            <div className="mt-0.5 text-[10px] text-primary">
                                                                Ref: {lead.refCode}
                                                            </div>
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {lead.tierInterest && (
                                                            <div className="text-xs font-medium text-foreground">
                                                                Interest: <span className="text-primary">{lead.tierInterest}</span>
                                                            </div>
                                                        )}
                                                        {lead.preferredDate && (
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Calendar className="size-3" />
                                                                {lead.preferredDate} ({lead.timeWindow || 'Anytime'}, {lead.format || 'Video'})
                                                            </div>
                                                        )}
                                                        {lead.situation && (
                                                            <p className="mt-1 line-clamp-2 max-w-sm text-xs text-muted-foreground">
                                                                {lead.situation}
                                                            </p>
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Select
                                                            value={lead.status}
                                                            onValueChange={(val) => handleStatusChange(lead.id, val)}
                                                        >
                                                            <SelectTrigger className="h-7 text-xs">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {statuses.map((s) => (
                                                                    <SelectItem key={s.value} value={s.value}>
                                                                        {s.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openNotesDialog(lead)}
                                                            className="h-7 px-2 text-xs"
                                                        >
                                                            <FileText className="mr-1 size-3.5" />
                                                            {lead.notes ? 'Edit' : 'Add'}
                                                        </Button>
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        {isConverted ? (
                                                            <span className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-500">
                                                                <CheckCircle2 className="size-3.5" />
                                                                Converted
                                                            </span>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs"
                                                                onClick={() => handleConvert(lead.id)}
                                                            >
                                                                <UserPlus className="mr-1.5 size-3.5 text-primary" />
                                                                Convert
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notes Dialog */}
            <Dialog open={!!selectedLeadForNotes} onOpenChange={(open) => !open && setSelectedLeadForNotes(null)}>
                <DialogContent>
                    <form onSubmit={handleSaveNotes}>
                        <DialogHeader>
                            <DialogTitle>Lead Notes: {selectedLeadForNotes?.name}</DialogTitle>
                            <DialogDescription>
                                Internal notes visible to firm preparers and admins.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <Textarea
                                rows={4}
                                placeholder="Enter follow-up details, tax situation notes..."
                                value={notesText}
                                onChange={(e) => setNotesText(e.target.value)}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelectedLeadForNotes(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSavingNotes}>
                                {isSavingNotes ? 'Saving...' : 'Save Notes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
