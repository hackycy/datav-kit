---
description: Lightweight responsive panel with corner dots, corner ticks, straight edge rails, and optional background.
---

# Border Box 15

`dvk-border-box-15` recreates DataV Vue3 BorderBox6 as a lightweight responsive panel with four fixed corner dots, short corner ticks, straight edge rails, and an optional background fill.

<BorderChartDemo
  border="dvk-border-box-15"
  colors="rgba(255, 255, 255, 0.42),#8ea0b8"
  accent="#8ea0b8"
  title="Border Box 15"
  subtitle="DataV BorderBox6-style thin rail frame"
/>

```html
<dvk-border-box-15 colors="rgba(255, 255, 255, 0.42),#8ea0b8" background-color="rgba(5, 18, 46, 0.28)">
  <section>Border Box 15</section>
</dvk-border-box-15>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary rail stroke color. |
| `secondary-color` | `string` | CSS variable fallback | Corner dot color. |
| `background-color` | `string` | `transparent` | Panel background fill color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. Use `background-color` for an optional panel fill. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary rail fallback color. |
| `--dvk-color-secondary` | Corner dot fallback color. |
| `--dvk-border-box-15-background` | Panel background fallback color. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-15-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG frame. |
| `content` | Slotted content wrapper. |
