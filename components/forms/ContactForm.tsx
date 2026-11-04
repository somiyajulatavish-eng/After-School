'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { Magnetic } from '@/components/motion/Magnetic';
import { CheckIcon } from '@/components/ui/Icons';

const TOPICS = ['Order help', 'Returns', 'Wholesale', 'Custom 3D print', 'Press', 'Something else'];
type Errors = Partial<Record<'name' | 'email' | 'topic' | 'message', string>>;

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', topic: '', order: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.name.trim()) e.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = 'Enter a valid email address.';
    if (!values.topic) e.topic = 'Choose a topic.';
    if (values.message.trim().length < 10) e.message = 'Write at least a sentence so we can help.';
    return e;
  };

  const submit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website: (ev.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '' }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string; errors?: Errors };
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message ?? 'Message not sent.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Message not sent. Try again.');
    }
  };

  const fieldProps = (k: keyof Errors) => ({
    id: `cf-${k}`,
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `cf-${k}-err` : undefined,
  });

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`cf-${k}-err`} className="mt-1.5 text-sm text-margin">
        {errors[k]}
      </p>
    ) : null;

  return (
    <AnimatePresence mode="wait">
      {status === 'sent' ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-marker p-8 md:p-10" role="status">
          <CheckIcon width={32} height={32} />
          <p className="display-narrow mt-6 text-5xl">Message sent.</p>
          <p className="mt-3 max-w-[40ch] text-ink/80">Thanks, {values.name.split(' ')[0]}. We reply within one working day, usually faster.</p>
          <button
            type="button"
            className="link-underline mt-6 font-semibold"
            onClick={() => {
              setValues({ name: '', email: '', topic: '', order: '', message: '' });
              setStatus('idle');
            }}
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2 [&>*]:min-w-0" exit={{ opacity: 0, y: -16 }}>
          <div>
            <label htmlFor="cf-name" className="label">Name</label>
            <input {...fieldProps('name')} autoComplete="name" value={values.name} onChange={set('name')} className="field" />
            {err('name')}
          </div>
          <div>
            <label htmlFor="cf-email" className="label">Email</label>
            <input {...fieldProps('email')} type="email" autoComplete="email" value={values.email} onChange={set('email')} className="field" />
            {err('email')}
          </div>
          <div>
            <label htmlFor="cf-topic" className="label">Topic</label>
            <select {...fieldProps('topic')} value={values.topic} onChange={set('topic')} className="field cursor-pointer">
              <option value="">Choose one</option>
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            {err('topic')}
          </div>
          <div>
            <label htmlFor="cf-order" className="label">Order number (optional)</label>
            <input id="cf-order" value={values.order} onChange={set('order')} className="field" placeholder="AS-…" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cf-message" className="label">Message</label>
            <textarea {...fieldProps('message')} rows={6} value={values.message} onChange={set('message')} className="field h-auto py-3" />
            {err('message')}
          </div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <Magnetic>
              <button type="submit" disabled={status === 'sending'} className="btn-primary">
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </Magnetic>
            <p aria-live="polite" className="text-sm text-margin">
              {status === 'error' ? message : ''}
            </p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
