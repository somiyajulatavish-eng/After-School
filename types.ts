export type CategorySlug = 'clothing' | 'football' | '3d-printed';

export type Badge = 'New' | 'Sale' | 'Bestseller';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  type: string;
  art: string;
  pattern?: string;
  price: number; // cents (USD)
  compareAt?: number; // cents (USD)
  colors: ColorOption[];
  sizes: string[];
  description: string;
  details: string[];
  tags: string[];
  badge?: Badge;
  createdAt: string;
  /** images[colorIndex] = [primary, detail] */
  images: [string, string][];
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  variant: string;
  verified: boolean;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  blurb: string;
  time: string;
}

export interface CartLineInput {
  slug: string;
  color: string;
  size?: string;
  qty: number;
}

export interface CartLine extends CartLineInput {
  key: string;
}
