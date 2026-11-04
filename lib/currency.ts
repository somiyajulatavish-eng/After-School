/**
 * Currency system.
 *
 * Every price in the catalogue is stored once, in the base currency (USD minor units / cents).
 * Prices are converted only for presentation and checkout, using a rate table of
 * "units of target currency per 1 USD". Rates come from the server (see lib/server/rates.ts):
 * a live API, an environment override, or the reference fallback table below.
 * A transaction is always calculated and charged in exactly one currency.
 */

export const BASE_CURRENCY = 'USD';

export const CURRENCY_CODES = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'INR', 'CAD', 'AUD', 'JPY', 'CNY', 'SGD', 'CHF'] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  /** Locale used to format amounts in this currency. */
  locale: string;
  /** Number of minor-unit decimals (ISO 4217). */
  decimals: 0 | 2 | 3;
  /**
   * Smallest chargeable step in minor units. Stripe requires three-decimal currencies
   * (KWD, BHD, OMR) to be charged in multiples of 10.
   */
  step: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US dollar', locale: 'en-US', decimals: 2, step: 1 },
  EUR: { code: 'EUR', name: 'Euro', locale: 'en-IE', decimals: 2, step: 1 },
  GBP: { code: 'GBP', name: 'British pound', locale: 'en-GB', decimals: 2, step: 1 },
  AED: { code: 'AED', name: 'UAE dirham', locale: 'en-AE', decimals: 2, step: 1 },
  SAR: { code: 'SAR', name: 'Saudi riyal', locale: 'en-SA', decimals: 2, step: 1 },
  QAR: { code: 'QAR', name: 'Qatari riyal', locale: 'en-QA', decimals: 2, step: 1 },
  KWD: { code: 'KWD', name: 'Kuwaiti dinar', locale: 'en-KW', decimals: 3, step: 10 },
  BHD: { code: 'BHD', name: 'Bahraini dinar', locale: 'en-BH', decimals: 3, step: 10 },
  OMR: { code: 'OMR', name: 'Omani rial', locale: 'en-OM', decimals: 3, step: 10 },
  INR: { code: 'INR', name: 'Indian rupee', locale: 'en-IN', decimals: 2, step: 1 },
  CAD: { code: 'CAD', name: 'Canadian dollar', locale: 'en-US', decimals: 2, step: 1 },
  AUD: { code: 'AUD', name: 'Australian dollar', locale: 'en-US', decimals: 2, step: 1 },
  JPY: { code: 'JPY', name: 'Japanese yen', locale: 'en-US', decimals: 0, step: 1 },
  CNY: { code: 'CNY', name: 'Chinese yuan', locale: 'en-US', decimals: 2, step: 1 },
  SGD: { code: 'SGD', name: 'Singapore dollar', locale: 'en-US', decimals: 2, step: 1 },
  CHF: { code: 'CHF', name: 'Swiss franc', locale: 'de-CH', decimals: 2, step: 1 },
};

export type RateSource = 'live' | 'environment' | 'fallback';

export interface ExchangeRates {
  base: typeof BASE_CURRENCY;
  /** Units of each currency per 1 USD. */
  rates: Record<CurrencyCode, number>;
  /** ISO timestamp identifying this rate set. Checkout rejects totals priced on a different set. */
  asOf: string;
  source: RateSource;
}

/**
 * Reference fallback table, used only when no live source or environment override is configured.
 * Pegged currencies (AED, SAR, QAR, BHD, OMR) use their official pegs; floating currencies use
 * reference values and should be replaced in production via EXCHANGE_RATES_URL or EXCHANGE_RATES_JSON.
 */
export const FALLBACK_RATES: ExchangeRates = {
  base: 'USD',
  asOf: '2026-01-01T00:00:00.000Z',
  source: 'fallback',
  rates: {
    USD: 1,
    EUR: 0.86,
    GBP: 0.75,
    AED: 3.6725,
    SAR: 3.75,
    QAR: 3.64,
    KWD: 0.307,
    BHD: 0.376,
    OMR: 0.3845,
    INR: 88,
    CAD: 1.39,
    AUD: 1.53,
    JPY: 148,
    CNY: 7.12,
    SGD: 1.29,
    CHF: 0.8,
  },
};

