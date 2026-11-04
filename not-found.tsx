import type { Metadata } from 'next';
import { TLink } from '@/components/TLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { SplitText } from '@/components/motion/SplitText';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { getBestsellers } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <section className="ruled relative flex min-h-[80svh] flex-col justify-center pb-16 pt-36">
        <span aria-hidden className="absolute bottom-0 left-[6%] top-0 w-px bg-margin/50 md:left-[4%]" />
        <div className="wrap">
          <p className="mb-6 text-sm font-semibold text-margin">Error 404</p>
          <SplitText as="h1" immediate mode="chars" text={'This page\nskipped class.'} className="display text-[clamp(56px,11vw,184px)]" />
          <p className="mt-8 max-w-[44ch] text-lg text-graphite">The link may be old or mistyped. Try the shop, or search for what you were after.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <TLink href="/shop" className="btn-primary">
                Go to the shop
              </TLink>
            </Magnetic>
            <TLink href="/search" className="btn-ghost">
              Search
            </TLink>
            <TLink href="/" className="btn-ghost">
              Home
            </TLink>
          </div>
        </div>
      </section>
      <section className="wrap pb-32">
        <h2 className="display mb-10 text-[clamp(36px,5vw,72px)]">Popular right now</h2>
        <ProductGrid products={getBestsellers(4)} />
      </section>
    </>
  );
}
