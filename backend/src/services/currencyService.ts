import { Currency } from '../types';

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1.00,
  EUR: 0.92,
  GBP: 0.78
};

const SUPPORTED_CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP'];

export function validateCurrency(currency: string): void {
  if (!SUPPORTED_CURRENCIES.includes(currency as Currency)) {
    throw new Error('Invalid currency. Supported currencies: USD, EUR, GBP');
  }
}

export function convertPrice(usdCents: number, targetCurrency: Currency): number {
  const rate = EXCHANGE_RATES[targetCurrency];
  return Math.round(usdCents * rate);
}

export function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  return symbols[currency];
}
