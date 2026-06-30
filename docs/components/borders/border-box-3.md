# Border Box 3

`dvk-border-box-3` renders a restrained futuristic blue frame rebuilt from the 1672 x 941 SVG reference canvas. It keeps corners, center modules, side ticks, and node lights as fixed SVG slices, while clean edge strips extend on one axis to adapt freely to the host size.

<BorderChartDemo
  border="dvk-border-box-3"
  colors="#57b9ff,#168cff,#9ae7ff"
  accent="#57b9ff"
  title="Border Box 3"
  subtitle="restrained futuristic frame around dense dashboard data"
/>

```html
<dvk-border-box-3 colors="#57b9ff,#168cff,#9ae7ff" glow-intensity="1">
  <section>Border Box 3</section>
</dvk-border-box-3>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary blue line and glint color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary dim blue frame color. |
| `accent-color` | `string` | CSS variable fallback | Accent highlight color used by nodes and fine hairlines. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for SVG blur filters that create the restrained neon glow. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary fallback color. |
| `--dvk-color-secondary` | Secondary fallback color. |
| `--dvk-color-accent` | Accent fallback color. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-3-padding` | Component-specific override for automatic content inset. |
| `--dvk-border-box-3-glow-opacity` | Static glow layer opacity. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
