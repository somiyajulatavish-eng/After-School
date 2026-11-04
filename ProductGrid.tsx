'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, columns = 'grid-cols-2 lg:grid-cols-4' }: { products: Product[]; columns?: string }) {
  return (
    <motion.ul layout className={`grid gap-x-4 gap-y-12 sm:gap-x-6 ${columns}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((p, i) => (
          <motion.li
            key={p.slug}
            layout
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
          >
            <ProductCard product={p} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
