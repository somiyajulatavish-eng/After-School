import { NextResponse } from 'next/server';
import { EMAIL_RE, clientIp, rateLimited, sendEmail, str } from '@/lib/server/validate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TOPICS = ['Order help', 'Returns', 'Wholesale', 'Custom 3D print', 'Press', 'Something else'];

export async function POST(req: Request) {
  if (rateLimited(`contact:${clientIp(req)}`, 5)) {
    return NextResponse.json({ ok: false, message: 'Too many messages. Try again in a minute.' }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }

  if (str(body.website)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const topic = str(body.topic, 40);
  const order = str(body.order, 40);
  const message = str(body.message, 4000);
  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Enter your name.';
  if (!email || !EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';
  if (!topic || !TOPICS.includes(topic)) errors.topic = 'Choose a topic.';
  if (!message || message.length < 10) errors.message = 'Write at least a sentence so we can help.';
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, message: 'Check the highlighted fields.', errors }, { status: 422 });

  const text = `From: ${name} <${email}>\nTopic: ${topic}\nOrder: ${order ?? 'n/a'}\n\n${message}`;
  try {
    const delivered = await sendEmail({ subject: `[After School] ${topic}: ${name}`, text, replyTo: email });
    if (!delivered) console.info('[contact] (email not configured)\n' + text);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ ok: false, message: 'We couldn’t send your message. Email us directly instead.' }, { status: 502 });
  }
}
