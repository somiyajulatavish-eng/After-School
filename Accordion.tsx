'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState, type ReactNode } from 'react';
import { PlusIcon } from '@/components/ui/Icons';

export function Accordion({ items, defaultOpen = 0 }: { items: { title: string; content: ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <div className="border-t border-ink/15">
      {items.map((it, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={it.title} className="border-b border-ink/15">
            <h3>
              <button
                type="button"
                id={`${id}-btn`}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left text-[15px] font-semibold"
              >
                {it.title}
                <PlusIcon width={18} height={18} className={`transition-transform duration-500 ease-expo ${isOpen ? 'rotate-45' : ''}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={`${id}-btn`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-[15px] leading-relaxed text-graphite">{it.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
