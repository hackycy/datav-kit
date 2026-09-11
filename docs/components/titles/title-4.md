---
description: Flat rail large-screen title header built from straight horizontal rails, quiet inner guides, and short end ticks, with a title-first opening that follows the title box.
---

# Title 4

`dvk-title-4` is a flat rail large-screen title header for command-center dashboards, city operations screens, and data visualization systems. It stays deliberately plain: straight horizontal rails, quiet inner guides, and a short bright tick at each end. The text is the first visual focus and the decoration moves aside — the center opening is measured from the title box, so a wide title pushes the rails outward and a narrow one lets them extend inward. Use it at 48–56px tall.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1200px; --datav-decoration-height: 56px;">
  <div class="datav-decoration-shell">
    <dvk-title-4 title-text="智慧城市运行中心" style="--dvk-title-4-title-width: 260px;"></dvk-title-4>
  </div>
</div>

```html
<dvk-title-4 title-text="智慧城市运行中心" style="--dvk-title-4-title-width: 260px;"></dvk-title-4>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 1200px; --datav-decoration-height: 56px;">
  <div class="datav-decoration-shell">
    <dvk-title-4 title-text="城市综合交通智能运行监测中心" style="--dvk-title-4-title-width: 380px;"></dvk-title-4>
  </div>
</div>

```html
<dvk-title-4 title-text="城市综合交通智能运行监测中心" style="--dvk-title-4-title-width: 380px;"></dvk-title-4>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 820px; --datav-decoration-height: 52px;">
  <div class="datav-decoration-shell">
    <dvk-title-4 colors="#52f0b5,#2f8cff,#b7f8ff" style="--dvk-title-4-title-width: 260px;">
      <span>综合态势感知平台</span>
    </dvk-title-4>
  </div>
</div>

```html
<dvk-title-4 colors="#52f0b5,#2f8cff,#b7f8ff" style="--dvk-title-4-title-width: 260px;">
  <span>综合态势感知平台</span>
</dvk-title-4>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan color for the main rails, the long quiet ticks, and the title edge dots. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary blue color for the inner soft rails. |
| `accent-color` | `string` | CSS variable fallback | Accent cyan color for the short bright ticks at each end of the rail pair. |
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
| `--dvk-title-4-accent` | Accent cyan fallback color for the end ticks. |
| `--dvk-title-4-rail-opacity` | Opacity of the main rails. |
| `--dvk-title-4-accent-opacity` | Opacity of the short bright end ticks. |
| `--dvk-title-4-title-width` | Title box width, never exceeding the host. When unset the box follows its own text. Wider boxes push the rails outward. |
| `--dvk-title-4-title-gap` | Padding between the title text and the rail opening. Any CSS length, defaulting to `0.8em` so it scales with the title font. The measured box includes it, so the rails open one gap beyond the text. |
| `--dvk-title-4-title-color` | Title text color. |
| `--dvk-title-4-title-font` | Title font shorthand. |
| `--dvk-title-4-title-letter-spacing` | Title letter spacing. |
| `--dvk-title-4-title-glow` | Soft title text glow. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `rail` | Shared part for the horizontal rails. |
| `main-rail` | Upper and lower boundary rails. |
| `soft-rail` | Quiet inner guide rails. |
| `accent` | Shared part for the short end ticks. |
| `accent-core` | Short bright tick near each end. |
| `accent-tail` | Longer quiet tick beside each bright tick. |
| `edge-dot` | Shared part for the small dot marking each side of the opening. |
| `edge-dot-left` | Left opening dot. |
| `edge-dot-right` | Right opening dot. |
| `content` | Center title content wrapper. |
| `title` | Title box whose measured width sets the rail opening. |
| `title-text` | Generated title text when `title-text` is used. |
