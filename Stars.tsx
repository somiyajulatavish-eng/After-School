import { StarIcon } from './Icons';

export function Stars({ value, count, size = 'sm' }: { value: number; count?: number; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 20 : 14;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex text-ink" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} width={dim} height={dim} fill={Math.max(0, Math.min(1, value - i))} />
        ))}
      </span>
      {typeof count === 'number' && <span className="text-sm text-graphite">({count})</span>}
    </span>
  );
}
