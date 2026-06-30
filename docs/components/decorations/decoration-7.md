# Decoration 7

`dvk-decoration-7` is a restrained enterprise data-screen ornament built around a translucent crystal-glass ribbon. It uses soft cyan/ice-blue gradients, purple-blue refraction, sparse particles, and thin flowing light trails. The `reverse` attribute mirrors the complete glass geometry so paired instances can form a balanced title bar or module divider.

<div class="datav-demo datav-demo--decoration datav-demo--decoration-7" style="--datav-decoration-width: 620px; --datav-decoration-height: 86px;">
  <div class="datav-decoration-shell">
    <dvk-decoration-7></dvk-decoration-7>
  </div>
</div>

```html
<dvk-decoration-7></dvk-decoration-7>
```

<div class="datav-demo datav-demo--decoration datav-demo--decoration-7" style="--datav-decoration-width: 760px; --datav-decoration-height: 92px;">
  <div class="datav-decoration-shell" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px;">
    <dvk-decoration-7></dvk-decoration-7>
    <dvk-decoration-7 reverse></dvk-decoration-7>
  </div>
</div>

```html
<dvk-decoration-7></dvk-decoration-7>
<dvk-decoration-7 reverse></dvk-decoration-7>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary ice-blue glass highlight. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary cyan glass glow color. |
| `accent-color` | `string` | CSS variable fallback | Purple-blue refraction and energy trail accent color. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `reverse` | `boolean` | `false` | Mirrors the glass ribbon horizontally for symmetric title or divider layouts. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary fallback color. |
| `--dvk-color-secondary` | Secondary fallback color. |
| `--dvk-decoration-7-accent-color` | Accent fallback color for refraction and energy trails. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `shadow` | Soft glow under the glass ribbon. |
| `ribbon` | Main translucent glass body. |
| `refraction` | Group containing the glass cut surfaces. |
| `slice` | Individual translucent refraction plane. |
| `edge` | Shared part for glass edge highlights. |
| `upper-edge` | Bright upper glass highlight. |
| `lower-edge` | Subtle lower glass highlight. |
| `energy` | Flowing light trails inside the ribbon. |
| `particle` | Sparse floating light particles. |
