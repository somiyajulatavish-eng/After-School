import { TLink } from '@/components/TLink';
import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';
import { ProductGrid } from '@/components/shop/ProductGrid';
import type { Product } from '@/lib/types';

const swatches = ['#F2D22E', '#1F5FB8', '#7FB7E6', '#C8102E', '#F27A1A', '#178A4C', '#1C1C1E', '#F1F1EC'];

export function Matchday({ products }: { products: Product[] }) {
  return (
    <section className="py-24 md:py-36" aria-labelledby="matchday-title">
      <div className="wrap">
        <div className="mb-14 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <SplitText as="h2" id="matchday-title" text={'Matchday,\nno badge needed'} className="display text-[clamp(44px,7vw,112px)]" />
          </div>
          <Reveal className="self-end md:col-span-5">
            <p className="text-lg leading-relaxed text-graphite">
              Shirts, scarves and training gear inspired by the colours of the world’s great teams. Original designs, clearly unofficial, made to be worn in the stands.
            </p>
            <ul className="mt-6 flex gap-2" aria-hidden="true">
              {swatches.map((c) => (
                <li key={c} className="h-6 w-6 rounded-full border border-ink/10" style={{ backgroundColor: c }} />
              ))}
            </ul>
            <TLink href="/shop/football" className="link-underline mt-6 inline-block text-[15px] font-semibold">
              Shop all football
            </TLink>
          </Reveal>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
