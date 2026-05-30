/**
 * All TypeScript interfaces and types for the invoice domain.
 * This file is the single source of truth for data shapes used across
 * components, hooks, context, storage, and PDF generation.
 */

/** A single line item row on the invoice. */
export interface LineItem {
  /** Stable unique key for React list rendering, generated with nanoid(). */
  id: string;
  description: string;
  unitCost: number;
  quantity: number;
  /** Computed: unitCost * quantity. Stored in state to avoid recomputation in PDF. */
  amount: number;
}

/** A supported currency entry shown in the currency dropdown. */
export interface Currency {
  /** ISO 4217 code, e.g. "USD", "IDR", "EUR". */
  code: string;
  /** Human-readable label, e.g. "US Dollar". */
  label: string;
  /** Display symbol, e.g. "$", "Rp", "€". */
  symbol: string;
  /** BCP 47 locale tag used by Intl.NumberFormat, e.g. "en-US". */
  locale: string;
}

/** The complete invoice data shape persisted to localStorage and held in React state. */
export interface Invoice {
  // --- Metadata ---
  /** Unique identifier generated with nanoid(). Stable for the lifetime of the invoice document. */
  id: string;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  /** ISO 8601 last-updated timestamp. */
  updatedAt: string;

  // --- Header ---
  invoiceNumber: string;
  purchaseOrder: string;
  /** Base64 data URL of the uploaded logo, or null if no logo. */
  logoDataUrl: string | null;

  // --- Parties ---
  /** Multiline textarea: sender's company details. */
  fromDetails: string;
  /** Multiline textarea: recipient's billing address. */
  billTo: string;

  // --- Dates ---
  /** Format: "YYYY-MM-DD". */
  invoiceDate: string;
  /** Format: "YYYY-MM-DD". */
  dueDate: string;

  // --- Currency ---
  currency: Currency;

  // --- Line items ---
  lineItems: LineItem[];

  // --- Adjustments ---
  /** Tax percentage, 0–100. */
  taxPercent: number;
  /** Flat discount in the selected currency. */
  discountAmount: number;
  /** Shipping fee in the selected currency. */
  shippingFee: number;

  // --- Computed totals (stored for PDF display, re-derived on load) ---
  subtotal: number;
  taxAmount: number;
  total: number;

  // --- Footer ---
  /** Payment terms and any additional notes shown on the invoice. */
  notes: string;
  /** Bank / payment account details shown at the bottom of the invoice. */
  bankDetails: string;
}

/**
 * Minimal invoice summary stored in the history index.
 * Used to populate the history list without deserializing every full invoice.
 */
export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  billTo: string;
  invoiceDate: string;
  total: number;
  currency: Currency;
  createdAt: string;
}

/** Union of all reducer actions for the invoice state machine. */
export type InvoiceAction =
  | { type: "LOAD_INVOICE"; payload: Invoice }
  | { type: "RESET_INVOICE" }
  | {
      type: "SET_FIELD";
      field: keyof Omit<Invoice, "lineItems" | "id" | "createdAt" | "updatedAt">;
      value: unknown;
    }
  | { type: "SET_LOGO"; dataUrl: string | null }
  | { type: "SET_CURRENCY"; currency: Currency }
  | { type: "ADD_LINE_ITEM" }
  | {
      type: "UPDATE_LINE_ITEM";
      id: string;
      field: keyof Omit<LineItem, "id" | "amount">;
      value: string | number;
    }
  | { type: "REMOVE_LINE_ITEM"; id: string }
  | { type: "REORDER_LINE_ITEMS"; fromIndex: number; toIndex: number };
