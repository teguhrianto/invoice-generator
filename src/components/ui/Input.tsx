"use client";

import React, { useId } from "react";

/** Props accepted by the Input component. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label rendered above the input field. */
  label: string;
  /**
   * Validation error message. When provided the input border turns red
   * and the message is rendered below the field.
   */
  error?: string;
}

/**
 * Accessible labeled text input.
 *
 * Renders a visible label above the <input> element linked via a generated
 * `htmlFor`/`id` pair. When an `error` string is passed the border turns red,
 * an ARIA `aria-describedby` attribute points at the error paragraph, and the
 * error text is rendered below the input with `role="alert"` so screen readers
 * announce it immediately.
 *
 * Forwards all standard HTML input attributes to the underlying <input>.
 */
export function Input({ label, error, className = "", id: idProp, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-[#212121]">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={[
          "rounded-md border px-3 py-2 text-sm text-[#212121] bg-white",
          "placeholder:text-[#757575]",
          "focus:outline-none focus:ring-2 focus:ring-[#4caf50] focus:ring-offset-1",
          "transition-colors duration-150",
          error ? "border-red-500 focus:ring-red-500" : "border-[#e0e0e0] hover:border-[#bdbdbd]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
