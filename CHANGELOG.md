# Changelog

All notable changes to BookNest are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned

- Server-backed authentication and persistent loan workflows.
- Create/edit flows for books and members.
- Visual regression tests.

## [0.1.0] - 2026-11-04

### Added

- Vite multi-page application with login, dashboard, catalogue, member register and 404 page.
- Accessible custom design system with self-hosted Fraunces and Manrope variable fonts.
- Protected app shell with versioned session storage, eight-hour expiry, route guards and
  bfcache re-checks.
- Dashboard statistics, collection pulse, category doughnut, monthly-loan bar chart and activity log.
- Searchable, filterable, sortable 16-book catalogue with deep-linkable URL state and a native
  details dialog.
- Searchable 12-member register with membership filtering, loan totals and a pie chart.
- Accessible chart alternatives, `aria-sort` header buttons, live result counts and visible focus states.
- 71 Vitest unit tests and 25 Playwright end-to-end/accessibility tests.
- GitHub Actions CI, GitHub Pages deployment, Dependabot, issue templates and PR template.
- Architecture decision records, deployment runbook, release notes and screenshots.

### Security

- Removed all CDN dependencies and bundled local assets.
- Replaced HTML string interpolation with safe DOM APIs.
- Added a restrictive meta content-security policy.
- Added demo-only security documentation and a private vulnerability reporting process.

### Changed

- Replaced the original Bootstrap prototype with a custom responsive CSS system.
- Moved hardcoded data into frozen ES modules.
- Corrected demo member email domains to the reserved `example.edu` domain.

### Known limitations

- Client-side demo authentication is not real security.
- Data is static; edits and loans do not persist.
- GitHub Pages cannot set HTTP security headers.
