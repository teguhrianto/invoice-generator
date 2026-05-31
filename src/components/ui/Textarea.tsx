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
      <label
        htmlFor={textareaId}
        className="text-xs font-semibold uppercase tracking-wider text-[#616161]"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={[
          "rounded-xl border px-4 py-2.5 text-sm text-[#212121] bg-white resize-y",
          "placeholder:text-[#bdbdbd]",
          "focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#4caf50]/15 focus:border-[#4caf50]",
          "transition-all duration-150",
          error
            ? "border-red-400 focus:ring-red-200 focus:border-red-500"
            : "border-[#c8c8c8] hover:border-[#c0c0c0]",
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
