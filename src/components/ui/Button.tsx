"use client";

import React from "react";

/** Visual style variants for the Button component. */
type ButtonVariant = "primary" | "secondary" | "danger";

/** Size variants for the Button component. */
type ButtonSize = "sm" | "md" | "lg";

/** Props accepted by the Button component. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant controlling colour scheme. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Size controlling padding and font size. Defaults to "lg". */
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#b5f23d] hover:bg-[#a3d935] active:bg-[#91c42e] text-[#163016] font-bold focus-visible:ring-[#b5f23d]",
  secondary:
    "bg-white hover:bg-gray-50 text-[#212121] border border-[#e0e0e0] focus-visible:ring-gray-400",
  danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-3 text-sm",
};

/**
 * Reusable button component with three visual variants and three sizes.
 *
 * - variant "primary": neon-lime background, dark text, full-width by default.
 * - variant "secondary": white background, border, dark text.
 * - variant "danger": red background, white text.
 * - size "sm": compact, suits inline/list actions.
 * - size "md": standard action button.
 * - size "lg" (default): prominent call-to-action.
 */
export function Button({
  variant = "primary",
  size = "lg",
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
        "w-full rounded-xl font-semibold transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        sizeClasses[size],
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
