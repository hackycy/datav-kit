# Border Box 10

`dv-border-box-10` recreates DataV Vue3 BorderBox12 as a rounded outline panel with four animated corner glows and responsive content padding from the live host size.

<BorderChartDemo
  border="dv-border-box-10"
  colors="#235fa7,#4fd2dd"
  accent="#4fd2dd"
  title="Border Box 10"
  subtitle="DataV BorderBox12-style rounded glow frame"
/>

```html
<dv-border-box-10 colors="#235fa7,#4fd2dd" background-color="rgba(5, 18, 46, 0.22)">
  <section>Border Box 10</section>
</dv-border-box-10>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary rounded outline color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary corner glow color. |
| `background-color` | `string` | `transparent` | Panel background fill color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. Use `background-color` for an optional panel fill. |
| `animated` | `boolean` | `true` | Whether the corner glow color animation is rendered. |
| `paused` | `boolean` | `false` | Disables the corner glow animation while keeping the static frame visible. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary outline fallback. |
| `--dv-color-secondary` | Secondary corner glow fallback. |
| `--dv-border-box-10-background` | Panel background fallback color. |
| `--dv-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dv-border-box-10-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG layer. |
| `content` | Slotted content wrapper. |
