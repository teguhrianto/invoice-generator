"use client";

import React, { useState } from "react";
import type { InvoiceSummary } from "@/types/invoice";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";

/** Props accepted by the InvoiceHistoryItem component. */
export interface InvoiceHistoryItemProps {
  /** Minimal invoice summary data shown in the card. */
  summary: InvoiceSummary;
  /** Called when the user clicks "Load" — passes the invoice id. */
  onLoad: (id: string) => void;
  /** Called when the user clicks "Delete" — passes the invoice id. */
  onDelete: (id: string) => void;
}

/** Max characters shown for the "Bill to" field before truncation. */
const BILL_TO_MAX_CHARS = 40;

/**
 * A single invoice history card.
 *
 * Displays invoice number, truncated billTo name, invoice date, and formatted
 * total. Provides "Load" and "Delete" action buttons. The card uses a semantic
 * <article> element so screen readers can identify it as a distinct content unit.
 */
export function InvoiceHistoryItem({ summary, onLoad, onDelete }: InvoiceHistoryItemProps) {
  const [confirming, setConfirming] = useState(false);

  const billToDisplay =
    summary.billTo.length > BILL_TO_MAX_CHARS
      ? `${summary.billTo.slice(0, BILL_TO_MAX_CHARS).trim()}…`
      : summary.billTo || "—";

  return (
    <article
      data-testid="history-card"
      aria-label={`Invoice ${summary.invoiceNumber || "unnamed"}`}
      className="flex flex-col gap-3 rounded-lg border border-[#e0e0e0] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Metadata */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-semibold text-[#212121] truncate">
          {summary.invoiceNumber || <span className="text-[#757575]">No invoice number</span>}
        </span>
        <span className="text-sm text-[#757575] truncate">{billToDisplay}</span>
        <span className="text-xs text-[#757575]">
          {summary.invoiceDate ? formatDate(summary.invoiceDate) : "No date"}
        </span>
      </div>

      {/* Total + actions */}
      <div className="flex flex-col items-start gap-2 sm:items-end shrink-0">
        <span className="text-base font-bold text-[#212121]">
          {formatCurrency(summary.total, summary.currency)}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => onLoad(summary.id)}
            className="w-auto px-4 py-1.5 text-xs"
            aria-label={`Load invoice ${summary.invoiceNumber || summary.id}`}
          >
            Load
          </Button>
          {confirming ? (
            <>
              <Button
                variant="danger"
                onClick={() => onDelete(summary.id)}
                className="w-auto px-4 py-1.5 text-xs"
                aria-label={`Confirm delete invoice ${summary.invoiceNumber || summary.id}`}
              >
                Confirm
              </Button>
              <Button
                variant="secondary"
                onClick={() => setConfirming(false)}
                className="w-auto px-4 py-1.5 text-xs"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="danger"
              onClick={() => setConfirming(true)}
              className="w-auto px-4 py-1.5 text-xs"
              aria-label={`Delete invoice ${summary.invoiceNumber || summary.id}`}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
