"use client";

import React from "react";
import type { LineItem } from "@/types/invoice";
import { formatCurrency } from "@/lib/formatters";
import type { Currency } from "@/types/invoice";

/** Props accepted by the InvoiceLineItemRow component. */
export interface InvoiceLineItemRowProps {
  /** The line item data to display and edit. */
  item: LineItem;
  /** Zero-based position in the line items array. */
  index: number;
  /** The active currency used for the read-only amount display. */
  currency: Currency;
  /** Called when a writable field on this row changes. */
  onUpdate: (
    id: string,
    field: keyof Omit<LineItem, "id" | "amount">,
    value: string | number,
  ) => void;
  /** Called when the remove (×) button is clicked. */
  onRemove: (id: string) => void;
  /** Called when the move-up (↑) button is clicked. */
  onMoveUp: (index: number) => void;
  /** Called when the move-down (↓) button is clicked. */
  onMoveDown: (index: number) => void;
  /** Total number of line items — used to disable move-down on the last row. */
  total: number;
}

/**
 * A single editable row inside the line items table.
 *
 * Renders inputs for description, unitCost, and quantity. The amount column
 * is read-only (derived from unitCost × quantity). The ↑ button triggers
 * reordering by calling onMoveUp; the × button calls onRemove.
 *
 * a11y: All inputs have visible aria-labels since the column headers act as
 * the visual labels. The action buttons have descriptive aria-labels.
 */
export function InvoiceLineItemRow({
  item,
  index,
  currency,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  total,
}: InvoiceLineItemRowProps) {
  return (
    <div
      data-testid="line-item-row"
      className="relative grid grid-cols-[1fr_120px_100px_120px] gap-2 items-center rounded-md bg-white border border-[#e0e0e0] px-3 py-2 group"
    >
      {/* Reorder buttons (↑ / ↓) */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          aria-label={`Move item ${index + 1} up`}
          className="flex h-5 w-5 items-center justify-center rounded text-[#757575] hover:text-[#212121] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4caf50] transition-colors duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          aria-label={`Move item ${index + 1} down`}
          className="flex h-5 w-5 items-center justify-center rounded text-[#757575] hover:text-[#212121] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4caf50] transition-colors duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <input
        type="text"
        value={item.description}
        placeholder="Item description"
        aria-label={`Item ${index + 1} description`}
        onChange={(e) => onUpdate(item.id, "description", e.target.value)}
        className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-sm text-[#212121] placeholder:text-[#bdbdbd] focus:border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4caf50] focus:ring-offset-1 transition-colors duration-150"
      />

      {/* Unit cost — negative values are valid (e.g. loan repayment, credit) */}
      <input
        type="number"
        value={item.unitCost === 0 ? "" : item.unitCost}
        placeholder="0"
        step="any"
        aria-label={`Item ${index + 1} unit cost`}
        onChange={(e) => onUpdate(item.id, "unitCost", parseFloat(e.target.value) || 0)}
        className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-sm text-[#212121] placeholder:text-[#bdbdbd] text-right focus:border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4caf50] focus:ring-offset-1 transition-colors duration-150"
      />

      {/* Quantity */}
      <input
        type="number"
        value={item.quantity === 0 ? "" : item.quantity}
        placeholder="1"
        min={0}
        step="any"
        aria-label={`Item ${index + 1} quantity`}
        onChange={(e) =>
          onUpdate(item.id, "quantity", Math.max(0, parseFloat(e.target.value) || 0))
        }
        className="w-full rounded border border-transparent bg-transparent px-2 py-1 text-sm text-[#212121] placeholder:text-[#bdbdbd] text-right focus:border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#4caf50] focus:ring-offset-1 transition-colors duration-150"
      />

      {/* Amount (read-only) */}
      <span
        data-testid="line-item-amount"
        className="text-sm text-[#212121] text-right font-medium pr-7"
        aria-label={`Item ${index + 1} amount`}
      >
        {formatCurrency(item.amount, currency)}
      </span>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove item ${index + 1}`}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-[#757575] hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors duration-150"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
