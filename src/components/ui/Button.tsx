"use client";

import React from "react";

/** Visual style variants for the Button component. */
type ButtonVariant = "primary" | "secondary" | "danger";

/** Props accepted by the Button component. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant controlling colour scheme.
   * Defaults to "primary" (green background, white text).
   */
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#b5f23d] hover:bg-[#a3d935] active:bg-[#91c42e] text-[#163016] font-bold focus-visible:ring-[#b5f23d]",
  secondary:
    "bg-white hover:bg-gray-50 text-[#212121] border border-[#e0e0e0] focus-visible:ring-gray-400",
  danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500",
};

/**
 * Reusable button component with three visual variants.
 *
 * - "primary": green background (#4caf50), white text, full-width by default.
 * - "secondary": white background, border, dark text.
 * - "danger": red background, white text.
 *
 * Forwards all standard HTML button attributes to the underlying <button>.
 */
export function Button({
  variant = "primary",
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={[
        "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variantClasses[variant],
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
