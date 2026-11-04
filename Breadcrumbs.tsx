import { TLink } from '@/components/TLink';
import { siteUrl } from '@/lib/site';

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: `${siteUrl()}${it.href}` })),
  };
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-graphite">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-2">
            {i < items.length - 1 ? (
              <>
                <TLink href={it.href} className="link-underline hover:text-ink">
                  {it.label}
                </TLink>
                <span aria-hidden>/</span>
              </>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
