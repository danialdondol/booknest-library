# ADR-0002: Client-side demo authentication with a fail-closed shell

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

The assignment requires a simulated login, session-based page protection, logout and error handling,
but explicitly allows hardcoded data and provides no backend. Hardcoded credentials in a browser
bundle cannot provide real security. The risk is presenting the simulation as if it were secure.

## Decision

Keep authentication intentionally client-side and make the boundary explicit.

- Demo accounts live in `src/data/users.js` and are visible in the UI and README.
- On success, store only `{ username, name, role }` plus version and timestamps in `sessionStorage`.
  Passwords are never stored.
- Read sessions through an injected storage interface, validate the shape, and expire after eight
  hours. Corrupt or expired sessions are removed.
- Protected pages ship with `<div id="app" hidden>`. The page module must verify the session and finish
  rendering before revealing it. If JavaScript is unavailable, the shell stays hidden and a noscript
  message explains why.
- Re-check the session on a persisted `pageshow` event so Back/Forward cache cannot show a protected
  page after logout.
- Use `aria-live` feedback for login errors, mark invalid fields and move focus appropriately.
- Document the limitation in the UI, README, SECURITY.md and this ADR.

## Consequences

**Positive**

- The assignment behaviour is preserved without pretending it is production auth.
- Session and redirect behaviour is deterministic and unit/E2E testable.
- Protected content does not flash before a redirect.
- The app fails closed rather than open.

**Negative**

- Any visitor can edit `sessionStorage` or read the demo credentials.
- There is no authorization, audit trail or server-side enforcement.
- A real deployment must replace this layer entirely.

## Explicit non-goals

- Client-side password hashing. It would add complexity without protecting public demo credentials.
- CSRF protection. There is no server or state-changing API.
- `localStorage` persistence. A tab-scoped session better matches a shared library desk.

## References

- `src/lib/auth.js`
- `src/lib/guard.js`
- `src/pages/login.js`
- `SECURITY.md`
