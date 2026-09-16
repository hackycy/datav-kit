---
description: Wide large-screen title banner whose side ribbons fold down through a shoulder into a flat bottom horizon, with a blurred centre beam, a rail-capped node and a group of slash blades past each shoulder.
---

# Title 7

`dvk-title-7` is a wide title banner for command centers, park operations screens, and data visualization systems. A translucent ribbon runs in from each edge and folds down through a shoulder into a flat bottom horizon, carrying a blurred centre beam and a bright core, so the title floats above a luminous baseline. Past each shoulder sit a thin outer hairline, a rail-capped node and a group of slash blades near the edge. The frame is measured from the title box — a long name pushes the shoulders outward, a short one lets them close in — while the shoulder slant is solved against the host's aspect ratio so it keeps its angle on any screen, and the node and its rail travel with the fold. The artwork is drawn on a 1672×84 canvas (about 20:1), but the demos below render it at 640×64 (about 10:1), so the band reads taller and its shoulder steeper than the design's ~43° — use the flatter shape if you want the prototype's proportions. The title font follows whichever of the two dimensions is tighter, so extra height adds vertical air rather than enlarging the text — and the title box is anchored to the horizon rather than to the top of the band, so a stretched band does not drift the title up and open the gap beneath it. Because a stretched band still shrinks the title relative to the artwork, the design font is set well above the prototype's own and the gap between the text and the fold is tightened to match. That anchor sits above the artwork's own top edge, so a few units of glyph rise above the host box; the component draws them (`overflow: visible`), but a host inside a clipping ancestor will cut them, so leave the title room above if you wrap it in `overflow: hidden`. The component never sets its own height; give the host the box you want.

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-7 title-text="智慧园区综合运营监控平台"></dvk-title-7>
  </div>
</div>

```html
<dvk-title-7 title-text="智慧园区综合运营监控平台"></dvk-title-7>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-7 title-text="态势感知"></dvk-title-7>
  </div>
</div>

```html
<dvk-title-7 title-text="态势感知"></dvk-title-7>
```

<div class="datav-demo datav-demo--decoration" style="--datav-decoration-width: 640px; --datav-decoration-height: 64px;">
  <div class="datav-decoration-shell">
    <dvk-title-7 colors="#52f0b5,#2f8cff,#b7f8ff">
      <span>综合态势感知平台</span>
    </dvk-title-7>
  </div>
</div>

```html
<dvk-title-7 colors="#52f0b5,#2f8cff,#b7f8ff">
  <span>综合态势感知平台</span>
</dvk-title-7>
```

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `string` | CSS variable fallback | Primary cyan color for the lit end of each ribbon, the outer hairline, the rail caps, and the bright end of the horizon. When set as a JavaScript property, a DataV-style color array is also accepted. |
| `secondary-color` | `string` | CSS variable fallback | Secondary deep navy color for the dim end of each ribbon, the side rails, the slash blades, and the quiet ends of the horizon. |
| `accent-color` | `string` | CSS variable fallback | Accent color for the white-hot centre of the horizon beam and the rail caps. |
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
| `--dvk-title-7-accent` | Accent fallback color for the white-hot centre of the beam. |
| `--dvk-title-7-glow-opacity` | Multiplier on the blurred glow layers. Defaults to `1`, which keeps the design's own glow weights. |
| `--dvk-title-7-title-top` | Vertical position of the title box. When unset the component computes it from the host's aspect so the box's bottom sits at `51.6` of the 84-unit canvas, `22.4` units above the horizon. Anchoring the bottom is what stops a band stretched taller than the design from drifting the title up and opening the gap beneath it, since the font tracks the host width alone. An explicit length or percentage always wins. In an environment that cannot measure the host, `25.71%` is used. |
| `--dvk-title-7-title-width` | Title box width, never exceeding the host. When unset the box follows its own text, and its measured width sets the frame. |
| `--dvk-title-7-title-gap` | Padding between the title text and the title box edge, so the fold sits one gap beyond the text. Any CSS length, defaulting to `1.6em` so it scales with the font. The prototype leaves `2.73em`; it is tightened here because the design font below is larger and the fold is measured from the title box, so this buys the wings their room back. |
| `--dvk-title-7-title-size` | Title font size. When unset it follows the host: `60 × min(hostHeight / 84, hostWidth / 1672)`. An explicit value always wins. The design font is larger than the prototype's own 48px on purpose — see the note above. |
| `--dvk-title-7-title-font` | Title font shorthand. Replaces the family, weight, size, and line-height in one declaration. |
| `--dvk-title-7-title-letter-spacing` | Title letter spacing. |
| `--dvk-title-7-title-color` | Title text color. |
| `--dvk-title-7-title-stroke` | Restrained cool halo behind the title glyphs. |
| `--dvk-title-7-title-glow` | Dark depth shadow under the title glyphs. |

## Parts

| Part | Description |
| --- | --- |
| `graphic` | Internal SVG. |
| `ribbon` | Shared part for the folded side ribbons. |
| `ribbon-left` | Left ribbon and its shoulder. |
| `ribbon-right` | Mirrored right ribbon. |
| `diagonal` | Shared part for the thin hairline just outside each fold. |
| `diagonal-left` | Left hairline, running from the fold down to the horizon. |
| `diagonal-right` | Mirrored right hairline. |
| `diagonal-glow` | Blurred glow copy of both hairlines. |
| `side-rail` | Shared part for the side rails that terminate into each node. |
| `side-rail-left` | Left side rail. |
| `side-rail-right` | Mirrored right side rail. |
| `side-rail-dim` | The quieter third line of each side rail. |
| `slash` | Shared part for the slash blades near each edge. |
| `slash-left` | Left group of slash blades. |
| `slash-right` | Mirrored right group of slash blades. |
| `slash-underline` | Thin underline beneath each slash group. |
| `node` | Shared part for the rail caps. |
| `node-left` | Left rail cap. |
| `node-right` | Mirrored right rail cap. |
| `node-highlight` | Bright top edge on each rail cap. |
| `horizon` | Shared part for the bottom horizon. |
| `horizon-flank` | Shared part for the horizon outside the centre beam. |
| `horizon-flank-left` | Left horizon segment. |
| `horizon-flank-right` | Mirrored right horizon segment. |
| `horizon-beam` | Horizon segment behind the centre beam. |
| `beam` | Shared part for the centre beam. |
| `beam-glow` | Blurred wide beam underlay. |
| `beam-core` | Crisp narrow beam core. |
| `content` | Title content wrapper. |
| `title` | Title box whose measured width sets the frame. |
| `title-text` | Generated title text when `title-text` is used. |
