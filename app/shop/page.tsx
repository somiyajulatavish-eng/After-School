import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShopView, type SortKey } from '@/components/shop/ShopView';
import { CATEGORIES, products } from '@/lib/catalog';
import type { CategorySlug } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Shop all',
  description: 'Shop every After School product: heavyweight clothing, unofficial football merch and print-to-order 3D toys and desk gear.',
  alternates: { canonical: '/shop' },
};

const SORTS: SortKey[] = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'];

export default function ShopPage({ searchParams }: { searchParams: { sort?: string; category?: string } }) {
  const sort = SORTS.includes(searchParams.sort as SortKey) ? (searchParams.sort as SortKey) : 'featured';
  const category = CATEGORIES.find((c) => c.slug === searchParams.category)?.slug as CategorySlug | undefined;
  return (
    <>
      <PageHeader
        title="Shop all"
        intro="Everything we make, in one place. Filter by department, type, colour or size."
        crumbs={<Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/shop', label: 'Shop' }]} />}
      />
      <div className="wrap pb-32">
        <ShopView products={products} showCategoryFilter initialSort={sort} initialCategory={category} />
      </div>
    </>
  );
}
