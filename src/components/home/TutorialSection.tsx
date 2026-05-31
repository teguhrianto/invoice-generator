/** A single numbered step in the how-to tutorial. */
interface TutorialStep {
  number: number;
  title: string;
  description: string;
}

const STEPS: TutorialStep[] = [
  {
    number: 1,
    title: "Fill in your details",
    description:
      "Add your company information, client name and address, invoice number, and purchase order reference.",
  },
  {
    number: 2,
    title: "Add line items",
    description:
      "Describe your services or products, set the unit cost and quantity. Subtotals calculate automatically.",
  },
  {
    number: 3,
    title: "Set adjustments",
    description:
      "Apply a tax percentage, flat discount, and shipping fee. The total updates in real time.",
  },
  {
    number: 4,
    title: "Download your PDF",
    description:
      'Click "Create the invoice" to generate and instantly download a professional PDF. The invoice is also saved locally for future reference.',
  },
];

/**
 * Tutorial section explaining how to create an invoice online.
 *
 * White background with four numbered step cards. Server Component.
 */
export function TutorialSection() {
  return (
    <section className="bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#212121] mb-3">
          How to create an invoice online
        </h2>
        <p className="text-sm text-[#757575] mb-10 max-w-xl">
          Follow these four steps to fill in and download your invoice in under a minute.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex gap-4 rounded-xl border border-[#e0e0e0] bg-white p-5 shadow-sm"
            >
              {/* Number badge */}
              <div
                className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#163016] text-[#b5f23d] font-bold text-sm"
                aria-hidden="true"
              >
                {step.number}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#212121]">{step.title}</span>
                <p className="text-sm text-[#757575] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
