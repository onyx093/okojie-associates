import { Upload, X } from 'lucide-react';
import * as React from 'react';
import { IconButton } from '@/components/primitives/button';
import { FileBadge } from '@/components/primitives/row-list';
import { cn } from '@/lib/utils';

export function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
        return `${Math.round(kb)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
}

export type FileDropzoneProps = {
    file?: File | null;
    onFileSelect?: (file: File | null) => void;
    accept?: string;
    helperText?: React.ReactNode;
    disabled?: boolean;
    id?: string;
    name?: string;
    className?: string;
};

export function FileDropzone({
    file = null,
    onFileSelect,
    accept = '.pdf,.png,.jpg,.jpeg,.webp',
    helperText = 'PDF, JPG, PNG, or WEBP up to 25 MB · Virus-scanned on upload',
    disabled = false,
    id,
    name,
    className,
}: FileDropzoneProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) {
            return;
        }
        onFileSelect?.(files[0]);
    };

    if (file) {
        const ext = file.name.includes('.')
            ? (file.name.split('.').pop() ?? 'FILE')
            : 'FILE';

        return (
            <div
                data-slot="selected-file"
                className={cn(
                    'flex items-center justify-between gap-3 rounded-control bg-sunken px-3 py-2.5 shadow-[inset_0_0_0_1px_var(--border)]',
                    className,
                )}
            >
                <div className="flex min-w-0 items-center gap-3">
                    <FileBadge ext={ext} />
                    <div className="min-w-0">
                        <div className="truncate text-[13.5px] font-medium text-foreground">
                            {file.name}
                        </div>
                        <div className="text-[12px] text-fg-3">
                            {formatBytes(file.size)} · ready to upload
                        </div>
                    </div>
                </div>
                <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove ${file.name}`}
                    disabled={disabled}
                    onClick={() => {
                        if (inputRef.current) {
                            inputRef.current.value = '';
                        }
                        onFileSelect?.(null);
                    }}
                >
                    <X className="size-4" strokeWidth={1.7} />
                </IconButton>
            </div>
        );
    }

    return (
        <div
            data-slot="file-dropzone"
            onDragOver={(event) => {
                event.preventDefault();
                if (!disabled) {
                    setIsDragging(true);
                }
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                if (!disabled) {
                    handleFiles(event.dataTransfer.files);
                }
            }}
            className={cn(
                'relative flex flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-border-strong bg-sunken px-5 py-7 text-center transition-colors duration-150',
                !disabled &&
                    'cursor-pointer hov:border-primary hov:bg-brand-soft/60',
                isDragging && 'border-primary bg-brand-soft',
                disabled && 'pointer-events-none opacity-60',
                className,
            )}
            onClick={() => {
                if (!disabled) {
                    inputRef.current?.click();
                }
            }}
        >
            <input
                ref={inputRef}
                id={inputId}
                name={name}
                type="file"
                accept={accept}
                disabled={disabled}
                onChange={(event) => handleFiles(event.target.files)}
                className="sr-only"
            />
            <span
                className="inline-flex size-10 items-center justify-center rounded-btn bg-card text-brand shadow-chip"
                aria-hidden="true"
            >
                <Upload className="size-[18px]" strokeWidth={1.7} />
            </span>
            <p className="text-[13.5px] text-foreground">
                Drag a file here or{' '}
                <span className="font-medium text-brand underline underline-offset-2">
                    browse
                </span>
            </p>
            {helperText && (
                <p className="text-[12px] text-fg-3">{helperText}</p>
            )}
        </div>
    );
}
