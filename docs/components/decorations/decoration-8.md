---
description: Rotating HUD energy ring with arcs, tick marks, neon blocks, and dark hollow center for metrics display.
---

# Decoration 8

`dvk-decoration-8` is a futuristic rotating HUD energy ring for dark data-screen scenes. It renders non-overlapping long-short outer arcs, a thinner offset trace ring that crosses them only during parallax motion, precision tick marks, dotted micro indicators, a ring of neon square energy blocks, and a dark hollow center. A default slot sits above the SVG so the decoration can frame a compact metric, icon, or status label.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 160px; --datav-decoration-height: 160px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-8></dvk-decoration-8>
  </div>
</div>

```html
<dvk-decoration-8></dvk-decoration-8>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 210px; --datav-decoration-height: 210px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-8 colors="#52f0b5,#2b7cff" dur="6">
      <div style="display: grid; place-items: center; width: 72px; height: 72px; border: 1px solid rgba(82, 240, 181, 0.34); border-radius: 50%; color: #effbff; background: rgba(5, 12, 24, 0.62);">
        <strong style="font-size: 22px; line-height: 1;">98</strong>
        <span style="font-size: 11px; color: rgba(239, 251, 255, 0.72);">SYNC</span>
      </div>
    </dvk-decoration-8>
  </div>
</div>

```html
<dvk-decoration-8 colors="#52f0b5,#2b7cff" dur="4">
  <strong>98</strong>
</dvk-decoration-8>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary neon ring, tick, and energy block color. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary arc, guide, and micro indicator color. |
| `colors` | `string` | empty | Comma-separated primary and secondary colors. |
| `dur` | `number` | `5` | Rotation duration in seconds. |
| `animated` | `boolean` | `true` | Enables SVG rotation animations. |
| `paused` | `boolean` | `false` | Stops rotation animations while keeping the static geometry visible. |

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
| `background` | Dark radial HUD background wash. |
| `halo` | Soft concentric glow guides. |
| `ring` | Shared part for segmented light arcs. |
| `outer-ring` | Wide rotating outer arc segments with irregular long-short pairing. |
| `outer-trace` | Thin offset outer trace segments placed between the wide arcs for parallax motion. |
| `inner-ring` | Narrow counter-rotating inner arc segments. |
| `outer-arcs` | Group containing the outer rotating light bands. |
| `outer-arc-band` | Group containing the wide outer arc band. |
| `outer-arc-trace` | Group containing the thinner offset outer trace band. |
| `segmented-track` | Group containing the inner segmented track. |
| `guide-ring` | Shared part for the static dashed guide rings. |
| `outer-guide` | Outer dashed guide ring. |
| `inner-guide` | Inner dashed guide ring. |
| `core-guide` | Dashed guide around the hollow core. |
| `ticks` | Group containing precision tick marks. |
| `tick` | Individual tick mark. |
| `energy-blocks` | Group containing the rotating square energy blocks. |
| `energy-block` | Individual neon square energy block. |
| `micro-lights` | Group containing dotted micro indicators. |
| `micro-light` | Individual micro indicator. |
| `core` | Dark hollow center and core rim. |
| `content` | Centered slot content wrapper. |
