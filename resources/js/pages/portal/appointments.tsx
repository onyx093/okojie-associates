import { Head, router, useForm } from '@inertiajs/react';
import { Building2, Calendar, Phone, Plus, Video } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import {
    Button,
    CalendarTile,
    Chip,
    ChoiceGroup,
    type ChoiceOption,
    ConfirmDialog,
    EmptyState,
    Field,
    Inner,
    Shell,
    ShellHead,
} from '@/components/primitives';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import { cn } from '@/lib/utils';
import {
    destroy as appointmentDestroy,
    store as appointmentStore,
} from '@/routes/portal/appointments';

export interface AppointmentItem {
    id: string;
    preferred_date: string;
    preferred_date_formatted: string;
    preferred_date_full: string;
    time_window: 'morning' | 'afternoon' | 'evening' | 'any';
    time_window_label: string;
    format: 'video' | 'phone' | 'in_person';
    format_label: string;
    topic: string | null;
    notes: string | null;
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
    status_label: string;
    confirmed_at: string | null;
    scheduled_at: string | null;
    scheduled_at_formatted: string | null;
    join_url: string | null;
    created_at: string | null;
    created_at_formatted: string | null;
    can_cancel: boolean;
}

export interface AppointmentsPageProps {
    appointments: AppointmentItem[];
}

export const FORMAT_OPTIONS: ChoiceOption[] = [
    {
        value: 'video',
        label: 'Video',
        icon: <Video className="size-4" />,
    },
    {
        value: 'phone',
        label: 'Phone',
        icon: <Phone className="size-4" />,
    },
    {
        value: 'in_person',
        label: 'In person',
        icon: <Building2 className="size-4" />,
    },
];

export const WINDOW_OPTIONS: ChoiceOption[] = [
    {
        value: 'morning',
        label: 'Morning',
        description: '9am–12pm',
    },
    {
        value: 'afternoon',
        label: 'Afternoon',
        description: '12pm–4pm',
    },
    {
        value: 'evening',
        label: 'Evening',
        description: '4pm–6pm',
    },
    {
        value: 'any',
        label: 'Any time',
        description: 'We’ll pick',
    },
];

