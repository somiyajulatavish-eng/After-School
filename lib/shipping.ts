export type ShippingMethodId = 'standard' | 'express';
export type Zone = 'domestic' | 'northamerica' | 'europe' | 'gulf' | 'international';

export const COUNTRIES: { code: string; name: string; zone: Zone }[] = [
  { code: 'US', name: 'United States', zone: 'domestic' },
  { code: 'CA', name: 'Canada', zone: 'northamerica' },
  { code: 'MX', name: 'Mexico', zone: 'northamerica' },
  { code: 'GB', name: 'United Kingdom', zone: 'europe' },
  { code: 'IE', name: 'Ireland', zone: 'europe' },
  { code: 'DE', name: 'Germany', zone: 'europe' },
  { code: 'FR', name: 'France', zone: 'europe' },
  { code: 'ES', name: 'Spain', zone: 'europe' },
  { code: 'IT', name: 'Italy', zone: 'europe' },
  { code: 'NL', name: 'Netherlands', zone: 'europe' },
  { code: 'CH', name: 'Switzerland', zone: 'europe' },
  { code: 'AE', name: 'United Arab Emirates', zone: 'gulf' },
  { code: 'SA', name: 'Saudi Arabia', zone: 'gulf' },
  { code: 'QA', name: 'Qatar', zone: 'gulf' },
  { code: 'KW', name: 'Kuwait', zone: 'gulf' },
  { code: 'BH', name: 'Bahrain', zone: 'gulf' },
  { code: 'OM', name: 'Oman', zone: 'gulf' },
  { code: 'IN', name: 'India', zone: 'international' },
  { code: 'SG', name: 'Singapore', zone: 'international' },
  { code: 'CN', name: 'China', zone: 'international' },
  { code: 'AU', name: 'Australia', zone: 'international' },
  { code: 'JP', name: 'Japan', zone: 'international' },
  { code: 'BR', name: 'Brazil', zone: 'international' },
];

interface Rate { price: number; days: [number, number] }
const RATES: Record<Zone, { standard: Rate; express: Rate; freeOver: number }> = {
  domestic: { standard: { price: 600, days: [3, 5] }, express: { price: 1800, days: [1, 2] }, freeOver: 5000 },
  northamerica: { standard: { price: 1400, days: [5, 9] }, express: { price: 3200, days: [2, 4] }, freeOver: 7000 },
  europe: { standard: { price: 1600, days: [6, 10] }, express: { price: 3600, days: [3, 5] }, freeOver: 7000 },
  gulf: { standard: { price: 1800, days: [5, 8] }, express: { price: 3800, days: [2, 4] }, freeOver: 7000 },
  international: { standard: { price: 2200, days: [8, 14] }, express: { price: 4500, days: [3, 6] }, freeOver: 10000 },
};

export const METHODS: { id: ShippingMethodId; name: string }[] = [
  { id: 'standard', name: 'Standard' },
  { id: 'express', name: 'Express' },
];

export function zoneFor(country: string): Zone {
  return COUNTRIES.find((c) => c.code === country)?.zone ?? 'international';
}

export function isSupportedCountry(country: string): boolean {
  return COUNTRIES.some((c) => c.code === country);
}

export interface ShippingQuote {
  amount: number;
  label: string;
  days: [number, number];
  freeThreshold: number;
  remainingForFree: number;
  isFree: boolean;
}

/**
 * All amounts are in the base currency (USD cents); pricing.ts converts them for display and checkout.
 * subtotal: merchandise total after discounts.
 * freeShippingCode: a discount that waives the standard rate.
 */
export function quoteShipping(country: string, method: ShippingMethodId, subtotal: number, freeShippingCode = false): ShippingQuote {
  const zone = RATES[zoneFor(country)];
  const rate = zone[method];
  const qualifies = subtotal >= zone.freeOver || freeShippingCode;
  let amount = rate.price;
  if (qualifies) amount = method === 'standard' ? 0 : rate.price - zone.standard.price;
  if (subtotal === 0) amount = 0;
  const name = METHODS.find((m) => m.id === method)?.name ?? 'Standard';
  return {
    amount,
    label: `${name} (${rate.days[0]}–${rate.days[1]} business days)`,
    days: rate.days,
    freeThreshold: zone.freeOver,
    remainingForFree: Math.max(0, zone.freeOver - subtotal),
    isFree: amount === 0 && subtotal > 0,
  };
}

