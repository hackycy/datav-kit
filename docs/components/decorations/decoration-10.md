---
description: Enterprise radar HUD with concentric rings, scanning beam, target signals, and technical grid overlay.
---

# Decoration 10

`dvk-decoration-10` is a restrained enterprise radar HUD for dark data-center screens. It renders a deep black-blue technical background, low-opacity grid and circuit traces, concentric radar rings, radial guides, precision ticks, segmented light arcs, sparse particles, target signal points, and a translucent clockwise scanning beam with a bright leading edge. A default slot sits above the SVG so the radar can frame a compact metric, status badge, or icon.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 260px; --datav-decoration-height: 260px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-10></dvk-decoration-10>
  </div>
</div>

```html
<dvk-decoration-10></dvk-decoration-10>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 300px; --datav-decoration-height: 300px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-10 colors="#66f5ff,#2f8cff,#a688ff" dur="8">
      <div style="display: grid; place-items: center; width: 76px; height: 76px; border: 1px solid rgba(102, 245, 255, 0.32); border-radius: 50%; color: #f4fdff; background: rgba(2, 13, 30, 0.72); box-shadow: inset 0 0 18px rgba(47, 140, 255, 0.16);">
        <strong style="font-size: 20px; line-height: 1;">A03</strong>
        <span style="font-size: 10px; color: rgba(244, 253, 255, 0.68);">RADAR</span>
      </div>
    </dvk-decoration-10>
  </div>
</div>

```html
<dvk-decoration-10 colors="#66f5ff,#2f8cff,#a688ff" dur="8">
  <strong>A03</strong>
</dvk-decoration-10>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan neon color for radar rings, ticks, scanner edge, particles, and target cores. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue color for grid lines, guide rings, data flow, and radar shadows. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and optional accent colors. |
| `dur` | `number` | `8` | Clockwise scanner rotation duration in seconds. Values are clamped to the 6-10 second radar range. |
| `animated` | `boolean` | `true` | Enables scanner, pulse, flowing arc, ripple, and data-line animations. |
| `paused` | `boolean` | `false` | Stops all animations while keeping the static radar geometry visible. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary fallback color. |
| `--dvk-color-secondary` | Secondary fallback color. |
| `--dvk-color-accent` | Optional pale-purple accent fallback color. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `background` | Deep black-blue radial HUD background. |
| `grid` | Low-opacity technical grid overlay. |
| `background-nodes` | Group containing subtle background flicker nodes. |
| `background-node` | Individual background flicker node. |
| `data-flow` | Group containing circuit-like data flow lines. |
| `data-line` | Individual data flow trace. |
| `ripple-grid` | Group containing side signal wave ripples. |
| `signal-ripple` | Individual expanding side signal wave. |
| `halo` | Soft concentric radar guide rings. |
| `radial-grid` | Group containing radial guide lines. |
| `radial-line` | Individual radial grid line. |
| `ring` | Shared part for radar arc paths. |
| `outer-ring` | Static segmented outer light arc. |
| `inner-ring` | Static inner segmented light arc. |
| `flow-ring` | Slowly rotating low-intensity flowing arc group. |
| `flow-arc` | Individual flowing arc segment. |
| `segmented-ring` | Group containing static segmented rings. |
| `ticks` | Group containing precision tick marks. |
| `tick` | Individual tick mark. |
| `particles` | Group containing sparse HUD particles. |
| `particle` | Individual particle point. |
| `scanner` | Clockwise rotating scanner group. |
| `scan-beam` | Translucent radar scan sector. |
| `scan-edge` | Bright leading edge of the scan sector. |
| `targets` | Group containing target signal points. |
| `target` | Individual target signal. |
| `target-ripple` | Expanding pulse around a target. |
| `target-core` | Target core light point. |
| `center` | Center radar hub group. |
| `center-pulse` | Breathing center point. |
| `content` | Centered slot content wrapper. |
