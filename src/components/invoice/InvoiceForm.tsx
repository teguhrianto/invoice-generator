"use client";

import React, { useState, useRef, useEffect } from "react";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { useInvoice } from "@/hooks/useInvoice";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceParties } from "@/components/invoice/InvoiceParties";
import { InvoiceDates } from "@/components/invoice/InvoiceDates";
import { InvoiceCurrency } from "@/components/invoice/InvoiceCurrency";
import { InvoiceLineItems } from "@/components/invoice/InvoiceLineItems";
import { InvoiceNotes } from "@/components/invoice/InvoiceNotes";
import { InvoiceSummary } from "@/components/invoice/InvoiceSummary";
import { Button } from "@/components/ui/Button";
import { saveInvoice } from "@/lib/storage";
import { generateAndDownloadPDF } from "@/lib/pdfGenerator";

/** Status of the PDF generation action. */
type GenerateStatus = "idle" | "generating" | "success" | "error";

/**
 * Inner form component that has access to InvoiceContext.
 *
 * Separated from the outer InvoiceForm wrapper so that InvoiceProvider can be
 * placed at the tree root while this component consumes the context.
 */
function InvoiceFormInner() {
  const { state } = useInvoice();
  const [status, setStatus] = useState<GenerateStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the banner reset timer on unmount to avoid state updates after removal.
  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function handleCreate() {
    if (status === "generating") return;

    setStatus("generating");
    setErrorMessage("");

    try {
      saveInvoice(state);
      await generateAndDownloadPDF(state);
      setStatus("success");
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setStatus("idle"), 4_000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-[#ebebeb] p-6 sm:p-8 flex flex-col gap-6">
        {/* ── 1. Header: invoice number, PO, logo ─────────────────────────── */}
        <InvoiceHeader />

        <hr className="border-[#e0e0e0]" />

        {/* ── 2. Company details / Bill to ────────────────────────────────── */}
        <InvoiceParties />

        <hr className="border-[#e0e0e0]" />

        {/* ── 3. Currency + Dates row ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="sm:w-1/3">
            <InvoiceCurrency />
          </div>
          <div className="flex-1">
            <InvoiceDates />
          </div>
        </div>

        <hr className="border-[#e0e0e0]" />

        {/* ── 4. Line items ────────────────────────────────────────────────── */}
        <InvoiceLineItems />

        <hr className="border-[#e0e0e0]" />

        {/* ── 5. Notes + Summary ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InvoiceNotes />
          <InvoiceSummary />
        </div>

        <hr className="border-[#e0e0e0]" />

        {/* ── 6. Create button + feedback ──────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {/* Success banner */}
          {status === "success" && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Invoice saved and PDF download started.
            </div>
          )}

          {/* Error banner */}
          {status === "error" && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
              {errorMessage || "Failed to generate PDF. Please try again."}
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={status === "generating"}
            aria-busy={status === "generating"}
          >
            {status === "generating" ? "Generating PDF…" : "Create the invoice"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Full invoice form page component.
 *
 * Wraps InvoiceFormInner in InvoiceProvider so the entire form tree has access
 * to invoice state and dispatch. This is the top-level component rendered by
 * the root page route.
 */
export function InvoiceForm() {
  return (
    <InvoiceProvider>
      <InvoiceFormInner />
    </InvoiceProvider>
  );
}
