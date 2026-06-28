# Border Box 7

`dv-border-box-7` recreates DataV BorderBox10 as a chamfered glowing panel. The main polygon is redrawn from the live host size, while the four source corner ornaments stay fixed and mirrored from the original 150 x 150 SVG module.

<BorderChartDemo
  border="dv-border-box-7"
  colors="#235fa7,#4fd2dd"
  accent="#4fd2dd"
  title="Border Box 7"
  subtitle="chamfered glow panel with fixed mirrored corner ornaments"
/>

```html
<dv-border-box-7 colors="#235fa7,#4fd2dd">
  <section>Border Box 7</section>
</dv-border-box-7>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary inset glow color. |
| `secondary-color` | `string` | CSS variable fallback | Corner ornament fill color. |
| `background-color` | `string` | `transparent` | Panel background fill color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. Use `background-color` for an optional panel fill. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary glow fallback color. |
| `--dv-color-secondary` | Corner fill fallback color. |
| `--dv-border-box-7-background` | Panel background fallback color. |
| `--dv-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dv-border-box-7-padding` | Component-specific override for automatic content inset. |
| `--dv-border-box-7-radius` | Host border radius. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG layers. |
| `content` | Slotted content wrapper. |
