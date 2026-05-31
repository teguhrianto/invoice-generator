"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is an invoice?",
    answer:
      "An invoice is a document sent from a seller to a buyer listing the goods or services provided and the amount owed. It serves as a formal request for payment and a record for both parties.",
  },
  {
    question: "Can I edit my invoices?",
    answer:
      'Yes. Previously generated invoices are saved in your browser\'s localStorage. Open the History page, click "Load" on any invoice, and it will be restored in the editor for you to modify and re-download.',
  },
  {
    question: "Can I change the currency on the invoice?",
    answer:
      "Yes. The currency selector supports multiple currencies including USD, EUR, GBP, IDR, SGD, and more. Changing the currency updates all monetary displays on the form and in the generated PDF.",
  },
  {
    question: "Can I put my own logo on the invoice?",
    answer:
      "Yes. Use the logo upload area in the top-right of the invoice form. Supported formats are PNG and JPG, up to 200 KB. The logo appears in the generated PDF header.",
  },
  {
    question: "How do I send my invoice?",
    answer:
      'Click "Create the invoice" to download a PDF file. You can then attach that PDF to an email or share it via any file-transfer method you prefer.',
  },
  {
    question: "Is my data private?",
    answer:
      "Completely. All invoice data is stored only in your browser's localStorage. Nothing is sent to any server. Clearing your browser storage will remove all saved invoices.",
  },
  {
    question: "Is this free?",
    answer:
      "Yes, entirely free. The project is open-source under the MIT License. There are no plans, subscriptions, or account requirements.",
  },
];

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}

/** Single FAQ accordion row with CSS grid height animation. */
function AccordionItem({ item, isOpen, onToggle, id }: AccordionItemProps) {
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-btn-${id}`;

  return (
    <div className="border-b border-white/20">
      <button
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="w-full flex cursor-pointer items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-base sm:text-lg font-semibold text-[#b5f23d] group-hover:text-white transition-colors duration-150">
          {item.question}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
          className={[
            "shrink-0 text-[#b5f23d] transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* CSS grid height animation — no JS measurement needed */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={[
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm sm:text-base text-white/75 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * FAQ accordion section for the home page.
 *
 * Dark forest-green background with Bebas Neue heading. Each item expands
 * and collapses independently; only one item is open at a time.
 * "use client" required for accordion toggle state.
 */
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section className="bg-[#163016] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2
          className="text-4xl sm:text-5xl text-[#b5f23d] uppercase leading-none tracking-wide mb-12 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          FAQ About Creating an Invoice.
        </h2>

        <div>
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              id={String(index)}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
