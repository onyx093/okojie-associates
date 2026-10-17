import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CalendarPlus,
    Clock,
    Loader2,
    MapPin,
    Phone,
    Video,
    XCircle,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { destroy, store } from '@/actions/App/Http/Controllers/Portal/AppointmentController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PortalLayout } from '@/layouts/portal-layout';
import { cn } from '@/lib/utils';

export interface AppointmentItem {
    id: string;
    preferred_date: string;
    preferred_date_formatted: string;
    preferred_date_full: string;
    time_window: string;
    time_window_label: string;
    format: string;
    format_label: string;
    topic: string | null;
    notes: string | null;
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
    status_label: string;
    confirmed_at: string | null;
    created_at: string | null;
    created_at_formatted: string | null;
    can_cancel: boolean;
}

interface AppointmentsPageProps {
    appointments: AppointmentItem[];
}

const TIME_WINDOWS = [
    { value: 'morning', label: 'Morning (9am–12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm–4pm)' },
    { value: 'evening', label: 'Evening (4pm–6pm)' },
    { value: 'any', label: 'Any time' },
];

const FORMAT_OPTIONS = [
    { value: 'video', label: 'Video call', icon: Video },
    { value: 'phone', label: 'Phone call', icon: Phone },
    { value: 'in_person', label: 'In person', icon: MapPin },
];

function getLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function AppointmentsPage({ appointments = [] }: AppointmentsPageProps) {
    const today = React.useMemo(() => new Date(), []);
    const minDateStr = React.useMemo(() => getLocalDateString(today), [today]);
    const maxDateStr = React.useMemo(() => {
        const future = new Date(today);
        future.setDate(future.getDate() + 180);
        return getLocalDateString(future);
    }, [today]);

    const [cancellingId, setCancellingId] = React.useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        preferred_date: minDateStr,
        time_window: 'morning',
        format: 'video',
        topic: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Your appointment request has been submitted.');
            },
            onError: () => {
                toast.error('Please check the form for errors.');
            },
        });
    };

    const handleCancel = (appointment: AppointmentItem) => {
        if (!appointment.can_cancel) {
            toast.error('This appointment cannot be cancelled.');
            return;
        }

        if (window.confirm('Are you sure you want to cancel this appointment request?')) {
            setCancellingId(appointment.id);
            router.delete(destroy.url(appointment.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Your appointment has been cancelled.');
                },
                onError: () => {
                    toast.error('Failed to cancel appointment.');
                },
                onFinish: () => {
                    setCancellingId(null);
                },
            });
        }
    };

    const getStatusBadge = (status: AppointmentItem['status'], label: string) => {
        switch (status) {
            case 'requested':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                    >
                        {label}
                    </Badge>
                );
            case 'confirmed':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
                    >
                        {label}
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-300 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
                    >
                        {label}
                    </Badge>
                );
            case 'cancelled':
            default:
                return (
                    <Badge
                        variant="outline"
                        className="border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"
                    >
                        {label}
                    </Badge>
                );
        }
    };

    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'phone':
                return <Phone className="h-3.5 w-3.5 text-primary" />;
            case 'in_person':
                return <MapPin className="h-3.5 w-3.5 text-primary" />;
            case 'video':
            default:
                return <Video className="h-3.5 w-3.5 text-primary" />;
        }
    };

    return (
        <PortalLayout>
            <Head title="Appointments | Okojie Online" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left Card: Request an appointment */}
                <div className="lg:col-span-5">
                    <div className="rounded-[18px] border border-border bg-card p-6 sm:p-7">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                Request an appointment
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Choose your preferred date, time window, and meeting format.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            {/* Preferred date */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="preferred_date"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Preferred date
                                </label>
                                <Input
                                    id="preferred_date"
                                    type="date"
                                    min={minDateStr}
                                    max={maxDateStr}
                                    value={data.preferred_date}
                                    onChange={(e) => setData('preferred_date', e.target.value)}
                                    className="w-full"
                                    required
                                />
                                <InputError message={errors.preferred_date} />
                            </div>

                            {/* Time window select */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="time_window"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Time window
                                </label>
                                <Select
                                    value={data.time_window}
                                    onValueChange={(val) => setData('time_window', val)}
                                >
                                    <SelectTrigger id="time_window" className="w-full">
                                        <SelectValue placeholder="Select time window" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_WINDOWS.map((tw) => (
                                            <SelectItem key={tw.value} value={tw.value}>
                                                {tw.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.time_window} />
                            </div>

                            {/* Format select */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="format"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Format
                                </label>
                                <Select
                                    value={data.format}
                                    onValueChange={(val) => setData('format', val)}
                                >
                                    <SelectTrigger id="format" className="w-full">
                                        <SelectValue placeholder="Select meeting format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FORMAT_OPTIONS.map((f) => {
                                            const Icon = f.icon;
                                            return (
                                                <SelectItem key={f.value} value={f.value}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                                        <span>{f.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.format} />
                            </div>

                            {/* Topic */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="topic"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Topic
                                </label>
                                <Input
                                    id="topic"
                                    type="text"
                                    maxLength={120}
                                    placeholder="Return review, planning, IRS notice..."
                                    value={data.topic}
                                    onChange={(e) => setData('topic', e.target.value)}
                                    className="w-full"
                                />
                                <InputError message={errors.topic} />
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="notes"
                                    className="text-sm font-semibold text-foreground"
                                >
                                    Notes
                                </label>
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    placeholder="Any details or questions you'd like your preparer to know in advance..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full resize-none"
                                />
                                <InputError message={errors.notes} />
                            </div>

                            {/* Submit button */}
                            <div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-full py-5 text-sm font-semibold"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Requesting...
                                        </>
                                    ) : (
                                        <>
                                            <CalendarPlus className="mr-2 h-4 w-4" />
                                            Request appointment
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Card: Your appointments */}
                <div className="lg:col-span-7">
                    <div className="rounded-[18px] border border-border bg-card p-6 sm:p-7">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    Your appointments
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {appointments.length}{' '}
                                    {appointments.length === 1 ? 'appointment' : 'appointments'}
                                </p>
                            </div>
                        </div>

                        {/* Empty State */}
                        {appointments.length === 0 ? (
                            <div className="mt-8 flex flex-col items-center justify-center rounded-[14px] border border-dashed border-border py-12 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-foreground">
                                    No appointments yet.
                                </h3>
                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Schedule a video, phone, or in-person consultation with your preparer
                                    using the form on the left.
                                </p>
                            </div>
                        ) : (
                            /* Appointments List */
                            <div className="mt-6 space-y-4">
                                {appointments.map((appt) => (
                                    <div
                                        key={appt.id}
                                        className={cn(
                                            'rounded-[14px] border border-border p-4 transition-colors sm:p-5',
                                            appt.status === 'cancelled'
                                                ? 'bg-muted/30 opacity-75'
                                                : 'bg-card hover:border-border-strong'
                                        )}
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="flex items-center gap-1.5 text-base font-semibold text-foreground">
                                                        <Calendar className="h-4 w-4 text-primary" />
                                                        {appt.preferred_date_full || appt.preferred_date_formatted}
                                                    </span>
                                                    {getStatusBadge(appt.status, appt.status_label)}
                                                </div>

                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        {getFormatIcon(appt.format)}
                                                        {appt.format_label}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {appt.time_window_label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Cancel Action */}
                                            {appt.can_cancel && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={cancellingId === appt.id}
                                                    onClick={() => handleCancel(appt)}
                                                    className="self-start rounded-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    {cancellingId === appt.id ? (
                                                        <>
                                                            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                                            Cancelling...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="mr-1 h-3.5 w-3.5" />
                                                            Cancel request
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>

                                        {/* Topic */}
                                        {appt.topic && (
                                            <div className="mt-3 text-sm font-medium text-foreground">
                                                <span className="text-muted-foreground">Topic: </span>
                                                {appt.topic}
                                            </div>
                                        )}

                                        {/* Notes */}
                                        {appt.notes && (
                                            <div className="mt-2 rounded-lg bg-secondary/40 p-2.5 text-xs text-secondary-foreground">
                                                <span className="font-semibold text-foreground">Notes: </span>
                                                {appt.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
