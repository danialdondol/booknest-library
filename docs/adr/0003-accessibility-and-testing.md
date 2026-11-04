# ADR-0003: Accessibility-first UI with layered automated tests

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

The original prototype used clickable `<th>` cells for sorting, placeholder-only search labels,
canvas charts with no text alternative, and no automated tests. Those are common demo shortcuts but
poor production defaults. The project needs confidence without turning a vanilla-JS assignment into
a large testing framework.

## Decision

Treat accessibility as a release gate and use three complementary test layers.

1. **Pure unit tests (Vitest)** — filtering, accent-insensitive search, non-mutating sort, query
   parsing/serialisation, statistics, percentage rounding, session expiry, malformed storage,
   redirect targets, bfcache and chart configuration. Coverage thresholds: 85% lines/functions/
   statements, 80% branches on `src/lib/**`.
2. **Browser integration tests (Playwright)** — real Chromium against the production build:
   authentication, route protection, deep links, sorting state, filter resets, dialog focus return,
   mobile overflow and no-JavaScript behaviour.
3. **Automated accessibility (axe + Playwright)** — WCAG 2.1 A/AA scans on login, dashboard, books,
   the open dialog and members. Serious or critical violations fail the test.

UI requirements that support the tests:

- Sort controls are real buttons inside `<th aria-sort>`.
- Result counts use `role="status"`/`aria-live`.
- Charts have `role="img"`, a generated text summary and a `<details>` data-table fallback.
- The book detail uses native `<dialog>` with a labelled heading and focus restoration.
- Colour tokens are checked against WCAG contrast and `prefers-reduced-motion` is respected.

## Consequences

**Positive**

- Regressions in keyboard, screen-reader and mobile behaviour are caught in CI.
- Pure logic is fast to test and has high coverage without jsdom.
- Accessibility is not a late manual checklist.

**Negative**

- Playwright adds browser installation and CI time.
- Automated axe scans cannot replace manual screen-reader testing.
- Canvas rendering remains outside unit-test scope by design.

## References

- `tests/unit/`
- `tests/e2e/accessibility.spec.js`
- `tests/e2e/responsive.spec.js`
- `vitest.config.js`
- `playwright.config.js`
