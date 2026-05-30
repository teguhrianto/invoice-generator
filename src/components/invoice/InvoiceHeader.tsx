"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { LogoUpload } from "@/components/ui/LogoUpload";
import { useInvoice } from "@/hooks/useInvoice";

/**
 * Invoice header section.
 *
 * Renders the invoice number input, purchase order input, and the logo upload
 * control side-by-side. Reads from and dispatches to InvoiceContext via the
 * useInvoice() hook.
 *
 * - Invoice number → SET_FIELD invoiceNumber
 * - Purchase order → SET_FIELD purchaseOrder
 * - Logo           → SET_LOGO
 */
export function InvoiceHeader() {
  const { state, dispatch } = useInvoice();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left: invoice number + PO */}
      <div className="flex flex-col gap-4 flex-1 max-w-sm">
        <Input
          label="Invoice number"
          placeholder="INV-001"
          value={state.invoiceNumber}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "invoiceNumber",
              value: e.target.value,
            })
          }
        />
        <Input
          label="Purchase order"
          placeholder="PO-0001"
          value={state.purchaseOrder}
          onChange={(e) =>
            dispatch({
              type: "SET_FIELD",
              field: "purchaseOrder",
              value: e.target.value,
            })
          }
        />
      </div>

      {/* Right: logo */}
      <div className="w-full sm:w-56">
        <LogoUpload
          value={state.logoDataUrl}
          onChange={(dataUrl) => dispatch({ type: "SET_LOGO", dataUrl })}
        />
      </div>
    </div>
  );
}
