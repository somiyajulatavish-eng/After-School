'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '@/components/providers/StoreProvider';
import { CloseIcon } from '@/components/ui/Icons';

export function DiscountForm() {
  const { code, applyCode, removeCode, totals } = useStore();
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = () => {
    if (!value.trim()) {
      setMsg({ ok: false, text: 'Enter a code first.' });
      return;
    }
    const r = applyCode(value);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok) setValue('');
  };

  return (
    <div>
      {code ? (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-marker/70 px-4 py-3">
          <div className="text-sm">
            <span className="font-semibold">{code}</span>
            <span className="block text-ink/70">{totals.discountError ?? totals.discountCode?.description}</span>
          </div>
          <button type="button" onClick={() => { removeCode(); setMsg(null); }} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/10" aria-label={`Remove code ${code}`}>
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <label htmlFor="discount" className="sr-only">
            Discount code
          </label>
          <input id="discount" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Discount code" autoComplete="off" className="field uppercase placeholder:normal-case" aria-describedby="discount-msg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
          />
          <button type="button" onClick={submit} className="btn-ghost h-12 shrink-0 px-5">
            Apply
          </button>
        </div>
      )}
      <div id="discount-msg" aria-live="polite" className="min-h-[1.25rem]">
        <AnimatePresence mode="wait">
          {msg && (
            <motion.p key={msg.text} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mt-2 text-sm ${msg.ok ? 'text-pen' : 'text-margin'}`}>
              {msg.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {!code && <p className="mt-1 text-xs text-graphite">Try AFTERSCHOOL10 for 10% off.</p>}
    </div>
  );
}
