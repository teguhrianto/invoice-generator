import type { Metadata } from "next";
import "./globals.css";

/**
 * Root layout for the invoice generator application.
 *
 * Defines document-level metadata including OpenGraph and Twitter card tags.
 * Wraps all page content in a minimal full-height shell div.
 */
export const metadata: Metadata = {
  title: "Invoice Generator — Free Open-Source PDF Invoice Maker",
  description:
    "Create and download professional PDF invoices for free. All data stays in your browser. No account needed.",
  openGraph: {
    title: "Invoice Generator — Free Open-Source PDF Invoice Maker",
    description:
      "Create and download professional PDF invoices for free. All data stays in your browser. No account needed.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

/** Root layout wrapping all application routes. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
