# v0.1.0 plan and traceability

No `TASKS.md`, issue list or project brief beyond the original `README.md` was present in the
workspace. The README was treated as the specification. This plan records the scope that was
inferred and delivered.

## Goal

Turn the four-page IMS566 prototype into a production-quality static repository that a first-time
user can run in one command, understand in under a minute, and trust as a demonstration of
accessible front-end engineering.

## Workstreams

| ID     | Outcome                                                          | Evidence                                                           |
| ------ | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| BN-001 | Repository foundation, pinned toolchain and local git history    | `package.json`, `package-lock.json`, `.gitignore`, `.editorconfig` |
| BN-002 | Frozen demo data and pure domain/auth modules                    | `src/data/`, `src/lib/`                                            |
| BN-003 | Accessible login, session handling and fail-closed route guards  | `src/pages/login.js`, `src/lib/auth.js`, `src/lib/guard.js`        |
| BN-004 | Dashboard with live stats, charts, pulse and activity            | `dashboard.html`, `src/pages/dashboard.js`                         |
| BN-005 | Searchable, filterable, sortable catalogue with URL state        | `books.html`, `src/lib/books.js`, `tests/e2e/books.spec.js`        |
| BN-006 | Searchable member register and membership summary                | `members.html`, `src/lib/members.js`                               |
| BN-007 | Accessibility and E2E quality gates                              | `tests/e2e/`, axe scans, 25 passing browser tests                  |
| BN-008 | Documentation, CI, Pages deployment, templates and release notes | `README.md`, `docs/`, `.github/`, `CHANGELOG.md`                   |
| BN-009 | Visual identity and screenshots                                  | `src/styles/`, `docs/screenshots/`                                 |

## Acceptance criteria

- [x] `npm start` works from a clean checkout and installs dependencies on first run.
- [x] All four pages load from the production build with local assets.
- [x] Demo login, validation, logout and protected-route redirects work.
- [x] Dashboard values are calculated from data, not hardcoded in the page.
- [x] Book search, filters, sorting, deep links and details dialog work.
- [x] Member search, type filter and chart work.
- [x] Mobile layout has no horizontal page overflow.
- [x] Unit tests, coverage thresholds, E2E tests, axe scans, lint and build pass.
- [x] No secrets or real personal data are committed.
- [x] README includes pitch, screenshot, quickstart, features, architecture and roadmap.
- [x] CI, Pages deployment, Dependabot and community files are present.
- [ ] GitHub remote, issues, project board, PRs and published release — blocked by missing
      authenticated GitHub CLI in the build environment; runbook provided.

## Deliberate non-goals for v0.1.0

- Real authentication, database or API.
- Editing records, loan transactions or persistence beyond the session.
- A component framework or TypeScript migration.
- Docker. The project has no services to compose; one `npm start` is the intended clean-machine path.

## Verification snapshots

- Unit: 71 passed, 97.25% lines on `src/lib/**`.
- Browser: 25 passed.
- Accessibility: 0 serious/critical axe violations on login, dashboard, books, open dialog, members.
- Build: 5 pages, 18 emitted assets, no external HTTP asset URLs.
