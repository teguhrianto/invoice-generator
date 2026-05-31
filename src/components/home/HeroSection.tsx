/**
 * Hero section for the home page.
 *
 * Full-width dark forest-green panel with the display heading and subtitle.
 * The InvoiceForm white card is rendered directly below by page.tsx inside
 * the same dark-background section. Server Component.
 */
export function HeroSection() {
  return (
    <section
      aria-label="Page hero"
      className="bg-[#163016] px-4 pt-14 pb-8 sm:pt-20 sm:pb-10 text-center"
    >
      <div className="mx-auto max-w-4xl">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl leading-none tracking-wide text-[#b5f23d] uppercase mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Free Invoice Generator
        </h1>
        <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
          Create professional PDF invoices in seconds. All data stays in your browser — no account,
          no server.
        </p>
      </div>
    </section>
  );
}
