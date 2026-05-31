"use client";

import { StyleSheet } from "@react-pdf/renderer";

/**
 * Design tokens and shared styles for the PDF invoice document.
 *
 * All colours, spacing, and font sizes are defined here and imported by the
 * individual PDF sub-components so the design remains consistent and easy to
 * update from a single location.
 *
 * Fonts: Helvetica is a built-in @react-pdf/renderer font — no network
 * download is required.
 */
export const pdfStyles = StyleSheet.create({
  // ── Page ────────────────────────────────────────────────────────────────────
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#212121",
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
  },

  // ── Header ───────────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  logoImage: {
    maxWidth: 120,
    maxHeight: 60,
    objectFit: "contain",
  },
  invoiceTitle: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    letterSpacing: 1,
  },
  headerMetaBlock: {
    alignItems: "flex-end",
    gap: 4,
  },
  headerMetaRow: {
    flexDirection: "row",
    gap: 8,
  },
  headerMetaLabel: {
    fontSize: 11,
    color: "#757575",
    width: 80,
    textAlign: "right",
  },
  headerMetaValue: {
    fontSize: 11,
    color: "#212121",
    fontFamily: "Helvetica-Bold",
  },

  // ── Parties row ──────────────────────────────────────────────────────────────
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    gap: 16,
  },
  partyBlock: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 10,
    color: "#757575",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  partyValue: {
    fontSize: 12,
    color: "#212121",
    lineHeight: 1.5,
  },

  // ── Line items table ─────────────────────────────────────────────────────────
  tableWrapper: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 10,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableRowAlt: {
    backgroundColor: "#f5f5f5",
  },
  tableCell: {
    fontSize: 12,
    color: "#212121",
  },
  tableCellMuted: {
    color: "#757575",
  },

  // Column widths (must sum to 100% of available space)
  colDescription: { flex: 3 },
  colUnitCost: { flex: 1, textAlign: "right" },
  colQty: { width: 44, textAlign: "right" },
  colAmount: { width: 88, textAlign: "right" },

  // ── Bottom section ───────────────────────────────────────────────────────────
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    marginTop: 8,
  },
  bottomLeft: {
    flex: 1,
  },
  bottomRight: {
    width: 240,
  },

  // ── Notes / bank details ─────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 10,
    color: "#757575",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 11,
    color: "#212121",
    lineHeight: 1.6,
    marginBottom: 16,
  },

  // ── Summary block ────────────────────────────────────────────────────────────
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#757575",
  },
  summaryValue: {
    fontSize: 11,
    color: "#212121",
    textAlign: "right",
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  summaryTotalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    textAlign: "right",
  },
});
