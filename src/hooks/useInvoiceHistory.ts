import { useState, useEffect, useCallback } from "react";
import type { InvoiceSummary } from "@/types/invoice";
import * as storage from "@/lib/storage";

/** Return type of the `useInvoiceHistory` hook. */
export interface InvoiceHistoryValue {
  /** Sorted list of invoice summaries (most recent first). Empty array on server. */
  invoices: InvoiceSummary[];
  /** Deletes an invoice by id from storage then refreshes the list. */
  deleteInvoice: (id: string) => void;
  /** Manually re-reads the list from localStorage. */
  refresh: () => void;
}

/**
 * Provides a reactive view of the invoice history stored in localStorage.
 *
 * - Initializes to an empty array on the server to avoid SSR hydration mismatches.
 * - Loads from localStorage after mount.
 * - `deleteInvoice` removes the entry from storage and immediately refreshes
 *   the in-memory list without requiring a full page reload.
 */
export function useInvoiceHistory(): InvoiceHistoryValue {
  // Start with an empty list so the server render and the initial client render match.
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);

  const refresh = useCallback(() => {
    setInvoices(storage.listInvoices());
  }, []);

  // Load from localStorage after the first client-side render.
  useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteInvoice = useCallback(
    (id: string) => {
      storage.deleteInvoice(id);
      refresh();
    },
    [refresh],
  );

  return { invoices, deleteInvoice, refresh };
}
