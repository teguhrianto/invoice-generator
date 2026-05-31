"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInvoiceHistory } from "@/hooks/useInvoiceHistory";
import { setActiveInvoiceId } from "@/lib/storage";
import { InvoiceHistoryItem } from "@/components/history/InvoiceHistoryItem";
import { Button } from "@/components/ui/Button";

/**
 * Invoice history page component.
 *
 * Lists all saved invoices using useInvoiceHistory. When the user clicks
 * "Load" on a card, the full Invoice document is loaded from localStorage,
 * dispatched into InvoiceContext via LOAD_INVOICE, and the user is navigated
 * back to "/" to continue editing.
 *
 * Must be rendered inside an InvoiceProvider because it calls useInvoice()
 * to dispatch LOAD_INVOICE.
 */
export function InvoiceHistoryPage() {
  const { invoices, deleteInvoice } = useInvoiceHistory();
  const router = useRouter();

  function handleLoad(id: string) {
    // Write the chosen id to localStorage so InvoiceProvider on "/" reads it
    // on mount. Dispatching into this page's context would be lost on navigation.
    setActiveInvoiceId(id);
    router.push("/");
  }

  function handleDelete(id: string) {
    deleteInvoice(id);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Invoice history</h1>
            <p className="mt-1 text-sm text-[#757575]">
              All invoices are stored locally in your browser.
            </p>
          </div>
          <Link href="/" aria-label="Create a new invoice">
            <Button variant="primary" className="w-auto px-5 py-2.5 whitespace-nowrap">
              New invoice
            </Button>
          </Link>
        </div>

        {/* List or empty state */}
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#e0e0e0] bg-white py-16 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-[#bdbdbd]"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <p className="text-[#757575] text-sm">No invoices yet.</p>
            <Link href="/">
              <Button variant="primary" className="w-auto px-6">
                Create your first invoice
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3" role="list" aria-label="Saved invoices">
            {invoices.map((summary) => (
              <div key={summary.id} role="listitem">
                <InvoiceHistoryItem summary={summary} onLoad={handleLoad} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
