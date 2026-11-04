import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SplitText } from '@/components/motion/SplitText';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductView } from '@/components/shop/ProductView';
import { Reviews } from '@/components/shop/Reviews';
import { getCategory, getProduct, getRating, getRelated, getReviews, products, totalStock } from '@/lib/catalog';
import { siteUrl } from '@/lib/site';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  const title = `${p.name}, ${p.colors[0].name}`;
  return {
    title: p.name,
    description: `${p.description} $${(p.price / 100).toFixed(2)}. ${p.colors.length} colour${p.colors.length > 1 ? 's' : ''}.`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title, description: p.description, type: 'website', url: `/product/${p.slug}` },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const reviews = getReviews(product.slug);
  const rating = getRating(product.slug);
  const related = getRelated(product, 4);
  const url = `${siteUrl()}/product/${product.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'After School' },
    category: category?.name,
    image: product.images.map((i) => `${siteUrl()}${i[0]}`),
    url,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.average, reviewCount: rating.count },
    review: reviews.slice(0, 3).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      name: r.title,
      reviewBody: r.body,
    })),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: (product.price / 100).toFixed(2),
      availability: totalStock(product) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap pt-28 md:pt-32">
        <Breadcrumbs
          items={[
            { href: '/', label: 'Home' },
            { href: `/shop/${product.category}`, label: category?.name ?? 'Shop' },
            { href: `/product/${product.slug}`, label: product.name },
          ]}
        />
        <ProductView product={product} rating={rating} />
        <Reviews reviews={reviews} average={rating.average} />
      </div>
      <section className="bg-sheet py-24" aria-labelledby="related-title">
        <div className="wrap">
          <SplitText as="h2" id="related-title" text="You might also like" className="display mb-12 text-[clamp(34px,6vw,96px)]" />
          <ProductGrid products={related} />
        </div>
      </section>
    </>
  );
}
