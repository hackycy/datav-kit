# Composition Patterns — Large-Screen Dashboards

The pattern layer of the datav-kit knowledge base. It answers **"how do I assemble this
block"** and is the routing main table: every screen block resolves here before a component is
chosen.

**This file owns**

- the 19 patterns P1–P19 and their construction;
- the **P6 border-box selection matrix** — capability groups, role entries, and fixed fallback
  chains. It is the single operative matrix.

**This file does not own**

- component capability fields, publication status, or the runtime availability check →
  `components.md`;
- generic redlines and thresholds → `design-rules.md`;
- token values → `tokens.md` / `assets/tokens.css`.

`spec.md` §3.4 carries a locked snapshot of the P6 matrix for implementation handoff only; it is
not a second, independently maintained rule set.

## 0. Routing path

```
user brief
  → template   (T1–T4, §1)   which screen layout
  → pattern    (P1–P19)      which block structure, components, parameters
  → component  (components.md + the online llms.txt index)   which tag, which props
```

| Hop | Decided by | Output |
| --- | --- | --- |
| brief → template | the brief's job: monitoring / analysis / narrative / KPI-led | one of T1–T4 |
| template → pattern | the template's block list | the P-numbers for each block |
| pattern → component | the pattern's **Construction** field | tag + key attributes |
| component → detail | the routing protocol in `components.md` | props / events / CSS variables from the detail page |

There is deliberately **no "task → component" mapping table**: it would duplicate this layer,
which already carries task → structure → component. Reach for the online `llms.txt` index only
for a component that no pattern covers.

## 1. Template layer

Shared skeleton: header `--dvk-screen-header-height` (104px), KPI strip
`--dvk-screen-kpi-height` (104px), main region `minmax(0, 1fr)`. All four templates use the
12-column grid (gutter 24, margin 48) and fluid rows.

| # | Layout | Rows | Main region (12 col) | Blocks | Use for |
| --- | --- | --- | --- | --- | --- |
| T1 | Three-column operations | header 104 / KPI 104 / main 1fr | 3 / 6 / 3 | left P6+P7+P9 or P10 x2; centre P6+P17 + P12; right P11 / P15 / P13 x2–3 | monitoring, command, duty room |
| T2 | Two-column analysis | header 104 / KPI 104 / main 1fr | 8 / 4 | main P6 + chart slot x2; side P10 + P15 | trend, comparison, attribution |
| T3 | Single-column narrative | header 104 / main 1fr / rhythm strip 104 | full width | P6+P17 + three small panels (P9/P14/P16) | situation overview, briefing |
| T4 | KPI-led | header 104 / KPI 208 / main 1fr | 6 / 6 | top P4 enlarged KPI cards x6 (P14/P16); bottom P6+P7 panels x2 (P9/P10) | metric board, business cockpit |

Changing the skeleton — row count, column count, primary-view position, header form, adding or
removing a block — is a redline: go back to the prototype and re-select. Substituting a pattern
inside a block is a free-zone change; each pattern lists its allowed replacements below.

## 2. Route index

| P | Pattern | Purpose | Primary components | Lands in |
| --- | --- | --- | --- | --- |
| P1 | Full-screen fit shell | Scale a fixed canvas into the page | `dvk-fit-screen` | all templates, outermost |
| P2 | Three-part header | Top information band | hand-written boxes + P3 | all templates |
| P3 | Title bar | Screen title as the visual focus | `dvk-title-*` or paired `dvk-decoration-9` | header centre |
| P4 | KPI strip | One row of 4–6 top-line metrics | `dvk-border-box-15` + `dvk-count-to` | T1–T4, row 2 |
| P5 | Three-column main grid | Left process / centre view / right status | `dvk-border-box-*` | T1 main region |
| P6 | Panel container | Frame + optional surface for one block | `dvk-border-box-N` (see §3) | every block |
| P7 | Panel head | "What is this panel, what state" | `h3` + `p` + P8 | panel first row |
| P8 | Panel head right zone | Count/state chip or tag group | hand-written chips | panel head right |
| P9 | Horizontal progress row | Share / completion | `dvk-count-to` + `--bar-value` bar | list rows |
| P10 | Rank / pressure row | Name + status + full-width bar | `dvk-count-to` + `--bar-value` bar | left/right column |
| P11 | Triage card | Risk / ticket / task queue | hand-written card + role colour | right column |
| P12 | Rhythm bars | Intensity by time slice | `--bar-value` columns | centre bottom / footer |
| P13 | Ring gauge | One percentage | `dvk-decoration-8` + `dvk-count-to` | narrow right panel |
| P14 | Hero metric | One block, one core number | surface panel + `dvk-count-to` | left column top |
| P15 | Metric stack | Two secondary metrics | `dvk-count-to` cards | middle rows |
| P16 | `dvk-count-to` usage | Every animating number | `dvk-count-to` | any metric slot |
| P17 | Map stage | The screen's visual lead | `dvk-border-box-*` + inline SVG | centre column |
| P18 | Map marker | A point on the map | absolute `div` + diamond | inside the map |
| P19 | Map overlay card | A conclusion over the map | absolute `section` | map bottom-right |

