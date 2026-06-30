# Decoration 5

`dvk-decoration-5` recreates the angled line decoration from DataV Vue3 `Decoration8` as a framework-agnostic Web Component. It reads the host width and height, draws the original three SVG polylines, and can mirror the line direction with `reverse`.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 360px; --datav-decoration-height: 40px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-5></dvk-decoration-5>
  </div>
</div>

```html
<dvk-decoration-5></dvk-decoration-5>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 40px;">
  <div class="datav-decoration-shell" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px;">
    <dvk-decoration-5></dvk-decoration-5>
    <dvk-decoration-5 reverse></dvk-decoration-5>
  </div>
</div>

```html
<dvk-decoration-5></dvk-decoration-5>
<dvk-decoration-5 reverse></dvk-decoration-5>
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
| `line` | Shared part for all polylines. |
| `short-line` | Short angled polyline. |
| `long-line` | Long angled polyline. |
| `bottom-line` | Bottom horizontal polyline. |
