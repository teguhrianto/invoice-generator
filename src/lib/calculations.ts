import type { LineItem } from "@/types/invoice";

/**
 * Calculates the subtotal by summing the `amount` of every line item.
 * Returns 0 when the array is empty.
 */
/** Rounds a monetary value to 2 decimal places to avoid floating-point drift. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateSubtotal(lineItems: LineItem[]): number {
  return round2(lineItems.reduce((acc, item) => acc + item.amount, 0));
}

/**
 * Calculates the tax amount from a taxable base and a tax percentage.
 * `taxableBase` should already have any discount deducted.
 * `taxPercent` is expected in the range 0–100 (e.g. 10 means 10%).
 */
export function calculateTax(taxableBase: number, taxPercent: number): number {
  return round2((taxableBase * taxPercent) / 100);
}

/**
 * Calculates the invoice total from its components.
 * Formula: subtotal - discountAmount + taxAmount + shippingFee
 * Result is clamped to 0 to prevent negative totals.
 */
export function calculateTotal(
  subtotal: number,
  taxAmount: number,
  discountAmount: number,
  shippingFee: number,
): number {
  return round2(Math.max(0, subtotal - discountAmount + taxAmount + shippingFee));
}

/**
 * Recomputes the `amount` field of a line item from its `unitCost` and `quantity`.
 * Accepts a line item without `amount` and returns a complete LineItem.
 */
export function recalculateLineItem(item: Omit<LineItem, "amount">): LineItem {
  return {
    ...item,
    amount: round2(item.unitCost * item.quantity),
  };
}
