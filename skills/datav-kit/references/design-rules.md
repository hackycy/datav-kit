# Design Rules — Large-Screen Dashboards

The single authority for design redlines and advisory values. Every rule below is derived
1:1 into a review rubric item (see [Rubric derivation](#rubric-derivation)).

**Tiers**

- `[redline]` — must not be violated. Binary pass/fail; any failure fails the case.
- `[advisory]` — may be deviated from, but the deviation must be registered in the project's
  deviation ledger. An unregistered deviation is a defect.

🅰 marks an accessibility cross-rule. Accessibility has no separate group; it constrains the
groups where it applies and is summarised in [Accessibility cross-rules](#accessibility-cross-rules).

**Source labels** (recorded per entry; cited thresholds and self-defined thresholds are
distinguished):

| Label | Meaning |
| --- | --- |
| `[standard]` | normative standard, primary text verified |
| `[standard-2nd]` | standard clause obtained via third-party transcription, not the official text |
| `[guide]` | official guidance from a vendor or organisation |
| `[research]` | academic study or measured result |
| `[repo]` | fact measured in this repository |
| `[custom]` | self-defined threshold — no external standard exists |
| `[derived]` | derived from another entry in this file |

**Checkability**: only quantified thresholds are listed. Entries marked `mech` can be checked
mechanically (a script or a count); `review` needs a human or model judgement. Purely stylistic
descriptions are stated as prose advice, not as thresholds.

---

## 1. Canvas and Grid

| # | Tier | Rule | Threshold / criterion | Source | Check |
| --- | --- | --- | --- | --- | --- |
| 1.1 | `[redline]` | Proportional scaling | No non-uniform stretch; a screen with text or line work must not use `fill` | `[derived]` geometry class | review |
| 1.2 | `[redline]` | Content safe area | Content sits inside `contentRect`; it must not cover decorative line work | `[repo]` architecture contracts | mech |
| 1.3 | `[redline]` | No overflow or clipping | No block content truncated by `overflow` at the design canvas | `[repo]` 26px overflow found in an existing demo | mech |
| 1.4 | `[advisory]` | Safe margin | `48px` default; video wall or overscan risk tightens to 5% (`96px` horizontal / `54px` vertical) | `[custom]` — no standard gives px values | mech |
| 1.5 | `[advisory]` | Grid | 12 columns / gutter `24px` / margin `48px`, on the 8pt grid | `[custom]` | mech |
| 1.6 | `[advisory]` | Fluid row height | Main region uses `minmax(0, 1fr)`, never fixed px rows | `[repo]` | mech |
| 1.7 | `[advisory]` | Sub-pixel line width | In scaled scenes use `vector-effect: non-scaling-stroke`; do not rely on 1px CSS borders | `[standard]` CSS Transforms — `scale()` is post-layout | mech |
| 1.8 | `[advisory]` | Canvas | 1920 x 1080, `mode="contain"` + `align="center center"`; outside canvas space is filled with an ambience layer, not dead black | `[derived]` | mech |
| 1.9 | `[advisory]` | Degradation | Ultra-wide 21:9/32:9: keep the 16:9 content area centred, fill the sides with an auxiliary band or ambience — never stretch or crop. Video wall: fixed height 1080, width = units x 1920, fine elements (<2px line, <16px text) avoid the seams. Portrait: **not supported**. Screen <=1440: preview only, never a delivery target | `[custom]` — no standard for 21:9 | review |

## 2. Spacing and Rhythm

| # | Tier | Rule | Threshold / criterion | Source | Check |
| --- | --- | --- | --- | --- | --- |
| 2.1 | `[advisory]` | Spacing scale | 8pt grid: `4/8/12/16/24/32/48/64/96` (token set in `tokens.md`) | `[guide]` Carbon 8px unit; Ant Design `sizeUnit` 4 | mech |
| 2.2 | `[advisory]` | Screen rhythm | Screen margin `48` / block gap `24` / panel gap `16` / panel padding `24` / header `104` / KPI strip `104` | `[custom]` | mech |
| 2.3 | `[advisory]` | Modules per screen | 5–9 modules | `[guide]` Ant Design | mech |
| 2.4 | `[advisory]` | Whitespace rhythm | The gap between adjacent blocks is at least the smallest spacing step used inside either block | `[derived]` | mech |

## 3. Typography and Hierarchy

| # | Tier | Rule | Threshold / criterion | Source | Check |
| --- | --- | --- | --- | --- | --- |
| 3.1 | `[redline]` 🅰 | Minimum font size | Physical character height = viewing distance / 200; coloured characters >= 21 arcmin (30 arcmin recommended); shortcut: max viewing distance = 215 x character height | `[standard-2nd]` T/CIDADS 00011-2022; `[standard]` ISO 9241-3 §6.4 | review |
| 3.2 | `[redline]` 🅰 | Key data is not hover-only | Primary metrics are statically visible | `[guide]` OpenAI quality gate | review |
| 3.3 | `[advisory]` | Font families | <= 2 families on one screen | `[standard-2nd]` T/CIDADS | mech |
| 3.4 | `[advisory]` | Type levels | 3–5 levels | `[guide]` Ant Design | mech |
| 3.5 | `[advisory]` | Weights | 400 / 500 for most text; 600 for Latin bold | `[guide]` Ant Design | mech |
| 3.6 | `[advisory]` 🅰 | Line length | <= 40 CJK characters per line; no justified alignment | `[standard]` WCAG 1.4.8 | mech |
| 3.7 | `[advisory]` 🅰 | Line height | >= 1.5x font size; paragraph spacing >= 2x | `[standard]` WCAG 1.4.12 | mech |

## 4. Color Roles

Colors come only from the theme's `--dvk-color-*` values. **No second color source** — no
hard-coded palette, no separate chart palette file.

| # | Tier | Rule | Threshold / criterion | Source | Check |
| --- | --- | --- | --- | --- | --- |
| 4.1 | `[redline]` 🅰 | Contrast floor | Body text >= 4.5:1; large text >= 3:1 (large = >= 18pt / 14pt bold / CJK equivalent, approx 24px / 18.5px); non-text and state indicators >= 3:1. **Never round**: 4.499:1 is not 4.5:1 | `[standard]` WCAG 2.2 SC 1.4.3 / 1.4.11 | mech |
| 4.2 | `[redline]` | No role overloading | One hue must not carry several unrelated meanings | `[guide]` OpenAI | review |
| 4.3 | `[advisory]` | Colour role ledger | 10 roles: neutral background / primary focus / secondary contrast / ordered magnitude / positive-negative change / alert-error / selected / hover-focus / missing-uncertain / disabled or expired | `[guide]` OpenAI | review |
| 4.4 | `[advisory]` | Colour count | <= 5 categorical data colours; <= 2 interface accent colours; semantic colours counted separately | `[custom]` | mech |
| 4.5 | `[advisory]` | Contrast ceiling | Body text sits in 7:1–15:1; dark scenes avoid pure white text on pure black | `[custom]`; `[standard]` MIL-STD-1472H 6:1–10:1, FAA/NATS > 15:1 discomfort | mech |
| 4.6 | `[advisory]` | Colour scale | Sequential/diverging scales must be perceptually uniform; **no rainbow scale** | `[research]` Moreland 2009 | mech |
| 4.7 | `[advisory]` | White area | <= 40% of the screen area | `[standard-2nd]` T/CIDADS | mech |
| 4.8 | `[advisory]` | Adjacent mark contrast | When a boundary itself carries meaning, also check contrast between adjacent data marks | `[guide]` OpenAI | mech |

## 5. Decoration and Motion Budget

| # | Tier | Rule | Threshold / criterion | Source | Check |
| --- | --- | --- | --- | --- | --- |
| 5.1 | `[redline]` | Decoration must be semantic | Every glow / pulse / halo / blur / particle / shimmer / animation must have a **named data or interaction mapping**. If it is only "pretty", delete it | `[guide]` OpenAI | review |
| 5.2 | `[redline]` 🅰 | Motion is controllable | Autoplay motion longer than 5s must be pausable/stoppable/hideable; flashing <= 3 times per second; `prefers-reduced-motion` is honoured | `[standard]` WCAG 2.2.2 / 2.3.1 / 2.3.3 | mech |
| 5.3 | `[advisory]` | Duration tiers | Interaction 150–300ms (`--dvk-screen-duration-*`); decoration follows the theme's `--dvk-motion-duration` (2200–2600ms); charts 200–400ms | `[guide]` Carbon / Ant Design / NN/g; `[repo]` theme token range | mech |
| 5.4 | `[advisory]` | Decoration budget | <= 1 decoration container + 1 decoration track per block; decoration visual weight stays below the data layer of the same block. Defined by hierarchy, not by element count | `[custom]` | review |
| 5.5 | `[advisory]` | Anti-AI ambience | Refuse broad brush strokes, wispy ribbons, bokeh/orbs, cinematic wallpaper, one-hue drama, decorative gradients, unmotivated particles | `[guide]` OpenAI | review |
| 5.6 | `[advisory]` | Gradient and glow | No gradient as a substitute for a sequential palette; no glow as a substitute for shadow/elevation | `[guide]` Carbon / Material | review |

## 6. Data Presentation and Exception States

| # | Tier | Rule | Threshold / criterion | Source | Check |
| --- | --- | --- | --- | --- | --- |
| 6.1 | `[advisory]` | Label directly | Direct labels beat a detached legend; a legend that is used must sit next to the chart | `[guide]` OpenAI / Carbon / Datawrapper | review |
| 6.2 | `[advisory]` | Mark count | <= 4 lines; <= 5 pie categories; <= 3 gauge needles | `[guide]` ECharts Handbook | mech |
| 6.3 | `[advisory]` | Legend height | <= 30% of chart height | `[guide]` Carbon | mech |
| 6.4 | `[advisory]` | Axis origin | Bar charts start the y-axis at 0; line charts need not | `[guide]` Datawrapper | mech |
| 6.5 | `[advisory]` | Forbidden chart forms | No 3D pie/bar, no dual axis, no rainbow scale, no over-smoothing | `[research]` Wilke; `[guide]` Datawrapper; `[research]` Moreland | mech |
| 6.6 | `[advisory]` | Four exception states | No data / loading / failed / stale — every state has an explicit presentation | `[guide]` OpenAI | mech |
| 6.7 | `[advisory]` | Real-time data | Prefer stale-but-visible over a blank chart; show the last update time and a live/stale/offline/partial state | `[guide]` OpenAI | review |

---

## Accessibility cross-rules

These are the 🅰 entries above, collected. They are redlines wherever the group marks them
`[redline]`; the remaining ones are advisory with a registered-deviation path.

| Rule | Threshold | Source |
| --- | --- | --- |
| Contrast (4.1) | body >= 4.5:1, large text >= 3:1, non-text >= 3:1, no rounding | WCAG 2.2 SC 1.4.3 / 1.4.11 |
| Minimum font size (3.1) | viewing distance / 200; coloured characters >= 21 arcmin | T/CIDADS 00011-2022; ISO 9241-3 §6.4 |
| Key data not hover-only (3.2) | primary metrics statically visible | OpenAI quality gate |
| Motion controllable (5.2) | > 5s pausable, flashing <= 3/s, reduced motion honoured | WCAG 2.2.2 / 2.3.1 / 2.3.3 |
| Keyboard reachable | all interactive elements reachable by keyboard | WCAG 2.1.1 |
| Focus appearance | >= 2 CSS px perimeter and >= 3:1 contrast | WCAG 2.4.13 |
| Text resizing | text scales to 200% without loss of content or function | WCAG 1.4.4 |
| Line length / line height (3.6, 3.7) | <= 40 CJK; >= 1.5x | WCAG 1.4.8 / 1.4.12 |

## One theme per screen

A screen uses exactly **one** theme class (`.dvk-theme-*`). Mixing several theme classes on one
screen is forbidden, including per-block themes. To emphasise a region, use the accent colour
role from the ledger — not a second theme. `[custom]`

## Rubric derivation

- **1:1 derivation**: every rule above becomes exactly one rubric item, carrying its tier. The
  free zone (business copy, chart type and option inside a block, pattern substitution inside a
  block) is not scored.
- **Redline item = binary**: pass / fail. **Any failed redline fails the case.**
- **Advisory item = three levels**: meets / registered deviation / unregistered deviation. An
  unregistered deviation is a defect.
- **No total score**: averaging hides a failed redline.
- **Writeback rule**: every failed redline and every unmet advisory value must be turned into a
  skill revision item, otherwise the review is not complete.
- The self-check list is derived 1:1 from these entries and must be able to detect hard-coded
  values in the implementation.
