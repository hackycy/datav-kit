# Decoration 3

`dv-decoration-3` recreates the animated angular line decoration from DataV Vue3 `Decoration5` as a framework-agnostic Web Component. It computes the same responsive polyline points from the host width and height, then applies the original stroke dash animation pattern.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 360px; --datav-decoration-height: 40px;">
  <div class="datav-decoration-shell">
    <dv-decoration-3 colors="#3f96a5,#7acaec" duration="1.2"></dv-decoration-3>
  </div>
</div>

```html
<dv-decoration-3 colors="#3f96a5,#7acaec" duration="1.2"></dv-decoration-3>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary line color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary line color. |
| `colors` | `string` | empty | Comma-separated primary and secondary line colors. |
| `duration` | `number` | `1.2` | Stroke dash animation duration in seconds. |
| `dur` | `number` | `1.2` | DataV-compatible alias for `duration`. |
| `animated` | `boolean` | `true` | Enables stroke dash animation. |
| `paused` | `boolean` | `false` | Pauses the stroke dash animation. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary fallback color. |
| `--dv-color-secondary` | Secondary fallback color. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `line` | Shared part for both polylines. |
| `main-line` | Main angular polyline. |
| `sub-line` | Secondary bottom polyline. |
