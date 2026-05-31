"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { useInvoice } from "@/hooks/useInvoice";

/**
 * Invoice dates section.
 *
 * Renders Invoice date and Due date using the standard Input component
 * with type="date" so the browser's native date picker works correctly.
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
          dispatch({ type: "SET_FIELD", field: "invoiceDate", value: e.target.value })
        }
      />
      <Input
        label="Due date"
        type="date"
        value={state.dueDate}
        onChange={(e) => dispatch({ type: "SET_FIELD", field: "dueDate", value: e.target.value })}
      />
    </div>
  );
}
