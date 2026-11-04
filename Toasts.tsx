'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/components/providers/StoreProvider';
import { CloseIcon } from '@/components/ui/Icons';

export function Toasts() {
  const { toasts, dismissToast, setCartOpen } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-[130] flex w-[min(92vw,380px)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-6 sm:translate-x-0" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-ink p-3 pr-2 text-paper shadow-2xl"
          >
            {t.image && <img src={t.image} alt="" width={44} height={55} className="h-[55px] w-11 rounded-md object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.body && <p className="truncate text-sm text-paper/70">{t.body}</p>}
            </div>
            {t.title === 'Added to bag' && (
              <button type="button" onClick={() => { setCartOpen(true); dismissToast(t.id); }} className="rounded-full bg-marker px-3 py-1.5 text-xs font-semibold text-ink">
                View bag
              </button>
            )}
            <button type="button" onClick={() => dismissToast(t.id)} className="rounded-full p-2 text-paper/70 hover:text-paper" aria-label="Dismiss">
              <CloseIcon width={16} height={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
