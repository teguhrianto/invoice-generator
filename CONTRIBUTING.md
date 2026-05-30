# Contributing to Invoice Generator

Thank you for taking the time to contribute. This document covers everything you need to get started.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Code Standards](#code-standards)
- [Project Structure](#project-structure)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Setup

```bash
# 1. Fork the repository on GitHub, then clone your fork
git clone https://github.com/teguhrianto/invoice-generator.git
cd invoice-generator

# 2. Install dependencies (Husky hooks are set up automatically via the prepare script)
pnpm install

# 3. Copy the example env file
cp .env.example .env.local

# 4. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Development Workflow

```bash
pnpm dev            # Development server with hot reload
pnpm type-check     # TypeScript check — run before pushing
pnpm lint           # ESLint
pnpm lint:fix       # ESLint with auto-fix
pnpm format         # Prettier write
pnpm format:check   # Prettier check
pnpm build          # Production build — run to catch build-time errors
pnpm test:e2e       # Playwright E2E tests (requires a running dev server or uses webServer config)
pnpm test:e2e:ui    # Playwright interactive UI mode
```

The pre-commit hook runs `lint-staged` and `type-check` automatically on every commit.

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint.

### Format

```
<type>: <short summary in lower-case>

[optional body]

[optional footer(s)]
```

### Allowed types

| Type       | When to use                                |
| ---------- | ------------------------------------------ |
| `feat`     | A new feature visible to users             |
| `fix`      | A bug fix                                  |
| `docs`     | Documentation only changes                 |
| `style`    | Formatting, whitespace — no logic change   |
| `refactor` | Code restructuring without feature or fix  |
| `perf`     | Performance improvements                   |
| `test`     | Adding or updating tests                   |
| `chore`    | Build process, dependency updates, tooling |
| `ci`       | CI/CD configuration changes                |
| `revert`   | Reverting a previous commit                |

### Examples

```
feat: add discount percentage mode alongside flat discount
fix: clamp tax percent to 100 in summary input
docs: add architecture section to README
chore: upgrade @react-pdf/renderer to v5
```

### Rules

- Subject must be **lower-case**
- Subject must be **under 100 characters**
- No period at the end of the subject line

---

## Code Standards

### TypeScript

- Strict mode is enabled — no `any` without a documented reason
- All exported symbols (functions, components, interfaces) must have a JSDoc comment (one-line minimum)
- No magic numbers — add constants to `src/lib/constants.ts`

### React

- Mark components `"use client"` when they use hooks, browser APIs, or event handlers
- Keep components single-responsibility; split if a component does more than one thing
- Use `useInvoice()` to read/dispatch state; do not import `InvoiceContext` directly in components

### Business logic

- All calculation functions live in `src/lib/calculations.ts` as pure functions
- All formatting functions live in `src/lib/formatters.ts`
- No calculation or formatting logic inside components — call the shared utility

### Styling

- Use Tailwind utility classes; no inline `style` objects in JSX (PDF components are the only exception — they use `StyleSheet.create()` from `@react-pdf/renderer`)
- Design tokens (colours, spacing) are defined as CSS variables in `src/app/globals.css`

### Testing

- New user-facing behaviour must have a corresponding E2E test in `e2e/`
- Use `getByLabel`, `getByRole`, or `data-testid` selectors — no CSS class selectors
- Every test must call `clearLocalStorage(page)` in `beforeEach` to ensure isolation

---

## Project Structure

```
src/
├── app/            Next.js routes and metadata
├── components/     React components (invoice/, pdf/, history/, ui/)
├── context/        InvoiceContext + InvoiceReducer
├── hooks/          useInvoice, useInvoiceHistory
├── lib/            Pure utilities: calculations, formatters, storage, pdfGenerator, constants
└── types/          invoice.ts — all shared TypeScript interfaces

e2e/                Playwright tests
```

See [README.md](README.md) for a full architecture overview.

---

## Submitting a Pull Request

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the code standards above.

3. **Run checks** locally before pushing:

   ```bash
   pnpm type-check && pnpm lint && pnpm build
   ```

4. **Push and open a PR** against `main`. Fill in the PR template:
   - What does this change do?
   - Why is it needed?
   - How to test it?

5. **Keep the PR focused** — one concern per PR. Large refactors and feature additions should be separate PRs.

PRs that fail `type-check`, `lint`, or `build` will not be merged.

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/teguhrianto/invoice-generator/issues/new) with:

- A clear description of the unexpected behaviour
- Steps to reproduce
- Expected vs actual result
- Browser and OS (since all data is client-side, browser matters)

---

## Requesting Features

Open a GitHub Issue with the `enhancement` label. Describe:

- The problem you are trying to solve
- Your proposed solution (optional)
- Any alternatives you have considered

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
