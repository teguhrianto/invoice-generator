import type { Currency } from "@/types/invoice";

/**
 * Formats a numeric amount as a currency string using the locale and code
 * defined on the Currency object. Uses `Intl.NumberFormat` — no external libs.
 *
 * Examples:
 *   formatCurrency(1500, USD)  → "$1,500.00"
 *   formatCurrency(150000, IDR) → "Rp 150,000"
 */
export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
  }).format(amount);
}

/**
 * Converts an ISO date string ("YYYY-MM-DD") to a display-friendly
 * "DD/MM/YYYY" format suitable for rendered text.
 * Returns an empty string if `dateStr` is falsy.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

/**
 * Returns the date string as-is for use as the `value` prop of
 * `<input type="date">`, which requires "YYYY-MM-DD" format.
 */
export function toDateInputValue(dateStr: string): string {
  return dateStr;
}

/**
 * Returns today's date formatted as "YYYY-MM-DD".
 * Uses the local wall-clock date, not UTC, so it matches what the user sees.
 */
export function getTodayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  // getMonth() is 0-indexed; pad to ensure two digits
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Adds `days` (default 14) to `invoiceDate` and returns the result as "YYYY-MM-DD".
 * Falls back to today + days if `invoiceDate` is not a valid date string.
 */
export function getDefaultDueDate(invoiceDate: string, days = 14): string {
  const base = invoiceDate ? new Date(invoiceDate) : new Date();
  // new Date("YYYY-MM-DD") parses as UTC midnight; use UTC arithmetic so the
  // result is date-only and unaffected by the local timezone offset.
  const due = new Date(base);
  due.setUTCDate(due.getUTCDate() + days);
  const year = due.getUTCFullYear();
  const month = String(due.getUTCMonth() + 1).padStart(2, "0");
  const day = String(due.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
