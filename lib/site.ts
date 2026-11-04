export const SITE = {
  name: 'After School',
  founder: 'Tavish',
  tagline: 'Clothes, football shirts and 3D printed objects for the hours after the bell.',
  description:
    'After School makes heavyweight streetwear, unofficial football fan merch and print-to-order 3D toys and desk gear. Ships to 23 countries, priced in your currency.',
  email: 'hello@afterschool.example.com',
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
  currency: 'USD',
};

export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
