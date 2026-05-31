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
const inputCls =
  "rounded-xl border border-[#c8c8c8] bg-white px-4 py-2.5 text-sm text-[#212121] placeholder:text-[#bdbdbd] focus:outline-none focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all duration-150";

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
  const btnUp = (
    <button
      type="button"
      onClick={() => onMoveUp(index)}
      disabled={index === 0}
      aria-label={`Move item ${index + 1} up`}
      className="flex h-5 w-5 cursor-pointer items-center justify-center text-[#bdbdbd] hover:text-[#212121] disabled:opacity-25 disabled:cursor-not-allowed focus-visible:outline-none transition-colors duration-150"
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
  );
  const btnDown = (
    <button
      type="button"
      onClick={() => onMoveDown(index)}
      disabled={index === total - 1}
      aria-label={`Move item ${index + 1} down`}
      className="flex h-5 w-5 cursor-pointer items-center justify-center text-[#bdbdbd] hover:text-[#212121] disabled:opacity-25 disabled:cursor-not-allowed focus-visible:outline-none transition-colors duration-150"
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
  );
  const btnRemove =
    total > 1 ? (
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove item ${index + 1}`}
        className="shrink-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-green-50 text-[#163016] hover:bg-red-500 hover:text-white focus-visible:outline-none transition-all duration-150"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    ) : (
      <span className="shrink-0 w-7 h-7" />
    );

  return (
    <div data-testid="line-item-row" className="relative flex items-start gap-2">
      {/* Reorder: inline on mobile, absolute on desktop */}
      <div className="flex flex-col gap-0.5 shrink-0 sm:absolute sm:-left-8 sm:top-1/2 sm:-translate-y-1/2">
        {btnUp}
        {btnDown}
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        {/* Description */}
        <div className="flex flex-col gap-1 sm:flex-1 sm:min-w-0">
          <span className="text-xs font-medium text-[#616161] sm:hidden">Item description</span>
          <input
            type="text"
            value={item.description}
            placeholder="Item description"
            aria-label={`Item ${index + 1} description`}
            onChange={(e) => onUpdate(item.id, "description", e.target.value)}
            className={`${inputCls} w-full`}
          />
        </div>

        {/* Mobile: stacked label + input rows */}
        <div className="flex flex-col gap-1.5 sm:hidden">
          {[
            {
              label: "Unit cost",
              node: (
                <input
                  type="number"
                  value={item.unitCost === 0 ? "" : item.unitCost}
                  placeholder="0"
                  step="any"
                  aria-label={`Item ${index + 1} unit cost`}
                  onChange={(e) => onUpdate(item.id, "unitCost", parseFloat(e.target.value) || 0)}
                  className="w-28 rounded-xl border border-[#c8c8c8] bg-white px-3 py-1.5 text-sm text-[#212121] placeholder:text-[#bdbdbd] text-right focus:outline-none focus:border-[#4caf50] transition-all"
                />
              ),
            },
            {
              label: "Quantity",
              node: (
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
                  className="w-28 rounded-xl border border-[#c8c8c8] bg-white px-3 py-1.5 text-sm text-[#212121] placeholder:text-[#bdbdbd] text-right focus:outline-none focus:border-[#4caf50] transition-all"
                />
              ),
            },
            {
              label: "Amount",
              node: (
                <span
                  data-testid="line-item-amount"
                  aria-label={`Item ${index + 1} amount`}
                  className="text-sm font-semibold text-[#212121]"
                >
                  {formatCurrency(item.amount, currency)}
                </span>
              ),
            },
          ].map(({ label, node }) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#616161] shrink-0">{label}</span>
              {node}
            </div>
          ))}
        </div>

        {/* Desktop: inline fixed widths */}
        <div className="hidden sm:flex sm:gap-2">
          <input
            type="number"
            value={item.unitCost === 0 ? "" : item.unitCost}
            placeholder="0"
            step="any"
            aria-label={`Item ${index + 1} unit cost`}
            onChange={(e) => onUpdate(item.id, "unitCost", parseFloat(e.target.value) || 0)}
            className={`${inputCls} w-30 shrink-0 text-right`}
          />
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
            className={`${inputCls} w-25 shrink-0 text-right`}
          />
          <span
            data-testid="line-item-amount"
            aria-label={`Item ${index + 1} amount`}
            className={`${inputCls} w-30 shrink-0 flex items-center justify-end font-medium`}
          >
            {formatCurrency(item.amount, currency)}
          </span>
        </div>
      </div>

      {/* Remove */}
      {btnRemove}
    </div>
  );
}