## 3. P6 — border-box selection matrix (normative)

P6 selects a border-box variant **capability first, role second**. `surface` means the component
exposes a `background-color` capability; omitting that attribute still permits a transparent
panel. `HUD` means a transparent decorative frame whose background is supplied by the host or
screen. A scene role is the container's semantic job after the capability branch — it is not a
colour theme.

### Capability groups

| Group | Variants | Capability boundary |
| --- | --- | --- |
| Generic rectangle | `1` | Animated rectangular frame; the only `auto-height` variant |
| Large HUD | `2/3/4/5/6` | Transparent large-format sliced/tiled HUD frames; no `background-color` |
| Surface panel | `7/8/9/10/15` | Optional independent surface through `background-color` |
| Status/precision frame | `11/12/13/14` | Transparent operational or technical rails; no `background-color` |
| Compact enhancement | `16` | Compact CPU-like KPI/topology/health frame; main-only; no `background-color` |

### Role entries and fixed fallback chains

Pick the preferred variant for the scene role, then take the first registered tag in the chain.
Import and registration must have completed before `customElements.get(tag)` is called.

| Scene role | Preferred | Fixed fallback chain |
| --- | --- | --- |
| Focal primary view | `4` | `4 → 2 → 6 → 3 → 5 → 1` |
| Dense-data primary view | `3` | `3 → 6 → 5 → 2 → 1` |
| Transparent free-size HUD | `5` | `5 → 3 → 6 → 2 → 1` |
| Precision technology primary view | `6` | `6 → 3 → 5 → 2 → 1` |
| Cyber/HUD primary view | `2` | `2 → 4 → 3 → 5 → 1` |
| Generic rectangle or content-sized box | `1` | `1 → 15` |
| Chamfered surface panel | `7` | `7 → 10 → 9 → 15` |
| Animated polygon surface panel | `8` | `8 → 10 → 7 → 15` |
| Restrained static surface panel | `9` | `9 → 15 → 7 → 10` |
| Rounded glow surface panel | `10` | `10 → 9 → 15 → 7` |
| Repeated lightweight card | `15` | `15 → 9 → 10 → 7` |
| Operational status rail | `11` | `11 → 13 → 12 → 14 → 1` |
| Top rail structural frame | `12` | `12 → 13 → 14 → 11 → 1` |
| Bottom carrier-spine frame | `13` | `13 → 12 → 14 → 11 → 1` |
| Signal-port technical area | `14` | `14 → 13 → 12 → 11 → 1` |
| Compact KPI, topology, or device health | `16` | `16 → 15 → 9` |

### Fallback rules

- Surface and HUD families must not silently cross during fallback. `1 → 15` is the explicit
  generic-rectangle fallback; omit `background-color` when the original role did not require a
  surface, and record the resulting visual change.
- `16 → 15 → 9` is the explicit compact-role exception: omit `background-color` on the fallback
  so the panel stays transparent, and record the loss of CPU-like geometry as a visual-contract
  degradation.
- Unsupported props must not be passed to a fallback variant.
- If a chain has no registered candidate, **stop with a missing dependency** — do not invent a
  component and do not silently substitute an arbitrary border.

### Surface boundary

When an independent surface is required, select only `7/8/9/10/15` and pass the theme's surface
value through the supported `background-color` prop. Transparent HUD and status variants take
their background from the host or the screen instead.

### Motion rule

