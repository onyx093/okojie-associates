import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CloudUpload,
    Download,
    FileSpreadsheet,
    FileText,
    Image as ImageIcon,
    Loader2,
    Trash2,
    X,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PortalLayout } from '@/layouts/portal-layout';
import { cn } from '@/lib/utils';
import {
    destroy as documentDestroy,
    store as documentStore,
} from '@/routes/portal/documents';

interface DocumentItem {
    id: string;
    type: string;
    type_label: string;
    filename: string;
    mime: string;
    size_bytes: number;
    size_formatted: string;
    scan_status: string;
    scan_status_label: string;
    created_at: string;
    created_at_formatted: string;
    download_url: string;
}

interface DocumentsPageProps {
    documents: DocumentItem[];
    canDelete: boolean;
    taxReturnStatus?: string | null;
}

const DOC_TYPES = [
    { value: 'w2', label: 'W-2' },
    { value: '1099', label: '1099' },
    { value: 'id', label: 'ID' },
    { value: 'prior_return', label: 'Prior return' },
    { value: 'other', label: 'Other' },
];

export default function PortalDocuments({
    documents,
    canDelete,
}: DocumentsPageProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
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

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.file) {
            toast.error('Please choose a file to upload.');
            return;
        }

        post(documentStore.url(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset('file');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                toast.success('Document uploaded successfully.');
            },
            onError: () => {
                toast.error(
                    'Failed to upload document. Please check the file and try again.',
                );
            },
        });
    };

    const handleDelete = (doc: DocumentItem) => {
        if (!canDelete) {
            toast.error(
                'Documents cannot be deleted once your return is ready for review.',
            );
            return;
        }

        if (
            window.confirm(`Are you sure you want to delete ${doc.filename}?`)
        ) {
            router.delete(documentDestroy.url({ document: doc.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Document deleted.');
                },
                onError: () => {
                    toast.error('Failed to delete document.');
                },
            });
        }
    };

    const getFileIcon = (mime: string, filename: string) => {
        const lower = filename.toLowerCase();
        if (
            mime.includes('image') ||
            lower.endsWith('.jpg') ||
            lower.endsWith('.jpeg') ||
            lower.endsWith('.png') ||
            lower.endsWith('.webp') ||
            lower.endsWith('.heic')
        ) {
            return <ImageIcon className="h-5 w-5 text-primary" />;
        }
        if (
            mime.includes('spreadsheet') ||
            lower.endsWith('.xlsx') ||
            lower.endsWith('.xls') ||
            lower.endsWith('.csv')
        ) {
            return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
        }
        return <FileText className="h-5 w-5 text-primary" />;
    };

    return (
        <PortalLayout>
            <Head title="Client Portal — Documents | Okojie Online" />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Left Card: Upload a document */}
                <div className="lg:col-span-5">
                    <div className="rounded-[18px] border border-border bg-card p-6 sm:p-7">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">
                                Upload a document
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Only you and your preparer can see these files.
                            </p>
                        </div>

                        <form
                            onSubmit={handleUploadSubmit}
                            className="mt-6 space-y-5"
                        >
                            {/* Document type select */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-foreground">
                                    Document type
                                </label>
                                <Select
                                    value={data.type}
                                    onValueChange={(val) =>
                                        setData('type', val)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DOC_TYPES.map((t) => (
                                            <SelectItem
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.type} />
                            </div>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.heic,.webp,.xlsx,.xls,.csv"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileSelect(e.target.files[0]);
                                    }
                                }}
                            />

                            {/* Drop zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    'flex cursor-pointer flex-col items-center justify-center rounded-[14px] border-2 border-dashed p-6 text-center transition-colors',
                                    isDragging
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border-strong bg-secondary/30 hover:border-primary/60 hover:bg-secondary/60',
                                )}
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <CloudUpload className="h-6 w-6" />
                                </div>
                                <p className="mt-3 text-sm font-semibold text-foreground">
                                    Drag & drop or click to upload
                                </p>
                                <p className="mt-1 max-w-[260px] text-xs text-muted-foreground">
                                    W-2, 1099, ID, prior return — PDF, image, or
                                    spreadsheet
                                </p>

                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                        className="rounded-full text-xs"
                                    >
                                        Browse files
                                    </Button>
                                </div>
                            </div>

                            {/* Selected file preview */}
                            {selectedFile && (
                                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-3">
                                    <div className="flex items-center gap-2.5 truncate">
                                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                                        <div className="truncate text-left text-xs">
                                            <p className="truncate font-medium text-foreground">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-muted-foreground">
                                                {(
                                                    selectedFile.size / 1024
                                                ).toFixed(0)}{' '}
                                                KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFileSelect(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* Upload Progress */}
                            {progress && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Uploading...</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <Progress value={progress.percentage} />
                                </div>
                            )}

                            <InputError message={errors.file} />

                            <div>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.file}
                                    className="w-full rounded-full py-5 text-sm font-semibold"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        'Upload document'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Card: Your documents */}
                <div className="lg:col-span-7">
                    <div className="rounded-[18px] border border-border bg-card p-6 sm:p-7">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    Your documents
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {documents.length}{' '}
                                    {documents.length === 1 ? 'file' : 'files'}{' '}
                                    uploaded
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            {documents.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border py-12 text-center">
                                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        No documents yet. Upload your first one
                                        to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {documents.map((doc) => {
                                        const isClean =
                                            doc.scan_status === 'clean';
                                        const isPending =
                                            doc.scan_status === 'pending';
                                        const isInfected =
                                            doc.scan_status === 'infected';

                                        return (
                                            <div
                                                key={doc.id}
                                                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="flex items-start gap-3 truncate">
                                                    <div className="mt-0.5 rounded-lg border border-border bg-secondary/50 p-2">
                                                        {getFileIcon(
                                                            doc.mime,
                                                            doc.filename,
                                                        )}
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="truncate text-sm font-semibold text-foreground">
                                                            {doc.filename}
                                                        </p>
                                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                            <Badge
                                                                variant="secondary"
                                                                className="px-2 py-0 text-[11px]"
                                                            >
                                                                {doc.type_label}
                                                            </Badge>
                                                            <span>•</span>
                                                            <span>
                                                                {
                                                                    doc.size_formatted
                                                                }
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {
                                                                    doc.created_at_formatted
                                                                }
                                                            </span>
                                                        </div>

                                                        {/* Scan status notice */}
                                                        {isPending && (
                                                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-warning">
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                                <span>
                                                                    Scanning for
                                                                    viruses...
                                                                </span>
                                                            </div>
                                                        )}
                                                        {isInfected && (
                                                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
                                                                <AlertCircle className="h-3 w-3" />
                                                                <span>
                                                                    File
                                                                    infected —
                                                                    blocked
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 self-end sm:self-center">
                                                    {/* Download link: plain <a> per spec */}
                                                    {isClean ? (
                                                        <a
                                                            href={
                                                                doc.download_url
                                                            }
                                                            download
                                                            className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                                            title="Download file"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            <span>
                                                                Download
                                                            </span>
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled
                                                            className="rounded-full text-xs opacity-50"
                                                            title="Available after scan completes"
                                                        >
                                                            <Download className="mr-1 h-3.5 w-3.5" />
                                                            Download
                                                        </Button>
                                                    )}

                                                    {/* Delete button: only before ReadyForReview */}
                                                    {canDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    doc,
                                                                )
                                                            }
                                                            className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            title="Delete file"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Delete
                                                            </span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
}
