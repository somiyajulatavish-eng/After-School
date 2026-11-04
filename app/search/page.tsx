import type { Metadata } from 'next';
import { TLink } from '@/components/TLink';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { SearchForm } from '@/components/shop/SearchForm';
import { ShopView } from '@/components/shop/ShopView';
import { getBestsellers } from '@/lib/catalog';
import { POPULAR_SEARCHES, searchProducts } from '@/lib/search';

export function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Metadata {
  const q = (searchParams.q ?? '').trim();
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: 'Search the After School shop.',
    robots: { index: false, follow: true },
  };
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? '').trim().slice(0, 80);
  const results = q ? searchProducts(q) : [];
  const title = q ? `“${q}”` : 'Search';
  return (
    <>
      <PageHeader
        title={title}
        intro={q ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${q}”.` : 'Find hoodies, retro shirts, dragons and more.'}
      >
        <SearchForm key={q} initial={q} />
      </PageHeader>
      <div className="wrap pb-32">
        {q && results.length > 0 ? (
          <ShopView key={q} products={results} showCategoryFilter />
        ) : (
          <>
            {q && (
              <div className="mb-16 rounded-xl bg-sheet px-6 py-14">
                <p className="display-narrow text-4xl">No matches for “{q}”.</p>
                <p className="mt-3 text-graphite">Check the spelling, or try one of these:</p>
              </div>
            )}
            <ul className="mb-16 flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <li key={s}>
                  <TLink href={`/search?q=${encodeURIComponent(s)}`} className="block rounded-full border border-line/15 px-4 py-2 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                    {s}
                  </TLink>
                </li>
              ))}
            </ul>
            <h2 className="display mb-10 text-[clamp(36px,5vw,72px)]">Bestsellers</h2>
            <ProductGrid products={getBestsellers(8)} />
          </>
        )}
      </div>
    </>
  );
}
