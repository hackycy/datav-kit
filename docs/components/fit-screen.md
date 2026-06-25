# Fit Screen

`dv-fit-screen` scales a fixed design canvas into either the browser viewport or its host container.

<div class="datav-demo">
  <dv-fit-screen fit-target="host" width="1280" height="720" mode="contain" align="center center">
    <dv-border-glow class="datav-panel" colors="#18f0ff,#2b7cff" radius="20">
      <div class="datav-panel__content">
        <p class="datav-panel__title">Contain Mode</p>
        <p class="datav-panel__meta">1280 x 720 design canvas</p>
      </div>
    </dv-border-glow>
  </dv-fit-screen>
</div>

```html
<dv-fit-screen fit-target="host" width="1280" height="720" mode="contain" align="center center">
  <dv-border-glow>
    <section>Contain Mode</section>
  </dv-border-glow>
</dv-fit-screen>
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
| `dv-resize` | `{ width, height, dpr, scale, scaleX, scaleY, offsetX, offsetY }` |
| `dv-fullscreen-request` | `{ ok, reason }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-scale` | The active uniform scale. |
| `--dv-scale-x` | X scale. |
| `--dv-scale-y` | Y scale. |
| `--dv-viewport-width` | Observed viewport width. |
| `--dv-viewport-height` | Observed viewport height. |

## Parts

| Part | Description |
| --- | --- |
| `viewport` | Outer viewport wrapper. |
| `canvas` | Scaled design canvas. |
