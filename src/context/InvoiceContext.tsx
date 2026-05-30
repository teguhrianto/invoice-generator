"use client";

import React, { createContext, useReducer, useEffect } from "react";
import type { Invoice, InvoiceAction } from "@/types/invoice";
import { invoiceReducer, createInitialInvoice } from "@/context/InvoiceReducer";
import {
  getMostRecentInvoice,
  getActiveInvoiceId,
  clearActiveInvoiceId,
  loadInvoice,
} from "@/lib/storage";

/** Shape of the value exposed through InvoiceContext. */
export interface InvoiceContextValue {
  state: Invoice;
  dispatch: React.Dispatch<InvoiceAction>;
}

/**
 * The React context that distributes invoice state and dispatch throughout the tree.
 * Consumers should use the `useInvoice` hook rather than accessing this directly.
 */
export const InvoiceContext = createContext<InvoiceContextValue | null>(null);

/**
 * Provides invoice state via `useReducer`.
 * On first mount it attempts to rehydrate state from localStorage by loading
 * the most recently saved invoice. This runs client-side only, avoiding
 * SSR hydration mismatches.
 */
export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(invoiceReducer, null, createInitialInvoice);

  useEffect(() => {
    // If the history page set an "active" id (e.g. user clicked Load), prefer
    // that invoice over the most-recently-created one. Clear the key immediately
    // so it is consumed only once.
    const activeId = getActiveInvoiceId();
    if (activeId) {
      clearActiveInvoiceId();
      const active = loadInvoice(activeId);
      if (active) {
        dispatch({ type: "LOAD_INVOICE", payload: active });
        return;
      }
    }
    // Fall back to the most recently created invoice.
    const recent = getMostRecentInvoice();
    if (recent) {
      dispatch({ type: "LOAD_INVOICE", payload: recent });
    }
  }, []);

  return <InvoiceContext.Provider value={{ state, dispatch }}>{children}</InvoiceContext.Provider>;
}
