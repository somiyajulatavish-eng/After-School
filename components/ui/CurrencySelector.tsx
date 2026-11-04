'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useStore } from '@/components/providers/StoreProvider';
import { CURRENCIES, CURRENCY_CODES, currencySymbol, type CurrencyCode } from '@/lib/currency';
import { CheckIcon, ChevronIcon } from './Icons';

/** Compact listbox for the header. Fully keyboard operable (arrows, Home/End, Enter, Escape). */
export function CurrencyMenu({ className = '' }: { className?: string }) {
  const { currency, setCurrency, hydrated } = useStore();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, CURRENCY_CODES.indexOf(currency)));
    const t = window.setTimeout(() => list.current?.focus(), 30);
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, currency]);

  useEffect(() => {
    if (!open) return;
    list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const choose = (c: CurrencyCode) => {
    setCurrency(c);
    setOpen(false);
    btn.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = CURRENCY_CODES.length - 1;
    if (e.key === 'ArrowDown') setActive((a) => Math.min(last, a + 1));
    else if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else if (e.key === 'Enter' || e.key === ' ') choose(CURRENCY_CODES[active]);
    else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
      if (e.key === 'Escape') btn.current?.focus();
      return;
    } else return;
    e.preventDefault();
  };

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <button
        ref={btn}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`Currency: ${CURRENCIES[currency].name}. Change currency`}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold tabular-nums tracking-wide transition-[background-color,opacity] duration-300 hover:bg-ink/10 ${hydrated ? 'opacity-100' : 'opacity-0'}`}
      >
        {currency}
        <ChevronIcon width={14} height={14} className={`transition-transform duration-500 ease-expo ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            tabIndex={-1}
            aria-label="Currency"
            aria-activedescendant={`${id}-${CURRENCY_CODES[active]}`}
            onKeyDown={onKey}
            data-lenis-prevent
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-10 max-h-[min(420px,70svh)] w-[19rem] max-w-[calc(100vw-2rem)] origin-top-right overflow-y-auto overscroll-contain rounded-xl border border-line/10 bg-raised p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] focus:outline-none"
          >
            {CURRENCY_CODES.map((c, i) => (
              <li
                key={c}
                id={`${id}-${c}`}
                data-i={i}
                role="option"
                aria-selected={c === currency}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(c)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${i === active ? 'bg-ink/10' : ''}`}
              >
                <span className="w-10 font-semibold tabular-nums">{c}</span>
                <span className="flex-1 truncate text-graphite">{CURRENCIES[c].name}</span>
                <span className="w-9 text-right text-graphite">{currencySymbol(c)}</span>
                <CheckIcon width={14} height={14} className={c === currency ? 'opacity-100' : 'opacity-0'} />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Native select: the most reliable picker on touch devices and inside menus and the footer. */
export function CurrencySelect({ id, className = '', label = 'Currency' }: { id: string; className?: string; label?: string }) {
  const { currency, setCurrency } = useStore();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm text-graphite">
        {label}
      </label>
      <div className="relative">
        <select id={id} value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)} className="field cursor-pointer appearance-none pr-10">
          {CURRENCY_CODES.map((c) => (
            <option key={c} value={c}>
              {c} ({CURRENCIES[c].name})
            </option>
          ))}
        </select>
        <ChevronIcon width={16} height={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-graphite" />
      </div>
    </div>
  );
}
