---
description: Cyber floating audio halo with fixed outer rhythm blocks, glow rings, segmented scales, and raised inner indicators.
---

# Decoration 11

`dvk-decoration-11` is a cyber floating audio halo inspired by layered status rings on large-screen command dashboards. The outer edge uses a fixed-count ring of short and tall rhythm blocks, like a clean music-player visualizer rotating around the platform. Inside it, a thin glow ring, a thick glow ring, a calibrated tick ring, a segmented inner ring, a single dashed core ring, and small outlined triangle indicators step upward to create a lightweight 3D stack.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 420px; --datav-decoration-height: 315px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-11 raster-renderer="sprite"></dvk-decoration-11>
  </div>
</div>

```html
<dvk-decoration-11></dvk-decoration-11>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 460px; --datav-decoration-height: 345px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-11 colors="#66f5ff,#2f8cff,#ffe69c" dur="9" raster-renderer="sprite"></dvk-decoration-11>
  </div>
</div>

```html
<dvk-decoration-11 colors="#66f5ff,#2f8cff,#ffe69c" dur="9"></dvk-decoration-11>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan neon color for glow rings, scale ticks, audio rhythm blocks, bridge glows, and inner indicators. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue color for guide rings, tick shadows, segmented arcs, and cool bridge lines. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and optional gold accent colors. |
| `dur` | `number` | `9` | Base rotation duration in seconds. Values are clamped to the `6`-`14` second floating-halo range. |
| `animated` | `boolean` | `true` | Enables the fixed outer audio rhythm-block ring and selected inner layers to rotate. |
| `paused` | `boolean` | `false` | Stops all rotations while keeping the raised layered platform visible. |
| `raster-renderer` | `'video' \| 'sprite'` | `'sprite'` | Runtime raster output renderer. Defaults to transparent PNG atlas playback; use `video` for transparent WebM playback. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary cyan fallback color. |
| `--dvk-color-secondary` | Secondary blue fallback color. |
| `--dvk-color-accent` | Optional warm gold fallback color. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `vertical-links` | Group containing subtle perspective bridge strokes. |
| `bridge-line` | Individual line connecting lower and higher halo layers. |
| `lift-layer` | Shared part for each raised ring layer. |
| `particle-layer` | Lowest outer ring layer containing the fixed rhythm blocks. |
| `audio-bars` | Group containing the fixed-count music-visualizer rhythm blocks. |
| `audio-bar-ring` | Rotating group for the outer rhythm blocks. |
| `thin-glow-layer` | Thin luminous ring layer just inside the rhythm blocks. |
| `thick-glow-layer` | Thick primary glow ring layer. |
| `thick-side-shadow` | Dark front edge that gives the thick glow ring a subtle raised side. |
| `scale-layer` | Raised calibrated tick layer. |
| `inner-segment-layer` | Raised segmented inner ring layer. |
| `inner-layer` | Highest dashed ring and triangle indicator layer. |
| `ring` | Shared part for circular and arc ring geometry. |
| `guide-ring` | Static low-intensity guide rings. |
| `particle-guide` | Subtle guide line under the outer rhythm blocks. |
| `thin-glow-ring` | Fine glowing ring and its sweep arcs. |
| `thick-glow-ring` | Main thick luminous ring, rendered as an ice-blue glow. |
| `scale-guide` | Guide rings under the scale ticks. |
| `segment-guide` | Guide ring under the inner segmented arcs. |
| `dashed-ring` | Single dashed ring inside the segmented inner ring. |
| `bright-ring` | Rotating bright neon arc groups. |
| `sweep-ring` | Fast subtle sweep arcs around the outer halo. |
| `sweep-arc` | Individual sweep arc. |
| `thin-sweep` | Rotating sweep group on the thin ring. |
| `segmented-track` | Rotating inner segmented ring group. |
| `segmented-ring` | Inner segmented ring group. |
| `segment-block` | Individual segment arc in the inner ring. |
| `segment-arc` | Individual segment arc in the inner ring. |
| `ticks` | Group containing precision tick marks. |
| `tick` | Individual tick mark. |
| `scale-ticks` | Group containing the calibrated scale ring ticks. |
| `scale-tick` | Individual tick in the scale ring. |
| `triangle-indicators` | Group containing small rotating outlined triangle indicators inside the dashed ring. |
| `triangle-indicator` | Individual outlined triangle indicator with its tip facing inward. |
| `particles` | Compatibility alias for the outer audio-bar layer. |
| `particle` | Compatibility alias for an individual outer rhythm block. |
