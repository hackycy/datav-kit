---
description: Cyber floating hollow luminous halo with a raised inner ring and rotating neon orbits.
---

# Decoration 11

`dvk-decoration-11` is a cyber floating hollow luminous halo inspired by layered status rings on large-screen command dashboards. It avoids filled surfaces: the outer energy ring carries the main glow, the segmented tick track and gold-white orbits rotate inside it, and the raised center is a black-hole-like void surrounded by hollow rings, rim highlights, and micro ticks. The height is visible enough to read as stacked floating rings while staying lighter than a heavy 3D pedestal.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 420px; --datav-decoration-height: 315px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-11></dvk-decoration-11>
  </div>
</div>

```html
<dvk-decoration-11></dvk-decoration-11>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 460px; --datav-decoration-height: 345px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-11 colors="#66f5ff,#2f8cff,#ffe69c" dur="9"></dvk-decoration-11>
  </div>
</div>

```html
<dvk-decoration-11 colors="#66f5ff,#2f8cff,#ffe69c" dur="9"></dvk-decoration-11>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan neon color for bright rings, ticks, particles, bridge glows, and the dark center rim. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue color for guide rings, lower tracks, segmented blocks, shadows, and cool bridge lines. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and optional gold accent colors. |
| `dur` | `number` | `9` | Base rotation duration in seconds. Values are clamped to the `6`-`14` second floating-halo range. |
| `animated` | `boolean` | `true` | Enables rotating halo layers, orbit arcs, and particle drift animations. |
| `paused` | `boolean` | `false` | Stops all animations while keeping the raised layered platform visible. |

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
| `ground-glow` | Soft glow projected below the floating rings. |
| `lift-shadow` | Stacked shallow shadows that sell the slight vertical lift. |
| `vertical-links` | Group containing subtle perspective bridge strokes. |
| `bridge-line` | Individual line connecting lower and higher halo layers. |
| `lift-layer` | Shared part for each raised ring layer. |
| `base-layer` | Lowest outer luminous halo layer. |
| `lower-layer` | Slightly raised segmented blue track layer. |
| `middle-layer` | Higher orbit layer with gold and white arcs. |
| `inner-layer` | Highest ring and core tick layer. |
| `ring` | Shared part for circular and arc ring geometry. |
| `guide-ring` | Static low-intensity guide rings. |
| `bright-ring` | Rotating bright neon arc groups. |
| `sweep-ring` | Fast subtle sweep arcs around the outer halo. |
| `segmented-track` | Rotating lower segmented track group. |
| `segment-block` | Individual rectangular energy block in the lower track. |
| `ticks` | Group containing precision tick marks. |
| `tick` | Individual tick mark. |
| `gold-orbit` | Warm gold orbit arcs in the middle layer. |
| `white-orbit` | White and gold orbit arcs around the inner layer. |
| `core-disc` | Highest hollow inner ring. |
| `inner-side-shadow` | Dark front edge that gives the highest ring a subtle raised side. |
| `inner-top-highlight` | Thin upper rim highlight on the raised inner ring. |
| `inner-front-lip` | Front rim strokes that make the inner ring read as slightly convex. |
| `core-ticks` | Small tick ring inside the raised center. |
| `core-tick` | Individual tick in the center tick ring. |
| `core` | Center core group. |
| `core-void` | Black-hole-like center void group. |
| `void-hole` | Dark empty center. |
| `void-rim` | Absorbing rim around the center void. |
| `particles` | Sparse outer floating particle group. |
| `particle` | Individual particle spark. |
