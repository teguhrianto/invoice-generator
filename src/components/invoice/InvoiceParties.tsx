"use client";

import React from "react";
import { Textarea } from "@/components/ui/Textarea";
import { useInvoice } from "@/hooks/useInvoice";

/**
 * Invoice parties section.
 *
 * Renders two side-by-side textareas for the sender's company details ("Your
 * company details") and the recipient's billing address ("Bill to"). Both
 * fields dispatch SET_FIELD to InvoiceContext.
 */
export function InvoiceParties() {
  const { state, dispatch } = useInvoice();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Textarea
        label="Your company details"
        placeholder={"Company name\nAddress line 1\nCity, State, ZIP\nCountry\nVAT / Tax ID"}
        rows={5}
        value={state.fromDetails}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "fromDetails",
            value: e.target.value,
          })
        }
      />
      <Textarea
        label="Bill to"
        placeholder={"Client name\nAddress line 1\nCity, State, ZIP\nCountry"}
        rows={5}
        value={state.billTo}
        onChange={(e) =>
          dispatch({
            type: "SET_FIELD",
            field: "billTo",
            value: e.target.value,
          })
        }
      />
    </div>
  );
}
