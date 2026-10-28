import * as React from 'react';
import { cn } from '@/lib/utils';

const AVATAR_GRADIENTS = [
    'linear-gradient(135deg in oklab, #A9B4FF, #F6C7B0)',
    'linear-gradient(135deg in oklab, #9EE2C4, #A8C3FF)',
    'linear-gradient(135deg in oklab, #FFD2A1, #F7A9C4)',
    'linear-gradient(135deg in oklab, #C9B8FF, #9FD5FF)',
    'linear-gradient(135deg in oklab, #FFE29A, #B8E5A8)',
    'linear-gradient(135deg in oklab, #B5E3F5, #E1C2FF)',
] as const;

export function getInitials(name?: string | null): string {
    const cleaned = (name ?? '').trim();
    if (!cleaned) {
        return 'OO';
    }

    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function getAvatarGradientIndex(
    name?: string | null,
    variant?: 1 | 2 | 3 | 4 | 5 | 6,
): number {
    if (variant) {
        return variant - 1;
    }

    const str = (name ?? 'Okojie').trim();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }

    return hash % AVATAR_GRADIENTS.length;
}

export type UserAvatarProps = React.ComponentProps<'span'> & {
    name?: string | null;
    initials?: string;
    src?: string | null;
    alt?: string;
    variant?: 1 | 2 | 3 | 4 | 5 | 6;
    size?: 'sm' | 'default' | 'lg' | 'xl';
};

const sizeClasses: Record<NonNullable<UserAvatarProps['size']>, string> = {
    sm: 'size-7 text-[11px]',
    default: 'size-[34px] text-[12.5px]',
    lg: 'size-11 text-sm',
    xl: 'size-16 text-lg',
};

export function Avatar({
    name,
    initials,
    src,
    alt,
    variant,
    size = 'default',
    className,
    style,
    ...props
}: UserAvatarProps) {
    const [imgError, setImgError] = React.useState(false);
    const gradientIndex = getAvatarGradientIndex(name, variant);
    const displayInitials = initials ?? getInitials(name);
    const showImage = Boolean(src && !imgError);

    return (
        <span
            data-slot="user-avatar"
            data-av={`av-${gradientIndex + 1}`}
            style={{
                backgroundImage: showImage
                    ? undefined
                    : AVATAR_GRADIENTS[gradientIndex],
                ...style,
            }}
            className={cn(
                'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold tracking-[-0.01em] text-[#1B1D3A] shadow-[inset_0_0_0_1px_rgb(16_19_40/0.12)] select-none',
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            {showImage ? (
                <img
                    src={src ?? undefined}
                    alt={alt ?? name ?? 'Avatar'}
                    onError={() => setImgError(true)}
                    className="size-full object-cover"
                />
            ) : (
                <span aria-hidden="true">{displayInitials}</span>
            )}
        </span>
    );
}
