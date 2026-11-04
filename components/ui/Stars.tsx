import { StarIcon } from './Icons';

/** Partial stars are drawn by clipping a full star over a faded one, so the SVG keeps its native typings. */
export function Stars({ value, count, size = 'sm' }: { value: number; count?: number; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 20 : 14;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex text-ink" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const amount = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative inline-block" style={{ width: dim, height: dim }}>
              <StarIcon width={dim} height={dim} className="absolute inset-0 opacity-20" />
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${amount * 100}%` }}>
                <StarIcon width={dim} height={dim} className="max-w-none" />
              </span>
            </span>
          );
        })}
      </span>
      {typeof count === 'number' && <span className="text-sm text-graphite">({count})</span>}
    </span>
  );
}
