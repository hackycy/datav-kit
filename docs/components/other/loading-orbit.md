---
description: Two counter-rotating loading rings with datav-kit color cycling and an optional status slot.
---

# Loading Orbit

`dvk-loading-orbit` renders a compact loading indicator based on the DataV Loading source: two concentric dashed rings rotate in opposite directions while cycling through the datav-kit default colors.

<div class="datav-demo">
  <div style="height: 180px; display: grid; place-items: center;">
    <dvk-loading-orbit>Loading data</dvk-loading-orbit>
  </div>
</div>

```html
<dvk-loading-orbit>Loading data</dvk-loading-orbit>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | empty | Outer ring initial color. Falls back to `--dvk-color-primary` and then `#18f0ff`. |
| `secondary-color` | `string` | empty | Inner ring initial color. Falls back to `--dvk-color-secondary` and then `#2b7cff`. |
| `colors` | `string` | empty | Comma-separated outer and inner ring colors. |
| `size` | `number` | `50` | Rendered SVG size in CSS pixels. |
| `stroke-width` | `number` | `3` | Ring stroke width in SVG units. |
| `dur` | `number` | `1.5` | Rotation duration in seconds. Color cycling uses twice this duration. |
| `animated` | `boolean` | `true` | Enables ring rotation and color animation. |
| `paused` | `boolean` | `false` | Stops animation while keeping the static rings visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## Slots

| Name | Description |
| --- | --- |
| default | Loading status text rendered below the rings. |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-loading-orbit-size` | SVG display size. The `size` attribute sets this inline. |
| `--dvk-loading-orbit-gap` | Gap between rings and status text. |
| `--dvk-loading-orbit-tip-color` | Status text color. |
| `--dvk-loading-orbit-tip-font-size` | Status text font size. |
| `--dvk-loading-orbit-tip-line-height` | Status text line height. |

## Parts

| Part | Description |
| --- | --- |
| `root` | Loading layout wrapper. |
| `graphic` | SVG graphic. |
| `ring` | Shared ring selector. |
| `outer-ring` | Outer dashed circle. |
| `inner-ring` | Inner dashed circle. |
| `tip` | Status text wrapper. |
