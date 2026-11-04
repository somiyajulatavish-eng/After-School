'use client';

import { MinusIcon, PlusIcon } from './Icons';

interface Props {
  value: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  min?: number;
  size?: 'sm' | 'md';
}

export function QuantityStepper({ value, max, onChange, label, min = 1, size = 'md' }: Props) {
  const h = size === 'sm' ? 'h-9' : 'h-12';
  const w = size === 'sm' ? 'w-9' : 'w-12';
  return (
    <div className={`inline-flex ${h} items-center rounded-full border border-line/20`} role="group" aria-label={label}>
      <button
        type="button"
        className={`flex ${h} ${w} items-center justify-center rounded-full transition-colors hover:bg-ink/5 disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon width={16} height={16} />
      </button>
      <span className="min-w-[2ch] text-center text-[15px] font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`flex ${h} ${w} items-center justify-center rounded-full transition-colors hover:bg-ink/5 disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
