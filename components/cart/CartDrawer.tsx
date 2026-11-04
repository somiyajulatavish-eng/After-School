'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { TLink } from '@/components/TLink';
import { useScrollLock } from '@/components/providers/SmoothScroll';
import { useStore } from '@/components/providers/StoreProvider';
import { CloseIcon } from '@/components/ui/Icons';
import { getRecommendations } from '@/lib/catalog';
import { CartLineItem } from './CartLineItem';
import { FreeShippingBar } from './FreeShippingBar';
import { Img } from '@/components/ui/Img';

export function CartDrawer() {
  const { cartOpen, setCartOpen, totals, hydrated, addItem, price, money } = useStore();
  const pathname = usePathname();
  const closeBtn = useRef<HTMLButtonElement>(null);
  useScrollLock(cartOpen);
  const close = () => setCartOpen(false);

  useEffect(() => {
    setCartOpen(false);
  }, [pathname, setCartOpen]);

  useEffect(() => {
    if (!cartOpen) return;
    const t = window.setTimeout(() => closeBtn.current?.focus(), 200);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [cartOpen, setCartOpen]);

  const recs = hydrated ? getRecommendations(totals.lines.map((l) => l.slug), 2) : [];

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[110]">
          <motion.button
            type="button"
            aria-label="Close bag"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-[480px] flex-col bg-paper pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line/10 px-6 py-5">
              <h2 id="cart-title" className="display text-3xl">
                Bag <span className="text-graphite">({totals.itemCount})</span>
              </h2>
              <button ref={closeBtn} type="button" onClick={close} className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5" aria-label="Close bag">
                <CloseIcon />
              </button>
            </div>

            {totals.lines.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center gap-6 px-6">
                <p className="display-narrow text-5xl">Your bag is empty.</p>
                <p className="text-graphite">Start with a bestseller or browse a category.</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['/shop/clothing', 'Clothing'],
                    ['/shop/football', 'Football'],
                    ['/shop/3d-printed', '3D Printed'],
                  ].map(([href, label]) => (
                    <TLink key={href} href={href} onClick={close} className="btn-ghost h-11 px-5 text-sm">
                      {label}
                    </TLink>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-line/10 px-6 py-4">
                  <FreeShippingBar quote={totals.shipping} subtotal={totals.subtotal - totals.discount} />
                </div>
                <div className="flex-1 overflow-y-auto overscroll-contain px-6" data-lenis-prevent>
                  <ul>
                    <AnimatePresence initial={false}>
                      {totals.lines.map((l) => (
                        <CartLineItem key={l.key} line={l} compact onNavigate={close} />
                      ))}
                    </AnimatePresence>
                  </ul>
                  {recs.length > 0 && (
                    <div className="mb-6 mt-2 rounded-xl bg-sheet p-4">
                      <p className="mb-3 text-sm font-semibold">Goes well with</p>
                      <ul className="flex flex-col gap-3">
                        {recs.map((p) => (
                          <li key={p.slug} className="flex items-center gap-3">
                            <Img src={p.images[0][0]} alt="" width={56} height={70} className="h-[70px] w-14 rounded object-cover" />
                            <div className="min-w-0 flex-1">
                              <TLink href={`/product/${p.slug}`} onClick={close} className="link-underline block truncate text-sm font-semibold">
                                {p.name}
                              </TLink>
                              <span className="text-sm text-graphite">{price(p.price)}</span>
                            </div>
                            {p.sizes.length === 0 ? (
                              <button type="button" onClick={() => addItem(p.slug, p.colors[0].name, undefined, 1)} className="rounded-full border border-line/20 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-ink hover:text-paper">
                                Add
                              </button>
                            ) : (
                              <TLink href={`/product/${p.slug}`} onClick={close} className="rounded-full border border-line/20 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-ink hover:text-paper">
                                Choose size
                              </TLink>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="border-t border-line/10 px-6 py-5">
                  <dl className="mb-4 space-y-1 text-[15px]">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd className="tabular-nums">{money(totals.subtotal)}</dd>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-pen">
                        <dt>Discount ({totals.discountCode?.code})</dt>
                        <dd className="tabular-nums">−{money(totals.discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-graphite">
                      <dt>Shipping</dt>
                      <dd>{totals.shipping.isFree ? 'Free' : 'Calculated in bag'}</dd>
                    </div>
                  </dl>
                  <div className="grid grid-cols-2 gap-3">
                    <TLink href="/cart" onClick={close} className="btn-ghost">
                      View bag
                    </TLink>
                    <TLink href="/checkout" onClick={close} className="btn-primary">
                      Checkout
                    </TLink>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
