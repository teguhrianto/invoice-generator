import type { Invoice, InvoiceSummary } from "@/types/invoice";
import { LS_INDEX_KEY, lsDocKey } from "@/lib/constants";

/** Re-thrown message for localStorage quota errors. */
const QUOTA_ERROR_MSG = "Storage quota exceeded. Please delete some old invoices.";

/**
 * Reads and JSON-parses a localStorage value.
 * Returns `null` if the key is absent or the value cannot be parsed.
 */
function lsGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * JSON-stringifies and writes a value to localStorage.
 * Throws a user-readable Error on QuotaExceededError.
 */
function lsSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    if (err instanceof DOMException && err.name === "QuotaExceededError") {
      throw new Error(QUOTA_ERROR_MSG);
    }
    throw err;
  }
}

/**
 * Reads the history index from localStorage.
 * Returns an empty array if the key is absent or unparseable.
 */
function readIndex(): InvoiceSummary[] {
  return lsGet<InvoiceSummary[]>(LS_INDEX_KEY) ?? [];
}

/**
 * Extracts the minimal InvoiceSummary fields from a full Invoice document.
 */
function toSummary(invoice: Invoice): InvoiceSummary {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    billTo: invoice.billTo,
    invoiceDate: invoice.invoiceDate,
    total: invoice.total,
    currency: invoice.currency,
    createdAt: invoice.createdAt,
  };
}

/**
 * Persists a full Invoice document to localStorage and upserts its summary
 * entry in the history index.
 * Throws a user-readable Error if the storage quota is exceeded.
 */
export function saveInvoice(invoice: Invoice): void {
  // Write the full document first; if this fails due to quota the index stays clean.
  lsSet(lsDocKey(invoice.id), invoice);

  const index = readIndex();
  const existingIdx = index.findIndex((s) => s.id === invoice.id);
  const summary = toSummary(invoice);

  if (existingIdx >= 0) {
    index[existingIdx] = summary;
  } else {
    index.push(summary);
  }

  lsSet(LS_INDEX_KEY, index);
}

/**
 * Loads and returns a full Invoice document by its id.
 * Returns `null` if the id is not found or the stored value is corrupt.
 */
export function loadInvoice(id: string): Invoice | null {
  return lsGet<Invoice>(lsDocKey(id));
}

/**
 * Returns all InvoiceSummary entries from the history index,
 * sorted by `createdAt` descending (most recent first).
 */
export function listInvoices(): InvoiceSummary[] {
  const index = readIndex();
  return [...index].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * Removes a full Invoice document and its summary entry from localStorage.
 * Silently does nothing if the id does not exist.
 */
export function deleteInvoice(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(lsDocKey(id));
  const index = readIndex().filter((s) => s.id !== id);
  lsSet(LS_INDEX_KEY, index);
}

/**
 * Convenience helper that returns the most recently created invoice
 * by loading the first entry from the sorted history index.
 * Returns `null` when no invoices are stored.
 */
export function getMostRecentInvoice(): Invoice | null {
  const summaries = listInvoices();
  if (summaries.length === 0) return null;
  return loadInvoice(summaries[0].id);
}

/** localStorage key that stores the id of the invoice to load on next "/" visit. */
const LS_ACTIVE_ID_KEY = "invoice_generator_active_id";

/**
 * Marks an invoice id as the "active" one to be loaded on the next InvoiceProvider mount.
 * Used by the history page so clicking "Load" correctly hydrates the form,
 * regardless of which invoice is the most recently created.
 */
export function setActiveInvoiceId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_ACTIVE_ID_KEY, id);
}

/** Returns the pending active invoice id, or `null` if none is set. */
export function getActiveInvoiceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LS_ACTIVE_ID_KEY);
}

/** Clears the pending active invoice id after it has been consumed. */
export function clearActiveInvoiceId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_ACTIVE_ID_KEY);
}
