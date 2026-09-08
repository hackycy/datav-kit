---
name: datav-kit
description: Design and build large-screen data dashboards with datav-kit Web Components (`dvk-*`). Use when the user wants a 数据大屏 / dashboard screen, needs to choose or compose datav-kit elements, or wants dashboard output reviewed against a design spec.
---

# datav-kit — Large-Screen Dashboards

Route a 大屏 brief through one contract: clarify → prototype → select → implement → self-check →
review. The skill carries the design rules, the composition patterns, the component availability
model, and the screen token set. It does not wrap the components and does not bundle a chart
library.

## 1. When this skill applies

**Use it when the work is a large screen** — a 数据大屏, dashboard wall, or control-room display
built from datav-kit `dvk-*` Web Components, including:

- choosing and composing `dvk-*` elements into a screen;
- laying a screen out against the design contract;
- reviewing existing dashboard output against that contract.

**Do not use it for:**

- ordinary back-office pages or any non-large-screen UI — the density, type, and layout rules here
  are calibrated for viewing distance, not for a desk monitor;
- projects that do not use datav-kit components.

This skill adds no wrapper components and no second color system. Every color comes from the
active theme's `--dvk-color-*` values; screen tokens (`--dvk-screen-*`) are not part of the theme
and are declared on `.dvk-screen`, never on `:root`.

## 2. Coverage and preflight

Establish what is actually available before naming a component in a plan or a prototype.

| Status | Count | Components |
| --- | --- | --- |
| Published (`@datav-kit/elements@0.0.5`) | 30 | `dvk-border-box-1`…`15`, `dvk-decoration-1`…`11`, `dvk-count-to`, `dvk-fit-screen`, `dvk-loading-energy`, `dvk-loading-orbit` |
| `main` branch only | 5 | `dvk-title-1`…`3`, `dvk-border-box-16`, `dvk-performance-monitor` |
| Nonexistent | — | `dvk-title-4` — an empty directory; never reference it |

This list is a planning aid. **Runtime availability is the authority**, checked after the element
package has finished registering:

```js
await import('@datav-kit/elements@0.0.5')
customElements.get('dvk-border-box-10') // truthy → registered
```

- Never pass a prop to a component that is not registered.
- If every candidate in a fallback chain is unavailable, stop and report the missing package.
- The header follows the same rule: `customElements.get('dvk-title-1')` decides between
  `dvk-title-*` (Title 1 enterprise/industrial, Title 2 command centre, Title 3 city operations)
  and the hand-built P3 title bar. `dvk-title-4` does not exist.

**Detail routing is online-first.** Use the live `llms.txt` index to decide *whether* a component
fits; fetch its detail page before writing props, events, CSS variables, or `::part()`. Do not
fetch the same page twice in one session. If the index omits the component or the page 404s, fall
back to the repository raw URL and label the result "from `main` — may not be published yet".

Availability list, capability fields, and the full fetch protocol: `references/components.md`.

**One theme per screen.** A screen uses exactly one `.dvk-theme-*` class. To emphasise a region,
use the accent color role — never a second theme.

## 3. The six-step workflow

Artifacts land in the project's `design/` directory so the process stays traceable and reviewable.

| # | Step | Artifact | Exit condition |
| --- | --- | --- | --- |
| ① | Clarify | `design/brief.md` | All seven brief questions answered (§5) |
| ② | Prototype | `design/prototype-*.html` (2–3) | Each opens by double-click with no console errors |
| ③ | Select | `design/decision.md` | The user has explicitly chosen one; deviations registered |
| ④ | Implement | project code | The screen runs at the target resolution |
| ⑤ | Self-check | `design/self-check.md` | **Every redline passes** |
| ⑥ | Review | `design/review.md` | Review record plus the skill revision items it produced |

Step ② rewrites 2–3 of the four templates T1–T4 instead of starting from a blank page. Step ⑤
derives its checklist 1:1 from `references/design-rules.md` — redlines binary, advisory values
three-level — and must be able to detect hard-coded values where a token was required. Step ⑥
turns every review finding into a skill revision item; without that the review is not complete.

## 4. Five hard gates

1. **No implementation before a prototype is selected.**
2. **No prototype before the brief is clarified** — viewing distance and resolution are what make
   font-size calibration possible.
3. **No review before every redline passes.** A failure is fixed first, or the screen goes back to
   a prototype.
4. **Touching a redline or changing the skeleton → go back and re-select a prototype.** Skeleton
   means row count, column count, primary-view position, header form, or adding/removing a block.
5. **An unregistered advisory-value deviation is a defect.**

## 5. The brief — seven questions

Ask all seven before step ②; an unanswered question blocks the prototype.

| # | Question | Decides |
| --- | --- | --- |
| 1 | Business domain / scenario | Template choice (T1–T4) |
| 2 | Core metrics (3–9) | KPI strip and block content |
| 3 | Data source and refresh rate | The four exception states, especially "stale" |
| 4 | **Target screen: size, resolution, viewing distance** | **Font-size calibration** |
| 5 | Theme | One library theme, or a custom project theme |
| 6 | Interaction (none, click, drill-down) | Static display vs. interactive screen |
| 7 | Delivery form (static HTML / Vue / React / other) | How it is implemented and charts are wired |

## 6. Redline quick reference

Four classes, plus the one-theme rule. `references/design-rules.md` owns the entries, thresholds,
and sources — this is the index, not a second copy.

| Class | The redline, in one line |
| --- | --- |
| Readability | Contrast floor (body ≥ 4.5:1, large text ≥ 3:1, non-text ≥ 3:1, **never rounded**); minimum font size = viewing distance / 200; key data is not hover-only |
| Geometry | Proportional scaling only — no non-uniform stretch; content stays inside the safe area and must not overflow or clip |
| Semantics | Every glow, motion, and decoration needs a named data or interaction mapping — if it is only "pretty", delete it |
| Accessibility | `prefers-reduced-motion` is honoured; flashing ≤ 3/s; autoplay over 5s is pausable; keyboard reachable with a visible focus ring |

Advisory values may be deviated from, but each deviation is registered with a one-line reason;
an unregistered one is a defect (gate 5). **One screen, one theme.**

## 7. Reference index

Resident — read them as part of the workflow:

| File | Owns |
| --- | --- |
| `references/design-rules.md` | Six rule groups, tiers, thresholds, sources, rubric derivation |
| `references/patterns.md` | Routing path, T1–T4 templates, P1–P19 patterns, the P6 border-box matrix |
| `references/components.md` | Availability, border-box capability fields, online-first detail routing |
| `references/tokens.md` | `--dvk-screen-*` values, scope, precedence, calibration |
| `assets/tokens.css` | Reference implementation of the token set under `.dvk-screen` |

On demand:

| File | Read it when |
| --- | --- |
| `references/charts.md` | Choosing a chart form, or bridging tokens into a chart library |
| `assets/charts/*.js` | You need a runnable chart starting point |
| `assets/prototypes/t*.html` | You are writing step ② |
| `assets/themes/theme-template.css` | The project needs its own theme |
| `assets/tools/contrast-check.js` | You are checking the contrast redline |
| `assets/minimal-example.html` | You want the smallest working screen |
