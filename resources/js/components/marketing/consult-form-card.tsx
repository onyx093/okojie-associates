import { useForm } from '@inertiajs/react';
import { Calendar, CheckCircle2, Clock, Video } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { consult } from '@/routes/leads';

interface ConsultFormCardProps {
    id?: string;
    referralCode?: string;
    className?: string;
}

export function ConsultFormCard({
    id = 'consult',
    referralCode = '',
    className,
}: ConsultFormCardProps) {
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm({
            name: '',
            phone: '',
            email: '',
            preferred_date: '',
            time_window: 'morning',
            format: 'video',
            notes: '',
            ref: referralCode || '',
            my_name: '', // honeypot
        });

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const queryRef = params.get('ref');
            if (queryRef && !data.ref) {
                setData('ref', queryRef);
            }
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(consult.url(), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    "Request received. We'll confirm your consultation by email shortly.",
                );
            },
            onError: () => {
                toast.error(
                    'Something went wrong. Please try again or call (215) 555-0142.',
                );
            },
        });
    };

    return (
        <section
            id={id}
            className={cn(
                'mx-auto w-full max-w-[640px] scroll-mt-24',
                className,
            )}
        >
            <Reveal direction="up">
                <Card className="border-border bg-[#181925]/70 shadow-xl">
                    <CardHeader className="pb-2 text-center">
                        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Calendar className="size-5" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">
                            Book a free consultation
                        </CardTitle>
                        <CardDescription className="text-sm text-body">
                            Meet with a credentialed preparer by video, phone,
                            or in person. No obligation.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                        {wasSuccessful ? (
                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-8 text-center">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <CheckCircle2 className="size-6" />
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-foreground">
                                    Consultation Requested
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-body">
                                    Request received. We'll confirm your
                                    consultation by email shortly.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-6"
                                    onClick={() => reset()}
                                >
                                    Book another consultation
                                </Button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="flex flex-col gap-4"
                            >
                                {/* Honeypot field */}
                                <div className="hidden" aria-hidden="true">
                                    <input
                                        type="text"
                                        name="my_name"
                                        value={data.my_name}
                                        onChange={(e) =>
                                            setData('my_name', e.target.value)
                                        }
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="consult-name">
                                            Full name{' '}
                                            <span className="text-primary">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="consult-name"
                                            name="name"
                                            placeholder="Marcus Taylor"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            aria-invalid={!!errors.name}
                                            className={cn(
                                                errors.name &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {errors.name && (
                                            <span className="text-xs text-destructive">
                                                {errors.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="consult-phone">
                                            Phone
                                        </Label>
                                        <Input
                                            id="consult-phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="(215) 555-0142"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            aria-invalid={!!errors.phone}
                                            className={cn(
                                                errors.phone &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {errors.phone && (
                                            <span className="text-xs text-destructive">
                                                {errors.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="consult-email">
                                            Email{' '}
                                            <span className="text-primary">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="consult-email"
                                            name="email"
                                            type="email"
                                            placeholder="marcus@example.com"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            aria-invalid={!!errors.email}
                                            className={cn(
                                                errors.email &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {errors.email && (
                                            <span className="text-xs text-destructive">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="consult-date">
                                            Preferred date{' '}
                                            <span className="text-primary">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="consult-date"
                                            name="preferred_date"
                                            type="date"
                                            min={today}
                                            value={data.preferred_date}
                                            onChange={(e) =>
                                                setData(
                                                    'preferred_date',
                                                    e.target.value,
                                                )
                                            }
                                            aria-invalid={
                                                !!errors.preferred_date
                                            }
                                            className={cn(
                                                errors.preferred_date &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {errors.preferred_date && (
                                            <span className="text-xs text-destructive">
                                                {errors.preferred_date}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="consult-time">
                                            Time window
                                        </Label>
                                        <Select
                                            value={data.time_window}
                                            onValueChange={(val) =>
                                                setData('time_window', val)
                                            }
                                        >
                                            <SelectTrigger id="consult-time">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select a time" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="any">
                                                    Any time
                                                </SelectItem>
                                                <SelectItem value="morning">
                                                    Morning (9am–12pm)
                                                </SelectItem>
                                                <SelectItem value="afternoon">
                                                    Afternoon (12pm–4pm)
                                                </SelectItem>
                                                <SelectItem value="evening">
                                                    Evening (4pm–6pm)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.time_window && (
                                            <span className="text-xs text-destructive">
                                                {errors.time_window}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="consult-format">
                                            Format
                                        </Label>
                                        <Select
                                            value={data.format}
                                            onValueChange={(val) =>
                                                setData('format', val)
                                            }
                                        >
                                            <SelectTrigger id="consult-format">
                                                <div className="flex items-center gap-2">
                                                    <Video className="size-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Format" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="video">
                                                    Video call
                                                </SelectItem>
                                                <SelectItem value="phone">
                                                    Phone call
                                                </SelectItem>
                                                <SelectItem value="in_person">
                                                    In person (Office)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.format && (
                                            <span className="text-xs text-destructive">
                                                {errors.format}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="consult-notes">Notes</Label>
                                    <Textarea
                                        id="consult-notes"
                                        name="notes"
                                        rows={3}
                                        placeholder="Any specific tax questions, notice details, or situation..."
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        aria-invalid={!!errors.notes}
                                        className={cn(
                                            errors.notes &&
                                                'border-destructive focus-visible:ring-destructive',
                                        )}
                                    />
                                    {errors.notes && (
                                        <span className="text-xs text-destructive">
                                            {errors.notes}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={processing}
                                    fullWidth
                                    className="mt-2"
                                >
                                    {processing
                                        ? 'Sending…'
                                        : 'Request consultation'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </Reveal>
        </section>
    );
}
