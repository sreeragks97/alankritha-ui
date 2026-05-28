export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
}

const DEFAULT_CURRENCY_OPTIONS: Required<CurrencyFormatOptions> = {
  locale: "en-IN",
  currency: "INR",
  maximumFractionDigits: 0,
};

export function formatCurrency(value: number, options: CurrencyFormatOptions = {}): string {
  const settings = { ...DEFAULT_CURRENCY_OPTIONS, ...options };
  return new Intl.NumberFormat(settings.locale, {
    style: "currency",
    currency: settings.currency,
    maximumFractionDigits: settings.maximumFractionDigits,
  }).format(value);
}
