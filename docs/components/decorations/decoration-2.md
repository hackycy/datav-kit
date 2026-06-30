# Decoration 2

`dvk-decoration-2` recreates the two-row dotted light decoration from DataV Vue3 `Decoration3` as a framework-agnostic Web Component. It uses a 300 x 35 SVG reference grid and scales to the host element.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 300px; --datav-decoration-height: 35px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-2 colors="#7acaec,transparent"></dvk-decoration-2>
  </div>
</div>

```html
<dvk-decoration-2 colors="#7acaec,transparent"></dvk-decoration-2>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary point color. |
| `secondary-color` | `string` | CSS variable fallback | Animated point color. |
| `colors` | `string` | empty | Comma-separated primary and animated point colors. |
| `point-size` | `number` | `7` | Base SVG size for each decoration point. |
| `animated` | `boolean` | `true` | Enables point fill animation. |
| `paused` | `boolean` | `false` | Pauses the point fill animation. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary fallback color. |
| `--dvk-color-secondary` | Animated fallback color. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `point` | Individual point rectangles. |
