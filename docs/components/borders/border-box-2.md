# Border Box 2

`dv-border-box-2` renders a layered neon cyber frame based on a 1600 x 900 SVG reference canvas. It keeps corners, center energy bars, side tick marks, and circular nodes fixed while stretching only clean line segments for free-size layouts.

<BorderChartDemo
  border="dv-border-box-2"
  colors="#0af2ff,#168cff,#7c4dff"
  accent="#0af2ff"
  title="Border Box 2"
  subtitle="layered cyber frame with chart content and neon detail nodes"
/>

```html
<dv-border-box-2 colors="#0af2ff,#168cff,#7c4dff" glow-intensity="1">
  <section>Border Box 2</section>
</dv-border-box-2>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan line and detail color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue frame color. |
| `accent-color` | `string` | CSS variable fallback | Accent highlight color used by gradient stops and purple detail blocks. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for SVG blur filters that create the neon glow. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary fallback color. |
| `--dv-color-secondary` | Secondary fallback color. |
| `--dv-color-accent` | Accent fallback color. |
| `--dv-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dv-border-box-2-padding` | Component-specific override for automatic content inset. |
| `--dv-border-box-2-glow-opacity` | Static glow layer opacity. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