function isAppointmentUpcoming(appt: AppointmentItem): boolean {
    if (appt.status === 'completed' || appt.status === 'cancelled') {
        return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDateStr =
        appt.scheduled_at || `${appt.preferred_date}T23:59:59`;
    const targetDate = new Date(targetDateStr);
    return targetDate >= today;
}

function getAppointmentDate(appt: AppointmentItem): {
    month: string;
    day: string;
} {
    const raw = appt.scheduled_at || `${appt.preferred_date}T00:00:00`;
    const date = new Date(raw);
    if (!isNaN(date.getTime())) {
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = String(date.getDate());
        return { month, day };
    }
    return { month: 'Jan', day: '1' };
}

export default function AppointmentsPage({
    appointments,
}: AppointmentsPageProps) {
    const todayStr = React.useMemo(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    const maxDateStr = React.useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 180);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            format: 'video',
            preferred_date: '',
            time_window: 'afternoon',
            topic: '',
            notes: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(appointmentStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setData({
                    format: 'video',
                    preferred_date: '',
                    time_window: 'afternoon',
                    topic: '',
                    notes: '',
                });
                toast.success(
                    'Request sent. We’ll confirm a time within one business day.',
                );
            },
        });
    };

    const handleReschedule = (appt: AppointmentItem) => {
        if (appt.topic) {
            setData('topic', `Reschedule: ${appt.topic}`);
        }
        const dateInput = document.getElementById('date');
        dateInput?.scrollIntoView({ behavior: 'smooth' });
        dateInput?.focus();
    };

    const handleCancel = (appt: AppointmentItem) => {
        router.delete(
            appointmentDestroy.url({
                appointment: appt.id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Your appointment has been cancelled.');
                },
            },
        );
    };

    const { upcoming, past } = React.useMemo(() => {
        const up: AppointmentItem[] = [];
        const pa: AppointmentItem[] = [];

        appointments.forEach((appt) => {
            if (isAppointmentUpcoming(appt)) {
                up.push(appt);
            } else {
                pa.push(appt);
            }
        });

        up.sort((a, b) => {
            const dateA = new Date(
                a.scheduled_at || `${a.preferred_date}T00:00:00`,
            ).getTime();
            const dateB = new Date(
                b.scheduled_at || `${b.preferred_date}T00:00:00`,
            ).getTime();
            return dateA - dateB;
        });

        pa.sort((a, b) => {
            const dateA = new Date(
                a.scheduled_at || `${a.preferred_date}T00:00:00`,
            ).getTime();
            const dateB = new Date(
                b.scheduled_at || `${b.preferred_date}T00:00:00`,
            ).getTime();
            return dateB - dateA;
        });

        return { upcoming: up, past: pa };
    }, [appointments]);

    const renderFormatIcon = (format: string) => {
        switch (format) {
            case 'phone':
                return <Phone className="size-3.5 text-fg-3" />;
            case 'in_person':
                return <Building2 className="size-3.5 text-fg-3" />;
            case 'video':
            default:
                return <Video className="size-3.5 text-fg-3" />;
        }
    };

    const renderStatusChip = (
        status: AppointmentItem['status'],
        label: string,
    ) => {
        switch (status) {
            case 'confirmed':
                return (
                    <Chip tone="success" dot>
                        {label}
                    </Chip>
                );
            case 'requested':
                return (
                    <Chip tone="warning" dot>
                        {label}
                    </Chip>
                );
            case 'completed':
            case 'cancelled':
            default:
                return <Chip tone="neutral">{label}</Chip>;
        }
    };

    const renderAppointmentRow = (appt: AppointmentItem, isPast: boolean) => {
        const calDate = getAppointmentDate(appt);
        const timeLine =
            appt.status === 'confirmed' && appt.scheduled_at_formatted
                ? appt.scheduled_at_formatted
                : `${appt.preferred_date_formatted} · ${appt.time_window_label}`;

        return (
            <div
                key={appt.id}
                data-slot="appointment-row"
                className="flex items-start justify-between gap-3 p-3 max-sm:flex-wrap"
            >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                    <CalendarTile
                        month={calDate.month}
                        day={calDate.day}
                        isPast={isPast}
                    />
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-medium text-foreground">
                            {appt.topic || 'Appointment with your preparer'}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-fg-2">
                            {renderFormatIcon(appt.format)}
                            <span>
                                {appt.format_label} · {timeLine}
                            </span>
                        </div>
                        {appt.notes && (
                            <p className="mt-1.5 text-[13.5px] whitespace-normal text-fg-2">
                                {appt.notes}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2 max-sm:w-full max-sm:flex-row max-sm:items-center max-sm:justify-start max-sm:pl-[64px]">
                    {renderStatusChip(appt.status, appt.status_label)}
                    {appt.join_url && (
                        <Button asChild variant="primary" size="sm">
                            <a
                                href={appt.join_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Join call
                            </a>
                        </Button>
                    )}
                    {appt.status === 'confirmed' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReschedule(appt)}
                            className="text-fg-3 hover:text-foreground"
                        >
                            Reschedule
                        </Button>
                    )}
                    {appt.can_cancel && (
                        <ConfirmDialog
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-fg-3 hover:bg-danger-soft hover:text-danger"
                                >
                                    Cancel request
                                </Button>
                            }
                            title="Cancel appointment request?"
                            description="Your preparer will be notified that you no longer need this appointment."
                            confirmLabel="Cancel request"
                            variant="danger"
                            onConfirm={() => handleCancel(appt)}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <AppShellLayout
            area="portal"
            activeKey="appointments"
            headTitle="Client Portal — Appointments | Okojie Online"
            eyebrow="Your return"
            title="Appointments"
            sub="Talk to your preparer by video, phone or in person."
        >
            <Head>
                <title>Client Portal — Appointments | Okojie Online</title>
            </Head>

            <div
                id="page"
                className="grid grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start gap-4 max-shell:grid-cols-1"
            >
                {/* Left Column: Request Form */}
                <Shell aria-labelledby="req-title">
                    <ShellHead
                        headingId="req-title"
                        icon={<Plus className="size-[18px]" />}
                        title="Request an appointment"
                    />
                    <Inner>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <fieldset className="grid gap-1.5 border-none p-0">
                                <legend className="text-[13px] font-medium text-foreground">
                                    Format
                                </legend>
                                <ChoiceGroup
                                    cols={3}
                                    options={FORMAT_OPTIONS}
                                    value={data.format}
                                    onValueChange={(val) => {
                                        clearErrors('format');
                                        setData('format', val);
                                    }}
                                    itemClassName="flex-col justify-center text-center py-3 px-2 gap-1.5 [&_.flex.min-w-0]:items-center"
                                />
                                {errors.format && (
                                    <p className="text-[12px] text-danger">
                                        {errors.format}
                                    </p>
                                )}
                            </fieldset>

                            <Field
                                label="Preferred date"
                                htmlFor="date"
                                error={errors.preferred_date}
                            >
                                <Input
                                    type="date"
                                    id="date"
                                    value={data.preferred_date}
                                    onChange={(e) => {
                                        clearErrors('preferred_date');
                                        setData(
                                            'preferred_date',
                                            e.target.value,
                                        );
                                    }}
                                    min={todayStr}
                                    max={maxDateStr}
                                    required
                                    disabled={processing}
                                />
                            </Field>

                            <fieldset className="grid gap-1.5 border-none p-0">
                                <legend className="text-[13px] font-medium text-foreground">
                                    Time window
                                </legend>
                                <ChoiceGroup
                                    cols={2}
                                    options={WINDOW_OPTIONS}
                                    value={data.time_window}
                                    onValueChange={(val) => {
                                        clearErrors('time_window');
                                        setData('time_window', val);
                                    }}
                                    itemClassName="flex-col items-start gap-0.5 py-2.5 px-3"
                                />
                                {errors.time_window && (
                                    <p className="text-[12px] text-danger">
                                        {errors.time_window}
                                    </p>
                                )}
                            </fieldset>

                            <Field
                                label="Topic"
                                htmlFor="topic"
                                error={errors.topic}
                            >
                                <Input
                                    id="topic"
                                    placeholder="e.g. Review my return"
                                    value={data.topic}
                                    onChange={(e) => {
                                        clearErrors('topic');
                                        setData('topic', e.target.value);
                                    }}
                                    maxLength={120}
                                    disabled={processing}
                                />
                            </Field>

                            <Field
                                label={
                                    <>
                                        Notes{' '}
                                        <span className="font-normal text-fg-3">
                                            (optional)
                                        </span>
                                    </>
                                }
                                htmlFor="notes"
                                error={errors.notes}
                            >
                                <Textarea
                                    id="notes"
                                    placeholder="Anything your preparer should know beforehand"
                                    value={data.notes}
                                    onChange={(e) => {
                                        clearErrors('notes');
                                        setData('notes', e.target.value);
                                    }}
                                    maxLength={2000}
                                    disabled={processing}
                                />
                            </Field>

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                Request appointment
                            </Button>

                            <p className="text-center text-[12.5px] text-fg-3">
                                We confirm requests within one business day.
                            </p>
                        </form>
                    </Inner>
                </Shell>

                {/* Right Column: Appointments List */}
                <section aria-labelledby="list-title">
                    <Shell aria-labelledby="list-title">
                        <ShellHead
                            headingId="list-title"
                            icon={<Calendar className="size-[18px]" />}
                            title="Your appointments"
                            right={
                                appointments.length > 0 ? (
                                    <span className="text-[13px] text-fg-3">
                                        {appointments.length}{' '}
                                        {appointments.length === 1
                                            ? 'appointment'
                                            : 'appointments'}
                                    </span>
                                ) : null
                            }
                        />

                        {appointments.length > 0 ? (
                            <Inner className="overflow-hidden p-0">
                                {upcoming.length > 0 && (
                                    <div data-slot="upcoming-group">
                                        <div className="bg-sunken/40 px-4 py-2.5 text-[11px] font-medium tracking-[0.08em] text-fg-3 uppercase">
                                            Upcoming
                                        </div>
                                        <div className="divide-y divide-border">
                                            {upcoming.map((appt) =>
                                                renderAppointmentRow(
                                                    appt,
                                                    false,
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {past.length > 0 && (
                                    <div
                                        data-slot="past-group"
                                        className={cn(
                                            upcoming.length > 0 &&
                                                'border-t border-border',
                                        )}
                                    >
                                        <div className="bg-sunken/40 px-4 py-2.5 text-[11px] font-medium tracking-[0.08em] text-fg-3 uppercase">
                                            Past
                                        </div>
                                        <div className="divide-y divide-border">
                                            {past.map((appt) =>
                                                renderAppointmentRow(
                                                    appt,
                                                    true,
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Inner>
                        ) : (
                            <Inner variant="flush-empty">
                                <EmptyState
                                    icon={<Calendar className="size-5" />}
                                    title="No appointments yet"
                                    body="Request a video, phone or in-person call with your preparer using the form."
                                    className="min-h-[420px]"
                                    actions={
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                const dateEl =
                                                    document.getElementById(
                                                        'date',
                                                    );
                                                dateEl?.scrollIntoView({
                                                    behavior: 'smooth',
                                                });
                                                dateEl?.focus();
                                            }}
                                        >
                                            Choose a date
                                        </Button>
                                    }
                                />
                            </Inner>
                        )}
                    </Shell>
                </section>
            </div>
        </AppShellLayout>
    );
}
