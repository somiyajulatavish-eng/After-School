'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { Magnetic } from '@/components/motion/Magnetic';

type Status = 'idle' | 'sending' | 'done' | 'error';

export function NewsletterForm({ tone = 'dark', id = 'newsletter' }: { tone?: 'dark' | 'light'; id?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus('error');
      setMessage('Enter a valid email address, like name@example.com.');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '' }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) throw new Error(data.message ?? 'Subscription failed');
      setStatus('done');
      setMessage('You’re on the list. Check your inbox for 10% off your first order.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Try again in a minute.');
    }
  };

  const dark = tone === 'dark';
  return (
    <form onSubmit={submit} noValidate className="w-full max-w-xl">
      <label htmlFor={`${id}-email`} className={`mb-3 block text-sm ${dark ? 'text-chalkline/80' : 'text-graphite'}`}>
        Get new drops and print-lab releases first. One email a fortnight, no spam.
      </label>
      <div className={`flex items-center gap-2 rounded-full border p-1.5 transition-colors focus-within:border-marker ${dark ? 'border-chalkline/30' : 'border-line/20 bg-sheet'}`}>
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={status === 'error'}
          aria-describedby={`${id}-msg`}
          className={`h-12 min-w-0 flex-1 bg-transparent px-4 text-[15px] focus:outline-none ${dark ? 'placeholder:text-chalkline/40' : 'placeholder:text-graphite/60'}`}
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <Magnetic strength={0.2}>
          <button type="submit" disabled={status === 'sending'} className="btn-marker h-12 px-6">
            {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </Magnetic>
      </div>
      <div id={`${id}-msg`} aria-live="polite" className="min-h-[1.5rem] pt-3 text-sm">
        <AnimatePresence mode="wait">
          {message && (
            <motion.p key={message} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={status === 'error' ? (dark ? 'text-[#FF9A8A]' : 'text-margin') : dark ? 'text-marker' : 'text-pen'}>
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
