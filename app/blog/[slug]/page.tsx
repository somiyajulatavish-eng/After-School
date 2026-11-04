import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TLink } from '@/components/TLink';
import { PostCard } from '@/components/blog/PostCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { POSTS, getPost, type Block } from '@/lib/blog';
import { getProduct } from '@/lib/catalog';
import { formatDate } from '@/lib/format';
import { siteUrl } from '@/lib/site';
import type { Product } from '@/lib/types';
import { Img } from '@/components/ui/Img';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPost(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: 'article', title: p.title, description: p.excerpt, publishedTime: p.date, authors: [p.author] },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case 'h2':
      return (
        <h2 key={i} className="display-narrow mb-6 mt-14 text-4xl md:text-5xl">
          {b.text}
        </h2>
      );
    case 'quote':
      return (
        <Reveal key={i} as="figure" className="my-14 border-l-4 border-margin pl-6 md:pl-10 xl:-ml-10">
          <blockquote className="text-2xl font-semibold leading-snug md:text-3xl">“{b.text}”</blockquote>
          {b.cite && <figcaption className="mt-4 text-graphite">{b.cite}</figcaption>}
        </Reveal>
      );
    case 'list':
      return (
        <ul key={i} className="my-6 list-disc space-y-2 pl-6 text-lg leading-relaxed">
          {b.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case 'products': {
      const items = b.slugs.map(getProduct).filter((p): p is Product => !!p);
      return (
        <div key={i} className="my-16 xl:-mx-32">
          <p className="mb-6 text-sm font-semibold">Shop the story</p>
          <ProductGrid products={items} columns="grid-cols-2 md:grid-cols-3" />
        </div>
      );
    }
    default:
      return (
        <p key={i} className="my-6 text-lg leading-[1.75] text-ink/90">
          {b.text}
        </p>
      );
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    image: `${siteUrl()}${post.cover}`,
    mainEntityOfPage: `${siteUrl()}/blog/${post.slug}`,
    publisher: { '@type': 'Organization', name: 'After School' },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="page-glow pb-14 pt-36 md:pt-44">
        <div className="wrap">
          <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/blog', label: 'Journal' }, { href: `/blog/${post.slug}`, label: post.title }]} />
          <div className="flex flex-wrap items-center gap-3 text-sm text-graphite">
            <span className="rounded-full border border-line/15 px-3 py-1 text-ink">{post.topic}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>/</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <SplitText as="h1" immediate delay={0.55} text={post.title} className="display mt-6 max-w-[18ch] text-[clamp(36px,7vw,112px)]" />
          <p className="mt-6 text-graphite">By {post.author}</p>
        </div>
      </header>
      <div className="wrap">
        <ClipReveal className="aspect-[16/9] rounded-xl bg-sheet md:aspect-[21/9]">
          <Img src={post.cover} alt={post.coverAlt} width={600} height={750} className="h-full w-full object-cover" />
        </ClipReveal>
      </div>
      <div className="wrap py-20">
        <div className="mx-auto max-w-prose">
          <p className="mb-10 text-2xl font-medium leading-snug">{post.excerpt}</p>
          {post.body.map(renderBlock)}
          <div className="mt-16 flex flex-wrap gap-3 border-t border-line/15 pt-8">
            <TLink href="/blog" className="btn-ghost">
              Back to the journal
            </TLink>
            <TLink href="/shop" className="btn-primary">
              Shop the collection
            </TLink>
          </div>
        </div>
      </div>
      <section className="bg-sheet py-24" aria-labelledby="more-title">
        <div className="wrap">
          <h2 id="more-title" className="display mb-12 text-[clamp(36px,5vw,72px)]">
            Keep reading
          </h2>
          <div className="grid gap-12 md:grid-cols-2">
            {others.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
