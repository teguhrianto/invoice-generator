import Link from "next/link";

/**
 * Global site header.
 *
 * Sticky dark forest-green bar. Left: InvoiceGen wordmark in neon lime using
 * the Bebas Neue display font. Right: "View history" ghost button.
 * Server Component — no client-side state required.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#163016] border-b border-[#1e401e]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="InvoiceGen — home"
          className="text-2xl tracking-wide text-[#b5f23d] hover:text-white transition-colors duration-150"
          style={{ fontFamily: "var(--font-display)" }}
        >
          InvoiceGen
        </Link>

        {/* Navigation */}
        <nav aria-label="Site navigation">
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#b5f23d]/40 px-3 py-1.5 text-sm font-medium text-[#b5f23d] hover:bg-[#b5f23d]/10 transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View history
          </Link>
        </nav>
      </div>
    </header>
  );
}
