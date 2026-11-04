import { getProduct, isVariantValid, variantStock } from './catalog';
import { findDiscount, type DiscountCode } from './discounts';
import { quoteShipping, type ShippingMethodId, type ShippingQuote } from './shipping';
import type { CartLineInput, CategorySlug } from './types';

export interface PricedLine extends CartLineInput {
  key: string;
  name: string;
  image: string;
  unit: number;
  total: number;
  category: CategorySlug;
  stock: number;
  variantLabel: string;
}

export interface Totals {
  lines: PricedLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  discountCode?: DiscountCode;
  discountError?: string;
  shipping: ShippingQuote;
  total: number;
}

export function lineKey(l: CartLineInput): string {
  return `${l.slug}::${l.color}::${l.size ?? ''}`;
}

export function priceLines(input: CartLineInput[]): PricedLine[] {
  const out: PricedLine[] = [];
  for (const l of input) {
    const p = getProduct(l.slug);
    if (!p || !isVariantValid(l)) continue;
    const stock = variantStock(l.slug, l.color, l.size);
    const qty = Math.max(1, Math.min(Math.floor(l.qty), stock, 10));
    if (stock <= 0) continue;
    const ci = Math.max(0, p.colors.findIndex((c) => c.name === l.color));
    out.push({
      ...l,
      qty,
      key: lineKey(l),
      name: p.name,
      image: p.images[ci][0],
      unit: p.price,
      total: p.price * qty,
      category: p.category,
      stock,
      variantLabel: [l.color, l.size].filter(Boolean).join(' / '),
    });
  }
  return out;
}

export function computeTotals(
  input: CartLineInput[],
  code: string | null | undefined,
  country: string,
  method: ShippingMethodId,
): Totals {
  const lines = priceLines(input);
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  let discount = 0;
  let discountError: string | undefined;
  let discountCode: DiscountCode | undefined;
  const d = code ? findDiscount(code) : undefined;
  if (code && !d) discountError = 'That code isn’t valid. Check the spelling and try again.';
  if (d) {
    if (d.minSubtotal && subtotal < d.minSubtotal) {
      discountError = `${d.code} needs a subtotal of $${(d.minSubtotal / 100).toFixed(0)} or more.`;
    } else if (d.kind === 'percent') {
      const base = d.category ? lines.filter((l) => l.category === d.category).reduce((s, l) => s + l.total, 0) : subtotal;
      if (base === 0) discountError = `${d.code} only applies to ${d.category === '3d-printed' ? '3D printed' : d.category} items.`;
      else {
        discount = Math.round((base * d.value) / 100);
        discountCode = d;
      }
    } else {
      discountCode = d;
    }
  }

  const merch = subtotal - discount;
  const shipping = quoteShipping(country, method, merch, discountCode?.kind === 'free-shipping');
  return { lines, itemCount, subtotal, discount, discountCode, discountError, shipping, total: merch + shipping.amount };
}
