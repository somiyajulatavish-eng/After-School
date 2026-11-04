'use client';

import { useStore } from '@/components/providers/StoreProvider';
import { formatPrice } from '@/lib/format';
import { COUNTRIES, METHODS, quoteShipping, type ShippingMethodId } from '@/lib/shipping';

export function ShippingCalculator({ id = 'ship' }: { id?: string }) {
  const { country, method, setCountry, setMethod, totals } = useStore();
  const merch = totals.subtotal - totals.discount;
  const freeCode = totals.discountCode?.kind === 'free-shipping';

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">Shipping estimate</legend>
      <label htmlFor={`${id}-country`} className="label text-graphite">
        Ship to
      </label>
      <select id={`${id}-country`} value={country} onChange={(e) => setCountry(e.target.value)} className="field cursor-pointer">
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="mt-3 grid gap-2" role="radiogroup" aria-label="Shipping method">
        {METHODS.map((m) => {
          const q = quoteShipping(country, m.id, merch, freeCode);
          return (
            <label key={m.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm transition-colors duration-300 ${method === m.id ? 'border-ink bg-white' : 'border-ink/15 hover:border-ink/40'}`}>
              <span className="flex items-center gap-3">
                <input type="radio" name={`${id}-method`} value={m.id} checked={method === m.id} onChange={() => setMethod(m.id as ShippingMethodId)} className="h-4 w-4 accent-ink" />
                <span>
                  <span className="font-semibold">{m.name}</span>
                  <span className="block text-graphite">
                    {q.days[0]} to {q.days[1]} business days
                  </span>
                </span>
              </span>
              <span className="font-semibold tabular-nums">{q.amount === 0 && merch > 0 ? 'Free' : formatPrice(q.amount)}</span>
            </label>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-graphite">
        Free standard shipping to {COUNTRIES.find((c) => c.code === country)?.name} on orders over {formatPrice(totals.shipping.freeThreshold)}. Duties and taxes are calculated at payment.
      </p>
    </fieldset>
  );
}
