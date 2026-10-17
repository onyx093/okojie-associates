import * as React from 'react';
import { cn } from '@/lib/utils';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    delay?: number;
    duration?: number;
    direction?: RevealDirection;
    threshold?: number;
    distance?: number;
    className?: string;
    children?: React.ReactNode;
}

export function Reveal({
    as: Component = 'div',
    delay = 0,
    duration = 550,
    direction = 'up',
    threshold = 0.15,
    distance = 16,
    className,
    children,
    style,
    ...props
}: RevealProps) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] =
        React.useState(false);
    const ref = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
        // Check user preference for reduced motion
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        if (mediaQuery.matches) {
            setPrefersReducedMotion(true);
            setIsVisible(true);
            return;
        }

        const element = ref.current;
        if (!element) {
            setIsVisible(true);
            return;
        }

        // SSR fallback: if IntersectionObserver is unsupported, reveal immediately
        if (!('IntersectionObserver' in window)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold,
                rootMargin: '0px 0px -40px 0px',
            },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold]);

    const getInitialTransform = (): string => {
        if (prefersReducedMotion || direction === 'none') return 'none';
        switch (direction) {
            case 'up':
                return `translateY(${distance}px)`;
            case 'down':
                return `translateY(-${distance}px)`;
            case 'left':
                return `translateX(${distance}px)`;
            case 'right':
                return `translateX(-${distance}px)`;
            default:
                return `translateY(${distance}px)`;
        }
    };

    const computedStyle: React.CSSProperties = prefersReducedMotion
        ? { ...style }
        : {
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'none' : getInitialTransform(),
              transitionProperty: 'opacity, transform',
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${delay}ms`,
              willChange: isVisible ? 'auto' : 'opacity, transform',
              ...style,
          };

    return (
        <Component
            ref={ref as unknown as React.Ref<never>}
            data-slot="reveal"
            className={cn(className)}
            style={computedStyle}
            {...props}
        >
            {children}
        </Component>
    );
}
