# After School

A premium e-commerce storefront for **After School**: heavyweight clothing, unofficial football fan merch and print-to-order 3D printed toys and desk gear.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Lenis, Framer Motion and Stripe Checkout. Deploys to Vercel with no changes.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: everything works without it
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

Requires Node.js 18.18 or newer.

## Deploy to Vercel

1. Push this folder to a GitHub, GitLab or Bitbucket repo.
2. In Vercel, choose **Add New → Project** and import the repo. The framework is detected as Next.js; keep the default settings.
3. Optionally add the environment variables below under **Settings → Environment Variables**.
4. Deploy.

Without any environment variables the site is fully usable: checkout runs in **demo mode** (no card is charged, the order confirmation is shown), and contact and newsletter submissions are written to the server logs.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for SEO, sitemap and Stripe redirects, e.g. `https://afterschool.example.com`. Falls back to Vercel's URL automatically. |
| `STRIPE_SECRET_KEY` | For real payments | Stripe secret key (`sk_test_…` or `sk_live_…`). Enables Stripe Checkout. |
| `RESEND_API_KEY` | Optional | Sends contact form messages and adds newsletter subscribers via [Resend](https://resend.com). |
| `CONTACT_TO_EMAIL` | With Resend | Inbox that receives contact form messages. |
| `CONTACT_FROM_EMAIL` | With Resend | Verified sender, e.g. `After School <noreply@yourdomain.com>`. |
| `RESEND_AUDIENCE_ID` | Optional | Resend audience that newsletter signups are added to. |

## Payments (Stripe)

- `POST /api/checkout` re-prices the bag on the server from the catalog, re-checks stock, validates the discount code and shipping quote, then creates a Stripe Checkout session. Client-side prices are never trusted.
- Discounts are applied as a one-time Stripe coupon matching the computed amount; shipping is passed as a fixed-amount shipping option.
- After payment Stripe redirects to `/order/confirmation?session_id=…`, which reads the session through `GET /api/checkout/session` and clears the bag once payment is confirmed.
- Test with card `4242 4242 4242 4242`, any future expiry date, any CVC.

To record orders in a database or send fulfilment emails, add a Stripe webhook for `checkout.session.completed` in a new route such as `app/api/stripe/webhook/route.ts`.

## Features

- **Catalog**: 56 products across Clothing (22), Football Merch (16) and 3D Printed (18), each with two images per colour, description, details, colours, sizes, stock per variant, reviews and related products.
- **Bag**: add, update and remove items, quantity capped at available stock, persisted in `localStorage` and synced across tabs.
- **Wishlist**: saved on the device.
- **Search**: live results in the header overlay (Cmd/Ctrl+K) and a full results page with filters.
- **Filters and sorting**: category, type, colour, size, price band, in-stock only; sort by featured, newest, price or rating.
- **Discount codes** (`lib/discounts.ts`):
  - `AFTERSCHOOL10`: 10% off
  - `FIRSTBELL`: 15% off orders over $75
  - `PRINTLAB20`: 20% off 3D printed items
  - `FREEKICK`: free standard shipping
- **Shipping calculator**: 15 countries in four zones, standard and express, free standard shipping above a threshold per zone (`lib/shipping.ts`).
- **Recommendations**: related products, "goes well with" in the bag, bestsellers on empty states.
- **Forms**: newsletter and contact, with client and server validation, honeypot and per-IP rate limiting.
- **SEO**: per-page metadata, canonical URLs, Open Graph image, Product / BlogPosting / BreadcrumbList / Organization JSON-LD, `sitemap.xml`, `robots.txt`. Transactional pages are `noindex`.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/shop` | Shop all (supports `?sort=` and `?category=`) |
| `/shop/[category]` | `clothing`, `football`, `3d-printed` |
| `/product/[slug]` | Product details |
| `/search?q=` | Search results |
| `/cart` | Bag |
| `/checkout` | Checkout |
| `/order/confirmation` | Order confirmation |
| `/wishlist` | Wishlist |
| `/blog`, `/blog/[slug]` | Journal and posts |
| `/about`, `/contact` | About, contact and FAQ |
| any unknown URL | 404 |

## Motion

| Effect | Where it lives |
| --- | --- |
| Smooth scrolling | `components/providers/SmoothScroll.tsx` (Lenis driven by the GSAP ticker, synced to ScrollTrigger) |
| Page transitions | `components/providers/TransitionProvider.tsx` + `components/TLink.tsx` (curtain wipe; modifier clicks open normally) |
| Split-text reveals | `components/motion/SplitText.tsx` (screen readers get the plain text) |
| Clip-path image reveals | `components/motion/ClipReveal.tsx` |
| Parallax | `components/motion/Parallax.tsx`, hero floaters in `components/home/HomeHero.tsx` |
| Magnetic buttons | `components/motion/Magnetic.tsx` |
| Cursor | `components/motion/Cursor.tsx` (fine pointers only) |
| Pinned horizontal rail | `components/home/HorizontalRail.tsx` (desktop; native swipe on touch) |
| UI motion | Framer Motion: bag drawer, menus, search, filters, grid layout, toasts |

All animation uses transforms, opacity and clip-path. With `prefers-reduced-motion: reduce`, Lenis, GSAP reveals, parallax, the cursor and magnetic effects are disabled and content renders immediately; Framer Motion follows the same setting through `MotionConfig reducedMotion="user"`.

## Project structure

```
app/                  Routes, API routes, metadata files
  api/checkout/       Stripe session creation and lookup
  api/contact/        Contact form
  api/newsletter/     Newsletter signup
components/
  blog/  cart/  checkout/  forms/  home/  layout/  motion/  providers/  shop/  ui/
data/products.json    Generated catalog data
lib/                  Catalog, pricing, shipping, discounts, search, blog, server helpers
public/products/      Product images (SVG, generated)
scripts/generate_catalog.py   Source of truth for products and their images
```

## Editing the catalog

Products are defined in `scripts/generate_catalog.py`. After editing, regenerate the JSON and images:

```bash
npm run generate:images
```

Stock levels and reviews are generated deterministically from each product's slug in `lib/catalog.ts`, so they stay stable between builds. Replace `variantStock` and `getReviews` with calls to your inventory and review provider when you connect real data.

## Football merchandise notice

Every football item is an original After School design inspired by team colours and football history. None carries real crests, sponsor marks or federation logos, and the site states on category, product and FAQ pages that the range is unofficial and not affiliated with any club, league or federation. Keep it that way unless you hold the relevant licences.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm run generate:images` | Rebuild `data/products.json` and `public/products/` |
