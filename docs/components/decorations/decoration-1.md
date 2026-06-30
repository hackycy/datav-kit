# Decoration 1

`dvk-decoration-1` is the first decoration component in datav-kit. It recreates the animated vertical bar effect from DataV Vue3 `Decoration6` as a framework-agnostic Web Component.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 300px; --datav-decoration-height: 35px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-1 colors="#7acaec,#4fd2dd"></dvk-decoration-1>
  </div>
</div>

```html
<dvk-decoration-1 colors="#7acaec,#4fd2dd"></dvk-decoration-1>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary bar color. |
| `secondary-color` | `string` | CSS variable fallback | Secondary bar color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. |
| `bar-width` | `number` | `7` | Base SVG width for each animated bar. |
| `animated` | `boolean` | `true` | Enables bar height animation. |
| `paused` | `boolean` | `false` | Pauses the bar height animation. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary fallback color. |
| `--dvk-color-secondary` | Secondary fallback color. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `bar` | Individual animated bar rectangles. |
