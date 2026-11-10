import { Currency } from '../types';

export function formatCurrency(cents: number, currency: Currency): string {
  const amount = cents / 100;

  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const symbol = symbols[currency];
  return `${symbol}${amount.toFixed(2)}`;
}

export function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  };
  return symbols[currency];
}
