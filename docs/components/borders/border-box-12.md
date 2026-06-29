# Border Box 12

`dv-border-box-12` renders a minimalist split-bus trace frame on a 1600 x 900 reference canvas. It uses a left/top command rail, an offset status dock, sparse corner terminals, and a bottom checksum strip so enterprise dashboard content stays calm while the frame still has subtle motion.

<BorderChartDemo
  border="dv-border-box-12"
  colors="#43d7ff,#2c7bf2,#f6d56a"
  accent="#f6d56a"
  title="Border Box 12"
  subtitle="minimal split-bus enterprise frame"
/>

```html
<dv-border-box-12 colors="#43d7ff,#2c7bf2,#f6d56a" glow-intensity="1">
  <section>Border Box 12</section>
</dv-border-box-12>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan rail and command bus color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue structural line and quiet return rail color. |
| `accent-color` | `string` | CSS variable fallback | Accent color for live status nodes, checksum marks, and rail-charge glints. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for SVG blur filters that create the restrained frame halo. |
| `animated` | `boolean` | `true` | Whether rail-charge glints and the status pulse are rendered. |
| `paused` | `boolean` | `false` | Disables rail-charge animation while keeping the static split-bus frame visible. |

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
| `--dv-border-box-12-padding` | Component-specific override for automatic content inset. |
| `--dv-border-box-12-glow-opacity` | Static glow layer opacity. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
