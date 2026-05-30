"use client";

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import type { Currency } from "@/types/invoice";
import { formatCurrency } from "@/lib/formatters";
import { pdfStyles } from "@/components/pdf/PDFStyles";

/** Props accepted by the PDFSummaryBlock component. */
export interface PDFSummaryBlockProps {
  /** Sum of all line item amounts before adjustments. */
  subtotal: number;
  /** Tax percentage applied to the subtotal (0–100). */
  taxPercent: number;
  /** Derived tax amount: subtotal × taxPercent / 100. */
  taxAmount: number;
  /** Flat discount subtracted from the total. */
  discountAmount: number;
  /** Shipping fee added to the total. */
  shippingFee: number;
  /** Final total after all adjustments. */
  total: number;
  /** Currency used for formatting all monetary values. */
  currency: Currency;
}

/**
 * Summary totals block for the PDF invoice.
 *
 * Renders Subtotal, Discount, Tax rate, Tax amount, Shipping, and Total rows.
 * Rows with zero values (except Subtotal and Total) are omitted to keep the
 * PDF clean. All values are formatted using formatCurrency.
 */
export function PDFSummaryBlock({
  subtotal,
  taxPercent,
  taxAmount,
  discountAmount,
  shippingFee,
  total,
  currency,
}: PDFSummaryBlockProps) {
  return (
    <View>
      {/* Subtotal */}
      <View style={pdfStyles.summaryRow}>
        <Text style={pdfStyles.summaryLabel}>Subtotal</Text>
        <Text style={pdfStyles.summaryValue}>{formatCurrency(subtotal, currency)}</Text>
      </View>

      {/* Discount (only when non-zero) — shown before tax since tax is on post-discount amount */}
      {discountAmount > 0 && (
        <View style={pdfStyles.summaryRow}>
          <Text style={pdfStyles.summaryLabel}>Discount</Text>
          <Text style={pdfStyles.summaryValue}>-{formatCurrency(discountAmount, currency)}</Text>
        </View>
      )}

      {/* Tax rate (only when non-zero) */}
      {taxPercent > 0 && (
        <View style={pdfStyles.summaryRow}>
          <Text style={pdfStyles.summaryLabel}>Tax rate</Text>
          <Text style={pdfStyles.summaryValue}>{taxPercent}%</Text>
        </View>
      )}

      {/* Tax amount (only when non-zero) */}
      {taxAmount > 0 && (
        <View style={pdfStyles.summaryRow}>
          <Text style={pdfStyles.summaryLabel}>Tax</Text>
          <Text style={pdfStyles.summaryValue}>{formatCurrency(taxAmount, currency)}</Text>
        </View>
      )}

      {/* Shipping (only when non-zero) */}
      {shippingFee > 0 && (
        <View style={pdfStyles.summaryRow}>
          <Text style={pdfStyles.summaryLabel}>Shipping</Text>
          <Text style={pdfStyles.summaryValue}>{formatCurrency(shippingFee, currency)}</Text>
        </View>
      )}

      {/* Total */}
      <View style={pdfStyles.summaryTotalRow}>
        <Text style={pdfStyles.summaryTotalLabel}>Total</Text>
        <Text style={pdfStyles.summaryTotalValue}>{formatCurrency(total, currency)}</Text>
      </View>
    </View>
  );
}
