import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Toasts } from '@/components/layout/Toasts';
import { Cursor } from '@/components/motion/Cursor';
import { Providers } from '@/components/providers/Providers';
import { SITE, siteUrl } from '@/lib/site';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name}: streetwear, football merch and 3D printed toys`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
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
  themeColor: '#F3F4EE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans">
        <a href="#main" className="fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-marker px-5 py-3 font-semibold text-ink transition-transform focus:translate-y-0">
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Toasts />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
