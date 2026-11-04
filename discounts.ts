import type { CategorySlug } from './types';

export interface DiscountCode {
  code: string;
  description: string;
  kind: 'percent' | 'free-shipping';
  value: number;
  minSubtotal?: number;
  category?: CategorySlug;
}

/** Codes are validated server-side again at checkout, so editing them here is the single source of truth. */
export const DISCOUNTS: DiscountCode[] = [
  { code: 'AFTERSCHOOL10', description: '10% off your order', kind: 'percent', value: 10 },
  { code: 'FIRSTBELL', description: '15% off orders over $75', kind: 'percent', value: 15, minSubtotal: 7500 },
  { code: 'PRINTLAB20', description: '20% off 3D printed items', kind: 'percent', value: 20, category: '3d-printed' },
  { code: 'FREEKICK', description: 'Free standard shipping', kind: 'free-shipping', value: 0 },
];

export function findDiscount(code: string | null | undefined): DiscountCode | undefined {
  if (!code) return undefined;
  const c = code.trim().toUpperCase();
  return DISCOUNTS.find((d) => d.code === c);
}
