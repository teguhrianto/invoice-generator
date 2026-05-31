# Invoice Generator

Open-source, client-side invoice generator. Create and download professional PDF invoices in seconds. All data stays in your browser — no account, no server, no database.

**[→ Live demo: invoice-generator.teguhrianto.com](https://invoice-generator.teguhrianto.com)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/teguhrianto/invoice-generator)

---

## Features

- **PDF download** — Generate a clean, professional PDF invoice with one click
- **Invoice history** — Every submitted invoice is saved locally; browse and reload any past invoice
- **Auto-fill** — The form pre-fills from your most recent invoice on every page load
- **Multi-currency** — USD, EUR, GBP, IDR, SGD, AUD, JPY, CAD, CHF, MYR
- **Line items** — Add, remove, and reorder rows; amounts auto-calculate
- **Tax, discount & shipping** — Tax is computed on the post-discount amount
- **Logo upload** — JPG / PNG / JPEG, max 200 KB; compressed before storage
- **100% client-side** — localStorage only; works offline after the initial load

---

## Tech Stack

| Layer           | Technology                   |
| --------------- | ---------------------------- |
| Framework       | Next.js 16 (App Router)      |
| Language        | TypeScript 5                 |
| Styling         | Tailwind CSS v4              |
| PDF             | @react-pdf/renderer v4       |
| State           | React `useReducer` + Context |
| Persistence     | `localStorage`               |
| Package manager | pnpm                         |
| Linting         | ESLint + Prettier            |
| Git hooks       | Husky + commitlint           |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)

### Installation

```bash
git clone https://github.com/teguhrianto/invoice-generator.git
cd invoice-generator
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (optional)

Copy `.env.example` to `.env.local` and set:

```env
# Canonical URL used in sitemap.xml and Open Graph tags
NEXT_PUBLIC_SITE_URL=https://invoice-generator.teguhrianto.com
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and metadata
│   ├── page.tsx            # "/" — invoice form
│   └── history/page.tsx    # "/history" — invoice history list
│
├── components/
│   ├── invoice/            # Invoice form sections (header, dates, line items, summary…)
│   ├── pdf/                # @react-pdf/renderer components (InvoicePDF, table, summary)
│   ├── history/            # History list and card components
│   └── ui/                 # Reusable primitives (Button, Input, Textarea, Select, LogoUpload)
│
├── context/
│   ├── InvoiceContext.tsx  # React context + InvoiceProvider
│   └── InvoiceReducer.ts   # Typed reducer + createInitialInvoice
│
├── hooks/
│   ├── useInvoice.ts       # Typed context consumer
│   └── useInvoiceHistory.ts # History list with delete and refresh
│
├── lib/
│   ├── calculations.ts     # Pure math: subtotal, tax (post-discount), total, rounding
│   ├── formatters.ts       # formatCurrency, formatDate, date helpers
│   ├── storage.ts          # localStorage CRUD + active-invoice pointer
│   ├── pdfGenerator.ts     # generateAndDownloadPDF() — lazy-loads @react-pdf
│   └── constants.ts        # CURRENCIES, DEFAULT_INVOICE, storage keys, limits
│
└── types/
    └── invoice.ts          # All TypeScript interfaces: Invoice, LineItem, Currency…

e2e/                        # Playwright end-to-end tests
```

---

## Available Scripts

```bash
pnpm dev            # Start development server
pnpm build          # Production build
pnpm start          # Start production server
pnpm type-check     # TypeScript check (no emit)
pnpm lint           # ESLint
pnpm lint:fix       # ESLint with auto-fix
pnpm format         # Prettier write
pnpm format:check   # Prettier check
pnpm test:e2e       # Run Playwright E2E tests
pnpm test:e2e:ui    # Playwright UI mode
```

---

## Architecture Notes

**PDF generation** is fully lazy — `@react-pdf/renderer` is dynamically imported only when the user clicks "Create the invoice", keeping the initial bundle small.

**localStorage schema** uses two keys:

- `invoice_generator_index` — lightweight array of `InvoiceSummary` (for the history list)
- `invoice_generator_doc_<id>` — full `Invoice` document per invoice

**Tax calculation** applies to the post-discount amount: `tax = (subtotal − discount) × taxRate`. This is the standard accounting convention.

**History loading** uses a dedicated `invoice_generator_active_id` key so the correct invoice loads after navigating from /history to /, regardless of creation order.

---

## Deployment

The project deploys to Vercel with zero configuration — push to `main` and Vercel auto-detects Next.js.

```bash
# Manual deploy via Vercel CLI
pnpm dlx vercel
```

---

## Contributing

1. Fork the repo and create a feature branch: `git checkout -b feat/your-feature`
2. Follow conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
3. Run `pnpm lint:fix && pnpm type-check` before pushing
4. Open a pull request — the CI checks lint, type-check, and build

**Code style:**

- JSDoc on every exported function and component (one-line minimum)
- No magic numbers — add constants to `src/lib/constants.ts`
- Business logic in `src/lib/` as pure functions; UI in components

---

## License

MIT — see [LICENSE](LICENSE).
