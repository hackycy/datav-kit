---
description: Slim enterprise large-screen header banner redesigned as one equal-height horizontal light panel with broad translucent surfaces and a few guiding rails.
---

# Title 1

`dvk-title-1` is a slim enterprise large-screen header banner for smart cockpit, industrial monitoring, data visualization, and digital twin systems. It is redesigned as one equal-height horizontal light panel: broad translucent surfaces keep the same visual height from center to both sides, with a slightly stronger panel thickness for presence, while only a few guiding rails and restrained accents keep the technology feel quiet and spacious.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 960px; --datav-decoration-height: 72px;">
  <div class="datav-decoration-shell">
    <dvk-title-1 title-text="SMART COCKPIT"></dvk-title-1>
  </div>
</div>

```html
<dvk-title-1 title-text="SMART COCKPIT"></dvk-title-1>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1080px; --datav-decoration-height: 76px;">
  <div class="datav-decoration-shell">
    <dvk-title-1 colors="#76f6ff,#2f8cff,#8cecff">
      <span>数字孪生监控平台</span>
    </dvk-title-1>
  </div>
</div>

```html
<dvk-title-1 colors="#76f6ff,#2f8cff,#8cecff">
  <span>数字孪生监控平台</span>
</dvk-title-1>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 900px; --datav-decoration-height: 68px;">
  <div class="datav-decoration-shell">
    <dvk-title-1 colors="#b7f8ff,#4e9dff,#52f0b5" title-text="INDUSTRIAL OPS"></dvk-title-1>
  </div>
</div>

```html
<dvk-title-1 colors="#b7f8ff,#4e9dff,#52f0b5" title-text="INDUSTRIAL OPS"></dvk-title-1>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan color for the center surface, guiding rails, and soft title emphasis. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue color for the side surfaces, rail gradients, and subtle background glow. |
| `accent-color` | `string` | CSS variable fallback | Accent color for the restrained center highlight and side surface accents. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `title-text` | `string` | empty | Optional centered system name. When omitted, the default slot is rendered inside the title area. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary cyan fallback color. |
| `--dvk-color-secondary` | Secondary blue fallback color. |
| `--dvk-title-1-accent` | Accent fallback color for small highlights. |
| `--dvk-title-1-title-width` | Maximum title content width. |
| `--dvk-title-1-title-min-width` | Minimum title content width. |
| `--dvk-title-1-title-height` | Title content height. |
| `--dvk-title-1-title-color` | Title text color. |
| `--dvk-title-1-title-font` | Title font shorthand. |
| `--dvk-title-1-title-glow` | Soft title text glow. |
| `--dvk-title-1-title-glow-strong` | Strong title text glow. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `ambient-glow` | Soft blue glow behind the full header. |
| `side` | Shared part for each symmetric side structure. |
| `left-side` | Left mechanical side group. |
| `right-side` | Mirrored right mechanical side group. |
| `side-surface` | Broad translucent side extension plane. |
| `rail` | Shared part for the few guiding rail strokes. |
| `surface-accent` | Filled side accent strip. |
| `center-panel` | Center title structure. |
| `title-panel` | Main translucent center title surface. |
| `center-edge` | Thin top and bottom guide line on the title surface. |
| `accent-core` | Restrained center highlight strip. |
| `center-notch` | Small bottom notch that gives the title area a subtle focal point. |
| `content` | Center title content wrapper. |
| `title` | Alias part for the title content wrapper. |
| `title-text` | Generated title text when `title-text` is used. |
