# Screen Design Tokens

The `--dvk-screen-*` token set is the design vocabulary for a large screen: spacing, type,
layering, interaction motion, and layout. Reference implementation: `assets/tokens.css`
(copy it into the project, then override only what the project needs).

## Scope and precedence

- **Scope**: declare these tokens on the large-screen root container `.dvk-screen`.
  Never `:root` — the host page outside the screen must not inherit them.
- **Precedence**: project override > skill default > component fallback.
  A project value on `.dvk-screen` (or a narrower selector inside it) wins; otherwise the
  `assets/tokens.css` default applies; otherwise the element's own `--dvk-*` fallback applies.
- **Colors are read-only**: this set declares **no** color token. Every color comes from the
  theme's `--dvk-color-*` values. Do not introduce a second color source.
- Screen tokens are **not** part of a theme. A theme carries colors and glow only; screen
  tokens stay in the screen layer so one theme can serve every screen.

## 1. Spacing — 8pt grid

| Token | Value | Use |
| --- | --- | --- |
| `--dvk-screen-space-xs` | `4px` | hairline separation, icon-to-label |
| `--dvk-screen-space-sm` | `8px` | inside a compact row |
| `--dvk-screen-space-md` | `12px` | label-to-value |
| `--dvk-screen-space-lg` | `16px` | panel spacing (adjacent panels) |
| `--dvk-screen-space-xl` | `24px` | block spacing, panel padding |
| `--dvk-screen-space-2xl` | `32px` | section spacing |
| `--dvk-screen-space-3xl` | `48px` | screen margin, major section gap |
| `--dvk-screen-space-4xl` | `64px` | hero block breathing room |
| `--dvk-screen-space-5xl` | `96px` | rare, full-width separation |

Adjacent blocks must not use a step smaller than the smallest step inside either block.

## 2. Typography

| Token | Value | Use |
| --- | --- | --- |
| `--dvk-screen-font-family` | `Inter, "PingFang SC", "Microsoft YaHei", sans-serif` | single screen family |
| `--dvk-screen-font-size-xs` | `14px` | axis labels, legends, secondary text |
| `--dvk-screen-font-size-sm` | `18px` | data labels, tooltips, body |
| `--dvk-screen-font-size-md` | `24px` | panel titles, key values |
| `--dvk-screen-font-size-lg` | `32px` | KPI values |
| `--dvk-screen-font-size-xl` | `44px` | screen title, hero KPI |
| `--dvk-screen-font-size-hero` | `56px` | hero number only — not a 6th text level |
| `--dvk-screen-font-weight-regular` | `400` | default text |
| `--dvk-screen-font-weight-medium` | `500` | emphasis, values |
| `--dvk-screen-font-weight-bold` | `600` | Latin bold only |
| `--dvk-screen-line-height-tight` | `1.25` | single-line values |
| `--dvk-screen-line-height-base` | `1.5` | multi-line text |

**Hero exception**: `--dvk-screen-font-size-hero` belongs to metrics, not to the text scale.
The text scale stays at five levels (`xs`–`xl`).

### Calibration (required for every project)

The defaults are calibrated for a **4m x 2.25m screen at 6m viewing distance**. A monitor and
a large screen differ by an order of magnitude in physical character height, so recalibrate:

```txt
minimum font size (px) = (viewing distance / 200) x (1080 / screen height)
```

- `viewing distance` and `screen height` in the same unit (e.g. metres); the screen height is
  the physical height of the display, not the CSS pixel height.
- Apply the result to `--dvk-screen-font-size-xs`. **If the computed value is larger than the
  default, raise the whole scale proportionally** — never leave `xs` below the computed floor.
- **Target screens that are monitors or laptops must raise the whole type scale**, even when
  the formula returns a small number.
- Source: T/CIDADS 00011-2022 `minimum font size = viewing distance / 200`, combined with the
  `1080 / screen height` term for non-1080p canvases. Clause obtained via third-party
  transcription — label it as a secondary source when quoting the standard.

## 3. Layering

| Token | Value | Use |
| --- | --- | --- |
| `--dvk-screen-z-base` | `0` | canvas, background ambience |
| `--dvk-screen-z-panel` | `10` | panels and blocks |
| `--dvk-screen-z-overlay` | `100` | drawers, full-screen overlays |
| `--dvk-screen-z-tooltip` | `1000` | tooltips, popovers |

Use these four steps only; do not invent intermediate z-index values.

## 4. Motion — interaction budget

| Token | Value | Use |
| --- | --- | --- |
| `--dvk-screen-duration-fast` | `150ms` | hover, focus, small state change |
| `--dvk-screen-duration-base` | `250ms` | expand/collapse, panel state change |
| `--dvk-screen-duration-slow` | `300ms` | overlay and drawer transitions |
| `--dvk-screen-ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | default |
| `--dvk-screen-ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | entering |
| `--dvk-screen-ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | leaving |

These tokens cover **interaction motion only** (150–300ms). They do not replace the theme's
decorative animation token:

- **Decoration** keeps using `--dvk-motion-duration` from the active theme (2200–2600ms).
  Do not override it with a screen duration token.
- **Charts** use 200–400ms transitions and must not read `--dvk-motion-duration` (see
  `charts.md`).

## 5. Layout — 1920 x 1080 canvas

| Token | Value | Use |
| --- | --- | --- |
| `--dvk-screen-safe-margin` | `48px` | screen edge inset |
| `--dvk-screen-grid-columns` | `12` | main grid columns |
| `--dvk-screen-grid-gutter` | `24px` | gutter between columns |
| `--dvk-screen-header-height` | `104px` | top bar |
| `--dvk-screen-kpi-height` | `104px` | KPI strip |
| `--dvk-screen-panel-padding` | `24px` | panel content inset |

At 1920 with a 48px margin and 11 gutters, one column is
`(1920 - 96 - 11 x 24) / 12 = 130px`.

- The main region row height is **fluid** (`minmax(0, 1fr)`), not a token and not a fixed px
  value.
- Video-wall or overscan-risk screens tighten the safe margin to 5% (96px horizontal /
  54px vertical, EBU R95 graphics safe).
- Canvas, scaling, and degradation policy live in `design-rules.md` group 1.

## Token boundary summary

| Layer | Owns | Does not own |
| --- | --- | --- |
| Theme (`--dvk-color-*`, `--dvk-glow-*`, `--dvk-line-width`, `--dvk-motion-duration`) | color, glow, line width, decorative animation period | spacing, type, layout |
| Screen (`--dvk-screen-*`, this file) | spacing, type, layering, interaction motion, layout | any color |
| Component | `--dvk-<component>-*` fallbacks | the layers above |
