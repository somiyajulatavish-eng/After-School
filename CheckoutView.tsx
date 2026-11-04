'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { TLink } from '@/components/TLink';
import { usePageTransition } from '@/components/providers/TransitionProvider';
import { useStore } from '@/components/providers/StoreProvider';
import { DiscountForm } from '@/components/cart/DiscountForm';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { ShippingCalculator } from '@/components/cart/ShippingCalculator';
import { formatPrice } from '@/lib/format';

export const LAST_ORDER_KEY = 'after-school:last-order';

interface ApiResponse {
  ok: boolean;
  url?: string;
  message?: string;
  demo?: boolean;
  order?: unknown;
}

export function CheckoutView({ cancelled }: { cancelled: boolean }) {
  const { totals, hydrated, code, country, method } = useStore();
  const { navigate } = usePageTransition();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState(cancelled ? 'Payment was cancelled. Your bag is saved, so you can try again whenever you’re ready.' : '');

  if (!hydrated) return <div className="h-[50vh] animate-pulse rounded-xl bg-sheet" aria-label="Loading checkout" />;

  if (!totals.lines.length) {
    return (
      <div className="rounded-xl bg-sheet px-6 py-20 text-center">
        <p className="display-narrow text-5xl">Nothing to check out yet.</p>
        <p className="mt-3 text-graphite">Add something to your bag first.</p>
        <TLink href="/shop" className="btn-primary mt-8">
          Browse the shop
        </TLink>
      </div>
    );
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState('loading');
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          notes,
          marketing: consent,
          code,
          country,
          method,
          items: totals.lines.map((l) => ({ slug: l.slug, color: l.color, size: l.size, qty: l.qty })),
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || !data.ok || !data.url) throw new Error(data.message ?? 'Checkout failed. Please try again.');
      if (data.demo && data.order) {
        try {
          window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(data.order));
        } catch {
          /* private mode: confirmation will fall back to a generic message */
        }
        navigate(data.url);
      } else {
        window.location.assign(data.url);
      }
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
    }
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-12 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-7">
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} role="alert" className="rounded-lg border border-margin/40 bg-margin/10 px-4 py-3 text-sm text-margin">
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <section aria-labelledby="contact-h">
          <h2 id="contact-h" className="mb-5 text-xl font-semibold">
            Contact
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="co-email" className="label">
                Email
              </label>
              <input id="co-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="you@example.com" />
              <p className="mt-1 text-xs text-graphite">We’ll send your receipt and tracking link here.</p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="co-name" className="label">
                Full name
              </label>
              <input id="co-name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="field" />
            </div>
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-ink" />
            Email me about new drops and print-lab releases. Unsubscribe any time.
          </label>
        </section>

        <section aria-labelledby="delivery-h">
          <h2 id="delivery-h" className="mb-5 text-xl font-semibold">
            Delivery
          </h2>
          <ShippingCalculator id="co-ship" />
          <p className="mt-4 text-sm text-graphite">You’ll enter your street address on the secure payment page.</p>
          <label htmlFor="co-notes" className="label mt-6">
            Order notes (optional)
          </label>
          <textarea id="co-notes" value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 400))} rows={3} className="field h-auto py-3" placeholder="Gift message, delivery instructions…" />
        </section>
      </div>

      <aside className="lg:col-span-5" aria-label="Order summary">
        <div className="space-y-6 rounded-2xl bg-white/60 p-6 shadow-[0_1px_0_rgba(19,28,94,0.06),0_24px_48px_-24px_rgba(19,28,94,0.18)] md:p-8 lg:sticky lg:top-28">
          <ul className="space-y-4" data-lenis-prevent>
            {totals.lines.map((l) => (
              <li key={l.key} className="flex items-center gap-4">
                <span className="relative shrink-0">
                  <img src={l.image} alt="" width={64} height={80} className="h-20 w-16 rounded-md object-cover" />
                  <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-semibold text-paper">{l.qty}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{l.name}</span>
                  <span className="text-sm text-graphite">{l.variantLabel}</span>
                </span>
                <span className="font-semibold tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
          </ul>
          <DiscountForm />
          <OrderSummary />
          <button type="submit" disabled={state === 'loading'} className="btn-primary w-full">
            {state === 'loading' ? 'Opening secure payment…' : `Pay ${formatPrice(totals.total)}`}
          </button>
          <p className="text-center text-xs text-graphite">
            By placing your order you agree to our 30-day returns policy. Payments are processed securely by Stripe.
          </p>
        </div>
      </aside>
    </form>
  );
}
