import 'server-only';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function str(v: unknown, max = 200): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t.length ? t.slice(0, max) : undefined;
}

const hits = new Map<string, number[]>();

/** Best-effort in-memory rate limit per serverless instance. */
export function rateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  return list.length > limit;
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function sendEmail(opts: { subject: string; text: string; replyTo?: string; to?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = opts.to ?? process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'After School <onboarding@resend.dev>',
      to: [to],
      subject: opts.subject,
      text: opts.text,
      reply_to: opts.replyTo,
    }),
  });
  if (!res.ok) throw new Error(`Email provider responded ${res.status}`);
  return true;
}