Motion is not a default selection reason. Enable it only for a named data or interaction
mapping. Under `prefers-reduced-motion: reduce`, use `paused` where supported and
`animated=false` for `border-box-1`; otherwise prefer a static role variant. Keep the component
default `glow-intensity` unless a documented visual-hierarchy deviation is registered.

### Content-area rule

Every variant keeps the `contentRect` contract. Automatic padding is the default; only an
observed obstruction, overflow, or readability problem justifies
`--dvk-border-box-N-padding`, and that override is recorded as a deviation. Padding numbers are
never used to infer the variant.

### Default-slot title rule

All 16 border boxes expose **only the default slot**. `frame`, `graphic`, and `content` are
parts, not title slots — no variant has a `#header` or `#title` slot. The panel title therefore
lives inside the default slot (P7's `.panel-inner`). The left/right title rails on `-11` and the
top title rail on `-12` are decorative graphics, not text containers.

## 4. Skeleton patterns

### P1 — Full-screen fit shell

- **Purpose**: scale a fixed design canvas into the page container; the only element that
  handles scaling.
- **Construction**: `<dvk-fit-screen>` wrapping the whole screen DOM.
- **Parameters**: `width="1920" height="1080" mode="contain" align="center center"`;
  `fit-target="viewport"` for a full-page screen, `"host"` when embedded in a host container.
  Inside the canvas, write absolute px — no responsive breakpoints.
- **Grid position**: outermost, fills the host; the host must have a resolved height or the
  canvas collapses.
- **Replacements**: none — a screen has exactly one fit shell. A fixed-size kiosk output that
  needs no scaling uses a plain container instead.
- **Cautions**: `auto-fullscreen` is a compatibility flag only; fullscreen must be requested
  from a user gesture. `fit-target="host"` requires the host to set a height (a `clamp()` is a
  common guard). Non-uniform `fill` is a redline violation.

### P2 — Three-part header

- **Purpose**: the top information band — left running context, centred title, right
  clock/status.
- **Construction**: `header` grid of three columns → two hand-written info boxes (`span` label +
  `strong` value) + the title group (P3).
- **Parameters**: height `--dvk-screen-header-height` (104px); columns
  `minmax(0, 1fr)` centre with equal side columns; gap `--dvk-screen-space-xl` (24px). Info box
  padding `--dvk-screen-space-lg` (16px) / `--dvk-screen-space-xl` (24px), 1px border or a 4px
  accent left border — pick one per screen.
- **Grid position**: first row, fixed height, never part of the `1fr` distribution; side columns
  must match the centre column height (`align-items: center`).
- **Replacements**: the left box may be dropped (title + right status only) on T3/T4; the centre
  group is replaced per P3.
- **Cautions**: the 390px / 350px side widths in the existing demos are scene values, not a
  rule. The eyebrow is English and the title Chinese — the shared convention of both demos, not
  a redline.

### P3 — Title bar

- **Purpose**: the screen's main title; the highest-contrast text region on the screen.
- **Construction**: two paths, chosen by feature detection on `customElements.get('dvk-title-1')`
  **after** registration.
  - Path 1 — title components registered: `dvk-title-1` / `-2` / `-3`; content goes in the
    default slot **or** `title-text` (mutually exclusive).
  - Path 2 — not registered (the published 0.0.5 case): a hand-built pair of mirrored
    `dvk-decoration-9` (standard track) plus a centred title block (`span` eyebrow + `h1`).
- **Parameters**: track pair — the left instance carries `reverse`; `colors` is a three-colour
  theme string; height 58–64px; opacity <= 0.85. Title block — centred, padding
  `--dvk-screen-space-lg` (16px) / `--dvk-screen-space-2xl` (32px), a 1px rule above and below
  at low alpha; `h1` at `--dvk-screen-font-size-xl` (44px).
- **Grid position**: header centre column, horizontally centred; the two tracks occupy the
  remaining space symmetrically.
- **Replacements**: Path 1 ↔ Path 2 by availability; `dvk-decoration-9` ↔ `dvk-decoration-6`;
  a compact title with no tracks on T4.
- **Cautions**: `reverse` is documented for symmetric title/divider layouts, so the paired
  mirror is evidence-based, not incidental. The 1px rules and translucent background in both
  demos are hand-written, not a component capability. Absolutely positioning the tracks (one
  demo does) overlaps the title on a narrow canvas — use grid columns. Title 1–3 are main-only
  and absent from 0.0.5; `title-4` does not exist and must never be referenced.

### P4 — KPI strip

- **Purpose**: one row of 4–6 top-line metrics.
- **Construction**: `section` grid → one card per metric → `dvk-count-to` inside each card. Card
  frame: `dvk-border-box-15` (the "repeated lightweight card" role), or `dvk-decoration-4` (the
  only slot-bearing decoration) for the diamond KPI look.
- **Parameters**: `grid-template-columns: repeat(N, minmax(0, 1fr))`; column gap
  `--dvk-screen-space-2xl` (32px); row height `--dvk-screen-kpi-height` (104px); value
  `--dvk-count-to-font-size` = `--dvk-screen-font-size-lg` (32px); label
  `--dvk-screen-font-size-xs` (14px); the card's inner wrapper carries
  `padding: 0 --dvk-screen-space-lg` — the frame's inset bottoms out at 10px, which otherwise
  puts the label and value too close to the frame edge.
- **Grid position**: second row, fixed height, equal cards, not part of the `1fr` distribution.
- **Replacements**: T4 enlarges the strip to 208px and uses P14/P16 for six cards; on an
  analysis screen the strip may be replaced by P15.
- **Cautions**: both existing demos hand-write the card with no component — a cost tradeoff,
  not a rule. Per-card colour must carry a role (design-rules 4.2), not decoration.

### P5 — Three-column main grid

- **Purpose**: the main region — left process/list, centre primary view, right status/queue.
- **Construction**: `main` grid → three column containers, each a grid holding `dvk-border-box-*`
  panels.
- **Parameters**: `grid-template-columns: L minmax(0, 1fr) R; column-gap`
  `--dvk-screen-space-2xl` (32px); rows `minmax(0, 1fr)`; every column and panel needs
  `min-height: 0`.
- **Grid position**: fills the remaining height; the centre column is always `minmax(0, 1fr)`.
- **Replacements**: T2 uses `8 / 4`, T3 a single column, T4 `6 / 6`.
- **Cautions**: fixed px row heights overflow the canvas — one demo loses 26px to
  `overflow: hidden`; always use fluid rows (design-rules 1.6). Missing `minmax(0, ...)` or
  `min-height: 0` lets content blow the grid out.

## 5. Panel patterns

### P6 — Panel container

- **Purpose**: carry one block of business content; provide frame, corners, and an optional
  surface.
- **Construction**: `<dvk-border-box-N>` wrapping `.panel-inner` in the default slot. The
  variant comes from the matrix in §3 — never from taste or from a demo.
- **Parameters**: `colors` is a comma-separated string ordered primary, secondary[, accent];
  surface variants take `background-color`; content inset is derived from `contentRect` by
  default. `.panel-inner` is `grid-template-rows: auto minmax(0, 1fr)` with gap
  `--dvk-screen-space-lg` (16px).
- **Grid position**: any grid cell; the element is `height: 100%` / `width: 100%` by default. A
  content-sized box uses `dvk-border-box-1` with `auto-height`.
- **Replacements**: only through the fixed fallback chain of the selected role (§3).
- **Cautions**: all 16 variants expose only the default slot, so the panel title goes inside it
  (P7). Never pass a prop the fallback variant does not support. Padding overrides require an
  observed obstruction, overflow, or readability problem plus a registered deviation; never
  infer the variant from padding numbers.

### P7 — Panel head

- **Purpose**: the panel's top information band — "what is this panel, what state is it in".
- **Construction**: `header.panel-heading` (`display: flex; justify-content: space-between`) →
  left `div` with a `p` eyebrow and an `h3` title, plus the optional right zone (P8).
- **Parameters**: gap `--dvk-screen-space-md` (12px)–`--dvk-screen-space-lg` (16px); eyebrow
  `--dvk-screen-font-size-sm` (18px) at reduced alpha; title `--dvk-screen-font-size-md`
  (24px) at weight 600; the gap to the body comes from `.panel-inner`.
- **Grid position**: the first row of the panel's inner grid (`auto`); the body takes
  `minmax(0, 1fr)`.
- **Replacements**: the right zone may be dropped; the eyebrow may be dropped on compact cards;
  a chart title may replace the heading when the panel holds a single chart.
- **Cautions**: one demo uses `<strong>` instead of `<h3>` and omits the right zone — the
  normative form is `p` + `h3`, with the right zone optional. The heading stays inside the
  default slot: no border box has a `#header` or `#title` slot. The demos' 16px eyebrow is not a
  token step; use 18px or 14px.

### P8 — Panel head right zone

- **Purpose**: a count/state or a group of category chips at the right of the panel head.
- **Construction**: a hand-written `span` (status chip) or a `div` with child `span`s (tag
  group).
- **Parameters**: chip `padding: 5px 9px`, 1px border, `--dvk-screen-font-size-xs` (14px),
  translucent background from a `--dvk-color-*` role; tag group `flex-wrap: wrap;
  justify-content: flex-end; gap` `--dvk-screen-space-sm` (8px).
- **Grid position**: the right end of the panel head, `flex: 0 0 auto`.
- **Replacements**: chip ↔ tag group; either may be dropped on compact cards.
- **Cautions**: chip text is business copy or a state token, not part of the design contract.
  Cap the chip count — overflow must scroll or be summarised.

## 6. Metric patterns

### P9 — Horizontal progress row

- **Purpose**: one row of "label + value + bar" for share or completion.
- **Construction**: a hand-written `div.progress-line` with an `<i>` fill; the value uses
  `dvk-count-to`.
- **Parameters**: track `height: 8px; overflow: hidden` on a low-alpha `--dvk-color-*`
  background; fill width from an inline CSS variable `--bar-value`; fill colour from the theme;
  value `--dvk-count-to-font-size` = `--dvk-screen-font-size-sm` (18px).
- **Grid position**: a list row inside a panel, full row width (`grid-column: 1 / -1`).
- **Replacements**: P10 when the row needs a rank, name, or status; P12 when the same data is
  time-sliced.
- **Cautions**: one demo mixes an inline `width` with `--bar-value` in the same file — use the
  CSS variable only, so the bar stays themeable and animatable. Never bake the value into a
  hard-coded gradient.

### P10 — Rank / pressure row

- **Purpose**: name + status word + full-width bar — hub pressure, area load.
- **Construction**: an `article` grid → name zone (`strong` code + `span` name) + `em` status +
  a full-width `.progress-line`.
- **Parameters**: `grid-template-columns: minmax(0, 120px) minmax(0, 1fr)`; the bar spans
  `1 / -1`; code at `--dvk-screen-font-size-md` (24px); row padding `--dvk-screen-space-md`
  (12px) / `--dvk-screen-space-lg` (16px) with a 1px border and translucent background; list
  `display: grid; gap` `--dvk-screen-space-md` (12px).
- **Grid position**: a left or right column panel body, stacked, `align-content: start`.
- **Replacements**: P9 for a plain progress row; P11 for a triage queue with time and severity.
- **Cautions**: the list must clip (`overflow: hidden`) or it overflows the panel. Row height is
  content-driven, so cap the number of rows per panel instead of fixing the height.

### P11 — Triage card

- **Purpose**: a risk, ticket, or task queue coloured by severity.
- **Construction**: an `article` grid → severity badge `b` + text zone (`strong` title + `span`
  meta) + an optional right `time`.
- **Parameters**: `grid-template-columns: 42px minmax(0, 1fr) 52px; gap`
  `--dvk-screen-space-md` (12px); padding `--dvk-screen-space-md` (12px) /
  `--dvk-screen-space-lg` (16px); `border-left: 3px solid <role colour>`; the severity colour
  comes from a `--dvk-color-*` role.
- **Grid position**: a right column panel body ("dispatch" / "queue"), stacked.
- **Replacements**: P10 when there is no severity dimension; P15 when the items are metrics
  rather than events.
- **Cautions**: this is the closest structural match between the two demos — treat it as
  verified. Badge and time column widths are scene values. Severity colour must map to a named
  role (design-rules 4.2), not to decoration.

### P12 — Rhythm bars

- **Purpose**: intensity by time slice — next N hours, day-long traffic.
- **Construction**: a `div` grid of N equal slices → `article`
  (`grid-template-rows: auto minmax(0, 1fr) auto`) → top `time`, bar slot `div > i`, bottom
  label.
- **Parameters**: `repeat(N, minmax(0, 1fr)); gap` `--dvk-screen-space-md` (12px); bar slot
  `min-height: 72px`; fill `height: var(--bar-value)` with a theme-derived gradient; bottom
  label `--dvk-screen-font-size-xs` (14px).
- **Grid position**: the centre column's bottom row (T1, ~190px) or the footer strip (T3,
  104px).
