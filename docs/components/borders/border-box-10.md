# Border Box 10

`dvk-border-box-10` recreates DataV Vue3 BorderBox12 as a rounded outline panel with four animated corner glows and responsive content padding from the live host size.

<BorderChartDemo
  border="dvk-border-box-10"
  colors="#235fa7,#4fd2dd"
  accent="#4fd2dd"
  title="Border Box 10"
  subtitle="DataV BorderBox12-style rounded glow frame"
/>

```html
<dvk-border-box-10 colors="#235fa7,#4fd2dd" background-color="rgba(5, 18, 46, 0.22)">
  <section>Border Box 10</section>
</dvk-border-box-10>
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
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary outline fallback. |
| `--dvk-color-secondary` | Secondary corner glow fallback. |
| `--dvk-border-box-10-background` | Panel background fallback color. |
| `--dvk-border-box-padding` | Shared override for automatic content inset across border boxes. |
| `--dvk-border-box-10-padding` | Component-specific override for automatic content inset. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG layer. |
| `content` | Slotted content wrapper. |
