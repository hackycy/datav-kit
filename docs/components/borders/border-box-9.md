# Border Box 9

`dv-border-box-9` recreates DataV Vue3 BorderBox7 as a glowing panel with a 1px host border, inset shadow, and two layers of rounded corner linework drawn from the live host size.

<BorderChartDemo
  border="dv-border-box-9"
  colors="#235fa7,#4fd2dd"
  accent="#4fd2dd"
  title="Border Box 9"
  subtitle="DataV BorderBox7-style glowing corner frame"
/>

```html
<dv-border-box-9 colors="#235fa7,#4fd2dd" background-color="rgba(5, 18, 46, 0.22)">
  <section>Border Box 9</section>
</dv-border-box-9>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary border, outer corner, and inset glow color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary inner corner line color. |
| `background-color` | `string` | `transparent` | Panel background color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. Use `background-color` for an optional panel fill. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary border and glow fallback. |
| `--dv-color-secondary` | Secondary corner line fallback. |
| `--dv-border-box-9-background` | Panel background fallback color. |
| `--dv-border-box-9-border-color` | Border color override. |
| `--dv-border-box-9-border-width` | Border width override. |
| `--dv-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dv-border-box-9-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG layer. |
| `content` | Slotted content wrapper. |
