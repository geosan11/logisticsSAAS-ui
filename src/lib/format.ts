/**
 * Formatting utilities for logisticsSAAS
 * Adheres to Nigerian Naira (NGN) en-NG locale and IATA cargo standards.
 */

const ngnCurrencyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ngnCurrencyDetailedFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNGN(amount: number, includeDecimals = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₦0';
  }
  return includeDecimals ? ngnCurrencyDetailedFormatter.format(amount) : ngnCurrencyFormatter.format(amount);
}

export function formatKg(kg: number): string {
  if (isNaN(kg) || kg === null || kg === undefined) return '0.0 kg';
  return `${kg.toFixed(1)} kg`;
}

export function formatNumber(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat('en-NG').format(val);
}
