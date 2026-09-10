---
description: A compact five-bar loading pulse whose bars rise and fall out of phase from the centre outward, with a quiet track behind each bar and an optional status slot.
---

# Loading Pulse

`dvk-loading-pulse` renders five data pulse bars that only scale and phase-shift: no rotation, no sweeping ring. The centre bar leads and the bars on either side follow, so the group reads as a single travelling wave. Use it as the default loading state on dashboards, panels, cards, and table empty states.

<div class="datav-demo">
  <div style="height: 180px; display: grid; place-items: center;">
    <dvk-loading-pulse>Loading data</dvk-loading-pulse>
  </div>
</div>

```html
<dvk-loading-pulse>Loading data</dvk-loading-pulse>
```

<div class="datav-demo">
  <div style="height: 180px; display: grid; place-items: center;">
    <dvk-loading-pulse colors="#48ff8a,#1e6b3c" size="72">Syncing nodes</dvk-loading-pulse>
  </div>
</div>

```html
<dvk-loading-pulse colors="#48ff8a,#1e6b3c" size="72">Syncing nodes</dvk-loading-pulse>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | empty | Moving bar color. Falls back to `--dvk-color-primary` and then `#18f0ff`. |
| `secondary-color` | `string` | empty | Static track color behind each bar. Falls back to `--dvk-color-secondary` and then `#2b7cff`. |
| `colors` | `string` | empty | Comma-separated bar and track colors. |
| `size` | `number` | `52` | Rendered SVG width in CSS pixels. The height follows the bar aspect ratio. |
| `dur` | `number` | `1.05` | Pulse cycle duration in seconds. Each bar starts at its own fraction of this value. |
| `animated` | `boolean` | `true` | Enables the bar pulse. |
| `paused` | `boolean` | `false` | Stops animation while keeping the resting bar profile visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## Slots

| Name | Description |
| --- | --- |
| default | Loading status text rendered below the pulse bars. |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-loading-pulse-size` | SVG display width. The `size` attribute sets this inline. |
| `--dvk-loading-pulse-gap` | Gap between the pulse bars and the status text. |
| `--dvk-loading-pulse-tip-color` | Status text color. |
| `--dvk-loading-pulse-tip-font-size` | Status text font size. |
| `--dvk-loading-pulse-tip-line-height` | Status text line height. |
| `--dvk-loading-pulse-tip-letter-spacing` | Status text letter spacing. The status text is uppercased. |

## Parts

| Part | Description |
| --- | --- |
| `root` | Loading layout wrapper. |
| `graphic` | SVG graphic. |
| `bar` | Shared group for each pulse bar. |
| `bar-track` | Static track behind a bar. |
| `bar-fill` | Moving bar that scales around its own centre. |
| `tip` | Status text wrapper. |
