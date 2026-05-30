"use client";

import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import type { Invoice } from "@/types/invoice";
import { formatDate } from "@/lib/formatters";
import { pdfStyles } from "@/components/pdf/PDFStyles";
import { PDFLineItemsTable } from "@/components/pdf/PDFLineItemsTable";
import { PDFSummaryBlock } from "@/components/pdf/PDFSummaryBlock";

/** Props accepted by the InvoicePDF component. */
export interface InvoicePDFProps {
  /** The complete invoice data to render as a PDF document. */
  invoice: Invoice;
}

/**
 * Root @react-pdf/renderer document for a single invoice.
 *
 * Assembles:
 * 1. Header row — "Invoice" title (left) + logo (right) + invoice metadata
 * 2. Parties row — Bill to / From / Purchase order
 * 3. Line items table
 * 4. Bottom row — notes + bank details (left) | summary totals (right)
 *
 * All layout uses @react-pdf View/Text/Image primitives with styles from PDFStyles.
 */
export function InvoicePDF({ invoice }: InvoicePDFProps) {
  const {
    invoiceNumber,
    purchaseOrder,
    logoDataUrl,
    fromDetails,
    billTo,
    invoiceDate,
    dueDate,
    currency,
    lineItems,
    taxPercent,
    taxAmount,
    discountAmount,
    shippingFee,
    subtotal,
    total,
    notes,
    bankDetails,
  } = invoice;

  return (
    <Document
      title={`Invoice ${invoiceNumber}`}
      author={fromDetails.split("\n")[0] ?? ""}
      subject={`Invoice for ${billTo.split("\n")[0] ?? ""}`}
    >
      <Page size="A4" style={pdfStyles.page}>
        {/* ── 1. Header row ─────────────────────────────────────────────────── */}
        <View style={pdfStyles.headerRow}>
          {/* Left: title + logo stacked */}
          <View>
            <Text style={pdfStyles.invoiceTitle}>Invoice</Text>
            {logoDataUrl && <Image src={logoDataUrl} style={pdfStyles.logoImage} />}
          </View>

          {/* Right: invoice metadata */}
          <View style={pdfStyles.headerMetaBlock}>
            {invoiceNumber ? (
              <View style={pdfStyles.headerMetaRow}>
                <Text style={pdfStyles.headerMetaLabel}>Invoice #</Text>
                <Text style={pdfStyles.headerMetaValue}>{invoiceNumber}</Text>
              </View>
            ) : null}
            {invoiceDate ? (
              <View style={pdfStyles.headerMetaRow}>
                <Text style={pdfStyles.headerMetaLabel}>Date of issue</Text>
                <Text style={pdfStyles.headerMetaValue}>{formatDate(invoiceDate)}</Text>
              </View>
            ) : null}
            {dueDate ? (
              <View style={pdfStyles.headerMetaRow}>
                <Text style={pdfStyles.headerMetaLabel}>Due date</Text>
                <Text style={pdfStyles.headerMetaValue}>{formatDate(dueDate)}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ── 2. Parties row ────────────────────────────────────────────────── */}
        <View style={pdfStyles.partiesRow}>
          {/* Billed to */}
          <View style={pdfStyles.partyBlock}>
            <Text style={pdfStyles.partyLabel}>Billed to</Text>
            <Text style={pdfStyles.partyValue}>{billTo || "—"}</Text>
          </View>

          {/* From */}
          <View style={pdfStyles.partyBlock}>
            <Text style={pdfStyles.partyLabel}>From</Text>
            <Text style={pdfStyles.partyValue}>{fromDetails || "—"}</Text>
          </View>

          {/* Purchase order */}
          {purchaseOrder ? (
            <View style={pdfStyles.partyBlock}>
              <Text style={pdfStyles.partyLabel}>Purchase order</Text>
              <Text style={pdfStyles.partyValue}>{purchaseOrder}</Text>
            </View>
          ) : null}
        </View>

        {/* ── 3. Line items table ───────────────────────────────────────────── */}
        <PDFLineItemsTable items={lineItems} currency={currency} />

        {/* ── 4. Bottom row: notes + bank details | summary ─────────────────── */}
        <View style={pdfStyles.bottomRow}>
          {/* Left column */}
          <View style={pdfStyles.bottomLeft}>
            {notes ? (
              <>
                <Text style={pdfStyles.sectionLabel}>Notes / Payment terms</Text>
                <Text style={pdfStyles.sectionValue}>{notes}</Text>
              </>
            ) : null}
            {bankDetails ? (
              <>
                <Text style={pdfStyles.sectionLabel}>Bank account details</Text>
                <Text style={pdfStyles.sectionValue}>{bankDetails}</Text>
              </>
            ) : null}
          </View>

          {/* Right column: summary */}
          <View style={pdfStyles.bottomRight}>
            <PDFSummaryBlock
              subtotal={subtotal}
              taxPercent={taxPercent}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              shippingFee={shippingFee}
              total={total}
              currency={currency}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
