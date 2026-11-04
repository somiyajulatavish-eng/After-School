import 'server-only';
import { FALLBACK_RATES, normaliseRates, type ExchangeRates } from '@/lib/currency';

const REVALIDATE_SECONDS = 60 * 60;

interface CacheEntry {
  rates: ExchangeRates;
  expires: number;
}
let cache: CacheEntry | null = null;

/** Accepts the common response shapes: { rates: {...} }, { conversion_rates: {...} } or a flat map. */
function extract(json: unknown): Record<string, unknown> | null {
  if (!json || typeof json !== 'object') return null;
  const o = json as Record<string, unknown>;
  for (const key of ['rates', 'conversion_rates', 'data']) {
    const v = o[key];
    if (v && typeof v === 'object') return v as Record<string, unknown>;
  }
  return o;
}

async function fromUrl(url: string): Promise<ExchangeRates | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const init: RequestInit & { next?: { revalidate: number } } = {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    };
    const res = await fetch(url, init);
    if (!res.ok) throw new Error(`Rates endpoint responded ${res.status}`);
    const map = extract(await res.json());
    const hour = new Date();
    hour.setUTCMinutes(0, 0, 0);
    return normaliseRates(map, 'live', hour.toISOString());
  } catch (err) {
    console.error('[rates] live source failed, using fallback', err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Server-side source of truth for exchange rates (units per 1 USD).
 * Priority: EXCHANGE_RATES_URL (live, cached hourly) → EXCHANGE_RATES_JSON (static override) → reference fallback.
 */
export async function getRates(): Promise<ExchangeRates> {
  if (cache && cache.expires > Date.now()) return cache.rates;
  let rates: ExchangeRates | null = null;

  const url = process.env.EXCHANGE_RATES_URL;
  if (url) rates = await fromUrl(url);

  if (!rates && process.env.EXCHANGE_RATES_JSON) {
    try {
      rates = normaliseRates(JSON.parse(process.env.EXCHANGE_RATES_JSON), 'environment', process.env.EXCHANGE_RATES_AS_OF || FALLBACK_RATES.asOf);
    } catch {
      console.error('[rates] EXCHANGE_RATES_JSON is not valid JSON, using fallback');
    }
  }

  const resolved = rates ?? FALLBACK_RATES;
  cache = { rates: resolved, expires: Date.now() + (resolved.source === 'live' ? REVALIDATE_SECONDS * 1000 : 10 * 60 * 1000) };
  return resolved;
}
