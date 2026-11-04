import { TLink } from '@/components/TLink';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { ProductCard } from '@/components/shop/ProductCard';
import type { Product } from '@/lib/types';

const KITS = ['#F2D22E', '#1F5FB8', '#7FB7E6', '#C8102E', '#F27A1A', '#178A4C', '#F1F1EC', '#1C1C1E'];

export function Matchday({ products }: { products: Product[] }) {
  const [a, b] = [products.filter((_, i) => i % 2 === 0), products.filter((_, i) => i % 2 === 1)];
  return (
    <section className="relative py-24 md:py-40" aria-labelledby="matchday-title">
      <div aria-hidden className="mb-20 flex h-2 w-full md:mb-28">
        {KITS.map((c) => (
          <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SplitText as="h2" id="matchday-title" text={'Matchday,\nno badge\nneeded'} className="display text-[clamp(36px,5.4vw,96px)]" />
            <Reveal className="mt-8 max-w-[40ch]">
              <p className="text-lg leading-relaxed text-graphite">
                Shirts, scarves and training gear inspired by the colours of the world’s great teams. Original designs, clearly unofficial, made to be worn in the stands.
              </p>
              <TLink href="/shop/football" className="btn-ghost mt-8">
                Shop football
              </TLink>
            </Reveal>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 lg:col-span-7 lg:col-start-6 lg:gap-x-10">
          <ul className="flex flex-col gap-14">
            {a.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} sizes="(min-width: 1024px) 28vw, 50vw" />
              </li>
            ))}
          </ul>
          <ul className="mt-24 flex flex-col gap-14 md:mt-40">
            {b.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} sizes="(min-width: 1024px) 28vw, 50vw" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
