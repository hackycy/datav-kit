# Decoration 1

`dv-decoration-1` is the first decoration component in datav-kit. It recreates the animated vertical bar effect from DataV Vue3 `Decoration6` as a framework-agnostic Web Component.

<div class="datav-demo datav-demo--decoration">
  <div class="datav-decoration-shell">
    <dv-decoration-1 colors="#7acaec,#4fd2dd"></dv-decoration-1>
  </div>
</div>

```html
<dv-decoration-1 colors="#7acaec,#4fd2dd"></dv-decoration-1>
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
| `bar` | Individual animated bar rectangles. |
