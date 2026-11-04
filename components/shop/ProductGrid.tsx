'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

/**
 * rhythm: on wide screens every seventh product (from the fourth) spans two columns with a
 * landscape frame, breaking the catalogue into an editorial cadence instead of a uniform grid.
 */
export function ProductGrid({ products, columns = 'grid-cols-2 lg:grid-cols-4', rhythm = false }: { products: Product[]; columns?: string; rhythm?: boolean }) {
  return (
    <motion.ul layout className={`grid gap-x-4 gap-y-12 sm:gap-x-6 ${rhythm ? 'md:grid-flow-dense' : ''} ${columns}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((p, i) => {
          const wide = rhythm && products.length >= 6 && i % 7 === 3;
          return (
          <motion.li
            key={p.slug}
            className={wide ? 'col-span-2' : undefined}
            layout
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
          >
            <ProductCard product={p} wide={wide} sizes={wide ? '(min-width: 768px) 60vw, 100vw' : undefined} />
          </motion.li>
          );
        })}
      </AnimatePresence>
    </motion.ul>
  );
}
