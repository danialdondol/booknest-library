# BookNest design direction

**The Reading Room Ledger** · 9 November 2026

BookNest is a staff tool, not a marketing dashboard. The redesign treats it like a well-kept
library ledger: numbered sections, ruled paper, accession marks, direct instructions, and a small
number of strong accents.

## Step 1 — Audit of the previous UI

1. **Four equal stat cards** repeated the same rounded tile, soft shadow and pastel quarter-circle
   motif. Nothing established a primary number.
2. **A uniform 5/7 panel grid** gave charts, pulse, and activity the same visual weight. The page
   read as a dashboard template rather than a sequence of useful desk tasks.
3. **Soft shadows and large uniform radii** created generic “SaaS card” depth. Borders and offsets
   would communicate structure more honestly.
4. **Dashboard shorthand copy** (“Collection pulse”, “Momentum”, “Desk log”, “Here is the shape of
   the library today”, “Find the right book, fast”) described the interface instead of the work.
5. **Default chart styling and pastel legends** weakened the otherwise warm palette and made the
   visualisations feel attached rather than designed.

## Step 2 — Creative concept

**The Reading Room Ledger** — a warm editorial operations journal.

- **Paper and ink, not glow.** Bone paper, bottle-green ink, rust for action, mustard for caution.
  No ambient gradients, neon, floating orbs, or glass.
- **Ledger composition.** One oversized number anchors each view, with smaller measurements set
  against rules and marginal labels. Charts and lists are printed sections, not floating cards.
- **Purposeful asymmetry.** The dashboard lead block is 1.1:2; the loan chart is offset downward;
  the member register sits against a narrow, sticky chart margin.
- **Tactile, not zoomy.** Buttons press into a solid offset shadow. Rows get a rust edge on
  hover/focus. Navigation uses a growing rule, not a pill background.
- **Human details.** Folio numbers, accession stamps, desk notes, monospaced labels, square status
  marks, and paper edges.

## Step 3 — Component changes

### Header

- Flat ink bar with a 4 px rust top edge and no blur or shadow.
- Brand mark becomes a square bookplate; the active nav item is marked by a rust underline.
- Demo status is a narrow edge tag rather than a pill.
- User avatar is a square initials tile, matching the ledger language.

### Login / conversion surface

- Split composition remains, but the dark panel is now a flat reading-room wall with a subtle
  column rule, not a gradient glow.
- Headline is editorial and specific: **“A quiet desk for a busy library.”**
- Benefits are numbered ledger entries; a “desk note” replaces the generic quotation.
- Sign-in card is a paper slip with a 1 px ink border, offset rust shadow, and accession stamp.
- Inputs are underline fields inside the card; the primary action uses a solid offset press effect.
- Copy is direct: “Two demo accounts are waiting below.” and a plain explanation of the demo limit.

### Dashboard

- Equal stat cards are replaced by a **ledger strip**: one large collection count, then three
  ruled measurements for readers, shelf copies, and loans.
- Category chart gets a paper panel and a centre total; the loan chart is offset and rule-bound.
- Section headings become “What we hold”, “Loans, month by month”, “Where the copies are”, and
  “What just happened”.
- Activity becomes a numbered desk log with a time column.
- The shelf-balance bar is square-ended and paired with ruled legend rows.

### Catalogue

- Page title becomes **“The catalogue, without the hunt.”**
- Search and filters form a ruled catalogue slip, not a raised toolbar card.
- The table reads as an index: serif titles, monospaced IDs, rust status marks, and a rust edge on
  hover/focus.
- The details dialog is an accession record with a hard ink border and offset shadow.
- Empty state is specific: “Nothing on this shelf.”

### Members

- Page title becomes **“Readers, not records.”**
- The register is a two-column ruled directory, not a grid of floating profile cards.
- Membership is a square, left-ruled tag; the avatar is an initials tile.
- Chart sidebar is a paper docket with ruled micro-stats.
- Empty state: “No reader matches that.”

### Charts

- Editorial palette: rust, mustard, moss, slate blue, plum, olive, umber.
- Square legend points, no rounded tooltips, sharp bar tops.
- Every chart keeps its generated text summary and data-table fallback.

## Design tokens

| Role       | Token            | Value     |
| ---------- | ---------------- | --------- |
| Paper      | `--paper`        | `#f2eadb` |
| Card paper | `--paper-strong` | `#fbf7ee` |
| Ink        | `--ink`          | `#16251f` |
| Action     | `--rust`         | `#9f3f27` |
| Caution    | `--gold`         | `#d9b15e` |
| Shelf      | `--moss`         | `#3d5f4d` |
| Rule       | `--line`         | `#cdbfa9` |

Typography remains **Fraunces Variable** for display and **Manrope Variable** for UI, with the
monospaced system stack for folios, IDs, labels, and small controls. No new runtime dependency was
added.

## Accessibility and responsiveness

- Primary controls keep 44 px targets; compact table actions stay at least 28 px, above the
  WCAG 2.5.8 minimum.
- The ledger stack collapses from a 1.1:2 composition to one column, then metrics become ruled rows.
- The offset loan chart returns to normal flow below 760 px.
- The mobile catalogue keeps data labels and 390 px overflow tests.
- `prefers-reduced-motion` disables transitions; axe tests remain part of CI.
- Body text and UI labels meet WCAG AA contrast against paper and ink.

## Files changed

- `src/styles/tokens.css` — palette, radii, shadows, type.
- `src/styles/base.css` — paper surface, folios, skip links, type scale.
- `src/styles/layout.css` — header, nav, page heading, asymmetric dashboard and member grids.
- `src/styles/components.css` — ledger, buttons, forms, charts, tables, members, dialog.
- `src/styles/login.css` — reading-room split screen, paper sign-in card, 404.
- `index.html`, `dashboard.html`, `books.html`, `members.html` — copy and composition.
- `src/lib/chart-configs.js` — editorial chart palette and sharp rendering.
- `docs/screenshots/` — refreshed production screenshots.

## Why not Tailwind or React?

The production app is a tested vanilla HTML/CSS/Vite multi-page build. Introducing Tailwind or React
for a visual redesign would increase runtime and build complexity without improving this static,
four-page workflow. The refactor stays in the existing CSS architecture, with tokens and component
classes that can be migrated later if the app grows.
