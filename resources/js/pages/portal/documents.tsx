import { Head, router, useForm } from '@inertiajs/react';
import {
    Check,
    Download,
    FileText,
    Lock,
    Shield,
    Trash2,
    Upload,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import {
    Button,
    Chip,
    ConfirmDialog,
    EmptyState,
    Field,
    FileBadge,
    FileDropzone,
    IconButton,
    Inner,
    Note,
    Row,
    RowList,
    Shell,
    ShellHead,
    StatusLabel,
} from '@/components/primitives';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AppShellLayout } from '@/layouts/app-shell-layout';
import { cn } from '@/lib/utils';
import {
    destroy as documentDestroy,
    store as documentStore,
} from '@/routes/portal/documents';

export interface DocumentItem {
    id: string;
    type: string;
    type_label: string;
    filename: string;
    mime: string;
    size_bytes: number;
    size_formatted: string;
    scan_status: 'clean' | 'pending' | 'infected';
    scan_status_label: string;
    created_at: string;
    created_at_formatted: string;
    download_url: string;
}

export interface DocumentsPageProps {
    documents: DocumentItem[];
    canDelete: boolean;
    taxReturnStatus?: string | null;
}

// Derived dynamically from App\Enums\DocType
export const DOCUMENT_TYPE_OPTIONS = [
    { value: 'w2', label: 'W-2' },
    { value: '1099', label: '1099' },
    { value: 'id', label: 'ID' },
    { value: 'prior_return', label: 'Prior return' },
    { value: 'other', label: 'Other' },
] as const;

// Derived dynamically from App\Rules\SafeUpload (ALLOWED_EXTENSIONS & MAX_KILOBYTES)
export const SAFE_UPLOAD_ACCEPT =
    '.pdf,.jpg,.jpeg,.png,.heic,.webp,.xlsx,.xls,.csv';
export const SAFE_UPLOAD_HELPER = 'PDF, image or spreadsheet · up to 25 MB';

interface ChecklistCategory {
    label: string;
    types: string[];
    isOptional?: boolean;
}

const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
    { label: 'W-2 from each job', types: ['w2'] },
    { label: '1099s (interest, freelance)', types: ['1099'] },
    { label: 'Photo ID', types: ['id'] },
    { label: 'Last year’s return', types: ['prior_return'] },
    {
        label: '1098-T or 1098 (if you have one)',
        types: ['other'],
        isOptional: true,
    },
];

