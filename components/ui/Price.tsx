'use client';

import { useStore } from '@/components/providers/StoreProvider';

/**
 * Catalogue price in the visitor's currency. Base prices are USD cents; conversion happens here.
 * Until the stored currency is restored the figure is held invisible (same footprint) so it never
 * flashes from one currency to another.
 */
export function Price({ price, compareAt, className = '' }: { price: number; compareAt?: number; className?: string }) {
  const { price: format, hydrated } = useStore();
  return (
    <span className={`inline-flex items-baseline gap-2 tabular-nums transition-opacity duration-500 ${hydrated ? 'opacity-100' : 'opacity-0'} ${className}`}>
      <span>{format(price)}</span>
      {compareAt && compareAt > price && (
        <>
          <span className="sr-only">, was</span>
          <s className="text-graphite/80">{format(compareAt)}</s>
        </>
      )}
    </span>
  );
}
