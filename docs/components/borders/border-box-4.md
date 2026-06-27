# Border Box 4

`dv-border-box-4` renders a dense neon HUD frame adapted from the provided 1672 x 941 vector SVG material. It keeps the original frame language as inline SVG linework while leaving the background to the host application.

<div class="datav-demo datav-demo--wide">
  <dv-border-box-4 class="datav-panel datav-panel--wide" colors="#36d9ff,#1ecfff,#c9fbff" glow-intensity="1">
    <div class="datav-panel__content">
      <p class="datav-panel__title">Border Box 4</p>
      <p class="datav-panel__meta">dense neon HUD frame from vector SVG material</p>
    </div>
  </dv-border-box-4>
</div>

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
| `auto-height` | `boolean` | `false` | Lets slotted content define the box height instead of stretching to a parent height. |

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
