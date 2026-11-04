import type { ReactNode } from 'react';
import { ProductCard } from '@/components/shop/ProductCard';
import type { Product } from '@/lib/types';

/**
 * Asymmetric product composition: varied widths and downward offsets on a 12-column grid
 * (offsets only ever push down, so items never overlap),
 * so a small set of products reads like a magazine layout instead of a catalogue grid.
 */
const SLOTS = [
  'col-span-2 md:col-span-6 lg:col-span-5',
  'col-span-1 md:col-span-5 md:col-start-8 md:mt-32 lg:col-span-4 lg:col-start-8 lg:mt-48',
  'col-span-1 md:col-span-4 lg:col-span-3 lg:col-start-2',
  'col-span-1 md:col-span-4 md:col-start-6 md:mt-16 lg:col-span-3 lg:col-start-6 lg:mt-24',
  'col-span-1 md:col-span-3 md:col-start-10 md:mt-32 lg:col-span-3 lg:col-start-10 lg:mt-10',
];

export function EditorialProducts({ products, header }: { products: Product[]; header?: ReactNode }) {
  return (
    <div>
      {header}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 md:grid-cols-12 md:gap-y-20">
        {products.slice(0, SLOTS.length).map((p, i) => (
          <li key={p.slug} className={SLOTS[i]}>
            <ProductCard product={p} sizes={i === 0 ? '(min-width: 768px) 45vw, 100vw' : '(min-width: 768px) 28vw, 50vw'} />
          </li>
        ))}
      </ul>
    </div>
  );
}
