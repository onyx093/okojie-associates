import * as React from 'react';

import { register } from '@/dev/fixtures';
import type { AppointmentItem } from '@/pages/portal/appointments';

// Dynamic lazy import prevents Vite from converting pages/portal/appointments into an internal chunk
const PortalAppointments = React.lazy(
    () => import('@/pages/portal/appointments'),
);

const SAMPLE_APPOINTMENTS: AppointmentItem[] = [
    {
        id: 'appt-1',
        preferred_date: '2027-02-12',
        preferred_date_formatted: 'Feb 12, 2027',
        preferred_date_full: 'Thursday, February 12, 2027',
        time_window: 'afternoon',
        time_window_label: 'Afternoon (12pm–4pm)',
        format: 'video',
        format_label: 'Video call',
        topic: 'Review call with your preparer',
        notes: 'Go through the return together before e-signing.',
        status: 'confirmed',
        status_label: 'Confirmed',
        confirmed_at: '2027-02-10T14:00:00Z',
        scheduled_at: '2027-02-12T16:30:00Z',
        scheduled_at_formatted: 'Thu, Feb 12 · 4:30 PM',
        join_url: 'https://meet.google.com/xyz-okojie-call',
        created_at: '2027-02-08T10:00:00Z',
        created_at_formatted: 'Feb 8, 2027',
        can_cancel: false,
    },
    {
        id: 'appt-2',
        preferred_date: '2027-02-18',
        preferred_date_formatted: 'Feb 18, 2027',
        preferred_date_full: 'Wednesday, February 18, 2027',
        time_window: 'afternoon',
        time_window_label: 'Afternoon (12pm–4pm)',
        format: 'phone',
        format_label: 'Phone call',
        topic: 'Question about my 1098-T',
        notes: null,
        status: 'requested',
        status_label: 'Requested',
        confirmed_at: null,
        scheduled_at: null,
        scheduled_at_formatted: null,
        join_url: null,
        created_at: '2027-02-14T11:00:00Z',
        created_at_formatted: 'Feb 14, 2027',
        can_cancel: true,
    },
    {
        id: 'appt-3',
        preferred_date: '2026-01-28',
        preferred_date_formatted: 'Jan 28, 2026',
        preferred_date_full: 'Tuesday, January 28, 2026',
        time_window: 'morning',
        time_window_label: 'Morning (9am–12pm)',
        format: 'in_person',
        format_label: 'In person',
        topic: 'Free consultation',
        notes: null,
        status: 'completed',
        status_label: 'Completed',
        confirmed_at: '2026-01-25T09:00:00Z',
        scheduled_at: '2026-01-28T10:00:00Z',
        scheduled_at_formatted: 'Tue, Jan 28 · 10:00 AM',
        join_url: null,
        created_at: '2026-01-20T12:00:00Z',
        created_at_formatted: 'Jan 20, 2026',
        can_cancel: false,
    },
    {
        id: 'appt-4',
        preferred_date: '2026-01-24',
        preferred_date_formatted: 'Jan 24, 2026',
        preferred_date_full: 'Friday, January 24, 2026',
        time_window: 'afternoon',
        time_window_label: 'Afternoon (12pm–4pm)',
        format: 'video',
        format_label: 'Video call',
        topic: 'Free consultation',
        notes: null,
        status: 'cancelled',
        status_label: 'Cancelled',
        confirmed_at: null,
        scheduled_at: null,
        scheduled_at_formatted: null,
        join_url: null,
        created_at: '2026-01-22T15:00:00Z',
        created_at_formatted: 'Jan 22, 2026',
        can_cancel: false,
    },
];

export const portalAppointmentsPageFixture = register({
    id: 'page-portal-appointments',
    title: 'Page: Portal Appointments (§3 Matrix)',
    states: [
        {
            label: 'With upcoming and past appointments',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalAppointments appointments={SAMPLE_APPOINTMENTS} />
                </React.Suspense>
            ),
        },
        {
            label: 'Empty state (no appointments)',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalAppointments appointments={[]} />
                </React.Suspense>
            ),
        },
        {
            label: 'Only upcoming requested appointment',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalAppointments
                        appointments={[SAMPLE_APPOINTMENTS[1]]}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Only past appointments',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalAppointments
                        appointments={SAMPLE_APPOINTMENTS.slice(2)}
                    />
                </React.Suspense>
            ),
        },
        {
            label: 'Confirmed video appointment with join_url',
            render: () => (
                <React.Suspense fallback={null}>
                    <PortalAppointments
                        appointments={[SAMPLE_APPOINTMENTS[0]]}
                    />
                </React.Suspense>
            ),
        },
    ],
});
