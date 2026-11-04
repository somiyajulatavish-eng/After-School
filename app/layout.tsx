import type { Metadata, Viewport } from 'next';
import { Archivo, Instrument_Serif } from 'next/font/google';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Toasts } from '@/components/layout/Toasts';
import { Cursor } from '@/components/motion/Cursor';
import { Providers } from '@/components/providers/Providers';
import { getRates } from '@/lib/server/rates';
import { SITE, siteUrl } from '@/lib/site';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name}: streetwear, football merch and 3D printed objects`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.founder }],
  creator: SITE.founder,
  keywords: ['streetwear', 'heavyweight hoodie', 'retro football shirts', 'articulated dragon', '3D printed toys', 'fidget toys', 'desk accessories'],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: '/',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: SITE.name, description: SITE.description },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0B',
  colorScheme: 'dark light',
};

const themeScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('after-school:theme');d.dataset.theme=t==='light'?'light':'dark';}catch(e){d.dataset.theme='dark';}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rates = await getRates();
  return (
    <html lang="en" data-theme="dark" className={`${archivo.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <a href="#main" className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-marker px-5 py-3 font-semibold text-noir transition-transform focus:translate-y-0">
          Skip to content
        </a>
        <Providers rates={rates}>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Toasts />
          <Cursor />
        </Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
