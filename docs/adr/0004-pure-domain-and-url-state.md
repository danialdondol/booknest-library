# ADR-0004: Pure domain functions and URL-backed catalogue state

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

The prototype mixed DOM queries, data access, filtering and sorting inside page scripts. Book filters
were ephemeral: refreshing or sharing a view lost the user's context. Sorting logic mutated the
source array and had no stable tie-breaker.

## Decision

Separate domain behaviour from rendering and represent catalogue state in the URL.

- `src/data/` exports frozen arrays so demo records cannot be mutated accidentally.
- `src/lib/books.js`, `members.js`, `dashboard.js`, `format.js`, `auth.js` and `guard.js` are
  DOM-free modules with injected inputs where browser APIs are involved.
- Filtering is accent-insensitive and searches stable fields. Sorting always returns a copy and uses
  title as a deterministic tie-breaker; ties stay ascending even for descending primary sorts.
- One state object represents `{ query, category, status, sort, direction }`. It round-trips through
  `URLSearchParams` with strict allowlists; unknown values fall back to safe defaults.
- `history.replaceState` keeps the URL current while typing/filtering without adding history noise.
  `popstate` restores the state from the URL.
- The page is a composition root: guard → parse state → render → wire events.

## Consequences

**Positive**

- A useful catalogue view can be copied, bookmarked or tested directly.
- Filtering and sorting are deterministic and covered by 100% line coverage.
- Rendering functions are easy to reason about because they receive data, not global state.
- Frozen data prevents accidental mutation from sort operations.

**Negative**

- A small amount of adapter code is needed between storage/location and pure functions.
- URL state must remain backwards-compatible if filters are added later.
- The page module owns event wiring; duplication across pages must be watched.

## References

- `src/lib/books.js`
- `src/lib/members.js`
- `src/lib/dashboard.js`
- `tests/unit/books.test.js`
