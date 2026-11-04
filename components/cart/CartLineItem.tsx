'use client';

import { motion } from 'framer-motion';
import { TLink } from '@/components/TLink';
import { useStore } from '@/components/providers/StoreProvider';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import type { PricedLine } from '@/lib/pricing';
import { Img } from '@/components/ui/Img';

export function CartLineItem({ line, compact = false, onNavigate }: { line: PricedLine; compact?: boolean; onNavigate?: () => void }) {
  const { setQty, removeItem, money } = useStore();
  const max = Math.min(line.stock, 10);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 border-b border-line/10 py-5 last:border-0"
    >
      <TLink href={`/product/${line.slug}`} onClick={onNavigate} className={`block shrink-0 overflow-hidden rounded-md bg-sheet ${compact ? 'w-20' : 'w-24 sm:w-32'}`}>
        <Img src={line.image} alt="" width={240} height={300} className="aspect-[4/5] h-auto w-full object-cover" />
      </TLink>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <TLink href={`/product/${line.slug}`} onClick={onNavigate} className="link-underline font-semibold leading-snug">
              {line.name}
            </TLink>
            <p className="mt-1 text-sm text-graphite">{line.variantLabel}</p>
            {line.stock <= 3 && <p className="mt-1 text-xs font-medium text-margin">Only {line.stock} left</p>}
          </div>
          <span className="shrink-0 font-semibold tabular-nums">{money(line.total)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <QuantityStepper size="sm" value={line.qty} max={max} min={1} onChange={(v) => setQty(line.key, v)} label={`Quantity for ${line.name}`} />
          <button type="button" onClick={() => removeItem(line.key)} className="link-underline text-sm text-graphite hover:text-ink">
            Remove<span className="sr-only"> {line.name}</span>
          </button>
        </div>
      </div>
    </motion.li>
  );
}
