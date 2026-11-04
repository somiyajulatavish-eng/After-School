'use client';

import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/format';
import type { ShippingQuote } from '@/lib/shipping';

export function FreeShippingBar({ quote, subtotal }: { quote: ShippingQuote; subtotal: number }) {
  const pct = Math.min(100, (subtotal / quote.freeThreshold) * 100);
  const done = quote.remainingForFree === 0;
  return (
    <div>
      <p className="mb-2 text-sm">
        {done ? (
          <span className="font-semibold">Free standard shipping unlocked.</span>
        ) : (
          <>
            You’re <span className="font-semibold">{formatPrice(quote.remainingForFree)}</span> away from free standard shipping.
          </>
        )}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Progress to free shipping">
        <motion.div className="h-full origin-left rounded-full bg-pen" initial={false} animate={{ scaleX: pct / 100 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </div>
  );
}
