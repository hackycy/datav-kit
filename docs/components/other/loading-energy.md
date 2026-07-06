---
description: A restrained enterprise loading indicator with a compact status panel, data lanes, and subtle progress motion.
---

# Loading Energy

`dvk-loading-energy` renders a compact enterprise loading indicator: a quiet status panel contains a live status dot and three horizontal data lanes, with subtle progress motion that fits dashboards, cards, dialogs, and table empty states.

<div class="datav-demo">
  <div style="height: 180px; display: grid; place-items: center;">
    <dvk-loading-energy>Processing data</dvk-loading-energy>
  </div>
</div>

```html
<dvk-loading-energy>Processing data</dvk-loading-energy>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | empty | Status light, lane marker, and progress highlight color. Falls back to `--dvk-color-primary` and then `#1677ff`. |
| `secondary-color` | `string` | empty | Panel frame, header line, divider, and track color. Falls back to `--dvk-color-secondary` and then `#8a99ad`. |
| `colors` | `string` | empty | Comma-separated status and panel colors. |
| `size` | `number` | `72` | Rendered SVG size in CSS pixels. |
| `stroke-width` | `number` | `2` | Panel frame and internal rule stroke width in SVG units. |
| `dur` | `number` | `1.9` | Progress cycle duration in seconds. Lane and status-dot motion derive from this value. |
| `animated` | `boolean` | `true` | Enables lane progress and status-dot animation. |
| `paused` | `boolean` | `false` | Stops animation while keeping the static status panel visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## Slots

| Name | Description |
| --- | --- |
| default | Loading status text rendered below the status panel. |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-loading-energy-size` | SVG display size. The `size` attribute sets this inline. |
| `--dvk-loading-energy-gap` | Gap between status panel and status text. |
| `--dvk-loading-energy-tip-color` | Status text color. |
| `--dvk-loading-energy-tip-font-size` | Status text font size. |
| `--dvk-loading-energy-tip-line-height` | Status text line height. |

## Parts

| Part | Description |
| --- | --- |
| `root` | Loading layout wrapper. |
| `graphic` | SVG graphic. |
| `panel` | Soft filled status panel surface. |
| `frame` | Outer panel frame. |
| `header-line` | Short rule in the panel header. |
| `divider` | Divider between header and data lanes. |
| `status-dot` | Animated status indicator. |
| `data-lane` | Shared group for each horizontal data lane. |
| `lane-marker` | Small marker at the start of each lane. |
| `lane-track` | Static data lane track. |
| `lane-progress` | Moving progress highlight inside each lane. |
| `tip` | Status text wrapper. |
