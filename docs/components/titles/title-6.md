---
description: Large-screen title banner whose bottom horizon runs into a shoulder on each side and up to a long upper rail, with translucent diagonal ribbons and support rails past the shoulders, around a white-hot centre core.
---

# Title 6

`dvk-title-6` is a wide title banner for command centers, park operations screens, and data visualization systems. A long upper rail runs in from each edge, steps down through a shoulder into a flat bottom horizon, and carries a white-hot core at its centre, so the title sits above a luminous baseline instead of inside a recess. Translucent diagonal ribbons and support rails sit just past each shoulder, and the frame is measured from the title box — a long name pushes the shoulders outward, a short one lets them close in — while the shoulder slant is solved against the host's aspect ratio so it keeps its angle on any screen. The artwork is drawn on a 2048×150 canvas (about 13.7:1), but a header this shape reads better a little taller — around 10:1, which is roughly 64px tall for a 638px-wide slot or 120px at 1200px. The title font follows whichever of the two dimensions is tighter, so extra height adds vertical air rather than enlarging the text. The component never sets its own height; give the host the box you want.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-6 title-text="智慧园区综合运营监控平台"></dvk-title-6>
  </div>
</div>

```html
<dvk-title-6 title-text="智慧园区综合运营监控平台"></dvk-title-6>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-6 title-text="态势感知"></dvk-title-6>
  </div>
</div>

```html
<dvk-title-6 title-text="态势感知"></dvk-title-6>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-6 colors="#52f0b5,#2f8cff,#b7f8ff">
      <span>综合态势感知平台</span>
    </dvk-title-6>
  </div>
</div>

```html
<dvk-title-6 colors="#52f0b5,#2f8cff,#b7f8ff">
  <span>综合态势感知平台</span>
</dvk-title-6>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary blue color for the bright end of the upper rails, the outer ticks, and the horizon halo. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary deep blue color for the dim end of the upper rails, the ribbons, the support rails, and the quiet ends of the horizon. |
| `accent-color` | `string` | CSS variable fallback | Accent color for the white-hot centre of the horizon. |
| `colors` | `string` | empty | Comma-separated primary, secondary, and accent colors. |
| `title-text` | `string` | empty | Optional centered system name. When omitted, the default slot is rendered inside the title area. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-ready` | `{ tagName }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-color-primary` | Primary blue fallback color. |
| `--dvk-color-secondary` | Secondary deep blue fallback color. |
| `--dvk-title-6-accent` | Accent fallback color for the white-hot centre of the horizon. |
| `--dvk-title-6-glow-opacity` | Multiplier on the blurred glow layers. Defaults to `1`, which keeps the design's own glow weights. |
| `--dvk-title-6-title-top` | Vertical position of the title box as a share of the host height. Defaults to `37.33%`, the design's title centre. |
| `--dvk-title-6-title-width` | Title box width, never exceeding the host. When unset the box follows its own text, and its measured width sets the frame. |
| `--dvk-title-6-title-gap` | Padding between the title text and the title box edge, so the frame sits one gap beyond the text. Defaults to `1.11em` — twice the prototype's own 40-unit clearance, which read as crowded — and scales with the font, like the rest of the title family. |
| `--dvk-title-6-title-size` | Title font size. When unset it follows the host: `72 × min(hostHeight / 150, hostWidth / 2048)`. An explicit value always wins. |
| `--dvk-title-6-title-font` | Title font shorthand. Replaces the family, weight, size, and line-height in one declaration. |
| `--dvk-title-6-title-letter-spacing` | Title letter spacing. |
| `--dvk-title-6-title-color` | Title text color. |
| `--dvk-title-6-title-stroke` | Restrained cool shadow under the title glyphs. |
| `--dvk-title-6-title-glow` | Dark depth shadow under the title glyphs. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `ribbon` | Shared part for the diagonal ribbons beside each shoulder. |
| `ribbon-left` | Left diagonal ribbon. |
| `ribbon-right` | Mirrored right diagonal ribbon. |
| `rail` | Shared part for the upper rail outline. |
| `rail-left` | Left upper rail, ending where it bends into the shoulder. |
| `rail-right` | Mirrored right upper rail. |
| `rail-glow` | Blurred glow copy of the upper rails. |
| `rail-core` | Crisp upper rail stroke. |
| `support-rail` | Shared part for the thin support rails that fade out before the title. |
| `support-rail-left` | Left support rail. |
| `support-rail-right` | Mirrored right support rail. |
| `tick` | Shared part for the two-level edge ticks. |
| `tick-bright` | Bright short tick head at each outer end. |
| `tick-dim` | Dimmer continuation behind each tick head. |
| `horizon` | Shared part for the bottom horizon. |
| `horizon-glow` | Blurred dark underlay of the horizon. |
| `horizon-core` | Crisp gradient stroke on the horizon. |
| `horizon-halo` | Wide low-energy halo around the centre of the horizon. |
| `core` | Shared part for the centre highlight. |
| `core-blur` | Blurred radial hot core. |
| `core-line` | Crisp white centre stroke. |
| `content` | Title content wrapper. |
| `title` | Title box whose measured width sets the frame. |
| `title-text` | Generated title text when `title-text` is used. |
