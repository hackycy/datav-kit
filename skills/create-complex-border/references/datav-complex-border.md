# Datav Complex Border Creation Guide

## Purpose

Create original high-density HUD/cyber border boxes that feel native to `datav-kit`. The goal is not "draw a border", but to design a responsive SVG frame with fixed visual identity modules, stretch-safe edge strips, neon lighting, and safe content geometry.

## Project Contract

- Use Web Components and Lit through `DatavElement`.
- Keep imports side-effect free; registration belongs in `register.ts` and aggregate register files.
- Use inline SVG for line frames, corners, flow light, gradients, filters, scanlines, and path animation.
- Provide usable default styles without requiring a theme package.
- Resolve values in this order: explicit property/attribute, CSS variable, component default.
- Keep `frame`, `graphic`, and `content` parts unless there is a clear local reason to add more.
- Compute content padding from a real `contentRect`; do not guess with fixed CSS padding alone.
- Respect `prefers-reduced-motion` for any continuous animation.

## Study Targets

Read these before creating a new border:

- `docs/architecture.md`: architecture, SVG-first rendering, content safe-area, theme and SSR rules.
- `skills/replicate-complex-svg/SKILL.md`: slicing, extension strip, and validation discipline.
- `packages/elements/src/border-box-2/element.ts`: layered cyber frame with fixed corners, center energy bars, side details, nodes, and glow filters.
- `packages/elements/src/border-box-3/element.ts`: symbols, mirrored corners, restrained gradients, side ticks, and center modules.
- `packages/elements/src/border-box-6/element.ts`: many clipped source layers, asymmetric modules, and multiple clean extension strips.
- `packages/elements/src/border-box-content-padding.ts`: content safe-area padding helper.
- `docs/components/borders/border-box-2.md`, `border-box-3.md`, and `border-box-6.md`: public docs tone and prop tables.

## Design Grammar

Use a reference canvas, usually `1600 x 900` or `1672 x 941`, and design in source coordinates first.

A complex border should include most of these traits:

- A non-rectangular silhouette with chamfers, stepped corners, notches, broken line segments, or inset plates.
- Fixed corner modules with layered panels, diagonals, micro ticks, inner hairlines, and bright glints.
- Top and bottom center modules such as plates, hatches, energy bars, small bridge lines, or status tabs.
- Side marker stacks such as dots, circles, short horizontal ticks, vertical rails, triangular arrows, barcode-like clusters, or small blocks.
- At least three visual depth layers: dim structural shadow, colored glow halo, and bright core stroke or fill.
- Multiple light types: soft blur, hard neon edge, small node halo, and gradient core.
- Asymmetry where useful: one side may have a large marker stack, the bottom may have hatch details, or a top line may have two different extension regions.
- Enough negative space to hold dashboard content; ornament density should frame the panel, not invade the safe content rectangle.

Avoid these weak outputs:

- A plain rounded rectangle with glow.
- Four simple corner brackets plus one line per side.
- A single full-size SVG stretched to every host size.
- Decorative nodes placed in stretch regions where they smear as the host grows.
- One hue at one opacity everywhere; complex HUD borders need contrast between dim structure, main chroma, and white-hot accents.

## Complexity Budget

Use this as a floor, not a ceiling, for a new "complex" border:

- At least `8` fixed modules, commonly four corners, two center modules, and two side detail modules.
- At least `8` extension strips, commonly two per side around fixed modules.
- At least `3` SVG definitions among filters, gradients, symbols, clip paths, and masks.
- At least `25` visible primitives or path layers across the frame, excluding repeated boilerplate.
- At least `2` glow filters or one multi-stage filter with more than one blur/merge layer.
- At least `3` color roles: primary, secondary, and accent.
- At least `1` measured `contentRect` and a safe-area padding calculation.

It is fine for `border-box-6` style implementations to keep large vector paths in `vector-paths.ts`, but the element must still expose the slicing and layout logic clearly.

