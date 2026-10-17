import { Head } from '@inertiajs/react';
import * as React from 'react';

import { PortalLayout } from '@/layouts/portal-layout';

export default function PortalOverview() {
    return (
        <PortalLayout title="Overview">
            <Head title="Client Portal — Overview" />
            <div className="rounded-[18px] border border-border bg-card p-8">
                <h2 className="text-xl font-bold text-foreground">
                    Welcome to Okojie Online
                </h2>
                <p className="mt-2 text-sm text-body">
                    Your portal overview will display return status, next steps,
                    document uploads, and invoices.
                </p>
            </div>
        </PortalLayout>
    );
}
