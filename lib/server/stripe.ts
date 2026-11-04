import 'server-only';
import Stripe from 'stripe';

let client: Stripe | null | undefined;

/** Returns a Stripe client, or null when STRIPE_SECRET_KEY is not configured (demo mode). */
export function getStripe(): Stripe | null {
  if (client !== undefined) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  client = key ? new Stripe(key, { appInfo: { name: 'After School Storefront' } }) : null;
  return client;
}
