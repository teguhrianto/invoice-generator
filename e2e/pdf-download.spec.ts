/**
 * pdf-download.spec.ts
 *
 * Tests the PDF download behavior triggered by "Create the invoice":
 *   - A download event fires and a .pdf file is received
 *   - The downloaded filename contains the invoice number
 */

import { test, expect } from "@playwright/test";
import { clearLocalStorage, fillMinimumInvoice } from "./fixtures/helpers";

// ---------------------------------------------------------------------------
// Shared setup: clean localStorage so the form starts blank each time
// ---------------------------------------------------------------------------

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await clearLocalStorage(page);
  await page.reload();
});

// ---------------------------------------------------------------------------
// Test: clicking "Create the invoice" triggers a PDF download
// ---------------------------------------------------------------------------

/**
 * Validates the end-to-end PDF download flow:
 * 1. The browser fires a `download` event (not a navigation).
 * 2. The downloaded file has a `.pdf` extension.
 * 3. The filename contains the invoice number supplied in the form.
 *
 * We use Playwright's `page.waitForEvent("download")` in a `Promise.all` race
 * with the button click so no timing gap exists between registering the listener
 * and triggering the download.
 */
test("clicking Create the invoice triggers a PDF download", async ({ page }) => {
  const invoiceNumber = "INV-PDF-TEST-001";

  await fillMinimumInvoice(page, invoiceNumber);

  // Race: listen for the download event at the same instant we click.
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);

  // A download object must have been received (not undefined / timed out)
  expect(download).toBeTruthy();

  const filename = download.suggestedFilename();

  // The file must carry a .pdf extension
  expect(filename).toMatch(/\.pdf$/i);

  // The filename must embed the invoice number (or a sanitised slug of it)
  // The app replaces non-alphanumeric characters with underscores for the id,
  // so we check for the numeric portion at minimum.
  expect(filename.toLowerCase()).toMatch(/^invoice-.*inv.*pdf.*test.*001.*\.pdf$/i);

  // Clean up: cancel/discard the download stream to free resources
  await download.cancel();
});
