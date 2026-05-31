"use client";

import React from "react";
import { useInvoice } from "@/hooks/useInvoice";
import { InvoiceLineItemRow } from "@/components/invoice/InvoiceLineItemRow";
import type { LineItem } from "@/types/invoice";

/**
 * Line items section of the invoice form.
 *
 * Renders a table-like layout with column headers and one InvoiceLineItemRow
 * per item in state.lineItems. Dispatches ADD_LINE_ITEM, UPDATE_LINE_ITEM,
 * REMOVE_LINE_ITEM, and REORDER_LINE_ITEMS actions to InvoiceContext.
 *
 * The entire section has a grey background to visually group it per the design.
 */
export function InvoiceLineItems() {
  const { state, dispatch } = useInvoice();

  function handleAdd() {
    dispatch({ type: "ADD_LINE_ITEM" });
  }

  function handleUpdate(
    id: string,
    field: keyof Omit<LineItem, "id" | "amount">,
    value: string | number,
  ) {
    dispatch({ type: "UPDATE_LINE_ITEM", id, field, value });
  }

  function handleRemove(id: string) {
    dispatch({ type: "REMOVE_LINE_ITEM", id });
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    dispatch({ type: "REORDER_LINE_ITEMS", fromIndex: index, toIndex: index - 1 });
  }

  function handleMoveDown(index: number) {
    if (index >= state.lineItems.length - 1) return;
    dispatch({ type: "REORDER_LINE_ITEMS", fromIndex: index, toIndex: index + 1 });
  }

  return (
    <section aria-label="Line items" className="rounded-lg bg-[#f5f5f5] p-4 flex flex-col gap-3">
      {/* Column headers — mirrors flex layout of InvoiceLineItemRow */}
      {state.lineItems.length > 0 && (
        <div className="flex items-center gap-2 pl-9 text-xs font-semibold uppercase tracking-wider text-[#9e9e9e]">
          <span className="flex-1 min-w-0 pl-4">Item description</span>
          <span className="w-30 shrink-0 text-right pr-4">Unit cost</span>
          <span className="w-25 shrink-0 text-right pr-4">Quantity</span>
          <span className="w-30 shrink-0 text-right pr-4">Amount</span>
          {/* Spacer matching × button width */}
          <span className="shrink-0 w-9" />
        </div>
      )}

      {/* Rows — pl-9 leaves space for the absolute-positioned reorder buttons */}
      <div className="flex flex-col gap-2 pl-9">
        {state.lineItems.map((item, index) => (
          <InvoiceLineItemRow
            key={item.id}
            item={item}
            index={index}
            total={state.lineItems.length}
            currency={state.currency}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        ))}
      </div>

      {/* Add item button */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={handleAdd}
          aria-label="Add line item"
          className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#163016] hover:bg-[#163016]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163016] focus-visible:ring-offset-1 transition-colors duration-150"
        >
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#163016] text-[#b5f23d]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          Add item
        </button>
      </div>
    </section>
  );
}
