# Contributing to BookNest

Thanks for helping make a calmer library desk. This project is a small vanilla-JavaScript app, so
the best contributions are focused, tested and easy to review.

## Setup

```bash
npm install
npm run dev
```

The app runs at <http://localhost:5173>. Demo login: `admin` / `admin123`.

Node **20.19+** or **22.12+** is required.

## Before opening a pull request

Run the full local gate:

```bash
npm run check
npm run test:e2e
```

`npm run check` covers:

- ESLint with zero warnings allowed.
- Prettier formatting.
- Vitest unit tests with coverage thresholds.
- Production build plus page/asset verification.

`npm run test:e2e` builds the production bundle and runs Playwright with axe accessibility scans.

If you change a user-facing screen, refresh the documentation screenshots with:

```bash
npm run screenshot
```

## Branch and commit style

- Branch from `main` using `feat/...`, `fix/...`, `docs/...`, `test/...` or `chore/...`.
- Use conventional commits:

  ```text
  feat(books): add status filter
  fix(auth): clear expired sessions
  test(members): cover empty results
  docs(readme): refresh quickstart
  ```

- Keep commits focused. Do not mix formatting-only changes with behavioural changes.

## Code guidelines

- Keep domain logic in `src/lib/` free of DOM and browser APIs.
- Keep page modules as composition roots: guard, query, render, wire events.
- Render user-visible data with `textContent` or `createElement`; never interpolate data into HTML.
- Preserve the fail-closed pattern: protected pages remain `hidden` until the session is verified and
  the page is ready.
- Prefer plain functions and small modules over classes or a framework.
- Add or update Vitest tests for pure logic; add Playwright coverage for integration behaviour.
- Keep CSS tokens in `src/styles/tokens.css` rather than hard-coding new colours.

## Accessibility checklist

- Semantic landmarks and exactly one `h1` per page.
- Every control has a visible or programmatic label.
- Keyboard operation works, including sort headers and the book dialog.
- New charts need a text summary and a data-table fallback.
- Check colour contrast against the warm paper palette.
- Respect `prefers-reduced-motion`.

Run `npm run test:e2e` before requesting review; the accessibility spec scans every page and the open
dialog for serious or critical axe violations.

## Security

- Never commit secrets, tokens, real member data or real email addresses.
- Demo credentials are intentionally public; do not present them as production security.
- Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Pull request checklist

- [ ] The change is linked to an issue or a clear problem statement.
- [ ] `npm run check` passes.
- [ ] `npm run test:e2e` passes.
- [ ] New behaviour has tests.
- [ ] Accessibility impact has been considered.
- [ ] Screenshots or release notes are updated when relevant.
- [ ] No secrets or real personal data are included.

## Project conventions

- Default branch: `main`.
- Required CI checks: `quality` and `e2e`.
- Versioning: Semantic Versioning; update `CHANGELOG.md` with user-visible changes.
- License: contributions are accepted under the MIT license.
