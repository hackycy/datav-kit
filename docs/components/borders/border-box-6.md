# Border Box 6

`dv-border-box-6` renders a high-precision cyan HUD frame recreated from the supplied 1672 x 941 SVG. It keeps the traced source layers as inline SVG paths, clips fixed detail modules from the original coordinates, and extends only clean edge strips so the frame can resize without stretching the whole artwork.

<BorderChartDemo
  border="dv-border-box-6"
  colors="#04b9f2,#102132,#00b7f0"
  accent="#04b9f2"
  title="Border Box 6"
  subtitle="high-precision source-clipped HUD frame with live chart content"
/>

```html
<dv-border-box-6 colors="#04b9f2,#102132,#00b7f0" glow-intensity="1">
  <section>Border Box 6</section>
</dv-border-box-6>
```

## Free Border

`dv-border-box-6` behaves like a decorative border. The host box can be fixed, responsive, or content-sized by normal CSS, while the component keeps corners, marker stacks, bottom hatch details, and other source modules fixed. Only measured straight strips are stretched along one axis.

```html
<dv-border-box-6 colors="#04b9f2,#102132,#00b7f0">
  <section>
    <h3>Free border panel</h3>
    <p>The border adapts to the content box.</p>
  </section>
</dv-border-box-6>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan glow and body color. |
| `secondary-color` | `string` | CSS variable fallback | Dark structural frame and shadow color. |
| `accent-color` | `string` | CSS variable fallback | Bright cyan highlight color used by the solid trace layer. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for SVG blur filters that create the layered glow. |

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
| `--dv-border-box-6-padding` | Component-specific override for automatic content inset. |
| `--dv-border-box-6-glow-opacity` | Static glow layer opacity. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
