import raw from '@/data/products.json';
import { hash } from './format';
import type { CartLineInput, Category, CategorySlug, Product, Review } from './types';

type RawProduct = Omit<Product, 'images'>;

export const CATEGORIES: Category[] = [
  {
    slug: 'clothing',
    name: 'Clothing',
    short: 'Clothing',
    time: '3:15',
    blurb: 'Heavyweight hoodies, oversized tees, cargos and the small stuff: caps, beanies, socks and bags.',
  },
  {
    slug: 'football',
    name: 'Football Merch',
    short: 'Football',
    time: '4:00',
    blurb: 'Retro-inspired shirts, scarves and training gear in the colours of the world’s great teams. Unofficial, unbadged, made for the stands.',
  },
  {
    slug: '3d-printed',
    name: '3D Printed',
    short: '3D Printed',
    time: '5:30',
    blurb: 'Articulated dragons, octopuses, fidget toys and desk gear, printed to order in our studio.',
  },
];

export const products: Product[] = (raw as unknown as RawProduct[]).map((p) => ({
  ...p,
  images: p.colors.map((_, i) => [`/products/${p.slug}/${i}-a.svg`, `/products/${p.slug}/${i}-b.svg`] as [string, string]),
}));

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug);
}

/* ---------- Stock ---------- */

export function variantStock(slug: string, color: string, size?: string): number {
  const h = hash(`${slug}|${color}|${size ?? ''}`) % 100;
  if (h < 5) return 0;
  if (h < 18) return 1 + (h % 4);
  return 6 + (h % 34);
}

export function totalStock(p: Product): number {
  const sizes = p.sizes.length ? p.sizes : [undefined];
  return p.colors.reduce((sum, c) => sum + sizes.reduce((s, z) => s + variantStock(p.slug, c.name, z), 0), 0);
}

export function isVariantValid(line: CartLineInput): boolean {
  const p = getProduct(line.slug);
  if (!p) return false;
  if (!p.colors.some((c) => c.name === line.color)) return false;
  if (p.sizes.length) return !!line.size && p.sizes.includes(line.size);
  return !line.size;
}

/* ---------- Reviews ---------- */

const AUTHORS: [string, string][] = [
  ['Maya R.', 'Austin, TX'], ['Jonah K.', 'Leeds, UK'], ['Priya S.', 'Toronto, CA'], ['Diego M.', 'Madrid, ES'],
  ['Sam T.', 'Portland, OR'], ['Aisha B.', 'Dubai, AE'], ['Leo F.', 'Lyon, FR'], ['Hana W.', 'Brooklyn, NY'],
  ['Tom O.', 'Dublin, IE'], ['Chloe D.', 'Chicago, IL'], ['Marco V.', 'Milan, IT'], ['Ellie P.', 'Melbourne, AU'],
  ['Kofi A.', 'Atlanta, GA'], ['Noor H.', 'Rotterdam, NL'], ['Ben L.', 'Denver, CO'], ['Zara Q.', 'Glasgow, UK'],
];

type Tmpl = [number, string, string];
const TEMPLATES: Record<CategorySlug, Tmpl[]> = {
  clothing: [
    [5, 'Heavier than it looks', 'Properly thick fabric and it kept its shape after a dozen washes. Sized up one for a looser fit and it’s perfect.'],
    [5, 'My new default', 'I wear this more than anything else I own. The colour is exactly like the photos.'],
    [4, 'Great quality, runs a bit big', 'Love the cut but the fit is generous. If you want it closer to the body, go one size down.'],
    [5, 'Worth the price', 'Stitching is clean, the print hasn’t cracked and it feels like it will last years.'],
    [4, 'Really nice, slow-ish delivery', 'Took eight days to arrive, but the piece itself is excellent. Would buy again.'],
    [5, 'Bought a second colour', 'Liked the first one so much I went back for another. Friends keep asking where it’s from.'],
    [3, 'Good, not perfect', 'Nice fabric, but the colour was slightly darker than I expected. Still wear it a lot.'],
  ],
  football: [
    [5, 'Better than some official shirts', 'Fabric breathes well and the collar detail is spot on. Wore it to the pub for every match this summer.'],
    [5, 'Retro feel nailed', 'The cut and colours really take me back. Love that there’s no giant sponsor across the front.'],
    [4, 'Nice, fits slim', 'Quality is great but it runs a little slim across the chest. Size up if you’re between sizes.'],
    [5, 'Great gift', 'Got this for my brother and he hasn’t taken it off. Arrived well packed.'],
    [4, 'Solid matchday gear', 'Warm, well made, and the colours didn’t fade after washing. Would buy again.'],
    [5, 'Exactly as pictured', 'Colours are bright and true. Feels sturdy, not like cheap fan merch.'],
  ],
  '3d-printed': [
    [5, 'My kid is obsessed', 'Every joint moves and it survived being dropped off the sofa twice. The silk finish looks amazing in daylight.'],
    [5, 'Clean print, no stringing', 'Surprisingly smooth with no loose bits. You can tell these are printed carefully.'],
    [4, 'Fun desk toy', 'I fidget with it during calls constantly. Took about a week to arrive since it’s printed to order.'],
    [5, 'Better than expected', 'Bigger and sturdier than I thought from the photos. The colour shift is beautiful.'],
    [4, 'Great, one small mark', 'A tiny seam line on one side, but you only notice up close. Works perfectly.'],
    [5, 'Bought three as gifts', 'Everyone wanted one after seeing mine. Packaging was plastic-free too.'],
  ],
};

