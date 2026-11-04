export type ShippingMethodId = 'standard' | 'express';
export type Zone = 'domestic' | 'northamerica' | 'europe' | 'international';

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
  { code: 'AE', name: 'United Arab Emirates', zone: 'international' },
  { code: 'SA', name: 'Saudi Arabia', zone: 'international' },
  { code: 'AU', name: 'Australia', zone: 'international' },
  { code: 'JP', name: 'Japan', zone: 'international' },
  { code: 'BR', name: 'Brazil', zone: 'international' },
];

interface Rate { price: number; days: [number, number] }
const RATES: Record<Zone, { standard: Rate; express: Rate; freeOver: number }> = {
  domestic: { standard: { price: 600, days: [3, 5] }, express: { price: 1800, days: [1, 2] }, freeOver: 10000 },
  northamerica: { standard: { price: 1400, days: [5, 9] }, express: { price: 3200, days: [2, 4] }, freeOver: 15000 },
  europe: { standard: { price: 1600, days: [6, 10] }, express: { price: 3600, days: [3, 5] }, freeOver: 15000 },
  international: { standard: { price: 2200, days: [8, 14] }, express: { price: 4500, days: [3, 6] }, freeOver: 20000 },
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
 * subtotal: merchandise total after discounts (cents).
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

export function methodPrice(country: string, method: ShippingMethodId): number {
  return RATES[zoneFor(country)][method].price;
}
