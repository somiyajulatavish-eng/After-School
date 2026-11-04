import { Collections, type CollectionItem } from '@/components/home/Collections';
import { EditorialProducts } from '@/components/home/EditorialProducts';
import { HomeHero } from '@/components/home/HomeHero';
import { HorizontalRail } from '@/components/home/HorizontalRail';
import { JournalTeaser } from '@/components/home/JournalTeaser';
import { Manifesto } from '@/components/home/Manifesto';
import { Matchday } from '@/components/home/Matchday';
import { PrintLab } from '@/components/home/PrintLab';
import { Spotlight } from '@/components/home/Spotlight';
import { SplitText } from '@/components/motion/SplitText';
import { TLink } from '@/components/TLink';
import { POSTS } from '@/lib/blog';
import { CATEGORIES, getBestsellers, getNewest, getProduct, getProductsByCategory, getRating } from '@/lib/catalog';
import { SITE, siteUrl } from '@/lib/site';

const ART: Record<string, Pick<CollectionItem, 'hero' | 'detail'>> = {
  clothing: {
    hero: { src: '/products/field-trip-cargo-pants/0-b.svg', alt: 'Detail of olive ripstop cargo pants' },
    detail: { src: '/products/detention-zip-hoodie/1-a.svg', alt: 'Detention Zip Hoodie in oatmeal' },
  },
  football: {
    hero: { src: '/products/albiceleste-stripe-shirt/0-b.svg', alt: 'Close-up of a sky blue and white striped football shirt' },
    detail: { src: '/products/matchday-bar-scarf/0-a.svg', alt: 'Red and white matchday bar scarf' },
  },
  '3d-printed': {
    hero: { src: '/products/articulated-octopus/1-b.svg', alt: 'Close-up of a teal articulated octopus' },
    detail: { src: '/products/mini-articulated-dragon/0-a.svg', alt: 'Rainbow mini articulated dragon' },
  },
};

export default function HomePage() {
  const collections: CollectionItem[] = CATEGORIES.map((c) => ({ ...c, count: getProductsByCategory(c.slug).length, ...ART[c.slug] }));
  const spotlight = getProduct('bell-heavyweight-hoodie') ?? getBestsellers(1)[0];
  const best = getBestsellers(9).filter((p) => p.slug !== spotlight.slug && p.category !== 'football').slice(0, 5);
  const football = getProductsByCategory('football').filter((p) => p.type === 'Football Shirt').slice(0, 4);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: siteUrl(),
    email: SITE.email,
    founder: { '@type': 'Person', name: SITE.founder },
    sameAs: [SITE.instagram, SITE.tiktok],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHero />
      <Manifesto />
      <Collections items={collections} />
      <Spotlight product={spotlight} rating={getRating(spotlight.slug)} />
      <HorizontalRail products={getNewest(10)} title="New this week" href="/shop?sort=newest" linkLabel="See all new" />
      <section className="py-24 md:py-40" aria-labelledby="best-title">
        <div className="wrap">
          <EditorialProducts
            products={best}
            header={
              <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-24">
                <SplitText as="h2" id="best-title" text={'What everyone\nis wearing'} className="display text-[clamp(36px,7vw,120px)]" />
                <TLink href="/shop?sort=rating" className="link-underline pb-2 text-[15px] font-semibold">
                  Shop top rated
                </TLink>
              </div>
            }
          />
        </div>
      </section>
      <PrintLab />
      <Matchday products={football} />
      <JournalTeaser posts={POSTS.slice(0, 4)} />
    </>
  );
}
