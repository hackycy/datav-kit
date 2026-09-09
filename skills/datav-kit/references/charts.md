# Chart Guidance — Large-Screen Dashboards

Owns chart selection, the token bridge, and ECharts usage. **The library-neutral guidance is
normative for every project**; the seven modules in `assets/charts/` are an ECharts reference
implementation (used by `assets/prototypes/`, available as a project default) and are never a
datav-kit component abstraction.

| Layer | Content | Status |
| --- | --- | --- |
| Library-neutral | selection matrix, colour roles, four exception states, padding, type sizes, stroke tiers, anti-patterns, performance guards | design rule — holds for any chart library |
| ECharts-specific | token injection, `setTheme`, resize, DPR compensation, explicit `grid` | reference implementation — copy it or replace it |

Colour comes only from the theme's `--dvk-color-*` values (`design-rules.md` §4). There is **no
second palette** — no chart colour file, no hard-coded hex, no per-chart theme. One screen, one theme.

## 1. Selection matrix

| Data shape | Preferred | Also acceptable | Anti-patterns (source) | Hard cap |
| --- | --- | --- | --- | --- |
| Time series — a metric over time | `line`, `area` | `bar` for a few discrete periods | More than 4 lines in one chart — lines entangle and lose contrast (ECharts handbook, basic-line); flattening or exaggerating the trend; `smooth: true` over-smoothing (design-rules 6.5) | 4 series |
| Part-to-whole — composition | `doughnut`, `radius: ['58%', '75%']` | stacked bar when the parts must be compared | Pie for close values — "people is less sensitive to the minor radian difference" than to small length differences (series-pie); 3D pie distorts the ratio (handbook) | 5 categories |
| Ranking — discrete comparison | horizontal `bar`, sorted, `yAxis.inverse: true` | lollipop for long lists | Bar axis not starting at 0 — "it will mislead the user" (handbook); a second colour when length already encodes the value; 3D bar | virtualise beyond ~20 rows |
| Distribution — spread and correlation | `scatter` (+ symbol size for a third dimension) | heatmap when points overlap densely | Scatter with no visible correlation; implying causality; a handful of unrelated points (handbook) | 1 series per relation |
| Density — two-dimensional | `heatmap` on two **category** axes | `scatter` with opacity when both axes are continuous | Rainbow sequential scale (design-rules 4.6); heatmap on two value axes — ECharts requires two categories | progressive rendering |
| Geographic | `map` / `geo` — **documentation only, no template** (§2) | a region list plus bars when geography adds nothing | Shipping boundary data without a licence check; a geographic layout for non-geographic data | see §2 |
| Relationship | `graph` with `layout: 'none'` (fixed coordinates) or `'circular'` | an adjacency matrix | `layout: 'force'` above ~100 nodes — the handbook warns the browser can hang; per-frame force jitter reads as noise on a wall screen | 100 nodes for force |
| Single value — progress | `gauge`, at most 3 pointers | KPI card with a sparkline | A gauge carpeted across several variables — "not suitable for carpeting different variables or trends" (handbook); more than 3 pointers; a gauge whose only job is one number — a big number is cheaper and more legible | 3 pointers |
| Multidimensional — profile | `radar`, at most 5 axes | parallel coordinates for an expert audience | More than 5 axes — "both the outline and color block will be too confusing to read" (handbook); reading exact values off radial distance — the handbook recommends a line chart for that | 5 indicators |
| Hierarchy — levels | `treemap` | `sunburst` with drill-down off | `tree` for a forest — "Forests are not currently supported directly in a single series"; `sunburst` left with its default `nodeClick` drill-down on an unattended screen | — |

Two forms are forbidden outright (design-rules 6.5): 3D pie/bar, and dual axis. A second y-axis
hides the fact that two series share no scale — split the panel instead.

## 2. Geographic is documentation-only

No map template is shipped. ECharts removed the built-in geoJSON files in v5 — "These geoJSON files
were always sourced from third parties" (v5 upgrade guide) — so a map is a data-and-licence decision,
not a template decision. To add one:

1. Obtain boundary data and **record its licence**. The ECharts FAQ points at third-party sources;
   each project verifies its own terms.
2. `echarts.registerMap(name, geoJSON)` before the first `setOption`.
3. `series: [{ type: 'map', map: name }]` plus a `visualMap` for the value scale (same single-hue
   ramp as §5).
4. Everything else still applies: the min-size guard, the four states, and the token bridge.

`themeRiver`, `candlestick`, and the `tree` family are the same kind of decision — heavy, narrow, or
licence-bound — so they are not templates either.

## 3. Token bridge contract

