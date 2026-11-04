import { getProduct, isVariantValid, variantStock } from './catalog';
import { BASE_CURRENCY, FALLBACK_RATES, convertMinor, formatMoney, roundToStep, type CurrencyCode, type ExchangeRates } from './currency';
import { findDiscount, type DiscountCode } from './discounts';
import { quoteShipping, type ShippingMethodId, type ShippingQuote } from './shipping';
import type { CartLineInput, CategorySlug } from './types';

export interface PricedLine extends CartLineInput {
  key: string;
  name: string;
  image: string;
  /** Unit price in minor units of the bag currency (base USD cents inside priceLines). */
  unit: number;
  total: number;
  category: CategorySlug;
  stock: number;
  variantLabel: string;
}

/** All money fields are minor units of `currency`. */
export interface Totals {
  currency: CurrencyCode;
  ratesAsOf: string;
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

export interface TotalsOptions {
  currency?: CurrencyCode;
  rates?: ExchangeRates;
}

/**
 * Calculates a bag in one currency.
 * Business rules (discount eligibility, free-shipping thresholds) are evaluated on base USD amounts,
 * then every component is converted once and the total is summed in the target currency, so the
 * displayed figures always add up exactly and no transaction mixes currencies.
 */
export function computeTotals(
  input: CartLineInput[],
  code: string | null | undefined,
  country: string,
  method: ShippingMethodId,
  { currency = BASE_CURRENCY as CurrencyCode, rates = FALLBACK_RATES }: TotalsOptions = {},
): Totals {
  const conv = (cents: number) => convertMinor(cents, currency, rates);
  const baseLines = priceLines(input);
  const baseSubtotal = baseLines.reduce((s, l) => s + l.total, 0);
  const itemCount = baseLines.reduce((s, l) => s + l.qty, 0);

  const lines: PricedLine[] = baseLines.map((l) => {
    const unit = conv(l.unit);
    return { ...l, unit, total: unit * l.qty };
  });
  const subtotal = lines.reduce((s, l) => s + l.total, 0);

  let discount = 0;
  let baseDiscount = 0;
  let discountError: string | undefined;
  let discountCode: DiscountCode | undefined;
  const d = code ? findDiscount(code) : undefined;
  if (code && !d) discountError = 'That code isn’t valid. Check the spelling and try again.';
  if (d) {
    if (d.minSubtotal && baseSubtotal < d.minSubtotal) {
      discountError = `${d.code} needs a subtotal of ${formatMoney(conv(d.minSubtotal), currency)} or more.`;
    } else if (d.kind === 'percent') {
      const eligible = (list: PricedLine[]) => (d.category ? list.filter((l) => l.category === d.category) : list).reduce((s, l) => s + l.total, 0);
      const baseEligible = eligible(baseLines);
      if (baseEligible === 0) discountError = `${d.code} only applies to ${d.category === '3d-printed' ? '3D printed' : d.category} items.`;
      else {
        baseDiscount = Math.round((baseEligible * d.value) / 100);
        discount = roundToStep((eligible(lines) * d.value) / 100, currency);
        discountCode = d;
      }
    } else {
      discountCode = d;
    }
  }

  const baseQuote = quoteShipping(country, method, baseSubtotal - baseDiscount, discountCode?.kind === 'free-shipping');
  const shipping: ShippingQuote = {
    ...baseQuote,
    amount: conv(baseQuote.amount),
    freeThreshold: conv(baseQuote.freeThreshold),
    remainingForFree: conv(baseQuote.remainingForFree),
  };
  return {
    currency,
    ratesAsOf: rates.asOf,
    lines,
    itemCount,
    subtotal,
    discount,
    discountCode,
    discountError,
    shipping,
    total: subtotal - discount + shipping.amount,
  };
}
