import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Check,
    Download,
    Info,
    Lock,
    MessageSquare,
    Shield,
    User,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import {
    Avatar,
    Button,
    Chip,
    Divider,
    EmptyState,
    FileBadge,
    Inner,
    Note,
    Shell,
    ShellHead,
} from '@/components/primitives';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import { cn } from '@/lib/utils';
import { appointments as portalAppointments } from '@/routes/portal';
import { read as messageRead } from '@/routes/portal/messages';

export interface MessageAttachmentItem {
    id: string;
    filename: string;
    size_formatted: string;
    download_url: string;
}

export interface PortalMessageItem {
    id: string;
    fromUserId: number;
    toUserId: number;
    fromName: string;
    isFromStaff: boolean;
    body: string;
    readAt: string | null;
    isUnread: boolean;
    createdAt: string | null;
    formattedDate: string;
    attachments?: MessageAttachmentItem[];
}

export interface AssignedPreparer {
    name: string | null;
    title: string | null;
    office: string | null;
    officeLabel: string | null;
    avatarUrl: string | null;
}

export interface MessagesPageProps {
    messages: PortalMessageItem[];
    preparer?: AssignedPreparer | null;
}

function getMessageDateGroupKey(createdAt: string | null): string {
    if (!createdAt) {
        return 'earlier';
    }
    const d = new Date(createdAt);
    if (isNaN(d.getTime())) {
        return 'earlier';
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function formatDayGroupLabel(dateStr: string | null): string {
    if (!dateStr) {
        return 'Earlier';
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return 'Earlier';
    }

    const now = new Date();
    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    if (isToday) {
        return 'Today';
    }

    const isSameYear = date.getFullYear() === now.getFullYear();
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: isSameYear ? undefined : 'numeric',
    });
}

