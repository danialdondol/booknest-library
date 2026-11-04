# ADR-0001: Vite multi-page app with custom CSS and build-time partials

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

The original BookNest prototype was four static HTML files sharing a Bootstrap navbar and six
global scripts. It worked, but had no build step, no dependency lockfile, CDN-only assets, duplicated
navigation, and no way to test the logic independently of the DOM.

The assignment brief still calls for four distinct pages, semantic HTML, responsive design and
separated content/behaviour/presentation. A single-page framework would add routing and bundle cost
without a state-sharing requirement.

## Decision

Use **Vite in multi-page mode** with four explicit HTML entry points and a static 404 page.

- Each page has one ES module composition root under `src/pages/`.
- Shared header/footer markup lives in `src/partials/` and is included at build time by a tiny
  `transformIndexHtml` plugin. No runtime template engine ships to the browser.
- CSS is a custom token-based system rather than Bootstrap. It is split into tokens, base, layout,
  components, login and print layers. Fonts and icons are bundled locally.
- Vite uses `base: './'`, so the same build works at the repository root or a GitHub Pages project
  subpath.
- All pages are registered explicitly in `vite.config.js`; `scripts/check-build.mjs` fails CI if a
  page or relative bundle is missing.

## Consequences

**Positive**

- Static HTML is fast, crawlable, resilient and easy to inspect.
- No runtime framework, hydration or client-side router.
- Shared markup exists once; the active navigation state is driven by `body[data-page]`.
- Local assets remove CDN availability and privacy concerns.
- The production build is deterministic and verifiable.

**Negative**

- The page list must be maintained in `vite.config.js`.
- Shared page chrome is resolved at build time, not dynamically.
- Custom CSS requires explicit accessibility and responsive review (covered by Playwright).

## Alternatives considered

- **Single-page app with a router:** rejected — no shared runtime state, more complexity and a
  heavier first load.
- **Keep Bootstrap from npm:** rejected — the default component look conflicts with the distinctive
  design goal, and the project only needs a small subset of layout primitives.
- **Runtime partial injection:** rejected — introduces a flash of unstyled/empty chrome and weakens
  the fail-closed shell.

## References

- `vite.config.js`
- `src/partials/`
- `scripts/check-build.mjs`