- **Replacements**: P9 when the data is a share rather than a time series; the strip may be
  dropped on T2/T4.
- **Cautions**: both demos implement it identically — a verified shared pattern. The bar slot
  needs `min-height` or it collapses under `minmax(0, 1fr)`. Slice count and gradient direction
  are scene values.

### P13 — Ring gauge

- **Purpose**: a single percentage — sync rate, health.
- **Construction**: `<dvk-decoration-8>` with `<dvk-count-to>` in its default slot.
- **Parameters**: `colors` from the theme; `dur` 4–6s; a near-square host (128 x 128px); the
  inner `dvk-count-to` at `--dvk-count-to-font-size: 18px`, weight 600, affix 0.58em. Outer
  layout `grid-template-columns: 128px minmax(0, 1fr)` with the caption on the right.
- **Grid position**: a narrow bottom panel of the right column.
- **Replacements**: `dvk-decoration-10` or `-11` for a larger circular visual; a `gauge` chart
  when the value needs a scale.
- **Cautions**: `dvk-decoration-8` is the only slot-bearing ring — size the slotted content to
  the hollow. It appears once in the demos, so verify it visually before reusing it at another
  size. Under `prefers-reduced-motion`, set `paused`.

### P14 — Hero metric

- **Purpose**: one block carrying a single core number.
- **Construction**: a surface panel (P6 role "rounded glow surface panel") + `span` label +
  `dvk-count-to` + `p` caption.