## Responsive Model

Prefer this model:

```txt
fixed corner/detail module | clean extension strip | fixed center/detail module | clean extension strip | fixed corner/detail module
```

For each axis:

- Compute a stable scale from the host and reference canvas.
- Preserve fixed module aspect ratio.
- Allocate extra width or height only to clean straight strips.
- Clip undersized or negative extension lengths to zero.
- Align right-side modules from the right edge and bottom modules from the bottom edge when that preserves source geometry.
- Keep top/bottom padding scaled from host height and left/right padding scaled from host width.

Do not use `preserveAspectRatio="none"` on fixed modules. Only use it for extension strips whose crop contains straight, stable linework and enough glow margin.

## SVG Layering Pattern

A strong generated border usually has this order:

1. Dim base shapes or shadow rails with low opacity.
2. Wide soft glow paths or fills.
3. Structural panel fills and darker contour strokes.
4. Main colored stroke/filled trace.
5. Bright core line, node lights, and small glints.
6. Fine hairlines, dashes, ticks, hatch marks, and micro labels or blocks.
7. Optional moving highlight, scan, or pulse gated by `animated`, `paused`, and reduced-motion rules.

Use `<defs>` for filters, gradients, symbols, clip paths, and reusable corner/side modules. Generate instance-specific IDs when the component can appear multiple times on a page.

## Datav-kit Implementation Checklist

For a new `border-box-N` component:

- Create `packages/elements/src/border-box-N/element.ts`.
- Add `metadata.ts`, `register.ts`, and `index.ts`.
- Export from `packages/elements/src/index.ts`.
- Add metadata to `packages/elements/src/metadata.ts`.
- Add registration to `packages/elements/src/register.ts`.
- Add docs in `docs/components/borders/border-box-N.md`.
- Add or update tests for metadata, registration, rendering, padding, and slice behavior.

Element conventions:

- Use `DatavElement`, `ResizeController`, `resolveThemeValue`, and `resolveNumberValue` where appropriate.
- Emit `dv-ready` with the actual tag name in `firstUpdated`.
- Use `display: block`, `position: relative`, `width: 100%`, `min-width: 0`, `min-height: 0`, and `box-sizing: border-box` on `:host`.
- Make the frame absolute, `inset: 0`, `pointer-events: none`, and non-content-affecting.
- Make the content wrapper `position: relative`, `z-index: 1`, `width: 100%`, `height: 100%`, `min-height: 0`, and `box-sizing: border-box`.
- Keep CSS variable overrides like `--dv-border-box-N-padding`, shared `--dv-border-box-padding`, and `--dv-border-box-N-glow-opacity`.

## Validation Checklist

Run `scripts/audit_border_complexity.py` against the new `element.ts`, then verify manually:

- Fixed modules stay crisp at source-ratio, wide, tall, and small sizes.
- Only clean extension strips grow.
- Corner diagonals, side marker stacks, circles, tick clusters, center plates, and hatches never smear.
- No full-frame SVG sits underneath sliced modules.
- Content padding maps to the intended safe area.
- The content wrapper and slotted content do not cross the frame in fixed-height demos.
- Multiple component instances do not collide through duplicated SVG IDs.
- `glow-intensity`, colors, CSS variables, and docs examples all affect visible SVG layers.

## Failure Patterns

- The output looks "technology-like" but too simple: add fixed modules, center plates, side marker stacks, hairlines, glints, and multiple light layers.
- The border looks good at one size only: you probably stretched the full drawing or included ornaments inside an extension strip.
- Neon looks flat: separate halo, body, and core layers instead of one bright stroke.
- Details disappear after slicing: the tile viewBox may be too tight and clipping filter blur.
- Right or bottom edges drift: align those slices from the corresponding host edge rather than reusing left/top placement math blindly.
- Content overlaps the frame: recalculate `contentRect`, then inspect live host/content rectangles before changing visual paths.
