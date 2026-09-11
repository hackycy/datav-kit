---
description: Recessed large-screen title header whose top guide rail steps down through a shoulder on each side into a flat bright bottom edge, around a recess that widens to follow the title.
---

# Title 5

`dvk-title-5` is a recessed large-screen title header for command centers, city operations screens, and data visualization systems. Its top guide rail steps down through a shoulder on each side into a flat, brightly lit bottom edge, so the title sits inside a shallow trapezoidal recess instead of on a plain band. The recess is measured from the title box — a long name pushes the shoulders outward, a short one lets them close in — and the shoulder slant is solved against the host's aspect ratio so it keeps its angle on any screen. Use it at 56–64px tall.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1200px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-5 title-text="态势感知"></dvk-title-5>
  </div>
</div>

```html
<dvk-title-5 title-text="态势感知"></dvk-title-5>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1200px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-5 title-text="实时人数监控中心"></dvk-title-5>
  </div>
</div>

```html
<dvk-title-5 title-text="实时人数监控中心"></dvk-title-5>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1200px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-5 colors="#52f0b5,#2f8cff,#b7f8ff">
      <span>综合态势感知平台</span>
    </dvk-title-5>
  </div>
</div>

```html
<dvk-title-5 colors="#52f0b5,#2f8cff,#b7f8ff">
  <span>综合态势感知平台</span>
</dvk-title-5>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan color for the guide rails, the recess bottom edge, the outer ticks, and the title text glow. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue color for the header surface, the recess fill, the inner rail, and the slash accents. |
| `accent-color` | `string` | CSS variable fallback | Accent cyan color for the bright centre of the recess bottom edge. |
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
| `--dvk-title-5-accent` | Accent cyan fallback color for the bright centre of the bottom edge. |
| `--dvk-title-5-surface-opacity` | Opacity of the faint full-width header surface. |
| `--dvk-title-5-glow-opacity` | Opacity of the blurred rail glow and bottom-edge glow. |
| `--dvk-title-5-title-top` | Vertical position of the title box as a share of the host height. Defaults slightly above the recess centre so the bright bottom edge does not crowd the text. |
| `--dvk-title-5-title-max-width` | Maximum title box width, capped at the host width. The box shrink-wraps its text, and its measured width sets the recess. |
| `--dvk-title-5-title-color` | Title text color. |
| `--dvk-title-5-title-font` | Title font shorthand. |
| `--dvk-title-5-title-letter-spacing` | Title letter spacing. |
| `--dvk-title-5-title-stroke` | Tight title text glow. |
| `--dvk-title-5-title-glow` | Wide title text glow. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `top-edge` | Thin gradient hairline along the very top of the header. |
| `surface` | Faint full-width header surface. |
| `guide-rail` | Shared part for the straight outer guide rails beside the recess. |
| `guide-rail-left` | Left guide rail, ending where the left shoulder begins. |
| `guide-rail-right` | Mirrored right guide rail. |
| `recess` | Filled trapezoidal recess surface under the title. |
| `inner-rail` | Quiet rail running parallel to and inside the main rail. |
| `rail` | Shared part for the main rail outline. |
| `rail-glow` | Blurred glow copy of the main rail. |
| `rail-core` | Crisp main rail stroke. |
| `accent` | Shared part for the bright bottom edge of the recess. |
| `accent-glow` | Blurred glow under the recess bottom edge. |
| `accent-core` | Crisp bright stroke on the recess bottom edge. |
| `slash` | Shared part for the symmetric slash accents beside the recess. |
| `slash-left` | Left group of slash accents. |
| `slash-right` | Mirrored right group of slash accents. |
| `tick` | Short quiet ticks near each outer end. |
| `content` | Title content wrapper. |
| `title` | Title box whose measured width sets the recess. |
| `title-text` | Generated title text when `title-text` is used. |
