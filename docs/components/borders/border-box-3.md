# Border Box 3

`dv-border-box-3` renders a restrained futuristic blue frame based on a cropped 1672 x 941 SVG reference canvas. It uses mirrored precision corners, top and bottom center modules, side ticks, small node lights, and configurable low-intensity glow filters.

<div class="datav-demo datav-demo--wide">
  <dv-border-box-3 class="datav-panel datav-panel--wide" colors="#57b9ff,#168cff,#9ae7ff" glow-intensity="1">
    <div class="datav-panel__content">
      <p class="datav-panel__title">Border Box 3</p>
      <p class="datav-panel__meta">minimal SVG futuristic frame with fine blue glints</p>
    </div>
  </dv-border-box-3>
</div>

```html
<dv-border-box-3 colors="#57b9ff,#168cff,#9ae7ff" glow-intensity="1">
  <section>Border Box 3</section>
</dv-border-box-3>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary blue line and glint color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary dim blue frame color. |
| `accent-color` | `string` | CSS variable fallback | Accent highlight color used by nodes and fine hairlines. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `glow-intensity` | `number` | `1` | Multiplier for SVG blur filters that create the restrained neon glow. |

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
| `--dv-border-box-3-padding` | Component-specific override for automatic content inset. |
| `--dv-border-box-3-glow-opacity` | Static glow layer opacity. |

## Parts

| Part | Description |
| --- | --- |
| `frame` | Absolute frame layer. |
| `graphic` | Internal SVG. |
| `content` | Slotted content wrapper. |
