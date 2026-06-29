# Border Box 11

`dv-border-box-11` renders a high-density cyber command-console frame on a 1600 x 900 reference canvas. It keeps corner armor, center docks, side sensor racks, hatch marks, nodes, and scan lights as fixed SVG modules, while clean straight rail slices stretch to fit wide, tall, and compact dashboard panels.

<BorderChartDemo
  border="dv-border-box-11"
  colors="#32e6ff,#1b7dff,#b9f7ff"
  accent="#32e6ff"
  title="Border Box 11"
  subtitle="high-density cyber command-console frame"
/>

```html
<dv-border-box-11 colors="#32e6ff,#1b7dff,#b9f7ff" glow-intensity="1.1">
  <section>Border Box 11</section>
</dv-border-box-11>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan rail, armor, and node color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue glow and dim structural line color. |
| `accent-color` | `string` | CSS variable fallback | Accent color for glints, moving scan lights, and fine hatches. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for SVG blur filters that create the neon halo. |
| `animated` | `boolean` | `true` | Whether scan lights and pulse glints are rendered. |
| `paused` | `boolean` | `false` | Disables scan light animation while keeping the static frame visible. |

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
| `--dv-border-box-11-padding` | Component-specific override for automatic content inset. |
| `--dv-border-box-11-glow-opacity` | Static glow layer opacity. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
