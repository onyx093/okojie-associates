import { Moon, Sun } from 'lucide-react';
import { IconButton } from '@/components/primitives/button';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export type ThemeToggleProps = {
    className?: string;
    size?: 'default' | 'sm';
};

export function ThemeToggle({ className, size = 'default' }: ThemeToggleProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <IconButton
            aria-label={
                isDark ? 'Switch to light theme' : 'Switch to dark theme'
            }
            size={size}
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            className={cn('relative overflow-hidden', className)}
        >
            <Sun
                className={cn(
                    'size-[18px] transition-all duration-200 ease-snap',
                    isDark
                        ? 'scale-25 opacity-0 blur-[4px]'
                        : 'blur-0 scale-100 opacity-100',
                )}
                strokeWidth={1.7}
                aria-hidden="true"
            />
            <Moon
                className={cn(
                    'absolute size-[18px] transition-all duration-200 ease-snap',
                    isDark
                        ? 'blur-0 scale-100 opacity-100'
                        : 'scale-25 opacity-0 blur-[4px]',
                )}
                strokeWidth={1.7}
                aria-hidden="true"
            />
        </IconButton>
    );
}
