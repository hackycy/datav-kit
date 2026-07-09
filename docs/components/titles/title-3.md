---
description: Aurora arc large-screen title header with open curved light tracks, a translucent center lens, soft orbit rails, and light-bead terminals.
---

# Title 3

`dvk-title-3` is an aurora arc large-screen title header for command-center dashboards, city operations screens, and data visualization systems. It uses an open curved silhouette: a soft aurora halo, two floating orbit rails, a central translucent lens, and tiny light-bead terminals for a light, spacious title focus.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1080px; --datav-decoration-height: 86px;">
  <div class="datav-decoration-shell">
    <dvk-title-3 title-text="AURORA OPERATIONS"></dvk-title-3>
  </div>
</div>

```html
<dvk-title-3 title-text="AURORA OPERATIONS"></dvk-title-3>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1120px; --datav-decoration-height: 88px;">
  <div class="datav-decoration-shell">
    <dvk-title-3 colors="#39f6c8,#7aa8ff,#ff7bd5">
      <span>极光城市运行中心</span>
    </dvk-title-3>
  </div>
</div>

```html
<dvk-title-3 colors="#39f6c8,#7aa8ff,#ff7bd5">
  <span>极光城市运行中心</span>
</dvk-title-3>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 960px; --datav-decoration-height: 78px;">
  <div class="datav-decoration-shell">
    <dvk-title-3 colors="#8cfaff,#6b8dff,#b787ff" title-text="CLOUD COMMAND"></dvk-title-3>
  </div>
</div>

```html
<dvk-title-3 colors="#8cfaff,#6b8dff,#b787ff" title-text="CLOUD COMMAND"></dvk-title-3>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary aurora green color for the main curved rails, lens glow, and title emphasis. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary cool blue color for the outer arc, lens tint, and quiet terminal marks. |
| `accent-color` | `string` | CSS variable fallback | Accent aurora pink color for the small central arcs and right-side color drift. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `title-text` | `string` | empty | Optional centered system name. When omitted, the default slot is rendered inside the title area. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary aurora green fallback color. |
| `--dvk-color-secondary` | Secondary cool blue fallback color. |
| `--dvk-title-3-accent` | Accent aurora pink fallback color. |
| `--dvk-title-3-title-width` | Maximum title content width. |
| `--dvk-title-3-title-min-width` | Minimum title content width. |
| `--dvk-title-3-title-top` | Title content vertical center. |
| `--dvk-title-3-title-height` | Title content height. |
| `--dvk-title-3-title-color` | Title text color. |
| `--dvk-title-3-title-font` | Title font shorthand. |
| `--dvk-title-3-title-letter-spacing` | Title letter spacing. |
| `--dvk-title-3-title-glow` | Soft primary title glow. |
| `--dvk-title-3-title-accent-glow` | Soft accent title glow. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `aurora-halo` | Soft curved aurora surface behind the title. |
| `lens-glow` | Diffuse glow around the central title lens. |
| `title-lens` | Main translucent elliptical title lens. |
| `title-lens-inner` | Inner curved lens surface for title focus. |
| `orbit-rail` | Shared part for the floating curved rails. |
| `outer-rail` | Upper open arc rail. |
| `inner-rail` | Lower quiet arc rail. |
| `base-rail` | Subtle bottom guide arc. |
| `accent-arc` | Small aurora accent strokes around the title. |
| `terminal` | Shared part for each side terminal group. |
| `left-terminal` | Left light-bead terminal group. |
| `right-terminal` | Mirrored right light-bead terminal group. |
| `light-bead` | Small terminal light points. |
| `terminal-mark` | Quiet vertical terminal tick marks. |
| `content` | Center title content wrapper. |
| `title` | Alias part for the title content wrapper. |
| `title-text` | Generated title text when `title-text` is used. |
