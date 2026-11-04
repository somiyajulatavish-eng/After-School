import { formatPrice } from '@/lib/format';

export function Price({ price, compareAt, className = '' }: { price: number; compareAt?: number; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 tabular-nums ${className}`}>
      <span>{formatPrice(price)}</span>
      {compareAt && compareAt > price && (
        <>
          <span className="sr-only">, was</span>
          <s className="text-graphite/80">{formatPrice(compareAt)}</s>
        </>
      )}
    </span>
  );
}
