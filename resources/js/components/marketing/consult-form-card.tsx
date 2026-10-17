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

interface ConsultFormCardProps {
    id?: string;
    className?: string;
}

export function ConsultFormCard({
    id = 'consult',
    className,
}: ConsultFormCardProps) {
    const today = new Date().toISOString().split('T')[0];

    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [date, setDate] = React.useState('');
    const [timeWindow, setTimeWindow] = React.useState('Any');
    const [format, setFormat] = React.useState('Video call');
    const [notes, setNotes] = React.useState('');
    const [errors, setErrors] = React.useState<{
        name?: string;
        email?: string;
        date?: string;
    }>({});
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { name?: string; email?: string; date?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Please enter your name.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email.trim())) {
            newErrors.email = 'Enter a valid email address.';
        }

        if (date && date < today) {
            newErrors.date = 'Choose a date today or later.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            toast.success(
                "Request received. We'll confirm your consultation by email shortly.",
            );
        }, 500);
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
                        {isSubmitted ? (
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
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setName('');
                                        setPhone('');
                                        setEmail('');
                                        setDate('');
                                        setNotes('');
                                    }}
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
                                            placeholder="Marcus Taylor"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                if (errors.name) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        name: undefined,
                                                    }));
                                                }
                                            }}
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
                                            type="tel"
                                            placeholder="(215) 555-0142"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(e.target.value)
                                            }
                                        />
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
                                            type="email"
                                            placeholder="marcus@example.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (errors.email) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        email: undefined,
                                                    }));
                                                }
                                            }}
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
                                            Preferred date
                                        </Label>
                                        <Input
                                            id="consult-date"
                                            type="date"
                                            min={today}
                                            value={date}
                                            onChange={(e) => {
                                                setDate(e.target.value);
                                                if (errors.date) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        date: undefined,
                                                    }));
                                                }
                                            }}
                                            aria-invalid={!!errors.date}
                                            className={cn(
                                                errors.date &&
                                                    'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {errors.date && (
                                            <span className="text-xs text-destructive">
                                                {errors.date}
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
                                            value={timeWindow}
                                            onValueChange={setTimeWindow}
                                        >
                                            <SelectTrigger id="consult-time">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select a time" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Any">
                                                    Any time
                                                </SelectItem>
                                                <SelectItem value="Morning">
                                                    Morning (9am–12pm)
                                                </SelectItem>
                                                <SelectItem value="Afternoon">
                                                    Afternoon (12pm–4pm)
                                                </SelectItem>
                                                <SelectItem value="Evening">
                                                    Evening (4pm–6pm)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <Label htmlFor="consult-format">
                                            Format
                                        </Label>
                                        <Select
                                            value={format}
                                            onValueChange={setFormat}
                                        >
                                            <SelectTrigger id="consult-format">
                                                <div className="flex items-center gap-2">
                                                    <Video className="size-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Format" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Video call">
                                                    Video call
                                                </SelectItem>
                                                <SelectItem value="Phone call">
                                                    Phone call
                                                </SelectItem>
                                                <SelectItem value="In person">
                                                    In person (Office)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="consult-notes">Notes</Label>
                                    <Textarea
                                        id="consult-notes"
                                        rows={3}
                                        placeholder="Any specific tax questions, notice details, or situation..."
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={isSubmitting}
                                    fullWidth
                                    className="mt-2"
                                >
                                    {isSubmitting
                                        ? 'Requesting...'
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
