/**
 * invoice-persistence.spec.ts
 *
 * Tests the localStorage persistence layer and the /history page:
 *   - Submitting an invoice writes the index + document to localStorage
 *   - Reloading "/" pre-fills the form from the most recent saved invoice
 *   - "/history" lists saved invoices
 *   - "Load" navigates back to "/" with the invoice pre-filled
 *   - "Delete" removes the entry from the history list
 */

import { test, expect } from "@playwright/test";
import {
  clearLocalStorage,
  fillMinimumInvoice,
  readInvoiceIndex,
  readInvoiceDoc,
} from "./fixtures/helpers";

// ---------------------------------------------------------------------------
// Shared setup: always start from a clean localStorage state
// ---------------------------------------------------------------------------

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await clearLocalStorage(page);
  await page.reload();
});

// ---------------------------------------------------------------------------
// Test 1: saves invoice to localStorage on submit
// ---------------------------------------------------------------------------

/**
 * Validates that clicking "Create the invoice" persists the invoice index entry
 * and the full document to localStorage using the keys defined in constants.ts.
 */
test("saves invoice to localStorage on submit", async ({ page }) => {
  await fillMinimumInvoice(page, "INV-LS-001");

  // "Create the invoice" triggers a PDF download — accept the download so the
  // test does not stall waiting for a file chooser dialog.
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);
  // Discard the file; we only care about localStorage state here.
  await download.cancel();

  // The index must contain at least one entry
  const index = await readInvoiceIndex(page);
  expect(index.length).toBeGreaterThan(0);

  // The entry must reference invoice number INV-LS-001
  const summary = index.find((s) => s.invoiceNumber === "INV-LS-001");
  expect(summary).toBeDefined();

  // The full document must also be present under its doc key
  const doc = await readInvoiceDoc(page, summary!.id);
  expect(doc).not.toBeNull();
  expect(doc!["invoiceNumber"]).toBe("INV-LS-001");
});

// ---------------------------------------------------------------------------
// Test 2: pre-fills form from most recent invoice on reload
// ---------------------------------------------------------------------------

/**
 * Validates that after submitting an invoice and hard-reloading the page, the
 * InvoiceProvider rehydrates the form with the most recently saved invoice.
 */
test("pre-fills form from most recent invoice on reload", async ({ page }) => {
  await fillMinimumInvoice(page, "INV-TEST-42");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);
  await download.cancel();

  // Hard reload — the InvoiceProvider useEffect will call getMostRecentInvoice()
  await page.reload();

  // The invoice number field should be pre-populated with our value
  await expect(page.getByLabel("Invoice number")).toHaveValue("INV-TEST-42");
});

// ---------------------------------------------------------------------------
// Test 3: history page lists saved invoices
// ---------------------------------------------------------------------------

/**
 * Validates that after submitting an invoice from "/", navigating to "/history"
 * shows at least one card containing the submitted invoice number.
 */
test("history page lists saved invoices", async ({ page }) => {
  await fillMinimumInvoice(page, "INV-HISTORY-SHOW");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);
  await download.cancel();

  // Go to the history page
  await page.goto("/history");

  // At least one history card must be visible
  const cards = page.locator('[data-testid="history-card"]');
  await expect(cards.first()).toBeVisible();

  // One of those cards must mention our invoice number
  await expect(page.getByText("INV-HISTORY-SHOW")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 4: load invoice from history
// ---------------------------------------------------------------------------

/**
 * Validates that clicking "Load" on a history card navigates back to "/" and
 * pre-populates the form with that invoice's data.
 */
test("load invoice from history", async ({ page }) => {
  await fillMinimumInvoice(page, "INV-LOAD-TEST");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);
  await download.cancel();

  await page.goto("/history");

  // Find the card containing our invoice number and click its Load button
  const targetCard = page
    .locator('[data-testid="history-card"]')
    .filter({ hasText: "INV-LOAD-TEST" });
  await expect(targetCard).toBeVisible();

  await targetCard.getByRole("button", { name: /load/i }).click();

  // Should now be on "/" with the invoice pre-filled
  await expect(page).toHaveURL("/");
  await expect(page.getByLabel("Invoice number")).toHaveValue("INV-LOAD-TEST");
});

// ---------------------------------------------------------------------------
// Test 5: delete invoice from history
// ---------------------------------------------------------------------------

/**
 * Validates that clicking "Delete" on a history card removes that entry from
 * the list without affecting other items.
 */
test("delete invoice from history", async ({ page }) => {
  await fillMinimumInvoice(page, "INV-DELETE-TEST");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);
  await download.cancel();

  await page.goto("/history");

  // Count total history items before deletion
  const cards = page.locator('[data-testid="history-card"]');
  const initialCount = await cards.count();
  expect(initialCount).toBeGreaterThan(0);

  // Find and delete the target card
  const targetCard = cards.filter({ hasText: "INV-DELETE-TEST" });
  await expect(targetCard).toBeVisible();
  await targetCard.getByRole("button", { name: /delete/i }).click();

  // The deleted item must no longer appear in the list
  await expect(page.getByText("INV-DELETE-TEST")).not.toBeVisible();

  // Total count should have decreased by one
  await expect(cards).toHaveCount(initialCount - 1);
});

// ---------------------------------------------------------------------------
// Test 6: load older invoice from history when multiple invoices exist
// ---------------------------------------------------------------------------

/**
 * Validates C-1: when two invoices exist, clicking "Load" on the older one
 * populates the form with that invoice — not the most recently created one.
 * This test would fail before the setActiveInvoiceId fix.
 */
test("loads correct invoice from history when multiple invoices exist", async ({ page }) => {
  // Create first (older) invoice
  await fillMinimumInvoice(page, "INV-OLDER");
  const [dl1] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);
  await dl1.cancel();

  // Reset form and create second (newer) invoice
  await page.reload();
  await fillMinimumInvoice(page, "INV-NEWER");
  const [dl2] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);
  await dl2.cancel();

  // Go to history — both cards should be present
  await page.goto("/history");
  const olderCard = page.locator('[data-testid="history-card"]').filter({ hasText: "INV-OLDER" });
  await expect(olderCard).toBeVisible();

  // Load the older invoice
  await olderCard.getByRole("button", { name: /load/i }).click();

  // Must land on "/" showing the older invoice, not the newer one
  await expect(page).toHaveURL("/");
  await expect(page.getByLabel("Invoice number")).toHaveValue("INV-OLDER");
});
