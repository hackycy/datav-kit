# Datav Complex Border Implementation Guide

This reference covers Datav-kit engineering rules for accepted border components. Use `SKILL.md` for process order and `design-brief-template.md` for required design evidence.

## Project Contract

- Use Web Components and Lit through `DatavElement`.
- Keep imports side-effect free; registration belongs in `register.ts` and aggregate registration files.
- Use inline SVG for rails, corners, gradients, glows, hatches, nodes, scanlines, and path animation.
- Provide usable defaults without requiring a theme package.
- Resolve visual values in this order: explicit property/attribute, CSS variable, component default.
- Keep `frame`, `graphic`, and `content` parts unless the component has a documented reason to add more.
- Compute content padding from a real content rectangle through `createBorderBoxContentPadding` or an equivalent measured mapping.
- Respect `prefers-reduced-motion` and `paused` when animation exists.

## Component Surface Checklist

For a new or redesigned `border-box-N`, update:

- `packages/elements/src/border-box-N/element.ts`
- `packages/elements/src/border-box-N/metadata.ts`
- `packages/elements/src/border-box-N/register.ts`
- `packages/elements/src/border-box-N/index.ts`
- `packages/elements/src/index.ts`
- `packages/elements/src/metadata.ts`
- `packages/elements/src/register.ts`
- `docs/components/borders/border-box-N.md`
- `docs/.vitepress/config.ts` when sidebar navigation changes
- `docs/index.md` when the landing index should mention it
- `packages/elements/test/register.test.ts`
- `skills/create-complex-border/references/border-family-inventory.md`

For `repair/redesign`, preserve public API by default: tag name, exports, standard props, CSS variables, parts, and `dv-ready`.

## Standard Public API

Default to:

- `color`
- `secondary-color`
- `accent-color`
- `colors`
- `glow-intensity`
- `animated`
- `paused`

Do not expose implementation details such as source canvas, `viewBox`, fixed slice coordinates, internal module names, or debug overlays.

## SVG Layering

Use a clear draw order:

1. Dim base construction lines or shadow rails.
2. Quiet painted halo or translucent fills.
3. Structural panel fills and darker contour strokes.
4. Main colored rail strokes and fixed modules.
5. Bright core lines, nodes, glints, and small status marks.
6. Fine hatches, ticks, labels, and secondary hairlines.
7. Optional moving highlight, gated by `animated`, `paused`, and reduced motion.

Prefer painted halo strokes and gradients before blur filters. Use at most one tight blur filter by default.

## Responsive Models

Default model:

```txt
fixed module | clean extension strip | fixed module | clean extension strip | fixed module
```

Other valid models:

- Asymmetric side module plus vertical extension strips.
- Split top rails with no centered module.
- Sparse anchors connected by long clean strips.
- Hybrid live host geometry plus fixed modules.
- Live-size geometry only when documented as an exception in the design brief.

Stretch only clean straight strips. Do not stretch complex corners, nodes, hatches, arcs, or identity modules.

### Cross-Slice Continuity

When a rail, spine, outline, or charge path appears to continue through multiple tiles/extensions, validate the coordinate mapping across slices, not just the path syntax.

- For a vertical continuous rail, all participating slices should normally share the same source `x` band and rendered width. If they do not, prove the rail source `x` maps to the same host `x` in each slice.
- For a horizontal continuous rail, all participating slices should normally share the same source `y` band and rendered height. If they do not, prove the rail source `y` maps to the same host `y` in each slice.
- Adjacent slice boxes must touch with a measured gap near zero at source-ratio, wide, tall, and small sizes.
- Tests should assert compatible viewBox bands for intentional cross-slice rails or include equivalent mapping checks. Browser validation should record the measured alignment delta and boundary gap.
- Do not accept a fix that only changes an SVG `d` string when the visual discontinuity is caused by mismatched slice viewBoxes, CSS placement, `preserveAspectRatio`, or clipping.

## Tests

Unit tests should cover engineering contracts, not aesthetic taste:

- registration helpers and aggregate registration;
- metadata presence and absence of internal public props;
- standard props, attributes, CSS variables, and defaults;
- `frame`, `graphic`, and `content` parts;
- content safe-area padding at representative sizes;
- `animated`, `paused`, and reduced-motion output;
- unique SVG ids across instances when defs are used;
- identifiable fixed modules and extension strips when slicing is used;
- cross-slice continuity contracts for rails intended to read as unbroken;
- documented live-size exception behavior when live-size geometry is used.

## Manual Validation

Use realistic dashboard content: title/status, KPI numbers, chart/map/topology region, list/status points, and dark dashboard surface. Check source-ratio, wide, tall, and small sizes.

Record conclusions in `design-brief.md`. Do not commit screenshot evidence unless the user explicitly changes the policy.
