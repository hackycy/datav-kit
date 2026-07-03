---
description: Minimal electric-blue HUD frame with chamfered corners, title rail, and symmetric side folds.
---

# Border Box 12

`dvk-border-box-12` is a minimal electric-blue HUD frame with sharp chamfered corners, a clean top title rail, subtle top slant blocks, and symmetric side folds.

<BorderChartDemo
  border="dvk-border-box-12"
  colors="#19d8ff,#56f0ff,#b9f8ff"
  accent="#b9f8ff"
  title="Border Box 12"
  subtitle="minimal chamfer rail outline"
/>

```html
<dvk-border-box-12 colors="#19d8ff,#56f0ff,#b9f8ff" glow-intensity="1.05">
  <section>Border Box 12</section>
</dvk-border-box-12>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary electric-blue frame color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary cyan inner rail and side-fold color. |
| `accent-color` | `string` | CSS variable fallback | Accent color for the top slant blocks. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for the rail and slant-block glow strength. |
| `animated` | `boolean` | `true` | Whether the top slant blocks render subtle blink animations. |
| `paused` | `boolean` | `false` | Disables motion while keeping the static chamfer frame visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary rail fallback. |
| `--dvk-color-secondary` | Secondary inner rail fallback. |
| `--dvk-color-accent` | Top slant block fallback. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-12-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG frame. |
| `content` | Slotted content wrapper. |
