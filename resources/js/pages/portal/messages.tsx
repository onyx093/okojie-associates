import { Head, router } from '@inertiajs/react';
import {
    Mail,
    MessageSquare,
    ShieldCheck,
    User as UserIcon,
} from 'lucide-react';
import * as React from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PortalLayout } from '@/layouts/portal-layout';
import { read as messageRead } from '@/routes/portal/messages';

export interface PortalMessageItem {
    id: string;
    fromUserId: number;
    toUserId: number;
    fromName: string;
    isFromStaff: boolean;
    body: string;
    readAt: string | null;
    isUnread: boolean;
    createdAt: string;
    formattedDate: string;
}

interface MessagesProps {
    messages: PortalMessageItem[];
}

export default function Messages({ messages }: MessagesProps) {
    // Post to mark-read endpoint on view if any unread messages exist
    React.useEffect(() => {
        const hasUnread = messages.some((m) => m.isUnread);
        if (hasUnread) {
            router.post(messageRead.url(), {}, { preserveScroll: true });
        }
    }, [messages]);

    // Client is currently read-only; reply box gated by feature flag for future release
    const allowReply = false;

    return (
        <PortalLayout>
            <Head title="Messages" />

            <div className="mx-auto max-w-4xl space-y-6">
                <Card className="border-border bg-card">
                    <CardHeader className="border-b border-border/60 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <MessageSquare className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">
                                        Messages from your preparer
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">
                                        Secure, end-to-end updates regarding
                                        your tax return.
                                    </CardDescription>
                                </div>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <ShieldCheck className="size-3.5 text-emerald-500" />
                                Encrypted & Private
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground">
                                    <Mail className="size-6" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">
                                    No messages yet
                                </h3>
                                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                                    No messages yet. Your preparer will post
                                    updates here as your return progresses.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message) => {
                                    return (
                                        <div
                                            key={message.id}
                                            className={`relative rounded-xl border p-4.5 transition-colors ${
                                                message.isFromStaff
                                                    ? 'border-primary/20 bg-primary/[0.03]'
                                                    : 'border-border bg-secondary/20'
                                            }`}
                                        >
                                            {message.isUnread && (
                                                <span
                                                    className="absolute top-4 right-4 size-2.5 rounded-full bg-primary"
                                                    title="Unread"
                                                    aria-label="Unread message"
                                                />
                                            )}

                                            <div className="flex items-center justify-between gap-2 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                                                            message.isFromStaff
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {message.isFromStaff ? (
                                                            <ShieldCheck className="size-4" />
                                                        ) : (
                                                            <UserIcon className="size-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {message.fromName}
                                                        </span>
                                                        {message.isFromStaff && (
                                                            <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                                                Staff
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {message.formattedDate}
                                                </span>
                                            </div>

                                            <div className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                                                {message.body}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {allowReply && (
                            <div className="mt-6 border-t border-border pt-4">
                                {/* Reply box when feature flag enabled in future */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PortalLayout>
    );
}
