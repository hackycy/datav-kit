---
description: Minimal enterprise HUD rail with guide lines, corner guides, and angled parallelogram modules for symmetry.
---

# Decoration 9

`dvk-decoration-9` is a minimal enterprise HUD rail for dark data-screen surfaces. It uses separated horizontal guide lines for extension, short angled corner guides for irregular rhythm, then places two independent angled parallelogram modules as restrained visual anchors. The geometry never stitches the blocks into the lines, so `reverse` can be used to build clean left-right symmetry.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 560px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-9></dvk-decoration-9>
  </div>
</div>

```html
<dvk-decoration-9></dvk-decoration-9>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 780px; --datav-decoration-height: 72px;">
  <div class="datav-decoration-shell" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 26px;">
    <dvk-decoration-9></dvk-decoration-9>
    <dvk-decoration-9 reverse></dvk-decoration-9>
  </div>
</div>

```html
<dvk-decoration-9></dvk-decoration-9>
<dvk-decoration-9 reverse></dvk-decoration-9>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 680px; --datav-decoration-height: 70px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-9 colors="#6ee7ff,#2f8cff,#52f0b5"></dvk-decoration-9>
  </div>
</div>

```html
<dvk-decoration-9 colors="#6ee7ff,#2f8cff,#52f0b5"></dvk-decoration-9>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cool cyan line color. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue glow and module color. |
| `accent-color` | `string` | CSS variable fallback | Accent highlight color for a small independent module and tick. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `reverse` | `boolean` | `false` | Mirrors the full rail horizontally for paired symmetric decoration. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary fallback color. |
| `--dvk-color-secondary` | Secondary fallback color. |
| `--dvk-decoration-9-accent` | Cold accent fallback color. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `line-glow` | Soft glow pass for the horizontal guide lines. |
| `glow-line` | Individual glow line. |
| `line-layer` | Crisp visible line and tick layer. |
| `line` | Shared part for horizontal guide lines. |
| `primary-line` | Primary horizontal rail segment. |
| `secondary-line` | Secondary horizontal rail segment. |
| `dim-line` | Quiet supporting rail segment. |
| `corner-line` | Shared part for independent angled corner guide lines. |
| `primary-corner-line` | Primary angled corner guide. |
| `secondary-corner-line` | Secondary angled corner guide. |
| `dim-corner-line` | Quiet angled corner guide. |
| `tick` | Short independent horizontal tick. |
| `block-layer` | Independent parallelogram module layer. |
| `block` | Shared part for all parallelogram modules. |
| `secondary-block` | Secondary module. |
| `accent-block` | Accent module. |
