import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Root layout for the invoice generator application.
 *
 * Bebas Neue is loaded via Google Fonts CSS @import in globals.css to avoid
 * build-time network dependencies. Wraps every route with Header and Footer.
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

/** Root layout wrapping all application routes with global Header and Footer. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
