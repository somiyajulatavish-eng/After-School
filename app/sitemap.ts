import type { MetadataRoute } from 'next';
import { POSTS } from '@/lib/blog';
import { CATEGORIES, products } from '@/lib/catalog';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    ...CATEGORIES.map((c) => ({ url: `${base}/shop/${c.slug}`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: new Date(p.createdAt), changeFrequency: 'weekly' as const, priority: 0.7 })),
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    ...POSTS.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'monthly' as const, priority: 0.5 })),
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
