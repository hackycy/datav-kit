---
description: Responsive scaling container that adapts design canvases to viewport or host container with multiple scaling modes.
---

# Fit Screen

`dvk-fit-screen` scales a fixed design canvas into either the browser viewport or its host container.

<div class="datav-demo">
  <dvk-fit-screen fit-target="host" width="1280" height="720" mode="contain" align="center center">
    <dvk-border-box-1 class="datav-panel" colors="#235fa7,#4fd2dd">
      <div class="datav-panel__content">
        <p class="datav-panel__title">Contain Mode</p>
        <p class="datav-panel__meta">1280 x 720 design canvas</p>
      </div>
    </dvk-border-box-1>
  </dvk-fit-screen>
</div>

```html
<dvk-fit-screen fit-target="host" width="1280" height="720" mode="contain" align="center center">
  <dvk-border-box-1>
    <section>Contain Mode</section>
  </dvk-border-box-1>
</dvk-fit-screen>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `width` | `number` | `1920` | Design canvas width. |
| `height` | `number` | `1080` | Design canvas height. |
| `mode` | `contain \| cover \| fill \| scroll` | `contain` | Scaling behavior. |
| `align` | `string` | `center center` | Horizontal and vertical alignment. |
| `fit-target` | `viewport \| host` | `viewport` | `viewport` makes a full-page dashboard shell; `host` follows the parent container. |
| `auto-fullscreen` | `boolean` | `false` | Compatibility flag only; fullscreen must use a user gesture. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-resize` | `{ width, height, dpr, scale, scaleX, scaleY, offsetX, offsetY }` |
| `dvk-fullscreen-request` | `{ ok, reason }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-scale` | The active uniform scale. |
| `--dvk-scale-x` | X scale. |
| `--dvk-scale-y` | Y scale. |
| `--dvk-viewport-width` | Observed viewport width. |
| `--dvk-viewport-height` | Observed viewport height. |

## Parts

| Part | Description |
| --- | --- |
| `viewport` | Outer viewport wrapper. |
| `canvas` | Scaled design canvas. |
