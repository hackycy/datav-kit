---
description: Sparse electric-blue split rail frame with corner modules, carrier spine, and endpoint sparkles.
---

# Border Box 13

`dvk-border-box-13` renders a sparse electric-blue split rail frame with fixed source-proportioned corner modules, a bottom carrier spine that extends through its simple middle rails, and subtle endpoint sparkles at a few existing rail terminals.

<BorderChartDemo
  border="dvk-border-box-13"
  colors="#1b8cff,#62c8ff,#d8f7ff"
  accent="#d8f7ff"
  title="Border Box 13"
  subtitle="split horizon carrier rail"
/>

```html
<dvk-border-box-13 colors="#1b8cff,#62c8ff,#d8f7ff" glow-intensity="1.05">
  <section>Border Box 13</section>
</dvk-border-box-13>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary blue frame color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary cyan core rail color. |
| `accent-color` | `string` | CSS variable fallback | Accent color for the endpoint sparkle dots. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for the rail and endpoint sparkle glow strength. |
| `animated` | `boolean` | `true` | Whether the border renders subtle fixed endpoint sparkle animations. |
| `paused` | `boolean` | `false` | Disables endpoint sparkle motion while keeping the static frame visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary rail fallback. |
| `--dvk-color-secondary` | Secondary core rail fallback. |
| `--dvk-color-accent` | Endpoint sparkle fallback. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-13-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG frame. |
| `content` | Slotted content wrapper. |
