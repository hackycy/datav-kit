# Border Box 4

`dv-border-box-4` renders a dense neon HUD frame adapted from the provided 1672 x 941 vector SVG material. It keeps the original ornate corners and detail modules as inline SVG linework, then extends the edge sections from source-clipped straight strips so the border follows normal CSS layout sizes without stretching the whole SVG.

<BorderChartDemo
  border="dv-border-box-4"
  colors="#36d9ff,#1ecfff,#c9fbff"
  accent="#36d9ff"
  title="Border Box 4"
  subtitle="source-clipped HUD frame adapting around ECharts content"
/>

```html
<dv-border-box-4 colors="#36d9ff,#1ecfff,#c9fbff" glow-intensity="1">
  <section>Border Box 4</section>
</dv-border-box-4>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan line and glint color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary glow and fine frame color. |
| `accent-color` | `string` | CSS variable fallback | Hot highlight color used by nodes, strokes, and HUD ticks. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for SVG blur filters that create the layered neon glow. |

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
| `--dv-border-box-4-padding` | Component-specific override for automatic content inset. |
| `--dv-border-box-4-glow-opacity` | Static glow layer opacity. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
