"use client";

import React from "react";
import { View, Text } from "@react-pdf/renderer";
import type { LineItem, Currency } from "@/types/invoice";
import { formatCurrency } from "@/lib/formatters";
import { pdfStyles } from "@/components/pdf/PDFStyles";

/** Props accepted by the PDFLineItemsTable component. */
export interface PDFLineItemsTableProps {
  /** Array of line items to render as table rows. */
  items: LineItem[];
  /** Active currency used to format unit cost and amount columns. */
  currency: Currency;
}

/**
 * Line items table for the PDF invoice.
 *
 * Renders a styled header row followed by one row per line item. Even rows
 * receive a light grey background for readability. All @react-pdf/renderer
 * primitives are used — no HTML or Tailwind.
 */
export function PDFLineItemsTable({ items, currency }: PDFLineItemsTableProps) {
  return (
    <View style={pdfStyles.tableWrapper}>
      {/* Header */}
      <View style={pdfStyles.tableHeader}>
        <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colDescription]}>Description</Text>
        <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colUnitCost]}>Unit cost</Text>
        <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colQty]}>QTY</Text>
        <Text style={[pdfStyles.tableHeaderCell, pdfStyles.colAmount]}>Amount</Text>
      </View>

      {/* Rows */}
      {items.map((item, index) => (
        <View
          key={item.id}
          style={[pdfStyles.tableRow, index % 2 !== 0 ? pdfStyles.tableRowAlt : {}]}
        >
          <Text style={[pdfStyles.tableCell, pdfStyles.colDescription]}>
            {item.description || "—"}
          </Text>
          <Text style={[pdfStyles.tableCell, pdfStyles.colUnitCost]}>
            {formatCurrency(item.unitCost, currency)}
          </Text>
          <Text style={[pdfStyles.tableCell, pdfStyles.colQty]}>{item.quantity}</Text>
          <Text style={[pdfStyles.tableCell, pdfStyles.colAmount]}>
            {formatCurrency(item.amount, currency)}
          </Text>
        </View>
      ))}
    </View>
  );
}
