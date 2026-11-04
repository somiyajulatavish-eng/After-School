import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TLink } from '@/components/TLink';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShopView } from '@/components/shop/ShopView';
import { CATEGORIES, getCategory, getProductsByCategory } from '@/lib/catalog';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const c = getCategory(params.category);
  if (!c) return {};
  return {
    title: c.name,
    description: c.blurb,
    alternates: { canonical: `/shop/${c.slug}` },
    openGraph: { title: `${c.name} | After School`, description: c.blurb },
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const c = getCategory(params.category);
  if (!c) notFound();
  const list = getProductsByCategory(c.slug);
  const others = CATEGORIES.filter((x) => x.slug !== c.slug);
  return (
    <>
      <PageHeader
        title={c.name}
        intro={c.blurb}
        crumbs={<Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/shop', label: 'Shop' }, { href: `/shop/${c.slug}`, label: c.name }]} />}
      >
        <ul className="flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <TLink href={`/shop/${o.slug}`} className="btn-ghost h-11 px-5 text-sm">
                {o.name}
              </TLink>
            </li>
          ))}
        </ul>
      </PageHeader>
      {c.slug === 'football' && (
        <div className="wrap -mt-6 mb-10">
          <p className="rounded-lg border border-line/15 bg-sheet px-4 py-3 text-sm text-graphite">
            Everything here is an original, unofficial fan design inspired by team colours and history. Not affiliated with, licensed or endorsed by any club, league or federation.
          </p>
        </div>
      )}
      {c.slug === '3d-printed' && (
        <div className="wrap -mt-6 mb-10">
          <p className="rounded-lg border border-line/15 bg-sheet px-4 py-3 text-sm text-graphite">
            Printed to order in our studio. 3D items ship within two to four days of ordering. Contains small parts: not suitable for children under 3.
          </p>
        </div>
      )}
      <div className="wrap pb-32">
        <ShopView products={list} initialCategory={c.slug} />
      </div>
    </>
  );
}
