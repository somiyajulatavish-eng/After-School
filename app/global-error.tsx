'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Helvetica, Arial, sans-serif', background: '#F3F4EE', color: '#131C5E' }}>
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px', maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontSize: 48, margin: 0, textTransform: 'uppercase' }}>Something went wrong.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.5 }}>The site hit an unexpected error. Reload the page to try again.</p>
          <button type="button" onClick={reset} style={{ alignSelf: 'flex-start', marginTop: 16, height: 48, padding: '0 28px', borderRadius: 999, border: 0, background: '#131C5E', color: '#F3F4EE', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
