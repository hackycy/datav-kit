# Decoration 5

`dv-decoration-5` recreates the angled line decoration from DataV Vue3 `Decoration8` as a framework-agnostic Web Component. It reads the host width and height, draws the original three SVG polylines, and can mirror the line direction with `reverse`.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 360px; --datav-decoration-height: 40px;">
  <div class="datav-decoration-shell">
    <dv-decoration-5></dv-decoration-5>
  </div>
</div>

```html
<dv-decoration-5></dv-decoration-5>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 360px; --datav-decoration-height: 40px;">
  <div class="datav-decoration-shell">
    <dv-decoration-5 reverse colors="#18f0ff,#f3ff5c"></dv-decoration-5>
  </div>
</div>

```html
<dv-decoration-5 reverse colors="#18f0ff,#f3ff5c"></dv-decoration-5>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary line color. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Bottom line color. |
| `colors` | `string` | empty | Comma-separated primary and secondary line colors. |
| `reverse` | `boolean` | `false` | Mirrors the decoration horizontally. |

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
| `line` | Shared part for all polylines. |
| `short-line` | Short angled polyline. |
| `long-line` | Long angled polyline. |
| `bottom-line` | Bottom horizontal polyline. |
