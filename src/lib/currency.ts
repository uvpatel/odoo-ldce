import { CURRENCIES } from "./constants";

export function formatCurrency(
  amount: number | string,
  currencyCode: string = "USD",
  locale: string = "en-US"
): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "$0.00";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currencyCode.toUpperCase()} ${numericAmount.toFixed(2)}`;
  }
}

export function getCurrencySymbol(currencyCode: string = "USD"): string {
  const found = CURRENCIES.find(
    (c) => c.code.toLowerCase() === currencyCode.toLowerCase()
  );
  return found ? found.symbol : "$";
}
