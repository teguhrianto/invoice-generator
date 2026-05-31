import Link from "next/link";

/** GitHub repository URL. */
const GITHUB_URL = "https://github.com/teguhrianto/invoice-generator";

/**
 * Global site footer.
 *
 * Dark forest-green background with three columns: brand/tagline,
 * navigation links, and license information. Server Component.
 */
export function Footer() {
  return (
    <footer className="bg-[#163016] border-t border-[#1e401e]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span
              className="text-2xl text-[#b5f23d] tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              InvoiceGen
            </span>
            <p className="text-sm text-white/70 leading-relaxed">
              Free invoice generator.
              <br />
              No account needed.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
              Navigation
            </span>
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-[#b5f23d] transition-colors duration-150"
            >
              Home
            </Link>
            <Link
              href="/history"
              className="text-sm text-white/70 hover:text-[#b5f23d] transition-colors duration-150"
            >
              History
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 hover:text-[#b5f23d] transition-colors duration-150"
            >
              GitHub
            </a>
          </nav>

          {/* License */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
              License
            </span>
            <p className="text-sm text-white/70">MIT License · Open Source</p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#b5f23d] hover:underline underline-offset-2"
            >
              View on GitHub →
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-[#1e401e] pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} InvoiceGen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