- **Parameters**: `dvk-count-to` `--dvk-count-to-font-size` = `--dvk-screen-font-size-hero`
  (56px), weight 600, affix 0.42em in a role colour; panel padding
  `--dvk-screen-space-xl` (24px).
- **Grid position**: a fixed-height top row of the left column (T1/T4, ~180px).
- **Replacements**: P4 when the number belongs to a strip; P16 for a bare value; P13 when the
  number is a percentage that benefits from a ring.
- **Cautions**: the hero size is a **metric exception**, not a sixth text level — one hero
  number per screen. The demos' 52px is superseded by the token value (56px).

### P15 — Metric stack

- **Purpose**: two secondary metrics side by side or stacked.
- **Construction**: a `section` grid → two `article` cards → `dvk-count-to` in each.
- **Parameters**: `grid-template-rows: repeat(2, minmax(0, 1fr)); gap`
  `--dvk-screen-space-sm` (8px)–`--dvk-screen-space-md` (12px); card padding
  `--dvk-screen-space-md` (12px) / `--dvk-screen-space-lg` (16px); value
  `--dvk-count-to-font-size` = `--dvk-screen-font-size-md` (24px); affix at reduced alpha.
- **Grid position**: a middle row of the left or right column (T1).
- **Replacements**: P4 for a full-width strip; P16 for a single value; `dvk-border-box-15` when
  the framed/unframed alternation is not wanted.
