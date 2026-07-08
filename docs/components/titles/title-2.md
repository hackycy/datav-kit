---
description: Deep glass large-screen top title bar with cyber-blue mechanical wings, a central title panel, low-brightness flow line, and gold title focus.
---

# Title 2

`dvk-title-2` is a deep glass large-screen top title bar based on the provided SVG. It keeps the dark blue-black background band, symmetric mechanical wing panels, thin cyber-blue rails, a restrained center flow line, and a gold title focus for command-center dashboards.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1200px; --datav-decoration-height: 80px;">
  <div class="datav-decoration-shell">
    <dvk-title-2 title-text="智慧指挥平台"></dvk-title-2>
  </div>
</div>

```html
<dvk-title-2 title-text="智慧指挥平台"></dvk-title-2>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1200px; --datav-decoration-height: 80px;">
  <div class="datav-decoration-shell">
    <dvk-title-2 colors="#7cf6ff,#2f70ff,#ffd36d">
      <span>作战指挥中心</span>
    </dvk-title-2>
  </div>
</div>

```html
<dvk-title-2 colors="#7cf6ff,#2f70ff,#ffd36d">
  <span>作战指挥中心</span>
</dvk-title-2>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1080px; --datav-decoration-height: 72px;">
  <div class="datav-decoration-shell">
    <dvk-title-2 colors="#52f0b5,#1487ff,#f9e7a0" title-text="CITY"></dvk-title-2>
  </div>
</div>

```html
<dvk-title-2 colors="#52f0b5,#1487ff,#f9e7a0" title-text="CITY OPERATIONS"></dvk-title-2>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan color for luminous rails, micro grid strokes, flow lines, and small HUD details. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary deep blue color for wing surfaces, outer strokes, and edge gradients. |
| `accent-color` | `string` | CSS variable fallback | Accent color for the centered title text. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `title-text` | `string` | empty | Optional centered system name. When omitted, the default slot is rendered inside the title area. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary cyan fallback color. |
| `--dvk-color-secondary` | Secondary blue fallback color. |
| `--dvk-title-2-accent` | Accent fallback color for the title text. |
| `--dvk-title-2-title-width` | Maximum title content width. |
| `--dvk-title-2-title-min-width` | Minimum title content width. |
| `--dvk-title-2-title-height` | Title content height. |
| `--dvk-title-2-title-color` | Title text color override. |
| `--dvk-title-2-title-font` | Title font shorthand. |
| `--dvk-title-2-title-letter-spacing` | Title letter spacing. |
| `--dvk-title-2-title-stroke` | Subtle bright text edge glow. |
| `--dvk-title-2-title-glow` | Soft gold title glow. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `background` | Dark blue-black background band. |
| `micro-grid` | Low-opacity technical grid texture. |
| `wing` | Shared part for each symmetric side wing. |
| `left-wing` | Left mechanical wing group. |
| `right-wing` | Right mechanical wing group. |
| `wing-surface` | Glassy translucent side wing surface. |
| `wing-inner-line` | Inner outline of each wing. |
| `glass-sheen` | Subtle clipped reflection across the wing panels. |
| `edge-line` | Brighter wing edge rail. |
| `detail-line` | Quiet internal HUD line detail. |
| `glow-accent` | Soft short highlight on each wing. |
| `center-panel` | Center title structure. |
| `title-panel` | Outer center title panel. |
| `title-inner-panel` | Inner center title surface. |
| `center-edge` | Bright top and bottom center panel rails. |
| `quiet-line` | Low-opacity center panel guide line. |
| `side-connector` | Short connector strokes between wings and title panel. |
| `flow-line` | Horizontal center flow light below the title panel. |
| `content` | Center title content wrapper. |
| `title` | Alias part for the title content wrapper. |
| `title-text` | Generated title text when `title-text` is used. |
