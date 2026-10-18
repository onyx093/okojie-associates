import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    FileText,
    History,
    Mail,
    MessageSquare,
    Phone,
    Send,
    Shield,
    Sparkles,
    UserCheck,
    Users,
    XCircle,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface ClientShowProps {
    client: {
        id: number;
        name: string | null;
        email: string;
        phone: string | null;
        tier: string | null;
        tierLabel: string;
        referralCode: string | null;
        referredByCode: string | null;
        createdAt: string;
    };
    taxReturn: {
        id: string;
        taxYear: number;
        status: string;
        statusLabel: string;
        statusOrder: number;
        preparerId: number | null;
        preparerName: string;
        signedAt: string | null;
        filedAt: string | null;
        invoice: {
            id: string;
            amountCents: number | null;
            amountDollars: string;
            formattedAmount: string;
            status: string;
            statusLabel: string;
            isPaid: boolean;
            paidAt: string | null;
        } | null;
        statusEvents: Array<{
            id: string;
            from: string | null;
            to: string;
            byUserName: string;
            reason: string | null;
            createdAt: string;
        }>;
    };
    documents: Array<{
        id: string;
        fileName: string;
        docType: string;
        docTypeLabel: string;
        fileSizeBytes: number;
        formattedSize: string;
        scanStatus: string;
        scanStatusLabel: string;
        createdAt: string;
        downloadUrl: string;
    }>;
    appointments: Array<{
        id: string;
        preferredDate: string;
        timeWindow: string;
        format: string;
        topic: string | null;
        notes: string | null;
        status: string;
        statusLabel: string;
        createdAt: string;
    }>;
    messages: Array<{
        id: string;
        fromUserId: number;
        toUserId: number;
        fromName: string;
        isFromStaff: boolean;
        body: string;
        readAt: string | null;
        formattedDate: string;
    }>;
    referrals: Array<{
        id: string;
        friendName: string;
        friendEmail: string;
        status: string;
        statusLabel: string;
        reward: string;
        createdAt: string;
    }>;
    preparers: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
    allStatuses: Array<{
        value: string;
        label: string;
        order: number;
    }>;
    allTiers: Array<{
        value: string;
        label: string;
    }>;
}

