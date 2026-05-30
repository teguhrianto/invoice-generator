import { InvoiceForm } from "@/components/invoice/InvoiceForm";

/**
 * Root page route — renders the full invoice creation form.
 *
 * InvoiceForm contains its own InvoiceProvider, so no additional context
 * wrapping is required at this level.
 */
export default function HomePage() {
  return <InvoiceForm />;
}