- **Cautions**: the unframed stack creates a framed/unframed alternation — allowed, but the
  screen must stay consistent about it. A naked stack needs enough spacing to read as a group.

### P16 — `dvk-count-to` usage

- **Purpose**: every number that animates.
- **Construction**: `<dvk-count-to>`, with optional `prefix` / `suffix` slots (a slot wins over
  the same-named prop).
- **Parameters**: `start-val`, `end-val`, `duration`, `delay`, `decimals`, `decimal`,
  `separator`, `prefix`, `suffix`, `disabled`, `transition`; CSS variables
  `--dvk-count-to-color/font-family/font-size/font-weight/gap/affix-color/affix-font-size/decimal-color/decimal-font-size/decimal-font-weight`.
- **Grid position**: any metric slot; set `--dvk-count-to-font-size` on the host selector, not
  per instance.
- **Replacements**: none — this is the only count-up primitive. A value that must not animate
  renders statically.
- **Cautions**: in plain single-file HTML every prop is an attribute coerced from a string —
  write the value, not a template expression. Use **one duration per screen**: the demos' 1300 /
  1400 / 1500 / 1600ms spread is unregularized, not a rule. Under `prefers-reduced-motion`, set
  `disabled` so the end value renders immediately. Count-up is a data animation and needs a
  named mapping (design-rules 5.1).

