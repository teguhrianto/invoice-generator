import type { Invoice } from "@/types/invoice";

/**
 * Generates a PDF for the given invoice and triggers a browser download.
 *
 * Steps:
 * 1. Dynamically imports @react-pdf/renderer and the InvoicePDF component
 *    (ssr: false — this must only run in the browser).
 * 2. Renders the React element tree to a Blob using `pdf().toBlob()`.
 * 3. Creates a temporary object URL, clicks a programmatic <a download> link.
 * 4. Schedules revokeObjectURL cleanup after 60 seconds.
 *
 * @param invoice - The complete Invoice document to render.
 */
export async function generateAndDownloadPDF(invoice: Invoice): Promise<void> {
  // Dynamic imports to avoid SSR issues with @react-pdf/renderer
  const [renderer, { createElement }, { InvoicePDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("react"),
    import("@/components/pdf/InvoicePDF"),
  ]);

  // Cast is required because @react-pdf/renderer's `pdf()` expects a narrowly
  // typed ReactElement<DocumentProps> but InvoicePDF returns Document internally.
  // The runtime shape is correct — the cast is only needed to satisfy the type checker.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(InvoicePDF, { invoice }) as any;
  const blob = await renderer.pdf(element).toBlob();

  const objectUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  // Sanitise invoice number for use as a filename
  const safeName = invoice.invoiceNumber
    ? invoice.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "_")
    : "invoice";
  anchor.download = `invoice-${safeName}.pdf`;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Revoke after 60 s to free memory; the download starts well before then.
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 60_000);
}
