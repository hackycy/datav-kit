# Border Box 14

`dvk-border-box-14` renders a shallow orthogonal signal-port corner frame with equal-weight circuit traces, pin contacts, fixed interface nodes, and subtle node pulse motion for precise technology dashboards.

<BorderChartDemo
  border="dvk-border-box-14"
  colors="#1ed6ff,#55f0c8,#f7fbff"
  accent="#f7fbff"
  title="Border Box 14"
  subtitle="orthogonal signal-port frame"
/>

```html
<dvk-border-box-14 colors="#1ed6ff,#55f0c8,#f7fbff" glow-intensity="0.85">
  <section>Border Box 14</section>
</dvk-border-box-14>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary signal rail color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary rail gradient color. |
| `accent-color` | `string` | CSS variable fallback | Accent color for the signal-port nodes and contact pads. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for the signal rail and node glow strength. |
| `animated` | `boolean` | `true` | Whether the border renders subtle signal node pulse animations. |
| `paused` | `boolean` | `false` | Disables signal node motion while keeping the static frame visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary rail fallback. |
| `--dvk-color-secondary` | Secondary rail fallback. |
| `--dvk-color-accent` | Signal node fallback. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-14-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG frame. |
| `content` | Slotted content wrapper. |