## 7. Map patterns

### P17 — Map stage

- **Purpose**: the screen's visual lead, in the centre column, usually at least two thirds of
  the screen height.
- **Construction**: a large HUD or surface panel (P6 role chosen by capability) + `.map-shell`
  (`grid-template-rows: auto minmax(0, 1fr)`) + a map container (`position: relative;
  overflow: hidden`, 1px border, grid texture) + an inline `<svg viewBox>` + absolutely
  positioned markers + overlay cards.
- **Parameters**: SVG inset 24–32px; texture `background-size: 42px 42px`; paths through
  `<linearGradient>`, flow through `stroke-dasharray`; the panel variant follows §3.
- **Grid position**: the centre column's main row (`minmax(0, 1fr)`), panel head above, map
  filling the rest.
- **Replacements**: a chart-based primary view (see `charts.md`) when the data has no geography;
  `dvk-decoration-10` as a radar-style primary visual.
- **Cautions**: the two demos picked different variants for a capability reason (`-11` has no
  `background-color`, `-10` does) — resolve through §3, never by copying a demo. Keep the map's
  ambience layer behind the panel, not inside the frame. SVG inset values are scene values.

### P18 — Map marker

- **Purpose**: a point on the map — hub, node, flight.
- **Construction**: an absolutely positioned `div` (percentage `left`/`top`) → diamond point `i`
  (`transform: rotate(45deg)`) + a label plate `div` holding `strong` code + `span` name + an
  optional `em` value.
- **Parameters**: `position: absolute; transform: translate(-50%, -50%); display: grid;
  justify-items: center; gap` `--dvk-screen-space-xs` (4px); `min-width: 88px`; the point is
  14–16px with a 2px border and a theme glow; tone colour per role; `pointer-events: none`; the
  label plate carries a `--dvk-color-surface` backing and `--dvk-screen-space-xs` inline padding
  so the map's connection lines never cross the code or the name.
- **Grid position**: inside the map container; coordinates are percentages, decoupled from the
  SVG `viewBox`.
- **Replacements**: a symbol layer once markers exceed ~20 (DOM markers stop scaling); P19 for a
  summary anchored to a marker.
- **Cautions**: the two demos hand-write different names and sizes (88px vs 94px) — use this one
  pattern. `pointer-events: none` is mandatory, or the markers block map interaction. Labels
  collide before points do, so the marker count is a density decision.

### P19 — Map overlay card

- **Purpose**: a conclusion or annotation over the map without interrupting it.
- **Construction**: an absolutely positioned `section` (`right` / `bottom`) → `span` eyebrow +
  `strong` conclusion + `p` caption.
- **Parameters**: width 300–360px; padding `--dvk-screen-space-lg` (16px); a 1px border from a
  role colour; background alpha >= 0.8 for legibility over the map.
- **Grid position**: bottom-right of the map container.
- **Replacements**: a smaller region label for a single zone; a tooltip when the content is
  per-marker.
- **Cautions**: offset values are scene values. An alpha below 0.8 makes the text unreadable
  over map detail — a contrast problem, not a taste problem.

## 8. Cross-pattern rules

- **Default slot only**: every border box exposes only the default slot; `frame`, `graphic`, and
  `content` are parts. Panel titles go inside the default slot.
- **One colour source**: colours come only from the active theme's `--dvk-color-*`. No palette
  extracted from the demos or from component-doc demos may be reused.
- **One theme per screen**: exactly one `.dvk-theme-*` class per screen (design-rules, "One
  theme per screen").
- **Fluid rows**: `minmax(0, 1fr)` for the main region, never fixed px row heights.
- **Named mapping**: every decoration and every motion must map to a named data or interaction
  semantic.
- **Token vocabulary**: values in this file are token references; the authoritative numbers are
  in `tokens.md` and `assets/tokens.css`.
- **Runtime availability**: check `customElements.get(tag)` after registration and follow
  `components.md` for capability fields, publication status, and the fetch/fallback protocol.
- **Never reference `title-4`**: it does not exist.