The same eight tokens drive **any** chart library. ECharts cannot read CSS variables (the
maintainers declined the feature), so the bridge reads computed values and hands them over.

| Token | Maps to |
| --- | --- |
| `--dvk-color-primary` | palette position 1 / primary focus colour |
| `--dvk-color-secondary` | palette position 2 / contrast colour |
| `--dvk-color-accent` | accent — selection or alert emphasis |
| `--dvk-color-surface` | tooltip / overlay background |
| `--dvk-glow-soft` | shadow (blur radius + colour) |
| `--dvk-line-width` | axis and split-line width |
| `--dvk-motion-duration` | **not mapped** — decoration cycle (2200–2600ms), not a chart transition |
| `--dvk-screen-font-size-*` | in-chart type size |

Rules that come with the bridge:

- Read the tokens from the **nearest themed ancestor** of the chart container (or the container
  itself, which inherits them) — never assume `document.documentElement` carries the screen's theme.
- Read only self-contained values (hex / rgb / rgba / px). `var()` is substituted by the browser,
  but `rem` is not converted and `color-mix()` is not evaluated.
- ECharts has no alpha syntax: derive translucent roles in JS (`withAlpha`), do not bake them into
  the theme file.
- Do **not** map `--dvk-motion-duration` into chart animation. Chart transitions stay in the
  200–400ms band; the theme token is a decoration cycle and makes a chart crawl.
- Do not map `--dvk-color-surface` to the chart background. The panel already paints a surface;
  a second one muddies it. It belongs on tooltips and overlays.

## 4. Copy vs adjust

Each module in `assets/charts/` is self-contained and copy-and-run: the bridge, the option skeleton,
the resize wiring, the state layer, and the guards are all inside the one file. Copy the six pieces
verbatim; change only what the data demands.

| Piece | What it is | Copy? |
| --- | --- | --- |
| Token injection | `readDatavTokens()` → `buildTheme()` → `init(el, themeObject)` | **verbatim** |
| Option skeleton | explicit `grid` / `center` + `radius`, explicit guards, no library defaults | skeleton verbatim, values per chart |
| Resize | `ResizeObserver` + `requestAnimationFrame` → `chart.resize()` | **verbatim** |
| Theme switching | `chart.setTheme(themeObject)` — never `dispose()` + re-init | **verbatim** |
| Four states | loading / empty / failed / stale, exposed as `setState()` | **verbatim** |
| Performance guard | `sampling`, `large` + `largeThreshold`, `progressive`, `animationThreshold` | **verbatim** |

Must be adjusted for every real dataset — copying these is the defect:

- the series data and its shape;
- the axis categories, ranges, and sort order;
- which colour role each series carries (primary focus vs secondary contrast vs accent);
- **the chart type itself**, when the data shape is not the one the template assumes.

## 5. Space, size, type, strokes

- **Fill the panel's content area; add no DOM padding.** `dvk-border-box-*` already computes an
  8–44px inset from its `contentRect` and scales it with the panel. Set the chart container to
  `width: 100%; height: 100%` and let it fill `::part(content)`.
- **Override `grid` explicitly.** The library defaults (`left/right: '10%'`, `top/bottom: 60`)
  waste most of a small panel. Use px values plus `outerBoundsMode: 'same'` /
  `outerBoundsContain: 'axisLabel'` (the v6 replacement for `containLabel`). Non-cartesian types
  (pie, gauge, radar) have no `grid` — give them an explicit `center` and `radius` instead.
- **To change the chart's own breathing room, override the token** — not by adding margin.
  Cascade: `--dvk-border-box-<N>-padding` → `--dvk-border-box-padding` → the computed safe area.
  The computed inset is the safe distance and the default; an override is a registered deviation
  for a measured problem, never a way to dodge a decoration or to buy space.
- **Minimum size guard: content area < 160 x 100** → degrade to a `dvk-count-to` value card or a
  mini sparkline (no axes, no labels). Decide from the container size, not from the rendered chart.
- **Type sizes**: axis labels and legend use `--dvk-screen-font-size-xs` (14); data labels and
  tooltips use `--dvk-screen-font-size-sm` (18). **Panel titles never go inside the chart** — they
  are DOM (`.panel-heading`), so they inherit CSS variables and stay readable to assistive tech.
- **Stroke tiers**: non-data 0.5–1px; data lines 1.5–2.25px; emphasis lines 2.5–3px. Axis and
  split lines take `--dvk-line-width`; a series line is heavier than an axis by design.
- **Legend** sits next to the chart, never detached, and stays ≤ 30% of the chart height
  (design-rules 6.3). Prefer direct labels — a legend is the fallback.

## 6. Four exception states

