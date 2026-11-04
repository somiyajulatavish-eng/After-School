import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { CURRENCIES, isCurrencyCode, type CurrencyCode } from '@/lib/currency';
import { computeTotals } from '@/lib/pricing';
import { getRates } from '@/lib/server/rates';
import { getStripe } from '@/lib/server/stripe';
import { EMAIL_RE, clientIp, rateLimited, str } from '@/lib/server/validate';
import { isSupportedCountry, type ShippingMethodId } from '@/lib/shipping';
import type { CartLineInput } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const fail = (message: string, status = 400) => NextResponse.json({ ok: false, message }, { status });

function parseItems(v: unknown): CartLineInput[] | null {
  if (!Array.isArray(v) || v.length === 0 || v.length > 50) return null;
  const out: CartLineInput[] = [];
  for (const raw of v) {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;
    const slug = str(r.slug, 100);
    const color = str(r.color, 60);
    const size = r.size === undefined || r.size === null ? undefined : str(r.size, 20);
    const qty = typeof r.qty === 'number' && Number.isInteger(r.qty) ? r.qty : NaN;
    if (!slug || !color || !(qty >= 1 && qty <= 10)) return null;
    out.push({ slug, color, size, qty });
  }
  return out;
}

export async function POST(req: Request) {
  if (rateLimited(`checkout:${clientIp(req)}`, 10)) return fail('Too many attempts. Wait a minute and try again.', 429);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail('Invalid request body.');
  }

  const email = str(body.email, 200);
  const name = str(body.name, 120);
  const notes = str(body.notes, 400) ?? '';
  const country = str(body.country, 2) ?? 'US';
  const method: ShippingMethodId = body.method === 'express' ? 'express' : 'standard';
  const code = str(body.code, 40) ?? null;
  const items = parseItems(body.items);
  const currency: CurrencyCode = isCurrencyCode(body.currency) ? body.currency : 'USD';

  if (!email || !EMAIL_RE.test(email)) return fail('Enter a valid email address.');
  if (!name) return fail('Enter your full name.');
  if (!isSupportedCountry(country)) return fail('We don’t ship to that country yet.');
  if (!items) return fail('Your bag looks empty or invalid. Refresh the page and try again.');

  const rates = await getRates();
  if (typeof body.ratesAsOf === 'string' && body.ratesAsOf !== rates.asOf) {
    return NextResponse.json(
      { ok: false, rates, message: `Exchange rates for ${CURRENCIES[currency].name} were just updated. Your total has been refreshed; review it and place the order again.` },
      { status: 409 },
    );
  }

  const totals = computeTotals(items, code, country, method, { currency, rates });
  if (!totals.lines.length) return fail('The items in your bag are no longer available.', 409);
  const shortfall = items.find((i) => {
    const line = totals.lines.find((l) => l.slug === i.slug && l.color === i.color && (l.size ?? '') === (i.size ?? ''));
    return !line || line.qty < i.qty;
  });
  if (shortfall) return fail('Some items have sold out or have less stock than you requested. Your bag has been updated, so review it and try again.', 409);
  if (typeof body.expectedTotal === 'number' && body.expectedTotal !== totals.total) {
    return NextResponse.json({ ok: false, rates, message: 'Your total changed since the page loaded. Review the updated total and place the order again.' }, { status: 409 });
  }

  const stripe = getStripe();
  const origin = new URL(req.url).origin;

  if (!stripe) {
    const id = `AS-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    console.info('[checkout:demo]', id, email, totals.total, currency);
    return NextResponse.json({
      ok: true,
      demo: true,
      url: `/order/confirmation?demo=1&order=${id}`,
      order: {
        id,
        email,
        name,
        currency,
        createdAt: new Date().toISOString(),
        country,
        shippingLabel: totals.shipping.label,
        items: totals.lines.map((l) => ({ name: l.name, variant: l.variantLabel, qty: l.qty, total: l.total, image: l.image })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        discountCode: totals.discountCode?.code ?? null,
        shipping: totals.shipping.amount,
        total: totals.total,
      },
    });
  }

  try {
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (totals.discount > 0 && totals.discountCode) {
      const coupon = await stripe.coupons.create({
        amount_off: totals.discount,
        currency: currency.toLowerCase(),
        duration: 'once',
        max_redemptions: 1,
        name: totals.discountCode.code,
      });
      discounts.push({ coupon: coupon.id });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: totals.lines.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: l.unit,
          product_data: {
            name: l.name,
            description: l.variantLabel,
            metadata: { slug: l.slug, color: l.color, size: l.size ?? '' },
          },
        },
      })),
      discounts: discounts.length ? discounts : undefined,
      shipping_address_collection: {
        allowed_countries: [country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: totals.shipping.label,
            fixed_amount: { amount: totals.shipping.amount, currency: currency.toLowerCase() },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: totals.shipping.days[0] },
              maximum: { unit: 'business_day', value: totals.shipping.days[1] },
            },
          },
        },
      ],
      metadata: {
        customer_name: name,
        notes,
        marketing_opt_in: body.marketing === true ? 'yes' : 'no',
        discount_code: totals.discountCode?.code ?? '',
        currency,
        rates_as_of: rates.asOf,
        rates_source: rates.source,
      },
      success_url: `${origin}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
    });

    if (!session.url) return fail('Could not start payment. Please try again.', 502);
    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error('[checkout]', err);
    return fail('Payment provider error. Please try again in a moment.', 502);
  }
}
