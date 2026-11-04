import { Reveal } from '@/components/motion/Reveal';
import { Stars } from '@/components/ui/Stars';
import { formatDate } from '@/lib/format';
import type { Review } from '@/lib/types';

export function Reviews({ reviews, average }: { reviews: Review[]; average: number }) {
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));
  return (
    <section id="reviews" className="scroll-mt-28 py-24" aria-labelledby="reviews-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="reviews-title" className="display text-[clamp(34px,5vw,72px)]">
            Reviews
          </h2>
          <div className="mt-6 flex items-center gap-4">
            <span className="display-narrow text-6xl tabular-nums">{average.toFixed(1)}</span>
            <div>
              <Stars value={average} size="md" />
              <p className="mt-1 text-sm text-graphite">Based on {reviews.length} reviews</p>
            </div>
          </div>
          <dl className="mt-6 space-y-2">
            {dist.map(({ n, c }) => (
              <div key={n} className="flex items-center gap-3 text-sm">
                <dt className="w-14 shrink-0">{n} stars</dt>
                <dd className="flex flex-1 items-center gap-3">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                    <span className="block h-full rounded-full bg-ink" style={{ width: `${reviews.length ? (c / reviews.length) * 100 : 0}%` }} />
                  </span>
                  <span className="w-4 text-right tabular-nums text-graphite">{c}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ul className="grid gap-6 lg:col-span-8">
          {reviews.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 0.05} className="rounded-xl border border-line/10 bg-sheet p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Stars value={r.rating} />
                <time dateTime={r.date} className="text-sm text-graphite">
                  {formatDate(r.date)}
                </time>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 leading-relaxed text-graphite">{r.body}</p>
              <p className="mt-4 text-sm">
                <span className="font-semibold">{r.author}</span>
                <span className="text-graphite">, {r.location}</span>
                {r.verified && <span className="ml-2 inline-block rounded-full bg-sheet px-2 py-0.5 text-xs font-medium">Verified buyer</span>}
              </p>
              <p className="mt-1 text-xs text-graphite">Bought: {r.variant}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
