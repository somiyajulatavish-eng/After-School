'use client';

import { AnimatePresence } from 'framer-motion';
import { TLink } from '@/components/TLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { useStore } from '@/components/providers/StoreProvider';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { getBestsellers, getRecommendations } from '@/lib/catalog';
import { CartLineItem } from './CartLineItem';
import { DiscountForm } from './DiscountForm';
import { FreeShippingBar } from './FreeShippingBar';
import { OrderSummary } from './OrderSummary';
import { ShippingCalculator } from './ShippingCalculator';

export function CartView() {
  const { totals, hydrated } = useStore();

  if (!hydrated) {
    return <div className="h-[40vh] animate-pulse rounded-xl bg-sheet" aria-label="Loading bag" />;
  }

  if (!totals.lines.length) {
    return (
      <div>
        <div className="rounded-xl bg-sheet px-6 py-20 text-center">
          <p className="display-narrow text-5xl">Your bag is empty.</p>
          <p className="mt-3 text-graphite">Everything you add will stay here, even if you close the tab.</p>
          <TLink href="/shop" className="btn-primary mt-8">
            Start shopping
          </TLink>
        </div>
        <h2 className="display mb-10 mt-24 text-[clamp(36px,5vw,72px)]">Popular right now</h2>
        <ProductGrid products={getBestsellers(4)} />
      </div>
    );
  }

  const recs = getRecommendations(totals.lines.map((l) => l.slug), 4);

  return (
    <>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <FreeShippingBar quote={totals.shipping} subtotal={totals.subtotal - totals.discount} />
          <ul className="mt-6 border-t border-ink/10">
            <AnimatePresence initial={false}>
              {totals.lines.map((l) => (
                <CartLineItem key={l.key} line={l} />
              ))}
            </AnimatePresence>
          </ul>
        </div>
        <aside className="lg:col-span-5" aria-label="Order summary">
          <div className="space-y-8 rounded-2xl bg-white/60 p-6 shadow-[0_1px_0_rgba(19,28,94,0.06),0_24px_48px_-24px_rgba(19,28,94,0.18)] md:p-8 lg:sticky lg:top-28">
            <DiscountForm />
            <ShippingCalculator id="cart-ship" />
            <OrderSummary />
            <Magnetic strength={0.15} className="w-full">
              <TLink href="/checkout" className="btn-primary w-full" data-cursor="Pay">
                Continue to checkout
              </TLink>
            </Magnetic>
            <p className="text-center text-xs text-graphite">Secure payment by Stripe. Cards, Apple Pay and Google Pay accepted.</p>
          </div>
        </aside>
      </div>
      <section className="mt-28" aria-labelledby="recs-title">
        <h2 id="recs-title" className="display mb-10 text-[clamp(36px,5vw,72px)]">
          Pairs well with your bag
        </h2>
        <ProductGrid products={recs} />
      </section>
    </>
  );
}
