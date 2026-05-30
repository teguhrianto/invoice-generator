"use client";

import { InvoiceProvider } from "@/context/InvoiceContext";
import { InvoiceHistoryPage } from "@/components/history/InvoiceHistoryPage";

/**
 * History route — lists all previously saved invoices.
 *
 * Wraps InvoiceHistoryPage in InvoiceProvider because InvoiceHistoryPage
 * calls useInvoice() to dispatch LOAD_INVOICE when a user restores an invoice.
 */
export default function HistoryPage() {
  return (
    <InvoiceProvider>
      <InvoiceHistoryPage />
    </InvoiceProvider>
  );
}
