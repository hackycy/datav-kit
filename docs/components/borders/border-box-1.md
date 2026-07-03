---
description: Animated rectangular SVG border component with moving highlight for data dashboard panels.
---

# Border Box 1

`dvk-border-box-1` is the first numbered border component. It renders a rectangular SVG border with a moving highlight around the edge.

<BorderChartDemo
  border="dvk-border-box-1"
  colors="#235fa7,#4fd2dd"
  accent="#4fd2dd"
  title="Border Box 1"
  subtitle="animated edge highlight around a live telemetry panel"
/>

```html
<dvk-border-box-1 colors="#235fa7,#4fd2dd" duration="3">
  <section>Border Box 1</section>
</dvk-border-box-1>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary border color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary highlight color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. |
| `reverse` | `boolean` | `false` | Reverses the animated path direction. |
| `duration` | `number` | `3` | Animation duration in seconds. |
| `animated` | `boolean` | `true` | Enables the moving highlight. |
| `paused` | `boolean` | `false` | Pauses the moving highlight while retaining the border. |
| `auto-height` | `boolean` | `false` | Lets slotted content define the box height instead of stretching to a parent height. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary fallback color. |
| `--dvk-color-secondary` | Secondary fallback color. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-1-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
