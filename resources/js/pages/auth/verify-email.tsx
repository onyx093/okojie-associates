import { Link, useForm, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import * as React from 'react';

import { Button, Note } from '@/components/primitives';
import { Spinner } from '@/components/ui/spinner';
import { AuthScreenLayout } from '@/layouts/auth-screen-layout';
import { logout } from '@/routes';
import verification from '@/routes/verification';
import type { SharedData } from '@/types';

export interface VerifyEmailProps {
    status?: string;
    email?: string;
    isSubmitting?: boolean;
}

export default function VerifyEmail({
    status,
    email: emailProp,
    isSubmitting,
}: VerifyEmailProps) {
    const { auth } = usePage<Partial<SharedData>>().props;
    const userEmail = emailProp ?? auth?.user?.email ?? 'your email address';

    const { post, processing } = useForm({});
    const effectiveProcessing = processing || Boolean(isSubmitting);

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        post(verification.send.url());
    };

    return (
        <AuthScreenLayout
            headTitle="Verify your email — Okojie Online"
            iconTile={<Mail className="size-5" />}
            eyebrow="One more step"
            title="Verify your email"
            lead={
                <>
                    We sent a link to{' '}
                    <strong className="font-medium text-foreground">
                        {userEmail}
                    </strong>
                    . Click it to finish creating your account.
                </>
            }
        >
            {status === 'verification-link-sent' && (
                <Note tone="ok" role="status" className="mb-6">
                    A new link is on its way. Check your spam folder if it’s not
                    there in a few minutes.
                </Note>
            )}

            <form onSubmit={handleResend} className="grid gap-3" noValidate>
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    block
                    disabled={effectiveProcessing}
                    className="h-11 text-sm font-medium"
                >
                    {effectiveProcessing && <Spinner className="mr-2 size-4" />}
                    {effectiveProcessing ? 'Sending…' : 'Send the link again'}
                </Button>

                <Button
                    variant="ghost"
                    size="lg"
                    block
                    asChild
                    className="h-11 text-sm font-medium text-fg-2 hover:text-foreground"
                >
                    <Link href={logout.url()} method="post" as="button">
                        Log out
                    </Link>
                </Button>
            </form>
        </AuthScreenLayout>
    );
}
