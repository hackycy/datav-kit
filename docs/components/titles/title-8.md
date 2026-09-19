---
description: Large-screen title banner whose upper rails run in from each edge through a shoulder onto a luminous spine, around a dark recess lit by an ambient bloom, with slash blades and an end dot matrix past each shoulder.
---

# Title 8

`dvk-title-8` is a large-screen title banner for command centers, city operations screens, and data visualization systems. An upper rail runs in from each edge, steps down through a 51° shoulder, and lands on a luminous baseline — the spine — that carries a white-hot centre, so the title sits in the valley between two raised wings instead of on a plain band. Under each rail is a band fill and, inboard of it, a dark recess, which is the design's 凹槽: a notch cut out of the lit field, flanked by three slash blades and an end dot matrix. The frame is measured from the title box — a long name pushes the shoulders outward, a short one lets them close in — while the shoulder slant is solved against the host's aspect ratio so it keeps its angle on any screen. The artwork is drawn on a 2048×180 canvas (about 11.4:1), but the demos below render it at 640×64 (10:1) — the same box the rest of the title family uses — so the band reads a little taller than its design, and because the title box is anchored to the spine that extra room goes above the title rather than under it. The title font follows whichever of the two dimensions is tighter, so extra height adds vertical air rather than enlarging the text, and the title box is anchored to the spine rather than to the top of the band, so a stretched band does not drift the title up and open the gap beneath it. Two things are worth knowing before you size it. First, the recess is *darker* than the page, so it only reads as a notch because an ambient bloom lights the field around it — on a mid-tone or light page the wings will look like flat panels. That bloom is pooled around the title and the recess; the prototype's second bloom, which entered from the top edge, is not drawn, so the band's top edge is flush with the page rather than a lit boundary. Second, the component deliberately paints no backdrop of its own: it assumes a dark page (the prototype's `#06111f` and anything within a few levels of it) and composites onto whatever is behind it, like the rest of the title family. The component never sets its own height; give the host the box you want.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-8 title-text="企业运营监控中心"></dvk-title-8>
  </div>
</div>

```html
<dvk-title-8 title-text="企业运营监控中心"></dvk-title-8>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-8 title-text="态势感知"></dvk-title-8>
  </div>
</div>

```html
<dvk-title-8 title-text="态势感知"></dvk-title-8>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-8 colors="#52f0b5,#2f8cff,#b7f8ff">
      <span>综合态势感知平台</span>
    </dvk-title-8>
  </div>
</div>

```html
<dvk-title-8 colors="#52f0b5,#2f8cff,#b7f8ff">
  <span>综合态势感知平台</span>
</dvk-title-8>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan color for the bright end of the upper rails and the flanks of the spine. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary deep navy color for the dim end of the upper rails and the band, the lower rails, the slash blades, and the quiet ends of the spine. |
| `accent-color` | `string` | CSS variable fallback | Accent color for the white-hot centre of the spine. |
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
| `--dvk-color-secondary` | Secondary deep navy fallback color. |
| `--dvk-title-8-accent` | Accent fallback color for the white-hot centre of the spine. |
| `--dvk-title-8-glow-opacity` | Multiplier on the blurred rail glow and the spine's glow rect. Defaults to `1`, which keeps the design's own glow weights. |
| `--dvk-title-8-recess` | Fill of the dark notch under each rail. Defaults to `rgba(4, 16, 30, 0.72)`, which is *darker* than the page — the notch is a cut, not a panel. |
| `--dvk-title-8-title-top` | Vertical position of the title box. When unset the component computes it from the host's aspect so the box's bottom sits at `146.1` of the 180-unit canvas, `24` units above the spine. Anchoring the bottom is what stops a band stretched taller than the design from drifting the title up and opening the gap beneath it, since the font tracks the host width alone. An explicit length or percentage always wins. In an environment that cannot measure the host, `60.06%` is used. |
| `--dvk-title-8-title-width` | Title box width, never exceeding the host. When unset the box follows its own text, and its measured width sets the frame. |
| `--dvk-title-8-title-gap` | Padding between the title text and the title box edge, so the shoulder sits one gap beyond the text. Any CSS length, defaulting to `1.435em` so it scales with the font. This is the prototype's own clearance, kept verbatim so the frame lands on its design coordinates. |
| `--dvk-title-8-title-size` | Title font size. When unset it follows the host: `76 × min(hostHeight / 180, hostWidth / 2048)`. An explicit value always wins. |
| `--dvk-title-8-title-font` | Title font shorthand. Replaces the family, weight, size, and line-height in one declaration. |
| `--dvk-title-8-title-letter-spacing` | Title letter spacing. Defaults to the prototype's wide `0.105em`. |
| `--dvk-title-8-title-gradient` | Background image clipped to the glyphs — the prototype's white-to-blue vertical ramp. Set it to `none` to fall back to a flat fill, which is what `--dvk-title-8-title-color` then paints. |
| `--dvk-title-8-title-color` | Flat title text color, used when the gradient is `none`. |
| `--dvk-title-8-title-stroke-width` | Width of the glyph outline stroke. Defaults to `.0094em`, the prototype's viewport-relative value at the design font. |
| `--dvk-title-8-title-stroke` | Color of that glyph outline stroke. |
| `--dvk-title-8-title-glow` | Tight white lift directly under the glyphs. |
| `--dvk-title-8-title-halo` | Mid cyan halo behind the glyphs. |
| `--dvk-title-8-title-shadow` | Wide blue depth shadow behind the glyphs. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `bloom` | Wide ambient bloom pooled around the title and the recess. |
| `band` | Shared part for the thin band that follows each rail down into the shoulder. |
| `band-left` | Left band, from the edge to the shoulder foot. |
| `band-right` | Mirrored right band. |
| `recess` | Shared part for the dark notch under each band. |
| `recess-left` | Left notch. |
| `recess-right` | Mirrored right notch. |
| `upper-rail` | Shared part for the upper rails. |
| `upper-rail-left` | Left upper rail and its shoulder. |
| `upper-rail-right` | Mirrored right upper rail. |
| `upper-rail-glow` | Blurred glow copy of the upper rails. |
| `upper-rail-core` | Crisp upper rail stroke. |
| `lower-rail` | Shared part for the quiet rail below each band. |
| `lower-rail-left` | Left lower rail. |
| `lower-rail-right` | Mirrored right lower rail. |
| `slash` | Shared part for the slash blades past each shoulder. |
| `slash-left` | Left group of three blades. |
| `slash-right` | Mirrored right group of three blades. |
| `dots` | Shared part for the terminal dot matrices. |
| `dots-left` | Left 8×3 dot matrix. |
| `dots-right` | Mirrored right dot matrix. |
| `aura` | Soft pool of light under the spine. |
| `spine` | Shared part for the luminous baseline. |
| `spine-glow` | Blurred, one-unit-wider underlay of the spine. |
| `spine-core` | Crisp narrow core of the spine. |
| `content` | Title content wrapper. |
| `title` | Title box whose measured width sets the frame. |
| `title-text` | Generated title text when `title-text` is used. |
