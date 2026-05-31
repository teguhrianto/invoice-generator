"use client";

import React from "react";
import { useInvoice } from "@/hooks/useInvoice";
import { formatCurrency } from "@/lib/formatters";

/**
 * Invoice summary / totals block.
 *
 * Displays the calculated subtotal, editable tax %, discount, and shipping fee
 * inputs, and the derived total. All monetary values are formatted using
 * formatCurrency. Dispatches SET_FIELD for taxPercent, discountAmount, and
 * shippingFee — each triggers deriveTotals inside the reducer.
 */
export function InvoiceSummary() {
  const { state, dispatch } = useInvoice();
  const { currency, subtotal, taxAmount, taxPercent, discountAmount, shippingFee, total } = state;

  return (
    <div className="rounded-lg border border-[#e0e0e0] bg-white p-4 flex flex-col gap-3 text-sm">
      {/* Subtotal row */}
      <div className="flex items-center justify-between">
        <span className="text-[#616161]">Subtotal</span>
        <span className="text-[#212121] font-medium">{formatCurrency(subtotal, currency)}</span>
      </div>

      {/* Tax % input */}
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="tax-percent" className="shrink-0 text-[#616161]">
          Tax (%)
        </label>
        <input
          id="tax-percent"
          type="number"
          min={0}
          max={100}
          step="any"
          value={taxPercent === 0 ? "" : taxPercent}
          placeholder="0"
          aria-label="Tax percentage"
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "taxPercent",
              value: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)),
            })
          }
          className="w-24 rounded-xl border border-[#c8c8c8] px-3 py-2 text-right text-sm text-[#212121] bg-white placeholder:text-[#bdbdbd] hover:border-[#a0a0a0] focus:outline-none focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all duration-150"
        />
      </div>

      {/* Tax amount display */}
      {taxAmount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-[#616161]">Tax amount</span>
          <span className="text-[#212121]">{formatCurrency(taxAmount, currency)}</span>
        </div>
      )}

      {/* Discount input */}
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="discount-amount" className="shrink-0 text-[#616161]">
          Discount ({currency.symbol})
        </label>
        <input
          id="discount-amount"
          type="number"
          min={0}
          step="any"
          value={discountAmount === 0 ? "" : discountAmount}
          placeholder="0"
          aria-label="Discount amount"
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "discountAmount",
              value: Math.max(0, parseFloat(e.target.value) || 0),
            })
          }
          className="w-24 rounded-xl border border-[#c8c8c8] px-3 py-2 text-right text-sm text-[#212121] bg-white placeholder:text-[#bdbdbd] hover:border-[#a0a0a0] focus:outline-none focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all duration-150"
        />
      </div>

      {/* Shipping fee input */}
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="shipping-fee" className="shrink-0 text-[#616161]">
          Shipping ({currency.symbol})
        </label>
        <input
          id="shipping-fee"
          type="number"
          min={0}
          step="any"
          value={shippingFee === 0 ? "" : shippingFee}
          placeholder="0"
          aria-label="Shipping fee"
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "shippingFee",
              value: Math.max(0, parseFloat(e.target.value) || 0),
            })
          }
          className="w-24 rounded-xl border border-[#c8c8c8] px-3 py-2 text-right text-sm text-[#212121] bg-white placeholder:text-[#bdbdbd] hover:border-[#a0a0a0] focus:outline-none focus:border-[#4caf50] focus:ring-4 focus:ring-[#4caf50]/10 transition-all duration-150"
        />
      </div>

      {/* Divider */}
      <hr className="border-[#e0e0e0]" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#212121] text-base">Total</span>
        <span data-testid="invoice-total" className="font-bold text-[#212121] text-base">
          {formatCurrency(total, currency)}
        </span>
      </div>
    </div>
  );
}
