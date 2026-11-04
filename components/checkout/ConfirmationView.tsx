'use client';

import { useEffect, useState } from 'react';
import { TLink } from '@/components/TLink';
import { SplitText } from '@/components/motion/SplitText';
import { useStore } from '@/components/providers/StoreProvider';
import { CheckIcon } from '@/components/ui/Icons';
import { formatMoney, isCurrencyCode, type CurrencyCode } from '@/lib/currency';
import { LAST_ORDER_KEY } from './CheckoutView';
import { Img } from '@/components/ui/Img';

interface OrderItem {
  name: string;
  variant: string;
  qty: number;
  total: number;
  image?: string;
}

interface Order {
  id: string;
  currency?: string;
  email: string;
  name: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
  paid?: boolean;
  shippingLabel?: string;
}

type State = { kind: 'loading' } | { kind: 'ok'; order: Order; demo: boolean } | { kind: 'error'; message: string };

export function ConfirmationView({ sessionId, demoOrder }: { sessionId?: string; demoOrder?: string }) {
  const { clearCart, hydrated } = useStore();
  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      if (sessionId) {
        try {
          const res = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`);
          const data = (await res.json()) as { ok: boolean; order?: Order; message?: string };
          if (cancelled) return;
          if (!res.ok || !data.ok || !data.order) throw new Error(data.message ?? 'We couldn’t load your order.');
          if (data.order.paid) clearCart();
          setState({ kind: 'ok', order: data.order, demo: false });
        } catch (e) {
          if (!cancelled) setState({ kind: 'error', message: e instanceof Error ? e.message : 'We couldn’t load your order.' });
        }
        return;
      }
      if (demoOrder) {
        try {
          const raw = window.sessionStorage.getItem(LAST_ORDER_KEY);
          const order = raw ? (JSON.parse(raw) as Order) : null;
          if (order && order.id === demoOrder) {
            clearCart();
            setState({ kind: 'ok', order, demo: true });
            return;
          }
        } catch {
          /* fall through */
        }
      }
      setState({ kind: 'error', message: 'We couldn’t find an order to show. If you just paid, check your email for a receipt.' });
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, demoOrder, hydrated, clearCart]);

  if (state.kind === 'loading') return <div className="h-[50vh] animate-pulse rounded-xl bg-sheet" aria-label="Loading your order" />;

  if (state.kind === 'error') {
    return (
      <div className="rounded-xl bg-sheet px-6 py-20 text-center">
        <p className="display-narrow text-5xl">No order to show.</p>
        <p className="mx-auto mt-3 max-w-[48ch] text-graphite">{state.message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <TLink href="/shop" className="btn-primary">
            Keep shopping
          </TLink>
          <TLink href="/contact" className="btn-ghost">
            Contact us
          </TLink>
        </div>
      </div>
    );
  }

  const { order, demo } = state;
  const cur: CurrencyCode = isCurrencyCode(order.currency) ? order.currency : 'USD';
  const fmt = (minor: number) => formatMoney(minor, cur);
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-marker">
          <CheckIcon width={32} height={32} />
        </span>
        <SplitText as="h1" immediate text={order.paid === false ? 'Order received.' : 'You’re all set.'} className="display mt-8 text-[clamp(38px,8vw,128px)]" />
        <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-graphite">
          Thanks{order.name ? `, ${order.name.split(' ')[0]}` : ''}. Order <span className="font-semibold text-ink">{order.id}</span> is confirmed and a receipt is on its way to{' '}
          <span className="font-semibold text-ink">{order.email}</span>.
          {order.paid === false && ' We’ll start packing as soon as your payment clears.'}
        </p>
        {demo && (
          <p className="mt-4 rounded-lg border border-line/15 bg-sheet px-4 py-3 text-sm text-graphite">
            This store is running in demo mode, so no payment was taken. Add a Stripe key to accept real orders.
          </p>
        )}
        <ol className="mt-10 space-y-4 border-l-2 border-line/15 pl-6">
          <li>
            <p className="font-semibold">Confirmed</p>
            <p className="text-sm text-graphite">{new Date(order.createdAt).toLocaleString()}</p>
          </li>
          <li>
            <p className="font-semibold">Packing</p>
            <p className="text-sm text-graphite">Clothing ships in 1 to 2 days. 3D printed items are printed first, then ship in 2 to 4 days.</p>
          </li>
          <li>
            <p className="font-semibold">On its way</p>
            <p className="text-sm text-graphite">You’ll get a tracking link by email{order.shippingLabel ? `. Method: ${order.shippingLabel}` : ''}.</p>
          </li>
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <TLink href="/shop" className="btn-primary">
            Keep shopping
          </TLink>
          <TLink href="/blog" className="btn-ghost">
            Read the journal
          </TLink>
        </div>
      </div>
      <aside className="lg:col-span-5 lg:col-start-8" aria-label="Order details">
        <div className="rounded-2xl bg-sheet p-6 md:p-8">
          <h2 className="mb-6 text-lg font-semibold">Order summary</h2>
          <ul className="space-y-4">
            {order.items.map((it, i) => (
              <li key={i} className="flex items-center gap-4">
                {it.image && <Img src={it.image} alt="" width={56} height={70} className="h-[70px] w-14 rounded-md object-cover" />}
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{it.name}</span>
                  <span className="text-sm text-graphite">
                    {it.variant ? `${it.variant}, ` : ''}qty {it.qty}
                  </span>
                </span>
                <span className="tabular-nums">{fmt(it.total)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-line/15 pt-4 text-[15px]">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{fmt(order.subtotal)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between text-pen"><dt>Discount</dt><dd className="tabular-nums">−{fmt(order.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd className="tabular-nums">{order.shipping ? fmt(order.shipping) : 'Free'}</dd></div>
            <div className="flex justify-between pt-2 text-lg font-semibold"><dt>Total paid</dt><dd className="tabular-nums">{fmt(order.total)}</dd></div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
