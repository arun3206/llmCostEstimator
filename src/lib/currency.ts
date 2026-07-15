import type { Currency } from "@/types/calculator";

export const USD_TO_INR = 83.5;

export function toCurrencyValue(amountUsd: number, currency: Currency) {
  return currency === "INR" ? amountUsd * USD_TO_INR : amountUsd;
}

export function formatCurrency(amountUsd: number, currency: Currency) {
  const value = toCurrencyValue(amountUsd, currency);
  const minimumFractionDigits = value > 0 && value < 0.01 ? 6 : 2;

  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: value > 0 && value < 1 ? 2 : 0,
  }).format(value);
}