export function isCurrencyCode(v: unknown): v is CurrencyCode {
  return typeof v === 'string' && (CURRENCY_CODES as readonly string[]).includes(v);
}

/**
 * Builds a complete rate table from untrusted input (API response or env JSON).
 * Missing or invalid entries fall back to the reference table so one bad value never breaks pricing.
 */
export function normaliseRates(input: unknown, source: RateSource, asOf = new Date().toISOString()): ExchangeRates | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  const rates = { ...FALLBACK_RATES.rates };
  let found = 0;
  for (const code of CURRENCY_CODES) {
    const v = raw[code];
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) {
      rates[code] = v;
      found++;
    }
  }
  if (!found) return null;
  rates.USD = 1;
  return { base: 'USD', rates, asOf, source };
}

/** Converts a base amount (USD cents) into minor units of the target currency, rounded to a chargeable step. */
export function convertMinor(baseCents: number, to: CurrencyCode, rates: ExchangeRates): number {
  if (to === BASE_CURRENCY) return Math.round(baseCents);
  const info = CURRENCIES[to];
  const major = (baseCents / 100) * rates.rates[to];
  const minor = major * 10 ** info.decimals;
  return Math.round(minor / info.step) * info.step;
}

/** Rounds an already-converted amount to the currency's chargeable step. */
export function roundToStep(minor: number, currency: CurrencyCode): number {
  const step = CURRENCIES[currency].step;
  return Math.round(minor / step) * step;
}

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(currency: CurrencyCode, fraction: boolean): Intl.NumberFormat {
  const key = `${currency}:${fraction}`;
  let f = formatters.get(key);
  if (!f) {
    const info = CURRENCIES[currency];
    f = new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: fraction ? info.decimals : 0,
      maximumFractionDigits: info.decimals,
    });
    formatters.set(key, f);
  }
  return f;
}

/** Formats minor units of a currency, dropping trailing zero decimals on whole amounts. */
export function formatMoney(minor: number, currency: CurrencyCode): string {
  const info = CURRENCIES[currency];
  const factor = 10 ** info.decimals;
  const whole = minor % factor === 0;
  return formatter(currency, !whole).format(minor / factor);
}

/** Symbol or short label for a currency in its own locale, e.g. "€", "£", "AED". */
export function currencySymbol(currency: CurrencyCode): string {
  const part = formatter(currency, false)
    .formatToParts(0)
    .find((p) => p.type === 'currency');
  return part?.value ?? currency;
}

const TZ_CURRENCY: Record<string, CurrencyCode> = {
  'Asia/Dubai': 'AED',
  'Asia/Riyadh': 'SAR',
  'Asia/Qatar': 'QAR',
  'Asia/Kuwait': 'KWD',
  'Asia/Bahrain': 'BHD',
  'Asia/Muscat': 'OMR',
  'Asia/Kolkata': 'INR',
  'Asia/Calcutta': 'INR',
  'Asia/Tokyo': 'JPY',
  'Asia/Shanghai': 'CNY',
  'Asia/Singapore': 'SGD',
  'Europe/London': 'GBP',
  'Europe/Zurich': 'CHF',
  'Australia/Sydney': 'AUD',
  'Australia/Melbourne': 'AUD',
  'Australia/Brisbane': 'AUD',
  'Australia/Perth': 'AUD',
  'America/Toronto': 'CAD',
  'America/Vancouver': 'CAD',
  'America/Edmonton': 'CAD',
  'America/Montreal': 'CAD',
};

/** A sensible first-visit default based on the browser's time zone. The visitor can always change it. */
export function guessCurrency(timeZone: string | undefined): CurrencyCode {
  if (!timeZone) return BASE_CURRENCY;
  if (TZ_CURRENCY[timeZone]) return TZ_CURRENCY[timeZone];
  if (timeZone.startsWith('Europe/')) return 'EUR';
  return BASE_CURRENCY;
}
