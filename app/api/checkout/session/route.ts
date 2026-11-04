import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/server/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('session_id');
  if (!id || !/^cs_[A-Za-z0-9_]+$/.test(id)) return NextResponse.json({ ok: false, message: 'Missing or invalid session id.' }, { status: 400 });
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ ok: false, message: 'Payments are not configured.' }, { status: 503 });
  try {
    const s = await stripe.checkout.sessions.retrieve(id, { expand: ['line_items'] });
    return NextResponse.json({
      ok: true,
      order: {
        id: `AS-${s.id.slice(-8).toUpperCase()}`,
        currency: (s.currency ?? 'usd').toUpperCase(),
        paid: s.payment_status === 'paid' || s.payment_status === 'no_payment_required',
        status: s.payment_status,
        email: s.customer_details?.email ?? s.customer_email ?? '',
        name: s.customer_details?.name ?? s.metadata?.customer_name ?? '',
        items: (s.line_items?.data ?? []).map((li) => ({ name: li.description ?? 'Item', variant: '', qty: li.quantity ?? 1, total: li.amount_total })),
        subtotal: s.amount_subtotal ?? 0,
        discount: s.total_details?.amount_discount ?? 0,
        shipping: s.total_details?.amount_shipping ?? 0,
        total: s.amount_total ?? 0,
        country: s.customer_details?.address?.country ?? '',
        createdAt: new Date(s.created * 1000).toISOString(),
      },
    });
  } catch (err) {
    console.error('[checkout/session]', err);
    return NextResponse.json({ ok: false, message: 'We couldn’t find that order.' }, { status: 404 });
  }
}
