import { type Page } from "@playwright/test";
import path from "path";
import fs from "fs";
import os from "os";

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

/**
 * Clears all localStorage entries in the current browser context.
 * Call this in `test.beforeEach` to guarantee test isolation.
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

// ---------------------------------------------------------------------------
// Temporary file helpers
// ---------------------------------------------------------------------------

/**
 * Writes `content` (a Buffer) to a temp file with the given `filename` and
 * returns the absolute path. Caller is responsible for cleanup.
 */
export function writeTempFile(filename: string, content: Buffer): string {
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

/**
 * Removes a file created by `writeTempFile`. Safe to call even if the file
 * has already been deleted.
 */
export function removeTempFile(filePath: string): void {
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore — file already gone
  }
}

// ---------------------------------------------------------------------------
// Minimal valid PNG (1×1 pixel, ~67 bytes) as a Buffer
// ---------------------------------------------------------------------------

/**
 * Returns a Buffer containing the bytes of a valid 1×1 transparent PNG.
 * Use this to create test logo uploads that will pass the browser's image
 * validation without requiring an external fixture file.
 */
export function minimalPngBuffer(): Buffer {
  // Standard 1×1 transparent PNG in base64.
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  return Buffer.from(base64, "base64");
}

// ---------------------------------------------------------------------------
// Form-filling helpers
// ---------------------------------------------------------------------------

/**
 * Fills the minimum set of invoice fields needed to make the "Create the
 * invoice" button work: invoice number + one line item.
 *
 * @param invoiceNumber - The invoice number string to enter (e.g. "INV-001").
 */
export async function fillMinimumInvoice(page: Page, invoiceNumber: string): Promise<void> {
  // Invoice number
  await page.getByLabel("Invoice number").fill(invoiceNumber);

  // Add one line item
  await page.getByRole("button", { name: /add item/i }).click();

  // Fill the first (and only) row's description and unit cost
  const rows = page.locator('[data-testid="line-item-row"]');
  await rows
    .first()
    .getByLabel(/description/i)
    .fill("Test Service");
  await rows
    .first()
    .getByLabel(/unit cost/i)
    .fill("100");
  await rows
    .first()
    .getByLabel(/quantity/i)
    .fill("1");
}

// ---------------------------------------------------------------------------
// localStorage inspection helpers
// ---------------------------------------------------------------------------

/**
 * Reads and JSON-parses the invoice history index from localStorage.
 * Returns an empty array when the key is absent.
 */
export async function readInvoiceIndex(
  page: Page,
): Promise<Array<{ id: string; invoiceNumber: string; [key: string]: unknown }>> {
  return page.evaluate(() => {
    const raw = localStorage.getItem("invoice_generator_index");
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
}

/**
 * Reads the full invoice document for a given `id` from localStorage.
 * Returns `null` when the key is absent.
 */
export async function readInvoiceDoc(
  page: Page,
  id: string,
): Promise<Record<string, unknown> | null> {
  return page.evaluate((docId) => {
    const raw = localStorage.getItem(`invoice_generator_doc_${docId}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, id);
}