function formatMessageTime(
    createdAt: string | null,
    fallbackFormattedDate: string,
): string {
    if (!createdAt) {
        return fallbackFormattedDate;
    }
    const d = new Date(createdAt);
    if (isNaN(d.getTime())) {
        return fallbackFormattedDate;
    }
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export default function Messages({
    messages: initialMessages,
    preparer,
}: MessagesPageProps) {
    const [messages, setMessages] =
        React.useState<PortalMessageItem[]>(initialMessages);
    const [isMarkingRead, setIsMarkingRead] = React.useState(false);

    // Keep state synchronized with incoming props
    React.useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    // Keep existing timing: automatically trigger mark-read when unread messages exist on initial view
    React.useEffect(() => {
        const hasUnread = initialMessages.some((m) => m.isUnread);
        if (
            hasUnread &&
            typeof window !== 'undefined' &&
            !window.location.pathname.startsWith('/dev/styleguide')
        ) {
            router.post(messageRead.url(), {}, { preserveScroll: true });
        }
    }, [initialMessages]);

    const unreadCount = React.useMemo(() => {
        return messages.filter((m) => m.isUnread).length;
    }, [messages]);

    const hasUnread = unreadCount > 0;

    const handleMarkAllAsRead = () => {
        setIsMarkingRead(true);
        // Optimistically mark messages as read for immediate responsive feedback
        setMessages((prev) => prev.map((m) => ({ ...m, isUnread: false })));

        router.post(
            messageRead.url(),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('All messages marked as read');
                },
                onFinish: () => {
                    setIsMarkingRead(false);
                },
            },
        );
    };

    // Partition messages into grouped days, sorted chronologically with newest day at top
    const dayGroups = React.useMemo(() => {
        const sorted = [...messages].sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
        });

        const groups: {
            dateKey: string;
            label: string;
            items: PortalMessageItem[];
        }[] = [];

        for (const msg of sorted) {
            const key = getMessageDateGroupKey(msg.createdAt);
            let group = groups.find((g) => g.dateKey === key);
            if (!group) {
                group = {
                    dateKey: key,
                    label: formatDayGroupLabel(msg.createdAt),
                    items: [],
                };
                groups.push(group);
            }
            group.items.push(msg);
        }

        return groups;
    }, [messages]);

    return (
        <AppShellLayout
            area="portal"
            activeKey="messages"
            headTitle="Client Portal — Messages | Okojie Online"
            eyebrow="Your return"
            title="Messages"
            sub={
                <div className="flex flex-wrap items-center gap-2">
                    <Chip tone="success">
                        <Lock className="mr-1 size-3.5" />
                        Encrypted and private
                    </Chip>
                    <span>Updates from your preparer about your return.</span>
                </div>
            }
            actions={
                hasUnread ? (
                    <Button
                        id="mark-read"
                        variant="secondary"
                        onClick={handleMarkAllAsRead}
                        disabled={isMarkingRead}
                    >
                        <Check className="mr-1.5 size-4" />
                        Mark all as read
                    </Button>
                ) : null
            }
        >
            <Head>
                <title>Client Portal — Messages | Okojie Online</title>
            </Head>

            <div
                id="page"
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,340px)] items-start gap-4 max-shell:grid-cols-1"
            >
                {/* Left Column: Messages Thread */}
                <section aria-labelledby="thread-title">
                    <Shell aria-labelledby="thread-title">
                        <ShellHead
                            headingId="thread-title"
                            icon={<MessageSquare className="size-[18px]" />}
                            title="From your preparer"
                            right={
                                unreadCount > 0 ? (
                                    <span className="text-[13px] text-fg-3">
                                        {unreadCount} unread
                                    </span>
                                ) : null
                            }
                        />

                        {messages.length > 0 ? (
                            <Inner className="overflow-hidden p-0">
                                <div className="grid gap-1 p-2 pb-1">
                                    {dayGroups.map((group) => (
                                        <div
                                            key={group.dateKey}
                                            data-slot="day-group"
                                        >
                                            <div className="flex items-center gap-3 px-2 pt-3.5 pb-1.5 text-[11px] font-medium tracking-[0.08em] text-fg-3 uppercase before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                                                {group.label}
                                            </div>
                                            <div className="grid gap-1">
                                                {group.items.map((message) => {
                                                    const timeString =
                                                        formatMessageTime(
                                                            message.createdAt,
                                                            message.formattedDate,
                                                        );

                                                    return (
                                                        <article
                                                            key={message.id}
                                                            data-slot="message-article"
                                                            data-unread={
                                                                message.isUnread
                                                                    ? 'true'
                                                                    : 'false'
                                                            }
                                                            aria-label={
                                                                message.isUnread
                                                                    ? 'Unread message'
                                                                    : undefined
                                                            }
                                                            className={cn(
                                                                'flex items-start gap-3 rounded-card p-3 transition-colors',
                                                                message.isUnread &&
                                                                    'bg-brand-soft',
                                                            )}
                                                        >
                                                            <Avatar
                                                                name={
                                                                    message.fromName
                                                                }
                                                                size="default"
                                                                className="size-9 shrink-0"
                                                            />
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-baseline gap-2">
                                                                    <span className="text-[14px] font-medium text-foreground">
                                                                        {
                                                                            message.fromName
                                                                        }
                                                                    </span>
                                                                    <small className="text-[12.5px] text-fg-3">
                                                                        {message.isFromStaff
                                                                            ? 'Preparer'
                                                                            : 'You'}{' '}
                                                                        ·{' '}
                                                                        {
                                                                            timeString
                                                                        }
                                                                    </small>
                                                                    {message.isUnread && (
                                                                        <Chip
                                                                            tone="accent"
                                                                            dot
                                                                            className="ml-auto h-5 text-[11.5px]"
                                                                        >
                                                                            New
                                                                        </Chip>
                                                                    )}
                                                                </div>

                                                                <p className="mt-1 max-w-[68ch] text-[14.5px] leading-relaxed whitespace-pre-wrap text-fg-2">
                                                                    {
                                                                        message.body
                                                                    }
                                                                </p>

                                                                {message.attachments &&
                                                                    message
                                                                        .attachments
                                                                        .length >
                                                                        0 && (
                                                                        <div className="mt-2.5 flex flex-wrap gap-2">
                                                                            {message.attachments.map(
                                                                                (
                                                                                    attach,
                                                                                ) => {
                                                                                    const ext =
                                                                                        attach.filename.includes(
                                                                                            '.',
                                                                                        )
                                                                                            ? attach.filename
                                                                                                  .split(
                                                                                                      '.',
                                                                                                  )
                                                                                                  .pop() ||
                                                                                              'PDF'
                                                                                            : 'FILE';
                                                                                    return (
                                                                                        <a
                                                                                            key={
                                                                                                attach.id
                                                                                            }
                                                                                            href={
                                                                                                attach.download_url
                                                                                            }
                                                                                            download
                                                                                            className="inline-flex items-center gap-2.5 rounded-[10px] bg-card px-3 py-2 text-[13px] font-medium text-foreground shadow-chip transition-colors hover:bg-sunken"
                                                                                        >
                                                                                            <FileBadge
                                                                                                ext={
                                                                                                    ext
                                                                                                }
                                                                                                className="size-7 rounded-[7px] text-[8.5px]"
                                                                                            />
                                                                                            <span>
                                                                                                {
                                                                                                    attach.filename
                                                                                                }
                                                                                            </span>
                                                                                            <span className="text-[11.5px] text-fg-3">
                                                                                                (
                                                                                                {
                                                                                                    attach.size_formatted
                                                                                                }
                                                                                                )
                                                                                            </span>
                                                                                            <Download className="size-3.5 text-fg-3" />
                                                                                        </a>
                                                                                    );
                                                                                },
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </article>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Note
                                    tone="neutral"
                                    icon={<Info className="size-4 shrink-0" />}
                                    className="m-2"
                                >
                                    <span>
                                        Need to reply? Call{' '}
                                        <a
                                            href="tel:+12155550142"
                                            className="font-medium text-foreground underline-offset-4 hover:underline"
                                        >
                                            (215) 555-0142
                                        </a>{' '}
                                        or{' '}
                                        <Link
                                            href={portalAppointments.url()}
                                            className="font-medium text-foreground underline-offset-4 hover:underline"
                                        >
                                            book a call
                                        </Link>
                                        . Never share your SSN by email or text.
                                    </span>
                                </Note>
                            </Inner>
                        ) : (
                            <Inner variant="flush-empty">
                                <EmptyState
                                    icon={<MessageSquare className="size-5" />}
                                    title="No messages yet"
                                    body="Your preparer will post updates here as your return moves along."
                                    className="min-h-[440px]"
                                />
                            </Inner>
                        )}
                    </Shell>
                </section>

                {/* Right Column: Side Cards */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Your Preparer Card */}
                    <Shell aria-labelledby="prep-title">
                        <ShellHead
                            headingId="prep-title"
                            icon={<User className="size-[18px]" />}
                            title="Your preparer"
                        />
                        <Inner>
                            <div className="flex items-center gap-3">
                                <Avatar
                                    name={preparer?.name ?? 'Adaeze Okojie'}
                                    src={preparer?.avatarUrl}
                                    size="lg"
                                    className="size-11 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <span className="block truncate text-[14px] font-medium text-foreground">
                                        {preparer?.name ?? 'Your preparer'}
                                    </span>
                                    <small className="block truncate text-[13px] text-fg-3">
                                        {preparer
                                            ? [
                                                  preparer.title,
                                                  preparer.officeLabel,
                                              ]
                                                  .filter(Boolean)
                                                  .join(' · ')
                                            : 'Enrolled Agent · Okojie & Associates'}
                                    </small>
                                </div>
                            </div>

                            <Divider className="my-3.5" />

                            <div className="grid gap-2 text-[13px]">
                                <div className="flex justify-between gap-2">
                                    <span className="text-fg-3">
                                        Usually replies
                                    </span>
                                    <span className="font-medium text-foreground">
                                        Within 1 business day
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-fg-3">
                                        Office hours
                                    </span>
                                    <span className="font-medium text-foreground">
                                        Mon–Fri 9am–6pm
                                    </span>
                                </div>
                            </div>

                            <Button
                                asChild
                                variant="secondary"
                                className="mt-3.5 w-full"
                            >
                                <Link href={portalAppointments.url()}>
                                    <Calendar className="mr-2 size-4" />
                                    Book a call
                                </Link>
                            </Button>
                        </Inner>
                    </Shell>

                    {/* Staying Safe Card */}
                    <Shell aria-labelledby="safe-title">
                        <ShellHead
                            headingId="safe-title"
                            icon={<Shield className="size-[18px]" />}
                            title="Staying safe"
                        />
                        <Inner>
                            <p className="text-[14px] leading-relaxed text-fg-2">
                                We’ll never ask for your password or full SSN in
                                a message. If something looks off, call the
                                office before you reply.
                            </p>
                        </Inner>
                    </Shell>
                </div>
            </div>
        </AppShellLayout>
    );
}
