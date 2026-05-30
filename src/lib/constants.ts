import type { Currency, Invoice } from "@/types/invoice";

/** All supported currencies available in the currency dropdown. */
export const CURRENCIES: Currency[] = [
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "EUR", label: "Euro", symbol: "€", locale: "de-DE" },
  { code: "GBP", label: "British Pound", symbol: "£", locale: "en-GB" },
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp", locale: "id-ID" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$", locale: "en-SG" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥", locale: "ja-JP" },
  { code: "CAD", label: "Canadian Dollar", symbol: "CA$", locale: "en-CA" },
  { code: "CHF", label: "Swiss Franc", symbol: "CHF", locale: "de-CH" },
  { code: "MYR", label: "Malaysian Ringgit", symbol: "RM", locale: "ms-MY" },
];

/** Fallback USD → IDR exchange rate used when currency is not IDR and the IDR equivalent note is shown. */
export const IDR_FALLBACK_RATE = 16_000;

/**
 * Override the fallback rate via environment variable NEXT_PUBLIC_IDR_RATE.
 * Useful for deployments that want a more current rate baked in at build time.
 * Falls back to IDR_FALLBACK_RATE when the env var is absent or non-numeric.
 */
const _parsedRate = Number(process.env.NEXT_PUBLIC_IDR_RATE);
export const IDR_RATE: number =
  !isNaN(_parsedRate) && _parsedRate > 0 ? _parsedRate : IDR_FALLBACK_RATE;

/** Default payment terms shown in the Notes field on a fresh invoice. */
export const DEFAULT_NOTES = "Payment is due within 15 days";

/** Maximum logo file size accepted (bytes). Files larger than this are rejected before processing. */
export const MAX_LOGO_SIZE_BYTES = 200 * 1024; // 200 KB

/** localStorage key for the history index (array of InvoiceSummary). */
export const LS_INDEX_KEY = "invoice_generator_index";

/** Returns the localStorage key for a full invoice document by id. */
export const lsDocKey = (id: string): string => `invoice_generator_doc_${id}`;

/** The default currency used on a fresh invoice. */
export const DEFAULT_CURRENCY: Currency = CURRENCIES[0];

/** A blank invoice used to initialise state when no history exists. */
export const DEFAULT_INVOICE: Omit<Invoice, "id" | "createdAt" | "updatedAt"> = {
  invoiceNumber: "",
  purchaseOrder: "",
  logoDataUrl: null,
  fromDetails: "",
  billTo: "",
  invoiceDate: "",
  dueDate: "",
  currency: DEFAULT_CURRENCY,
  lineItems: [],
  taxPercent: 0,
  discountAmount: 0,
  shippingFee: 0,
  subtotal: 0,
  taxAmount: 0,
  total: 0,
  notes: DEFAULT_NOTES,
  bankDetails: "",
};
