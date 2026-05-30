import { useContext } from "react";
import { InvoiceContext } from "@/context/InvoiceContext";
import type { InvoiceContextValue } from "@/context/InvoiceContext";

/**
 * Returns the current invoice state and dispatch function.
 * Must be called inside a component that is a descendant of `InvoiceProvider`.
 * Throws a descriptive error if used outside the provider tree.
 */
export function useInvoice(): InvoiceContextValue {
  const ctx = useContext(InvoiceContext);
  if (ctx === null) {
    throw new Error(
      "useInvoice must be used inside an <InvoiceProvider>. " +
        "Ensure your component tree includes InvoiceProvider at a higher level.",
    );
  }
  return ctx;
}
