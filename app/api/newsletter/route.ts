import { NextResponse } from 'next/server';
import { EMAIL_RE, clientIp, rateLimited, str } from '@/lib/server/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (rateLimited(`newsletter:${clientIp(req)}`, 5)) {
    return NextResponse.json({ ok: false, message: 'Too many attempts. Try again in a minute.' }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }
  if (str(body.website)) return NextResponse.json({ ok: true });
  const email = str(body.email, 200);
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ ok: false, message: 'Enter a valid email address, like name@example.com.' }, { status: 422 });

  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) {
    console.info('[newsletter] (provider not configured) new subscriber:', email);
    return NextResponse.json({ ok: true });
  }
  try {
    const res = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    if (!res.ok && res.status !== 409) throw new Error(`Provider responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[newsletter]', err);
    return NextResponse.json({ ok: false, message: 'We couldn’t subscribe you right now. Try again shortly.' }, { status: 502 });
  }
}
