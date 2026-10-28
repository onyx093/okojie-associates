import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import * as React from 'react';

import { container, Eyebrow } from '@/components/home/primitives';
import { Button } from '@/components/primitives';
import {
    type IncomeChoice,
    type MeetChoice,
    recommendTier,
    type StatesChoice,
    type TierGuideInput,
} from '@/lib/tier-guide';
import { cn } from '@/lib/utils';
import { register } from '@/routes';

interface OptionItem<T extends string> {
    value: T;
    label: string;
}

const INCOME_OPTIONS: OptionItem<IncomeChoice>[] = [
    { value: 'w2', label: 'W-2 job only' },
    { value: 'se', label: 'Self-employed or 1099' },
    { value: 'rent', label: 'Rental property' },
    { value: 'mix', label: 'A mix of these' },
];

const MEET_OPTIONS: OptionItem<MeetChoice>[] = [
    { value: 'remote', label: 'Fully online' },
    { value: 'office', label: 'In an office' },
];

const STATES_OPTIONS: OptionItem<StatesChoice>[] = [
    { value: 'one', label: 'Just one' },
    { value: 'multi', label: 'More than one' },
];

interface ChoiceGroupProps<T extends string> {
    legend: string;
    name: string;
    options: OptionItem<T>[];
    value: T;
    onChange: (value: T) => void;
}

function ChoiceGroup<T extends string>({
    legend,
    name,
    options,
    value,
    onChange,
}: ChoiceGroupProps<T>) {
    return (
        <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-2 font-mono text-xs tracking-[0.06em] text-muted-foreground uppercase">
                {legend}
            </legend>
            <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                {options.map((option) => {
                    const isSelected = value === option.value;
                    const id = `${name}-${option.value}`;

                    return (
                        <label
                            key={option.value}
                            htmlFor={id}
                            className={cn(
                                'relative flex cursor-pointer items-center gap-2 rounded-[10px] p-2.5 text-[13.5px] font-medium transition-colors select-none',
                                'has-focus-visible:outline-accent-solid has-focus-visible:outline-2 has-focus-visible:outline-offset-2',
                                isSelected
                                    ? 'bg-accent-soft text-accent-fg shadow-[inset_0_0_0_1.5px_var(--accent-solid)]'
                                    : 'bg-sunken text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-muted/50',
                            )}
                        >
                            <input
                                type="radio"
                                id={id}
                                name={name}
                                value={option.value}
                                checked={isSelected}
                                onChange={() => onChange(option.value)}
                                className="sr-only"
                            />
                            <span>{option.label}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

export function ServicesTierFinder({
    initialState,
}: {
    initialState?: Partial<TierGuideInput>;
}) {
    const [income, setIncome] = React.useState<IncomeChoice>(
        initialState?.income ?? 'w2',
    );
    const [meet, setMeet] = React.useState<MeetChoice>(
        initialState?.meet ?? 'remote',
    );
    const [states, setStates] = React.useState<StatesChoice>(
        initialState?.states ?? 'one',
    );

    const result = React.useMemo(
        () => recommendTier({ income, meet, states }),
        [income, meet, states],
    );

    return (
        <section
            id="guide"
            aria-labelledby="guide-title"
            className="py-14 sm:py-20"
        >
            <div className={container}>
                <div className="mb-9 grid items-end gap-5 sm:mb-12 md:grid-cols-[1fr_auto] md:gap-8">
                    <div>
                        <Eyebrow icon={Sparkles}>Not sure?</Eyebrow>
                        <h2
                            id="guide-title"
                            className="mt-5 max-w-[18ch] text-[clamp(34px,4.4vw,52px)] leading-[1.04] font-medium tracking-[-0.025em] text-balance text-foreground"
                        >
                            Find your tier in three questions
                        </h2>
                    </div>
                    <p className="max-w-[38ch] text-[17px] text-pretty text-muted-foreground md:text-right">
                        A starting point, not a commitment. Your preparer
                        confirms the right fit before any work begins.
                    </p>
                </div>

                <div className="grid gap-4 rounded-[20px] bg-card p-2 shadow-card lg:grid-cols-2">
                    <form
                        id="gq"
                        onSubmit={(e) => e.preventDefault()}
                        className="grid content-start gap-5 p-6 max-sm:p-4"
                    >
                        <ChoiceGroup<IncomeChoice>
                            legend="What income did you have?"
                            name="inc"
                            options={INCOME_OPTIONS}
                            value={income}
                            onChange={setIncome}
                        />

                        <ChoiceGroup<MeetChoice>
                            legend="How do you want to meet?"
                            name="meet"
                            options={MEET_OPTIONS}
                            value={meet}
                            onChange={setMeet}
                        />

                        <ChoiceGroup<StatesChoice>
                            legend="Did you live or work in more than one state?"
                            name="st"
                            options={STATES_OPTIONS}
                            value={states}
                            onChange={setStates}
                        />
                    </form>

                    <div
                        role="status"
                        aria-live="polite"
                        className="relative isolate flex flex-col overflow-hidden rounded-[14px] bg-[#0C0D16] p-7 text-[#F2F3F7] shadow-card before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(70%_90%_at_100%_0%,rgb(94_112_240/0.45),transparent_60%),radial-gradient(50%_70%_at_80%_120%,rgb(246_150_110/0.3),transparent_60%)] max-sm:p-5"
                    >
                        <span className="font-mono text-xs tracking-[0.06em] text-[#F2F3F7]/55 uppercase">
                            We’d suggest
                        </span>
                        <h3
                            id="g-name"
                            className="mt-2.5 text-[34px] font-medium tracking-[-0.035em] text-[#F2F3F7]"
                        >
                            {result.name}
                        </h3>
                        <p
                            id="g-why"
                            className="mt-2.5 max-w-[40ch] text-[15px] leading-relaxed text-[#F2F3F7]/75"
                        >
                            {result.reason}
                        </p>
                        <div className="mt-auto pt-6 text-[15px] text-[#F2F3F7]/75">
                            From{' '}
                            <b
                                id="g-price"
                                className="ml-1 text-[22px] font-medium text-[#F2F3F7] tabular-nums"
                            >
                                {result.price}
                            </b>
                        </div>
                        <div className="mt-4">
                            <Button
                                asChild
                                variant="primary"
                                size="lg"
                                className="self-start"
                            >
                                <Link
                                    href={register.url({
                                        query: { tier: result.slug },
                                    })}
                                >
                                    Start with this tier
                                    <ArrowRight className="size-[15px]" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