export default function PortalDocuments({
    documents,
    canDelete,
}: DocumentsPageProps) {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const {
        data,
        setData,
        post,
        processing,
        progress,
        errors,
        reset,
        clearErrors,
    } = useForm<{
        type: string;
        file: File | null;
    }>({
        type: 'w2',
        file: null,
    });

    const handleFileSelect = (file: File | null) => {
        clearErrors('file');
        setSelectedFile(file);
        setData('file', file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) {
            return;
        }

        post(documentStore.url(), {
            forceFormData: true,
            onSuccess: () => {
                reset('file');
                setSelectedFile(null);
                toast.success('Document uploaded. We’re scanning it now.');
            },
        });
    };

    // Calculate counts for checklist categories derived from documents[].type
    const checklistItems = React.useMemo(() => {
        return CHECKLIST_CATEGORIES.map((category) => {
            const count = documents.filter((doc) =>
                category.types.includes(doc.type),
            ).length;
            const isDone = count > 0;

            let countLabel = '';
            if (count > 0) {
                countLabel = `${count} uploaded`;
            } else if (category.isOptional) {
                countLabel = 'Optional';
            }

            return {
                label: category.label,
                isDone,
                countLabel,
            };
        });
    }, [documents]);

    return (
        <AppShellLayout
            area="portal"
            activeKey="documents"
            headTitle="Client Portal — Documents | Okojie Online"
            eyebrow="Your return"
            title="Documents"
            sub="Only you and your preparer can see these files."
        >
            <Head>
                <title>Client Portal — Documents | Okojie Online</title>
            </Head>

            <div
                id="page"
                data-locked={!canDelete ? 'true' : 'false'}
                className="grid grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start gap-4 max-shell:grid-cols-1"
            >
                {/* Left Column: Upload Form & "What we usually need" Checklist */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Upload Section */}
                    <Shell aria-labelledby="up-title">
                        <ShellHead
                            headingId="up-title"
                            icon={<Upload className="size-[18px]" />}
                            title="Upload a document"
                        />
                        <Inner>
                            <form
                                onSubmit={handleSubmit}
                                className="grid gap-4"
                            >
                                <Field
                                    label="Document type"
                                    htmlFor="doc-type"
                                    error={errors.type}
                                >
                                    <Select
                                        value={data.type}
                                        onValueChange={(val) =>
                                            setData('type', val)
                                        }
                                        disabled={processing}
                                    >
                                        <SelectTrigger id="doc-type">
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DOCUMENT_TYPE_OPTIONS.map(
                                                (opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field error={errors.file}>
                                    <FileDropzone
                                        id="file-in"
                                        file={selectedFile}
                                        onFileSelect={handleFileSelect}
                                        accept={SAFE_UPLOAD_ACCEPT}
                                        helperText={SAFE_UPLOAD_HELPER}
                                        disabled={processing}
                                    />
                                </Field>

                                {progress && (
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[12px] text-fg-3">
                                            <span>Uploading…</span>
                                            <span>{progress.percentage}%</span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                                            <div
                                                className="h-full bg-primary transition-all duration-150"
                                                style={{
                                                    width: `${progress.percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={processing || !data.file}
                                    className="w-full"
                                >
                                    <Upload className="mr-2 size-4" />
                                    {processing
                                        ? 'Uploading…'
                                        : 'Upload document'}
                                </Button>
                            </form>
                        </Inner>
                    </Shell>

                    {/* What We Usually Need Checklist */}
                    <Shell aria-labelledby="ck-title">
                        <ShellHead
                            headingId="ck-title"
                            icon={<Check className="size-[18px]" />}
                            title="What we usually need"
                        />
                        <Inner>
                            <div className="grid gap-0.5">
                                {checklistItems.map((item, index) => (
                                    <div
                                        key={index}
                                        data-slot="checklist-item"
                                        className={cn(
                                            'flex items-center gap-2.5 border-t border-border px-0.5 py-2.5 text-[14px] first:border-t-0',
                                            item.isDone && 'done',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex size-5 shrink-0 items-center justify-center rounded-[6px] transition-colors',
                                                item.isDone
                                                    ? 'bg-success text-white shadow-none'
                                                    : 'bg-card ring-[1.5px] ring-border-strong',
                                            )}
                                            aria-hidden="true"
                                        >
                                            {item.isDone && (
                                                <Check
                                                    className="size-3 stroke-[2.6]"
                                                    strokeWidth={2.6}
                                                />
                                            )}
                                        </span>
                                        <span
                                            className={cn(
                                                item.isDone
                                                    ? 'font-medium text-foreground'
                                                    : 'font-normal text-fg-2',
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                        {item.countLabel && (
                                            <span className="ml-auto text-[12.5px] text-fg-3">
                                                {item.countLabel}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Inner>
                    </Shell>
                </div>

                {/* Right Column: Your Documents List */}
                <section aria-labelledby="list-title">
                    <Shell aria-labelledby="list-title">
                        <ShellHead
                            headingId="list-title"
                            icon={<FileText className="size-[18px]" />}
                            title="Your documents"
                            right={
                                documents.length > 0 ? (
                                    <span className="text-[13px] text-fg-3">
                                        {documents.length}{' '}
                                        {documents.length === 1
                                            ? 'file'
                                            : 'files'}
                                    </span>
                                ) : null
                            }
                        />

                        {documents.length > 0 ? (
                            <Inner className="overflow-hidden p-0">
                                {!canDelete && (
                                    <Note
                                        tone="warn"
                                        icon={
                                            <Lock className="size-4 shrink-0" />
                                        }
                                        className="lockbar mx-2 mt-2"
                                    >
                                        Your return is ready for review, so
                                        documents can’t be deleted now. Message
                                        your preparer if something needs to
                                        change.
                                    </Note>
                                )}

                                <RowList
                                    footer={
                                        <span className="flex items-center gap-1.5">
                                            <Shield className="size-4 text-fg-3" />
                                            Every file is virus-scanned. Blocked
                                            files are never shared with anyone.
                                        </span>
                                    }
                                >
                                    {documents.map((doc) => {
                                        const ext = doc.filename.includes('.')
                                            ? doc.filename.split('.').pop() ||
                                              'PDF'
                                            : 'FILE';

                                        const isClean =
                                            doc.scan_status === 'clean';
                                        const isPending =
                                            doc.scan_status === 'pending';
                                        const isInfected =
                                            doc.scan_status === 'infected';

                                        return (
                                            <Row
                                                key={doc.id}
                                                leading={
                                                    <FileBadge ext={ext} />
                                                }
                                                title={doc.filename}
                                                meta={`${doc.size_formatted} · ${doc.created_at_formatted}`}
                                                status={
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="type max-sm:hidden">
                                                            <Chip tone="neutral">
                                                                {doc.type_label}
                                                            </Chip>
                                                        </span>
                                                        {isClean && (
                                                            <StatusLabel tone="ok">
                                                                Clean
                                                            </StatusLabel>
                                                        )}
                                                        {isPending && (
                                                            <StatusLabel tone="wait">
                                                                Scanning…
                                                            </StatusLabel>
                                                        )}
                                                        {isInfected && (
                                                            <StatusLabel tone="bad">
                                                                Blocked
                                                            </StatusLabel>
                                                        )}
                                                    </div>
                                                }
                                                actions={
                                                    <span className="flex items-center gap-1">
                                                        {isClean ? (
                                                            <IconButton
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                aria-label={`Download ${doc.filename}`}
                                                                className="text-fg-3 hover:text-foreground"
                                                            >
                                                                <a
                                                                    href={
                                                                        doc.download_url
                                                                    }
                                                                    download
                                                                >
                                                                    <Download className="size-4" />
                                                                </a>
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton
                                                                disabled
                                                                variant="ghost"
                                                                size="sm"
                                                                aria-label={
                                                                    isPending
                                                                        ? 'Download available after scan'
                                                                        : 'Blocked file can’t be downloaded'
                                                                }
                                                                className="cursor-not-allowed text-fg-3 opacity-40"
                                                            >
                                                                <Download className="size-4" />
                                                            </IconButton>
                                                        )}

                                                        {canDelete && (
                                                            <ConfirmDialog
                                                                trigger={
                                                                    <IconButton
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        aria-label={`Delete ${doc.filename}`}
                                                                        className="del text-fg-3 hover:bg-danger-soft hover:text-danger"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </IconButton>
                                                                }
                                                                title={`Delete ${doc.filename}?`}
                                                                description="This document will be permanently removed from your account. You can re-upload it later if needed."
                                                                confirmLabel="Delete document"
                                                                variant="danger"
                                                                onConfirm={() =>
                                                                    router.delete(
                                                                        documentDestroy.url(
                                                                            {
                                                                                document:
                                                                                    doc.id,
                                                                            },
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </span>
                                                }
                                            />
                                        );
                                    })}
                                </RowList>
                            </Inner>
                        ) : (
                            <Inner variant="flush-empty">
                                <EmptyState
                                    icon={<FileText className="size-5" />}
                                    title="No documents yet"
                                    body="Upload your first file and it will appear here once it’s been scanned."
                                    className="min-h-[420px]"
                                    actions={
                                        <label
                                            htmlFor="file-in"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-btn transition-colors hover:bg-primary/90"
                                        >
                                            <Upload className="size-4" />
                                            Upload a document
                                        </label>
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
