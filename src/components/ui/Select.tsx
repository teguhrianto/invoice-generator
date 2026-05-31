"use client";

import React, { useId } from "react";

/** A single option entry for the Select component. */
export interface SelectOption {
  value: string;
  label: string;
}

/** Props accepted by the Select component. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Visible label rendered above the select element. */
  label: string;
  /** Array of options to render inside the <select>. */
  options: SelectOption[];
}

/**
 * Accessible labeled select / dropdown component.
 *
 * Renders a visible <label> linked via a generated htmlFor/id pair, followed
 * by a styled <select> element populated from the `options` array. Forwards
 * all standard HTML select attributes to the underlying <select>.
 */
export function Select({ label, options, className = "", id: idProp, ...rest }: SelectProps) {
  const generatedId = useId();
  const selectId = idProp ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={selectId}
        className="text-xs font-semibold uppercase tracking-wider text-[#757575]"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={[
          "rounded-xl border border-[#c8c8c8] px-4 py-2.5 text-sm text-[#212121] bg-white",
          "hover:border-[#c0c0c0]",
          "focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#4caf50]/15 focus:border-[#4caf50]",
          "transition-all duration-150 cursor-pointer",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