Every chart implements all four (design-rules 6.6), and prefers **stale but visible** over a blank
panel (design-rules 6.7).

| State | Chart side | DOM side |
| --- | --- | --- |
| Loading | `showLoading('default', { maskColor: 'transparent', color, textColor })` — **always override the default mask**, which is `rgba(255,255,255,0.8)` and paints a white sheet over a dark screen | optional `dvk-loading-*` component for a themed spinner |
| No data | `graphic` group (circle + text), cleared with `replaceMerge: ['graphic']`; `data: []` and `data: [0, 0]` are different — the latter still draws | — |
| Failed | `chart.clear()` — the chart holds no frame | `role="alert"` overlay with the message and, if available, a retry affordance |
| Stale | keep the last frame; mark missing spans with `null` (breaks the line) or `markArea` | a `最后更新` badge plus a dashed outline |

The failed and stale layers live in the DOM on purpose: they can be announced, themed, and
repositioned without touching the canvas. Empty-state text is `silent: true` so it never swallows
pointer events.

## 7. Anti-patterns

- More than 4 lines, 5 pie categories, or 3 gauge pointers (`design-rules.md` 6.2).
- 3D anything, dual axes, rainbow sequential scales, over-smoothing (6.5).
- A chart smaller than 160 x 100 with axes and labels still drawn.
- A legend parked in a corner, detached from the marks it names (6.1).
- Axis lines or labels rendered in a data colour — the data layer must outrank the frame.
- A chart that re-inits on theme change (`dispose()` + `init()`), which flashes and loses state.
- Chart animation driven by `--dvk-motion-duration`.
- Decoration inside the plot area with no data mapping (5.1) — including a gradient that pretends
  to be a value scale.

## 8. Performance guards

| Guard | Setting | Why |
| --- | --- | --- |
| Renderer | SVG under `dvk-fit-screen` scaling; canvas only above ~1k points | a CSS `transform: scale()` blur is not repairable by `resize()` in echarts 6.1.0 |
| Downsampling | `sampling: 'lttb'` on line series | keeps trend and extrema when points far exceed pixels; off by default |
| Large mode | `large: true` + `largeThreshold` (bar 400, scatter 2000) | only activates at the threshold; above it per-item styles and labels are dropped, so it is a last resort |
| Progressive | `progressive` / `progressiveThreshold` (default 3000) | renders in chunks instead of blocking the frame |
| Animation | `animationThreshold: 2000`; `animation: false` under `prefers-reduced-motion` | large scenes skip animation automatically |
| Resize | `ResizeObserver` + `requestAnimationFrame`, `disconnect()` on teardown | `window.resize` never fires for panel or fit-screen changes |

## 9. Theme switching

- Switch with `chart.setTheme(themeObject)`. ECharts does not observe CSS variable changes, so the
  class change alone repaints nothing — re-read the tokens and call `setTheme`.
- Never `dispose()` + `init()` to change theme: it flashes, re-runs the entry animation, and a
  repeated `init()` on the same DOM returns the old instance without a word.
- Under `dvk-fit-screen` scaling prefer the SVG renderer. echarts 6.1.0 `resize()` does not refresh
  device pixel ratio, so a canvas chart that changes scale needs a full re-init.
- One screen, one theme (`design-rules.md`). Chart colour comes from that theme only.

## 10. Reference templates

All seven export `createXxx(el, data, tokens)` and return
`{ chart, update, setState, setTheme, dispose }`. `tokens` defaults to a read off `el`.

| File | Factory | Data shape | Guard |
| --- | --- | --- | --- |
| `assets/charts/line-area.js` | `createLineArea` | `{ labels, series: [{ name, data }] }` | ≤ 4 series; `sampling: 'lttb'`; `null` breaks the line |
| `assets/charts/bar-rank.js` | `createBarRank` | `{ items: [{ name, value }], unit }` | value axis from 0; `large` at 400 items |
| `assets/charts/pie-doughnut.js` | `createPieDoughnut` | `{ items: [{ name, value }] }` | ≤ 5 categories; `minAngle`, `avoidLabelOverlap` |
| `assets/charts/scatter.js` | `createScatter` | `{ series: [{ name, points: [[x, y, size?]] }] }` | `large` at 2000 points |
| `assets/charts/gauge.js` | `createGauge` | `{ value, min, max, unit, label }` | one pointer; never more than 3 |
| `assets/charts/radar.js` | `createRadar` | `{ indicators: [{ name, max }], series: [{ name, values }] }` | ≤ 5 indicators |
| `assets/charts/heatmap.js` | `createHeatmap` | `{ xLabels, yLabels, cells: [[x, y, value]] }` | two category axes; single-hue ramp; progressive |
