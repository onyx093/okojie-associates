import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'> & {
    ref?: Ref<HTMLInputElement>;
    showStrengthMeter?: boolean;
};

function evaluateStrength(value: string): {
    score: number;
    label: string;
} {
    const length = value.length;
    if (length === 0) {
        return { score: 0, label: 'Minimum 12 characters' };
    }

    let score = 1;
    if (length >= 12) {
        score++;
    }
    if (length >= 16 || (/[A-Z]/.test(value) && /[0-9]/.test(value))) {
        score++;
    }
    if (length >= 14 && /[^A-Za-z0-9]/.test(value)) {
        score++;
    }

    const clamped = Math.min(4, Math.max(1, score));
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    return {
        score: clamped,
        label: `${labels[clamped - 1]} · ${length} character${length === 1 ? '' : 's'}`,
    };
}

export default function PasswordInput({
    className,
    ref,
    showStrengthMeter = false,
    value,
    defaultValue,
    onChange,
    ...props
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(
        typeof value === 'string'
            ? value
            : typeof defaultValue === 'string'
              ? defaultValue
              : '',
    );

    const currentString = typeof value === 'string' ? value : internalValue;
    const strength = evaluateStrength(currentString);

    return (
        <div className="grid gap-2">
            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    className={cn('pr-10', className)}
                    ref={ref}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={(event) => {
                        setInternalValue(event.target.value);
                        onChange?.(event);
                    }}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-[5px] right-[5px] inline-flex size-8 items-center justify-center rounded-lg text-fg-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hov:bg-sunken hov:text-foreground"
                    aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                    }
                >
                    {showPassword ? (
                        <EyeOff className="size-[15px]" strokeWidth={1.7} />
                    ) : (
                        <Eye className="size-[15px]" strokeWidth={1.7} />
                    )}
                </button>
            </div>

            {showStrengthMeter && (
                <div className="grid gap-1.5" aria-live="polite">
                    <div className="grid grid-cols-4 gap-1.5">
                        {[1, 2, 3, 4].map((segment) => (
                            <span
                                key={segment}
                                className={cn(
                                    'h-1 rounded-full transition-colors duration-150',
                                    segment <= strength.score
                                        ? strength.score >= 3
                                            ? 'bg-success'
                                            : strength.score === 2
                                              ? 'bg-warning'
                                              : 'bg-danger'
                                        : 'bg-border-strong/50',
                                )}
                            />
                        ))}
                    </div>
                    <span className="text-[12px] text-fg-3">
                        {strength.label}
                    </span>
                </div>
            )}
        </div>
    );
}

export { PasswordInput };
