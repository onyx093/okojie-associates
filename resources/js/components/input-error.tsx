import { CircleAlert } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            role="alert"
            {...props}
            className={cn(
                'inline-flex items-center gap-1.5 text-[12.5px] leading-snug text-danger',
                className,
            )}
        >
            <CircleAlert
                className="size-[14px] shrink-0 text-danger"
                strokeWidth={1.7}
                aria-hidden="true"
            />
            <span>{message}</span>
        </p>
    ) : null;
}
