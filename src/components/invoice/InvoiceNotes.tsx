"use client";

import React from "react";
import { Textarea } from "@/components/ui/Textarea";
import { useInvoice } from "@/hooks/useInvoice";

/**
 * Notes and bank details section.
 *
 * Renders two textareas: one for payment terms / notes and one for bank account
 * details, both displayed in a two-column layout on wider screens. Both fields
 * dispatch SET_FIELD to InvoiceContext.
 */
export function InvoiceNotes() {
  const { state, dispatch } = useInvoice();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Textarea
        label="Notes / Payment terms"
        placeholder="e.g. Payment is due within 15 days"
        rows={4}
        value={state.notes}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "notes",
            value: e.target.value,
          })
        }
      />
      <Textarea
        label="Bank account details"
        placeholder={"Bank name\nAccount name\nAccount number\nRouting / SWIFT / IBAN"}
        rows={4}
        value={state.bankDetails}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "bankDetails",
            value: e.target.value,
          })
        }
      />
    </div>
  );
}
