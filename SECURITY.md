# Security policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

## The demo-auth boundary

BookNest is a **client-side demonstration**. The login screen, session storage and page guard are
UX features, not an access-control system:

- Demo usernames and passwords are intentionally public in `src/data/users.js`.
- A visitor can edit `sessionStorage` with browser developer tools.
- There is no server, database, identity provider, CSRF token or audit log.
- Do not use this authentication pattern for real member data or real library operations.

A production version must replace the demo session with server-issued authentication, enforce
authorization on an API, add secure HTTP headers, rate limiting and audit logging.

## Security controls present

- No third-party CDN requests; all runtime assets are bundled.
- No HTML interpolation of data; DOM nodes are created with `textContent`/`createElement`.
- Versioned session shape validation and eight-hour expiry.
- Protected pages fail closed with the `hidden` attribute until the guard succeeds.
- Meta Content-Security-Policy: `default-src 'self'`, `script-src 'self'`,
  `object-src 'none'`, `base-uri 'none'`, `form-action 'self'`.
- No secrets, API keys or real personal data are committed.
- Dependencies are pinned with a lockfile.
- CI runs lint, unit tests, coverage, production build, E2E and an audit at high severity.

## Known limitations

- GitHub Pages cannot set HTTP response security headers. The meta CSP is a partial mitigation and
  does not cover `frame-ancestors` or all browser policies.
- The development dependency chain for ESLint currently reports a moderate `minimatch` advisory.
  It is not shipped to users; monitor Dependabot for a compatible upstream update.
- Browser storage can be unavailable in private or embedded contexts; the app fails closed rather
  than silently allowing access.

## Reporting a vulnerability

Please do **not** open a public issue for a suspected vulnerability.

1. Once the repository is published, use **Security → Report a vulnerability** to open a private
   GitHub Security Advisory.
2. Include affected version, reproduction steps, impact and any suggested mitigation.
3. Do not include real personal data or secrets in the report.

You can expect acknowledgement within five working days. Please allow reasonable time for a fix
before public disclosure.

## Out of scope

- The intentionally public demo credentials.
- The absence of server-side auth, which is documented as a demo limitation.
- Vulnerabilities requiring a compromised browser extension or physical device access.
