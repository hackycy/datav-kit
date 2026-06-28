# Border Box 8

`dv-border-box-8` recreates DataV Vue3 BorderBox1 as a dynamic polygon panel with four fixed mirrored 150 x 150 animated corner ornaments.

<BorderChartDemo
  border="dv-border-box-8"
  colors="#4fd2dd,#235fa7"
  accent="#4fd2dd"
  title="Border Box 8"
  subtitle="DataV BorderBox1-style animated corner panel"
/>

```html
<dv-border-box-8 colors="#4fd2dd,#235fa7" background-color="rgba(5, 18, 46, 0.32)">
  <section>Border Box 8</section>
</dv-border-box-8>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary corner ornament color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary corner ornament color. |
| `background-color` | `string` | `transparent` | Panel background fill color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. Use `background-color` for an optional panel fill. |
| `animated` | `boolean` | `true` | Whether corner fill animations are rendered. |
| `paused` | `boolean` | `false` | Disables corner fill animations while keeping the static frame visible. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary corner color fallback. |
| `--dv-color-secondary` | Secondary corner color fallback. |
| `--dv-border-box-8-background` | Panel background fallback color. |
| `--dv-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dv-border-box-8-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG layers. |
| `content` | Slotted content wrapper. |
