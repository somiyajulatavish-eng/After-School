'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { TLink } from '@/components/TLink';
import { usePageTransition } from '@/components/providers/TransitionProvider';
import { useScrollLock } from '@/components/providers/SmoothScroll';
import { CloseIcon, SearchIcon } from '@/components/ui/Icons';
import { useStore } from '@/components/providers/StoreProvider';
import { POPULAR_SEARCHES, searchProducts } from '@/lib/search';
import { Img } from '@/components/ui/Img';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { price } = useStore();
  useScrollLock(open);
  const { navigate } = usePageTransition();
  const [q, setQ] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => (q.trim().length > 1 ? searchProducts(q, 6) : []), [q]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => input.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100]" initial="hidden" animate="show" exit="hidden">
          <motion.button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/30 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative bg-paper pt-[env(safe-area-inset-top)] shadow-2xl"
            variants={{ hidden: { y: '-100%' }, show: { y: 0 } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
          >
            <div className="wrap py-8 md:py-12">
              <form onSubmit={submit} role="search" className="flex items-center gap-4 border-b-2 border-ink pb-4">
                <SearchIcon width={28} height={28} />
                <label htmlFor="site-search" className="sr-only">
                  Search products
                </label>
                <input
                  ref={input}
                  id="site-search"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search hoodies, shirts, dragons…"
                  autoComplete="off"
                  className="display-narrow w-full bg-transparent text-[clamp(32px,5vw,64px)] placeholder:text-ink/25 focus:outline-none"
                />
                <button type="button" onClick={onClose} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full hover:bg-ink/5" aria-label="Close search">
                  <CloseIcon />
                </button>
              </form>

              <div className="mt-8 min-h-[120px]" aria-live="polite">
                {q.trim().length > 1 ? (
                  results.length ? (
                    <>
                      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        {results.map((p, i) => (
                          <motion.li key={p.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                            <TLink href={`/product/${p.slug}`} onClick={onClose} className="group block">
                              <span className="block aspect-[4/5] overflow-hidden rounded-md bg-sheet">
                                <Img src={p.images[0][0]} alt="" width={300} height={375} className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105" />
                              </span>
                              <span className="mt-2 block text-sm font-semibold leading-snug">{p.name}</span>
                              <span className="text-sm text-graphite">{price(p.price)}</span>
                            </TLink>
                          </motion.li>
                        ))}
                      </ul>
                      <button type="button" onClick={submit} className="link-underline mt-6 text-[15px] font-semibold">
                        See all results for “{q.trim()}”
                      </button>
                    </>
                  ) : (
                    <p className="text-graphite">No matches for “{q.trim()}”. Try a product type like “hoodie” or “stand”.</p>
                  )
                ) : (
                  <div>
                    <p className="mb-3 text-sm text-graphite">Popular right now</p>
                    <ul className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((s) => (
                        <li key={s}>
                          <button type="button" onClick={() => setQ(s)} className="rounded-full border border-line/15 px-4 py-2 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
