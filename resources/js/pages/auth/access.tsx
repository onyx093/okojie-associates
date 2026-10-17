import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { MarketingLayout } from '@/layouts/marketing-layout';

interface Props {
    mode: 'signin' | 'signup';
    status?: string;
    canResetPassword?: boolean;
    passwordRules?: string;
    tier?: string;
    next?: string;
    ref?: string;
}

export default function AccessPage({
    mode,
    status,
    tier,
    next,
    ref: refParam,
}: Props) {
    const [showPassword, setShowPassword] = React.useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true,
        tier: tier || '',
        next: next || '',
        ref: refParam || '',
    });

    const toggleUrl = React.useMemo(() => {
        const targetPath = mode === 'signin' ? '/register' : '/login';
        const searchParams = new URLSearchParams();
        if (tier) {
            searchParams.set('tier', tier);
        }
        if (next) {
            searchParams.set('next', next);
        }
        if (refParam) {
            searchParams.set('ref', refParam);
        }
        const qs = searchParams.toString();
        return qs ? `${targetPath}?${qs}` : targetPath;
    }, [mode, tier, next, refParam]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'signin') {
            post('/login', {
                onFinish: () => reset('password'),
            });
        } else {
            post('/register', {
                onFinish: () => reset('password'),
            });
        }
    };

    const isSignIn = mode === 'signin';
    const pageTitle = isSignIn ? 'Sign In | Okojie Online' : 'Sign Up | Okojie Online';

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta
                    name="description"
                    content="Sign in to Okojie Online to upload documents, review your return status, e-sign, and pay."
                />
            </Head>

            <section className="relative flex min-h-[calc(100vh-5rem-16rem)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="w-full max-w-[420px]">
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl sm:p-10">
                        {/* Security Badge */}
                        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            <ShieldCheck className="size-3.5" />
                            <span>Secure client portal</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Sign in to Okojie Online
                        </h1>

                        {/* Sub Copy */}
                        <p className="mt-2 text-sm leading-relaxed text-body">
                            Upload documents, review your return status, e-sign, and pay — all in one place.
                        </p>

                        {/* Session Status Banner */}
                        {status && (
                            <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-400">
                                {status}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                            {/* Email */}
                            <div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                    aria-label="Email address"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    className="h-11 bg-background text-sm"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-destructive" role="alert">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Password"
                                        aria-label="Password"
                                        autoComplete={isSignIn ? 'current-password' : 'new-password'}
                                        required
                                        className="h-11 bg-background pr-10 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-white"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-destructive" role="alert">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Forgot password link in sign-in mode */}
                            {isSignIn && (
                                <div className="flex justify-end pt-0.5">
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-primary transition-colors hover:text-primary-hover hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            )}

                            {/* Primary Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                disabled={processing}
                                className="mt-2 h-11 text-sm font-semibold shadow-sm"
                            >
                                {processing && <Spinner className="mr-2" />}
                                {isSignIn ? 'Sign in' : 'Create account'}
                            </Button>

                            {/* Mode Toggle Link */}
                            <div className="pt-2 text-center text-sm text-body">
                                {isSignIn ? (
                                    <>
                                        Need an account?{' '}
                                        <Link
                                            href={toggleUrl}
                                            className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        Have an account?{' '}
                                        <Link
                                            href={toggleUrl}
                                            className="font-semibold text-primary transition-colors hover:text-primary-hover hover:underline"
                                        >
                                            Sign in
                                        </Link>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Below Card Helper */}
                    <div className="mt-8 text-center text-sm text-body">
                        New here?{' '}
                        <Link
                            href="/contact"
                            className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
                        >
                            Start your return online
                        </Link>{' '}
                        or create an account above.
                    </div>
                </div>
            </section>
        </>
    );
}

AccessPage.layout = (page: React.ReactNode) => <MarketingLayout>{page}</MarketingLayout>;