export function getReviews(slug: string): Review[] {
  const p = getProduct(slug);
  if (!p) return [];
  const h = hash(slug);
  const count = 3 + (h % 4);
  const pool = TEMPLATES[p.category];
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    const t = pool[(h + i * 3) % pool.length];
    const a = AUTHORS[(h + i * 5) % AUTHORS.length];
    const day = new Date(Date.UTC(2026, 0, 1) + ((hash(slug + i) % 270) * 86400000));
    const color = p.colors[(h + i) % p.colors.length].name;
    const size = p.sizes.length ? p.sizes[(h + i * 2) % p.sizes.length] : undefined;
    out.push({
      id: `${slug}-r${i}`,
      author: a[0],
      location: a[1],
      rating: t[0],
      title: t[1],
      body: t[2],
      date: day.toISOString().slice(0, 10),
      variant: size ? `${color}, ${size}` : color,
      verified: (h + i) % 5 !== 0,
    });
  }
  return out.sort((x, y) => y.date.localeCompare(x.date));
}

export function getRating(slug: string): { average: number; count: number } {
  const r = getReviews(slug);
  if (!r.length) return { average: 0, count: 0 };
  return { average: Math.round((r.reduce((s, x) => s + x.rating, 0) / r.length) * 10) / 10, count: r.length };
}

/* ---------- Recommendations ---------- */

function affinity(a: Product, b: Product): number {
  let score = 0;
  if (a.category === b.category) score += 2;
  if (a.type === b.type) score += 1;
  for (const t of a.tags) if (b.tags.includes(t)) score += 1.5;
  return score;
}

export function getRelated(product: Product, n = 4): Product[] {
  return products
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({ p, s: affinity(product, p) + (hash(product.slug + p.slug) % 100) / 1000 }))
    .sort((x, y) => y.s - x.s)
    .slice(0, n)
    .map((x) => x.p);
}

export function getRecommendations(slugs: string[], n = 4): Product[] {
  const base = slugs.map(getProduct).filter((p): p is Product => !!p);
  if (!base.length) return getBestsellers(n);
  return products
    .filter((p) => !slugs.includes(p.slug))
    .map((p) => ({ p, s: base.reduce((sum, b) => sum + affinity(b, p), 0) + (p.category !== base[0].category ? 1.2 : 0) + (hash(p.slug) % 100) / 1000 }))
    .sort((x, y) => y.s - x.s)
    .slice(0, n)
    .map((x) => x.p);
}

export function getBestsellers(n = 8): Product[] {
  const best = products.filter((p) => p.badge === 'Bestseller');
  const rest = products.filter((p) => p.badge !== 'Bestseller').sort((a, b) => getRating(b.slug).average - getRating(a.slug).average);
  return [...best, ...rest].slice(0, n);
}

export function getNewest(n = 8): Product[] {
  return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, n);
}

export const ALL_TYPES = Array.from(new Set(products.map((p) => p.type)));
export const ALL_COLORS = Array.from(
  new Map(products.flatMap((p) => p.colors).map((c) => [c.name, c])).values(),
);
export const PRICE_MAX = Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 10;
