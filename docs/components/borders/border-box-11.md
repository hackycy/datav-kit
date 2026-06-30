# Border Box 11

`dvk-border-box-11` is a restrained enterprise data-platform frame with status rails, sparse live nodes, and subtle rail-charge motion for operations panels.

<BorderChartDemo
  border="dvk-border-box-11"
  colors="#3d7fb8,#6ed7e8,#52f0b5"
  accent="#52f0b5"
  title="Border Box 11"
  subtitle="enterprise status rail frame"
/>

```html
<dvk-border-box-11 colors="#3d7fb8,#6ed7e8,#52f0b5" glow-intensity="1.1">
  <section>Border Box 11</section>
</dvk-border-box-11>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary steel-blue rail color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary cyan rail and status-line color. |
| `accent-color` | `string` | CSS variable fallback | Accent color for live nodes and rail-charge highlights. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for the live-node and rail-charge glow strength. |
| `animated` | `boolean` | `true` | Whether the rail-charge and node pulse animations are rendered. |
| `paused` | `boolean` | `false` | Disables motion while keeping the static status rail frame visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary rail fallback. |
| `--dvk-color-secondary` | Secondary status rail fallback. |
| `--dvk-color-accent` | Live node and rail-charge fallback. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-11-padding` | Component-specific override for automatic content inset. |
| `--dvk-border-box-11-glow-opacity` | Opacity for live node and charge glow marks. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG slices. |
| `content` | Slotted content wrapper. |
