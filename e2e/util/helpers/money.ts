export const RATES = {
  USD: 1.00,
  EUR: 0.92,
  GBP: 0.78,
} as const;

export type CurrencyCode = keyof typeof RATES;

export type PriceFields = {
  currencyCode: CurrencyCode;
  nightlyRate?: number;
  subtotal?: number;
  taxesFees?: number;
  total?: number;
};

export function parseMoney(text: string): number | null {
  const m = text.match(/(\d+[0,.]*\d+)/);
  if (!m) return null;
  const clean = m[1].replace(/,/g, '');
  const value = Number(clean);
  return Number.isFinite(value) ? value : null;
}

export function expectConverted(
  usd: PriceFields,
  target: PriceFields,
  rate: number,
  tolerance = 0.01
) {
  const assertField = (key: keyof PriceFields) => {
    const base = usd[key];
    const converted = target[key];
    if (base === undefined || converted === undefined) return;
    const expected = Math.round(base * rate * 100) / 100;
    const delta = Math.abs(converted - expected);
    if (delta > tolerance) {
      throw new Error(`Expected ${String(key)} to convert from USD ${base} at rate ${rate} → expected ${expected}, got ${converted}`);
    }
  };

  assertField('nightlyRate');
  assertField('subtotal');
  assertField('taxesFees');
  assertField('total');
}
