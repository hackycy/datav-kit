# Decoration 6

`dv-decoration-6` is a minimal cyber HUD rail for enterprise data screens. It uses thin cyan and electric-blue SVG strokes, restrained glow, segmented breaks, angled cuts, and small light nodes without forming a frame. The `reverse` attribute mirrors the full geometry so paired instances can create a symmetric title or divider composition.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 520px; --datav-decoration-height: 48px;">
  <div class="datav-decoration-shell">
    <dv-decoration-6></dv-decoration-6>
  </div>
</div>

```html
<dv-decoration-6></dv-decoration-6>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 52px;">
  <div class="datav-decoration-shell" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px;">
    <dv-decoration-6></dv-decoration-6>
    <dv-decoration-6 reverse></dv-decoration-6>
  </div>
</div>

```html
<dv-decoration-6></dv-decoration-6>
<dv-decoration-6 reverse></dv-decoration-6>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan rail color. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary electric-blue rail and halo color. |
| `accent-color` | `string` | CSS variable fallback | Bright node core color. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `reverse` | `boolean` | `false` | Mirrors the decoration horizontally for symmetric title or divider layouts. |

## Events

| Name | Detail |
| --- | --- |
| `dv-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dv-color-primary` | Primary fallback color. |
| `--dv-color-secondary` | Secondary fallback color. |
| `--dv-decoration-6-accent-color` | Accent fallback color for node cores. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `halo` | Subtle glow layer. |
| `line` | Shared part for SVG linework. |
| `main-line` | Primary segmented rail. |
| `head-line` | Angled leading rail module. |
| `tail-line` | Long extending rail segment. |
| `support-line` | Secondary circuit lines. |
| `segment` | Short modular break marks. |
| `cut` | Fine diagonal cut marks. |
| `node` | Glowing circuit nodes. |