export default function ClientShow({
    client,
    taxReturn,
    documents,
    appointments,
    messages,
    referrals,
    preparers,
    allStatuses,
    allTiers,
}: ClientShowProps) {
    // Status update dialog state
    const [targetStatus, setTargetStatus] = React.useState<string | null>(null);
    const [reverseReason, setReverseReason] = React.useState('');
    const [statusError, setStatusError] = React.useState<string | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

    // Invoice edit state
    const [invoiceAmount, setInvoiceAmount] = React.useState(taxReturn.invoice?.amountDollars || '');
    const [isUpdatingInvoice, setIsUpdatingInvoice] = React.useState(false);

    // Message composer state
    const [messageBody, setMessageBody] = React.useState('');
    const [isSendingMessage, setIsSendingMessage] = React.useState(false);

    const isReversal = React.useMemo(() => {
        if (!targetStatus) return false;
        const targetObj = allStatuses.find((s) => s.value === targetStatus);
        return targetObj ? targetObj.order < taxReturn.statusOrder : false;
    }, [targetStatus, allStatuses, taxReturn.statusOrder]);

    const handleSelectStatusChange = (val: string) => {
        if (val === taxReturn.status) return;
        setTargetStatus(val);
        setReverseReason('');
        setStatusError(null);
    };

    const confirmStatusChange = () => {
        if (!targetStatus) return;

        if (isReversal && !reverseReason.trim()) {
            setStatusError('A reason is required when reversing return status.');
            return;
        }

        setIsUpdatingStatus(true);
        router.patch(
            `/admin/tax-returns/${taxReturn.id}/status`,
            {
                status: targetStatus,
                reason: isReversal ? reverseReason.trim() : null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setTargetStatus(null);
                    setReverseReason('');
                    setIsUpdatingStatus(false);
                },
                onError: (errors) => {
                    setStatusError(errors.reason || 'Failed to update status.');
                    setIsUpdatingStatus(false);
                },
            }
        );
    };

    const handleTierChange = (val: string) => {
        router.patch(`/admin/clients/${client.id}/tier`, { tier: val }, { preserveScroll: true });
    };

    const handlePreparerChange = (val: string) => {
        const preparerId = val === 'unassigned' ? null : parseInt(val, 10);
        router.patch(`/admin/clients/${client.id}/preparer`, { preparer_id: preparerId }, { preserveScroll: true });
    };

    const handleSaveInvoiceAmount = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingInvoice(true);
        router.patch(
            `/admin/tax-returns/${taxReturn.id}/invoice`,
            { amount_dollars: invoiceAmount },
            {
                preserveScroll: true,
                onSuccess: () => setIsUpdatingInvoice(false),
                onError: () => setIsUpdatingInvoice(false),
            }
        );
    };

    const handleMarkPaidOffline = () => {
        if (confirm('Mark this invoice as paid offline?')) {
            router.patch(
                `/admin/tax-returns/${taxReturn.id}/invoice`,
                { mark_paid_offline: true },
                { preserveScroll: true }
            );
        }
    };

    const handleAppointmentStatus = (apptId: string, status: string) => {
        router.patch(
            `/admin/appointments/${apptId}/status`,
            { status },
            { preserveScroll: true }
        );
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageBody.trim()) return;

        setIsSendingMessage(true);
        router.post(
            `/admin/clients/${client.id}/messages`,
            { body: messageBody.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setMessageBody('');
                    setIsSendingMessage(false);
                },
                onError: () => setIsSendingMessage(false),
            }
        );
    };

    return (
        <AdminLayout title={`Client: ${client.name || client.email}`}>
            <Head title={`Admin - ${client.name || client.email}`} />

            <div className="space-y-8">
                {/* Top Profile & Settings Card */}
                <Card className="border-border bg-card">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                    {client.name ? client.name.charAt(0).toUpperCase() : client.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">
                                        {client.name || 'Unnamed Client'}
                                    </CardTitle>
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Mail className="size-3.5" />
                                            {client.email}
                                        </span>
                                        {client.phone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="size-3.5" />
                                                {client.phone}
                                            </span>
                                        )}
                                        <span>Joined {client.createdAt}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[11px] text-muted-foreground">Service Tier</Label>
                                    <Select value={client.tier || ''} onValueChange={handleTierChange}>
                                        <SelectTrigger className="h-8 w-44 text-xs">
                                            <SelectValue placeholder="Select tier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allTiers.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>
                                                    {t.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[11px] text-muted-foreground">Assigned Preparer</Label>
                                    <Select
                                        value={taxReturn.preparerId ? taxReturn.preparerId.toString() : 'unassigned'}
                                        onValueChange={handlePreparerChange}
                                    >
                                        <SelectTrigger className="h-8 w-48 text-xs">
                                            <SelectValue placeholder="Select preparer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {preparers.map((p) => (
                                                <SelectItem key={p.id} value={p.id.toString()}>
                                                    {p.name} ({p.role})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Return Status Stepper & Control */}
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Tax Year {taxReturn.taxYear} Return Progress
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Current status: <span className="font-semibold text-primary">{taxReturn.statusLabel}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Select
                                        value={taxReturn.status}
                                        onValueChange={handleSelectStatusChange}
                                    >
                                        <SelectTrigger className="h-8 w-48 text-xs">
                                            <SelectValue placeholder="Change status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allStatuses.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Stepper visual */}
                            <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-5">
                                {allStatuses.map((s) => {
                                    const isCurrent = s.value === taxReturn.status;
                                    const isCompleted = s.order <= taxReturn.statusOrder;

                                    return (
                                        <div
                                            key={s.value}
                                            className={`flex flex-col rounded-lg border p-3 text-xs transition-colors ${
                                                isCurrent
                                                    ? 'border-primary bg-primary/5 font-semibold text-primary'
                                                    : isCompleted
                                                    ? 'border-border/80 bg-secondary/30 text-foreground'
                                                    : 'border-border/40 text-muted-foreground opacity-60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1.5 pb-1">
                                                {isCompleted ? (
                                                    <CheckCircle2 className="size-3.5 text-primary" />
                                                ) : (
                                                    <Clock className="size-3.5 text-muted-foreground" />
                                                )}
                                                <span>{s.label}</span>
                                            </div>
                                            {isCurrent && (
                                                <span className="text-[10px] text-primary">Active Stage</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2-Column Grid: Left: Invoice & Documents; Right: Appointments & Messages */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left 6 Columns: Invoice & Documents */}
                    <div className="space-y-8 lg:col-span-6">
                        {/* Invoice Editor */}
                        <Card className="border-border bg-card">
                            <CardHeader className="border-b border-border/60 pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="size-4 text-primary" />
                                        <CardTitle className="text-base font-bold">Client Invoice</CardTitle>
                                    </div>
                                    {taxReturn.invoice && (
                                        <Badge
                                            variant={taxReturn.invoice.isPaid ? 'default' : 'outline'}
                                            className="text-xs capitalize"
                                        >
                                            {taxReturn.invoice.statusLabel}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 p-5">
                                <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                                    <div>
                                        <span className="text-xs text-muted-foreground">Current Fee</span>
                                        <div className="text-xl font-bold text-foreground">
                                            {taxReturn.invoice?.formattedAmount || 'Awaiting quote'}
                                        </div>
                                    </div>
                                    {taxReturn.invoice?.isPaid ? (
                                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                                            <Check className="size-4" /> Paid offline {taxReturn.invoice.paidAt}
                                        </span>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handleMarkPaidOffline}
                                            className="h-8 text-xs"
                                        >
                                            <Check className="mr-1.5 size-3.5 text-emerald-500" />
                                            Mark Paid Offline
                                        </Button>
                                    )}
                                </div>

                                <form onSubmit={handleSaveInvoiceAmount} className="flex items-end gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor="invoice-amount" className="text-xs">
                                            Set Amount ($ USD)
                                        </Label>
                                        <div className="relative">
                                            <DollarSign className="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
                                            <Input
                                                id="invoice-amount"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="225.00"
                                                value={invoiceAmount}
                                                onChange={(e) => setInvoiceAmount(e.target.value)}
                                                className="h-8 pl-8 text-xs"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isUpdatingInvoice}
                                        className="h-8 text-xs"
                                    >
                                        {isUpdatingInvoice ? 'Saving...' : 'Update Fee'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Documents List */}
                        <Card className="border-border bg-card">
                            <CardHeader className="border-b border-border/60 pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="size-4 text-primary" />
                                        <CardTitle className="text-base font-bold">Uploaded Documents</CardTitle>
                                        <span className="text-xs text-muted-foreground">
                                            ({documents.length})
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {documents.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-muted-foreground">
                                        No documents uploaded yet.
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-border hover:bg-transparent">
                                                <TableHead>File</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Scan</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {documents.map((doc) => (
                                                <TableRow key={doc.id} className="border-border">
                                                    <TableCell>
                                                        <div className="font-medium text-xs text-foreground truncate max-w-[160px]" title={doc.fileName}>
                                                            {doc.fileName}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground">
                                                            {doc.formattedSize} · {doc.createdAt}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-[10px]">
                                                            {doc.docTypeLabel}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`text-[10px] font-medium ${
                                                                doc.scanStatus === 'clean'
                                                                    ? 'text-emerald-500'
                                                                    : doc.scanStatus === 'infected'
                                                                    ? 'text-destructive'
                                                                    : 'text-amber-500'
                                                            }`}
                                                        >
                                                            {doc.scanStatusLabel}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            asChild
                                                            className="h-7 px-2 text-xs"
                                                            disabled={doc.scanStatus !== 'clean'}
                                                        >
                                                            <a href={doc.downloadUrl} download>
                                                                <Download className="mr-1 size-3" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status History Audit Trail */}
                        <Card className="border-border bg-card">
                            <CardHeader className="border-b border-border/60 pb-3">
                                <div className="flex items-center gap-2">
                                    <History className="size-4 text-primary" />
                                    <CardTitle className="text-base font-bold">Status History & Audit</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                {taxReturn.statusEvents.length === 0 ? (
                                    <div className="text-center text-xs text-muted-foreground py-4">
                                        No status changes recorded yet.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {taxReturn.statusEvents.map((evt) => (
                                            <div
                                                key={evt.id}
                                                className="rounded-lg border border-border/60 bg-secondary/20 p-2.5 text-xs space-y-1"
                                            >
                                                <div className="flex items-center justify-between font-medium">
                                                    <span>
                                                        {evt.from || 'Initial'} &rarr; <span className="text-primary font-semibold">{evt.to}</span>
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {evt.createdAt}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    Updated by: <span className="text-foreground">{evt.byUserName}</span>
                                                </div>
                                                {evt.reason && (
                                                    <div className="rounded bg-background/80 p-1.5 text-[11px] text-muted-foreground italic">
                                                        Reason: &ldquo;{evt.reason}&rdquo;
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right 6 Columns: Messages, Appointments & Referrals */}
                    <div className="space-y-8 lg:col-span-6">
                        {/* Messages Thread & Composer */}
                        <Card className="border-border bg-card">
                            <CardHeader className="border-b border-border/60 pb-3">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="size-4 text-primary" />
                                    <CardTitle className="text-base font-bold">Direct Messaging</CardTitle>
                                </div>
                                <CardDescription className="text-xs">
                                    Messages posted here appear directly in the client&apos;s portal.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-5">
                                {/* Thread */}
                                <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                                    {messages.length === 0 ? (
                                        <div className="py-8 text-center text-xs text-muted-foreground">
                                            No messages exchanged yet.
                                        </div>
                                    ) : (
                                        messages.map((m) => (
                                            <div
                                                key={m.id}
                                                className={`rounded-lg border p-3 text-xs ${
                                                    m.isFromStaff
                                                        ? 'border-primary/20 bg-primary/5 ml-4'
                                                        : 'border-border bg-secondary/30 mr-4'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between font-semibold pb-1">
                                                    <span>{m.fromName}</span>
                                                    <span className="text-[10px] text-muted-foreground font-normal">
                                                        {m.formattedDate}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                                    {m.body}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Composer Form */}
                                <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-border">
                                    <Textarea
                                        rows={3}
                                        placeholder="Write an update or request documents from client..."
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                        className="text-xs resize-none"
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={isSendingMessage || !messageBody.trim()}
                                            className="h-8 text-xs"
                                        >
                                            <Send className="mr-1.5 size-3.5" />
                                            {isSendingMessage ? 'Sending...' : 'Post Message'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Appointments */}
                        <Card className="border-border bg-card">
                            <CardHeader className="border-b border-border/60 pb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4 text-primary" />
                                    <CardTitle className="text-base font-bold">Appointments</CardTitle>
                                    <span className="text-xs text-muted-foreground">
                                        ({appointments.length})
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {appointments.length === 0 ? (
                                    <div className="py-6 text-center text-xs text-muted-foreground">
                                        No appointments requested yet.
                                    </div>
                                ) : (
                                    appointments.map((appt) => (
                                        <div
                                            key={appt.id}
                                            className="rounded-lg border border-border p-3 text-xs space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="font-semibold text-foreground">
                                                    {appt.preferredDate} ({appt.timeWindow})
                                                </div>
                                                <Badge
                                                    variant={
                                                        appt.status === 'confirmed'
                                                            ? 'default'
                                                            : appt.status === 'cancelled'
                                                            ? 'destructive'
                                                            : 'outline'
                                                    }
                                                    className="text-[10px]"
                                                >
                                                    {appt.statusLabel}
                                                </Badge>
                                            </div>

                                            <div className="text-[11px] text-muted-foreground">
                                                Format: <span className="text-foreground">{appt.format}</span>
                                                {appt.topic && (
                                                    <span className="ml-2">Topic: <span className="text-foreground">{appt.topic}</span></span>
                                                )}
                                            </div>

                                            {appt.notes && (
                                                <p className="text-[11px] text-muted-foreground italic bg-secondary/30 p-2 rounded">
                                                    &ldquo;{appt.notes}&rdquo;
                                                </p>
                                            )}

                                            {appt.status === 'requested' && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs text-emerald-500 hover:text-emerald-600"
                                                        onClick={() => handleAppointmentStatus(appt.id, 'confirmed')}
                                                    >
                                                        <Check className="mr-1 size-3" />
                                                        Confirm
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 text-xs text-destructive hover:text-destructive"
                                                        onClick={() => handleAppointmentStatus(appt.id, 'cancelled')}
                                                    >
                                                        <XCircle className="mr-1 size-3" />
                                                        Cancel
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Referral Details */}
                        <Card className="border-border bg-card">
                            <CardHeader className="border-b border-border/60 pb-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="size-4 text-primary" />
                                    <CardTitle className="text-base font-bold">Referral Details</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Referral Code</span>
                                    <span className="font-mono font-semibold text-foreground">
                                        {client.referralCode || '—'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Referred By</span>
                                    <span className="font-mono text-foreground">
                                        {client.referredByCode || 'None'}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-border">
                                    <div className="font-semibold pb-1">Referrals Made ({referrals.length})</div>
                                    {referrals.length === 0 ? (
                                        <p className="text-muted-foreground text-[11px]">Has not referred any friends yet.</p>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {referrals.map((r) => (
                                                <div key={r.id} className="flex items-center justify-between text-[11px] bg-secondary/30 p-2 rounded">
                                                    <div>
                                                        <span className="font-medium text-foreground">{r.friendName}</span>
                                                        <span className="text-muted-foreground ml-1.5">({r.friendEmail})</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[9px] capitalize">{r.status}</Badge>
                                                        <span className="font-semibold text-foreground">{r.reward}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Status Change Confirmation Dialog */}
            <Dialog open={!!targetStatus} onOpenChange={(open) => !open && setTargetStatus(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isReversal ? 'Confirm Status Reversal' : 'Confirm Status Advance'}
                        </DialogTitle>
                        <DialogDescription>
                            {isReversal
                                ? `You are moving this return backward from "${taxReturn.statusLabel}" to "${allStatuses.find((s) => s.value === targetStatus)?.label}". A documented reason is required.`
                                : `Move return progress to "${allStatuses.find((s) => s.value === targetStatus)?.label}"? This will notify the client via queued email.`}
                        </DialogDescription>
                    </DialogHeader>

                    {isReversal && (
                        <div className="space-y-2 py-2">
                            <Label htmlFor="reverse-reason" className="text-xs">
                                Reason for Reversal <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="reverse-reason"
                                rows={3}
                                placeholder="e.g., Missing 1099-MISC form; revision needed on Schedule C..."
                                value={reverseReason}
                                onChange={(e) => setReverseReason(e.target.value)}
                                className="text-xs"
                                required
                            />
                            {statusError && (
                                <p className="text-xs text-destructive font-medium flex items-center gap-1">
                                    <AlertCircle className="size-3.5" />
                                    {statusError}
                                </p>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setTargetStatus(null)}
                            disabled={isUpdatingStatus}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmStatusChange}
                            disabled={isUpdatingStatus}
                        >
                            {isUpdatingStatus ? 'Updating...' : 'Confirm Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
