"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { useInvoice } from "@/hooks/useInvoice";

/**
 * Invoice dates section.
 *
 * Renders two date inputs: "Invoice date" and "Due date". Both dispatch
 * SET_FIELD to InvoiceContext. Uses native <input type="date"> which requires
 * and stores "YYYY-MM-DD" format — consistent with the Invoice type.
 */
export function InvoiceDates() {
  const { state, dispatch } = useInvoice();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input
        label="Invoice date"
        type="date"
        value={state.invoiceDate}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "invoiceDate",
            value: e.target.value,
          })
        }
      />
      <Input
        label="Due date"
        type="date"
        value={state.dueDate}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "dueDate",
            value: e.target.value,
          })
        }
      />
    </div>
  );
}
