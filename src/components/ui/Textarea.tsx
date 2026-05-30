"use client";

import React, { useId } from "react";

/** Props accepted by the Textarea component. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label rendered above the textarea. */
  label: string;
  /**
   * Validation error message. When provided the border turns red and
   * the message is rendered below the field with `role="alert"`.
   */
  error?: string;
}

/**
 * Accessible labeled textarea.
 *
 * Mirrors the Input component's API and visual style but renders a
 * <textarea> element instead of <input>. Applies the same red-border
 * error state and aria-describedby pattern for screen reader support.
 *
 * Forwards all standard HTML textarea attributes to the underlying <textarea>.
 */
export function Textarea({
  label,
  error,
  className = "",
  id: idProp,
  rows = 4,
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = idProp ?? generatedId;
  const errorId = `${textareaId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={textareaId} className="text-sm font-medium text-[#212121]">
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={[
          "rounded-md border px-3 py-2 text-sm text-[#212121] bg-white resize-y",
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
