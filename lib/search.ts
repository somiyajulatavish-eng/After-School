import { CATEGORIES, products } from './catalog';
import type { Product } from './types';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function searchProducts(query: string, limit = 60): Product[] {
  const tokens = norm(query).split(/[^a-z0-9]+/).filter((t) => t.length > 1 || /\d/.test(t));
  if (!tokens.length) return [];
  const scored: { p: Product; s: number }[] = [];
  for (const p of products) {
    const cat = CATEGORIES.find((c) => c.slug === p.category)?.name ?? '';
    const fields: [string, number][] = [
      [norm(p.name), 6],
      [norm(p.type), 4],
      [norm(p.tags.join(' ')), 3],
      [norm(cat), 2],
      [norm(p.colors.map((c) => c.name).join(' ')), 2],
      [norm(p.description), 1],
    ];
    let total = 0;
    let all = true;
    for (const t of tokens) {
      const variants = [t, t.endsWith('s') ? t.slice(0, -1) : t + 's'];
      let best = 0;
      for (const [text, w] of fields) {
        if (variants.some((v) => new RegExp(`\\b${v}`).test(text))) best = Math.max(best, w);
        else if (variants.some((v) => text.includes(v))) best = Math.max(best, w * 0.5);
      }
      if (!best) { all = false; break; }
      total += best;
    }
    if (all) scored.push({ p, s: total });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.p);
}

export const POPULAR_SEARCHES = ['hoodie', 'dragon', 'retro shirt', 'cargo', 'fidget', 'scarf', 'beanie', 'controller stand'];
