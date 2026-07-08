---
description: Floating CPU-like thin border with broken outer rails, open inner hairlines, shallow edge pins, and subtle chip activity.
---

# Border Box 16

`dvk-border-box-16` renders a floating CPU-like border with broken outer rails, a very light open inner hairline, shallow edge pins, sparse chip pads, and subtle pin pulse motion.

<BorderChartDemo
  border="dvk-border-box-16"
  colors="#38d8ff,#69ffe1,#f8fbff"
  accent="#f8fbff"
  title="Border Box 16"
  subtitle="floating thin CPU rail border"
/>

```html
<dvk-border-box-16 colors="#38d8ff,#69ffe1,#f8fbff" glow-intensity="0.7">
  <section>Border Box 16</section>
</dvk-border-box-16>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary chip perimeter rail color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary hairline and pin color. |
| `accent-color` | `string` | CSS variable fallback | Accent color for active chip pads and pulsing pins. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `0.7` | Multiplier for the active pin and pad glow strength. |
| `animated` | `boolean` | `true` | Whether the border renders subtle chip pin pulse animations. |
| `paused` | `boolean` | `false` | Disables chip pin motion while keeping the static frame visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary rail fallback. |
| `--dvk-color-secondary` | Secondary hairline and pin fallback. |
| `--dvk-color-accent` | Active chip pad fallback. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-16-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG frame. |
| `content` | Slotted content wrapper. |
