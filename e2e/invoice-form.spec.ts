/**
 * invoice-form.spec.ts
 *
 * Tests the main invoice form at "/" covering:
 *   - Full field population and computed amounts
 *   - Line item add/remove lifecycle
 *   - Line item reorder via the ↑ control
 *   - Logo upload size rejection (>200 KB)
 *   - Logo upload acceptance for a valid small PNG
 */

import { test, expect } from "@playwright/test";
import {
  clearLocalStorage,
  minimalPngBuffer,
  writeTempFile,
  removeTempFile,
} from "./fixtures/helpers";

// ---------------------------------------------------------------------------
// Shared setup: clear localStorage before every test so the form starts blank
// ---------------------------------------------------------------------------

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await clearLocalStorage(page);
  // Reload so the provider re-hydrates from the (now empty) localStorage.
  await page.reload();
});

// ---------------------------------------------------------------------------
// Test 1: fills in all invoice fields
// ---------------------------------------------------------------------------

/**
 * Validates that every visible form field accepts input, that the Amount column
 * auto-computes (unitCost × quantity), and that adjusting Tax % causes the
 * subtotal and grand total to update accordingly.
 */
test("fills in all invoice fields", async ({ page }) => {
  // --- Invoice header ---
  await page.getByLabel("Invoice number").fill("INV-2024-001");
  await page.getByLabel("Purchase order").fill("PO-9999");

  // --- Company details ---
  await page
    .getByLabel("Your company details")
    .fill("Acme Corp\n123 Main Street\nNew York, NY 10001");

  // --- Bill to ---
  await page.getByLabel("Bill to").fill("Client Inc\n456 Elm Avenue\nSan Francisco, CA 94102");

  // --- Dates ---
  await page.getByLabel("Invoice date").fill("2024-06-01");
  await page.getByLabel("Due date").fill("2024-06-15");

  // --- Line items: add 2 rows ---
  await page.getByRole("button", { name: /add item/i }).click();
  await page.getByRole("button", { name: /add item/i }).click();

  const rows = page.locator('[data-testid="line-item-row"]');
  await expect(rows).toHaveCount(2);

  // Fill row 1
  await rows
    .nth(0)
    .getByLabel(/description/i)
    .fill("Web Design");
  await rows
    .nth(0)
    .getByLabel(/unit cost/i)
    .fill("500");
  await rows
    .nth(0)
    .getByLabel(/quantity/i)
    .fill("2");

  // Fill row 2
  await rows
    .nth(1)
    .getByLabel(/description/i)
    .fill("Hosting");
  await rows
    .nth(1)
    .getByLabel(/unit cost/i)
    .fill("50");
  await rows
    .nth(1)
    .getByLabel(/quantity/i)
    .fill("12");

  // Amount column should auto-calculate: 500×2=1000, 50×12=600
  await expect(rows.nth(0).getByTestId("line-item-amount")).toHaveText(/1[,.]?000/);
  await expect(rows.nth(1).getByTestId("line-item-amount")).toHaveText(/600/);

  // --- Notes and bank details ---
  await page.getByLabel("Notes").fill("Net 15. Thank you for your business.");
  await page.getByLabel("Bank account details").fill("Bank: ACME Bank\nAccount: 123456789");

  // --- Tax: set to 10% and verify totals update ---
  // Subtotal before tax: 1000 + 600 = 1600
  await page.getByLabel(/tax/i).fill("10");

  // After 10% tax the total should reflect 1600 + 160 = 1760
  // We check the total area is non-zero (exact format varies by currency locale)
  await expect(page.getByTestId("invoice-total")).toContainText(/1[,.]?760/);

  // --- The submit button must be visible ---
  await expect(page.getByRole("button", { name: /create the invoice/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Test 6: success banner appears after PDF generation
// ---------------------------------------------------------------------------

/**
 * Validates that after clicking "Create the invoice" the success status banner
 * appears with the expected confirmation message.
 */
test("shows success banner after PDF generation", async ({ page }) => {
  await page.getByRole("button", { name: /add item/i }).click();
  const rows = page.locator('[data-testid="line-item-row"]');
  await rows
    .nth(0)
    .getByLabel(/description/i)
    .fill("Service");
  await rows
    .nth(0)
    .getByLabel(/unit cost/i)
    .fill("100");
  await rows
    .nth(0)
    .getByLabel(/quantity/i)
    .fill("1");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /create the invoice/i }).click(),
  ]);
  await download.cancel();

  await expect(page.getByRole("status")).toContainText(/invoice saved/i);
});

// ---------------------------------------------------------------------------
// Test 2: adds and removes line items
// ---------------------------------------------------------------------------

/**
 * Validates the line-item add/remove flow: clicking "Add item" twice produces
 * two rows; deleting the second row leaves exactly one row.
 */
test("adds and removes line items", async ({ page }) => {
  // Add two empty rows
  await page.getByRole("button", { name: /add item/i }).click();
  await page.getByRole("button", { name: /add item/i }).click();

  const rows = page.locator('[data-testid="line-item-row"]');
  await expect(rows).toHaveCount(2);

  // Fill the first row so we have something to distinguish it
  await rows
    .nth(0)
    .getByLabel(/description/i)
    .fill("Keep this row");

  // Delete the second row using its remove button
  await rows
    .nth(1)
    .getByRole("button", { name: /remove/i })
    .click();

  // Only one row should remain and it should be the one we filled
  await expect(rows).toHaveCount(1);
  await expect(rows.nth(0).getByLabel(/description/i)).toHaveValue("Keep this row");
});

// ---------------------------------------------------------------------------
// Test 3: reorder line items
// ---------------------------------------------------------------------------

/**
 * Validates that clicking the move-up (↑) button on the second line item
 * swaps it with the first item, reversing their display order.
 */
test("reorder line items", async ({ page }) => {
  // Add two rows with distinct descriptions
  await page.getByRole("button", { name: /add item/i }).click();
  await page.getByRole("button", { name: /add item/i }).click();

  const rows = page.locator('[data-testid="line-item-row"]');

  await rows
    .nth(0)
    .getByLabel(/description/i)
    .fill("First Item");
  await rows
    .nth(1)
    .getByLabel(/description/i)
    .fill("Second Item");

  // Move the second row up — it should now be in position 0
  await rows
    .nth(1)
    .getByRole("button", { name: /move up/i })
    .click();

  // The order should be swapped
  await expect(rows.nth(0).getByLabel(/description/i)).toHaveValue("Second Item");
  await expect(rows.nth(1).getByLabel(/description/i)).toHaveValue("First Item");
});

// ---------------------------------------------------------------------------
// Test 4: logo upload rejects files over 200 KB
// ---------------------------------------------------------------------------

/**
 * Validates that the logo upload component rejects a file larger than
 * MAX_LOGO_SIZE_BYTES (200 KB) and displays an error message to the user.
 */
test("logo upload rejects files over 200 KB", async ({ page }) => {
  // Create a fake file that exceeds the 200 KB limit (201 KB of zeros)
  const oversizedBuffer = Buffer.alloc(201 * 1024, 0);
  const tempPath = writeTempFile("oversized-logo.png", oversizedBuffer);

  try {
    // The file input is visually hidden; set files directly on the input element
    const fileInput = page.locator('input[type="file"][accept*="image"]');
    await fileInput.setInputFiles({
      name: "oversized-logo.png",
      mimeType: "image/png",
      buffer: oversizedBuffer,
    });

    // The error message should appear
    await expect(page.getByRole("alert")).toContainText(/200 KB/i);

    // No preview image should appear after a rejected upload
    await expect(page.locator('img[alt="Invoice logo preview"]')).not.toBeVisible();
  } finally {
    removeTempFile(tempPath);
  }
});

// ---------------------------------------------------------------------------
// Test 5: logo upload accepts a valid small PNG
// ---------------------------------------------------------------------------

/**
 * Validates that uploading a valid, small PNG file results in a logo preview
 * image being rendered with a data: URL src (the compressed base64 output).
 */
test("logo upload accepts valid file", async ({ page }) => {
  const validPng = minimalPngBuffer();
  const tempPath = writeTempFile("valid-logo.png", validPng);

  try {
    const fileInput = page.locator('input[type="file"][accept*="image"]');
    await fileInput.setInputFiles({
      name: "valid-logo.png",
      mimeType: "image/png",
      buffer: validPng,
    });

    // After a successful upload the component renders a preview <img>
    const preview = page.locator('img[alt="Invoice logo preview"]');
    await expect(preview).toBeVisible();

    // The src must be a base64 data URL produced by the canvas compression step
    const src = await preview.getAttribute("src");
    expect(src).toMatch(/^data:/);
  } finally {
    removeTempFile(tempPath);
  }
});
