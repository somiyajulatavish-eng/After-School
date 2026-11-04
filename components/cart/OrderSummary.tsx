'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/components/providers/StoreProvider';

function Row({ label, value, strong = false, accent = false }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? 'text-lg font-semibold' : 'text-[15px]'} ${accent ? 'text-pen' : ''}`}>
      <dt>{label}</dt>
      <motion.dd key={value} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="tabular-nums">
        {value}
      </motion.dd>
    </div>
  );
}

export function OrderSummary() {
  const { totals, money } = useStore();
  return (
    <dl className="space-y-2">
      <Row label={`Subtotal (${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'})`} value={money(totals.subtotal)} />
      {totals.discount > 0 && <Row label={`Discount (${totals.discountCode?.code})`} value={`−${money(totals.discount)}`} accent />}
      <Row label="Shipping" value={totals.shipping.amount === 0 && totals.subtotal > 0 ? 'Free' : money(totals.shipping.amount)} />
      <div className="my-3 border-t border-line/15" />
      <Row label="Total" value={money(totals.total)} strong />
    </dl>
  );
}
