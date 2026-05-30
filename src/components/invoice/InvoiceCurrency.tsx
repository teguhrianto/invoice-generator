"use client";

import React from "react";
import { Select } from "@/components/ui/Select";
import { CURRENCIES } from "@/lib/constants";
import { useInvoice } from "@/hooks/useInvoice";

/** Flag emoji map for the major supported currency codes. */
const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  IDR: "🇮🇩",
  SGD: "🇸🇬",
  AUD: "🇦🇺",
  JPY: "🇯🇵",
  CAD: "🇨🇦",
  CHF: "🇨🇭",
  MYR: "🇲🇾",
};

/** Builds select options from the CURRENCIES constant, prepending a flag emoji. */
const currencyOptions = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${CURRENCY_FLAGS[c.code] ?? ""} ${c.label} (${c.symbol})`,
}));

/**
 * Currency dropdown section.
 *
 * Renders a Select component populated from the CURRENCIES constant. On change
 * dispatches SET_CURRENCY with the full Currency object matching the selected code.
 */
export function InvoiceCurrency() {
  const { state, dispatch } = useInvoice();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = CURRENCIES.find((c) => c.code === e.target.value);
    if (selected) {
      dispatch({ type: "SET_CURRENCY", currency: selected });
    }
  }

  return (
    <div className="max-w-xs">
      <Select
        label="Currency"
        options={currencyOptions}
        value={state.currency.code}
        onChange={handleChange}
      />
    </div>
  );
}
