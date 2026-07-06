---
description: A restrained enterprise sci-fi loading indicator with a chamfered processor-like energy cell and continuous data-flow motion.
---

# Loading Energy

`dvk-loading-energy` renders a compact enterprise sci-fi loader: a chamfered processor-like energy cell sits inside a clean status shell, with four-direction contacts and a continuous energy-flow cycle that reads clearly as loading.

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
| `color` | `string` | empty | Energy flow, scan, and core status light color. Falls back to `--dvk-color-primary` and then `#18f0ff`. |
| `secondary-color` | `string` | empty | Module frame, bus line, and secondary contact color. Falls back to `--dvk-color-secondary` and then `#2b7cff`. |
| `colors` | `string` | empty | Comma-separated energy and module frame colors. |
| `size` | `number` | `72` | Rendered SVG size in CSS pixels. |
| `stroke-width` | `number` | `2` | Module shell and energy cell stroke width in SVG units. |
| `dur` | `number` | `1.9` | Flow cycle duration in seconds. Bus flow and scan layers derive from this value. |
| `animated` | `boolean` | `true` | Enables continuous energy-flow, bus-flow, contact, and scan animation. |
| `paused` | `boolean` | `false` | Stops animation while keeping the static module visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## Slots

| Name | Description |
| --- | --- |
| default | Loading status text rendered below the energy module. |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-loading-energy-size` | SVG display size. The `size` attribute sets this inline. |
| `--dvk-loading-energy-gap` | Gap between energy module and status text. |
| `--dvk-loading-energy-tip-color` | Status text color. |
| `--dvk-loading-energy-tip-font-size` | Status text font size. |
| `--dvk-loading-energy-tip-line-height` | Status text line height. |

## Parts

| Part | Description |
| --- | --- |
| `root` | Loading layout wrapper. |
| `graphic` | SVG graphic. |
| `aura` | Soft radial glow behind the module. |
| `frame` | Outer calibration rails. |
| `module-shell` | Chamfered processor-like module shell. |
| `bus-line` | Four-direction data bus lines. |
| `bus-flow` | Moving data-flow overlay on the bus lines. |
| `energy-cell` | Vertical central energy slot. |
| `energy-fill` | Static base fill inside the energy slot. |
| `energy-flow` | Moving energy segments inside the slot. |
| `scan-line` | Moving scanning highlight. |
| `charge-segment` | Shared selector for the contact segments. |
| `charge-left` | Left-side contact segment. |
| `charge-right` | Right-side contact segment. |
| `charge-top` | Top contact segment. |
| `charge-bottom` | Bottom contact segment. |
| `core` | Central status light. |
| `tip` | Status text wrapper. |
