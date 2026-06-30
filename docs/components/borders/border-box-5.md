# Border Box 5

`dvk-border-box-5` renders a layered electric-blue HUD frame adapted from the provided 1672 x 941 vector SVG material. It preserves the five visible frame layers as inline SVG paths while leaving the background to the host application.

<BorderChartDemo
  border="dvk-border-box-5"
  colors="#24d9ff,#008cff,#bffcff"
  accent="#24d9ff"
  title="Border Box 5"
  subtitle="layered electric-blue HUD frame with responsive chart content"
/>

```html
<dvk-border-box-5 colors="#24d9ff,#008cff,#bffcff" glow-intensity="1">
  <section>Border Box 5</section>
</dvk-border-box-5>
```

## Free Border

`dvk-border-box-5` behaves like a decorative border: the host box can be content-sized, fixed-size, percentage-sized, or responsive. The frame keeps the corner regions fixed and repeats the source SVG middle strips horizontally and vertically, so the border grows without stretching the original linework.

```html
<dvk-border-box-5 colors="#24d9ff,#008cff,#bffcff">
  <section>
    <h3>Free border panel</h3>
    <p>The border adapts to the content box.</p>
  </section>
</dvk-border-box-5>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan stroke and electric body color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue halo and outer aura color. |
| `accent-color` | `string` | CSS variable fallback | White-hot highlight color used by the brightest core layer. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for SVG blur filters that create the layered neon glow. |

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
| `--dvk-border-box-5-padding` | Component-specific override for automatic content inset. |
| `--dvk-border-box-5-glow-opacity` | Static glow layer opacity. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
