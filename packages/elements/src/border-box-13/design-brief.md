# Border Box 13 Design Brief

## User Constraints

- Request: add `border 13` from the provided sparse blue SVG reference, remove the large outer blank area caused by preserving the full source canvas, normalize the automatic padding, then redesign the too-invisible motion.
- Explicit direction: preserve the provided line layout, tightly crop the source SVG's unused outer whitespace, keep all four automatic paddings equal to the reasonable top baseline, and use only a few endpoint star-like sparkle dots. Do not use animated line segments, moving light, scanlines, or flow.
- Explicitly allowed risky motifs: none.

## Task Type

- Type: repair/redesign
- Candidate count required: 1
- Candidate count provided: 3

## Failure Diagnosis

- Failed behavior: the visible rails were inset by source canvas whitespace; the first crop improved it but still left obvious surplus space, source-mapped padding made right/bottom/left diverge from the reasonable top padding, two rounds of line-opacity breathing were invisible, the first small node-only pulse remained too weak, and the later anchor-lock rail overlays added unwanted animated line segments.
- Failed design layer: responsive model | motion | safe area.
- Old modules allowed to remain: all 25 source line paths, the split top rails, short side rails, bottom carrier spine, public API, and color/glow language.
- Old modules rejected: using the full `0 0 1920 1080` source canvas, a loose `40` source px crop allowance, source-rect four-side padding divergence, invisible line opacity breathing, dense node-only pulses, anchor-lock rail overlays, animated line segments, or moving dash/flow animation as the host-mapped drawing and motion model.

## Compatibility Contract

- Preserve tag name: `dvk-border-box-13`.
- Preserve class/export names: `BorderBox13Element`, `borderBox13Metadata`, `defineBorderBox13`.
- Preserve standard props: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, `animated`, `paused`.
- Preserve CSS variables: `--dvk-color-primary`, `--dvk-color-secondary`, `--dvk-color-accent`, `--dvk-border-box-padding`, `--dvk-border-box-13-padding`.
- Preserve parts: `frame`, `graphic`, `content`.
- Preserve events: `dvk-ready`.
- Allowed internal changes: crop the internal source viewBox and remap the same source endpoints into the host SVG.

## Design Goal

- Concept name in structure language: faithful split horizon rail.
- Aesthetic thesis: preserve the reference's restrained blue luminous linework while treating the line bounding region, not the unused full source canvas, as the responsive drawing area.
- Dashboard value: frames a command-center panel without occupying the central title/content zone.

## Dashboard Story

- Story type: command-center hero.
- Target panel content: KPI title, status row, main chart/map, and a bottom event stream.
- Focal zone: central content with a subtle bottom-live baseline.

## First-Read Promise

At dashboard distance, the viewer first sees the central dashboard content, then the bottom carrier spine and split top rails, then the blue glow atmosphere.

## Rejected Patterns

- Existing patterns not to repeat: border-box-12's closed chamfer rectangle with paired top slant blocks and symmetric side folds; border-box-11's top-left status rail and right node stack.
- Symbol/object motifs not allowed: object-shaped or logo-like frame identities.
- Safe-area or motion risks rejected: full-edge animated glow, moving flow highlights, repeated ticks, dense corner hardware, and animation crossing the content zone.

## Existing Border Inventory

- Inventory date: 2026-07-01
- Nearest existing border: `dvk-border-box-12`
- Similarity reason: sparse electric-blue HUD linework, live host geometry, and source-mapped content padding.
- Do-not-repeat notes: do not reuse a closed top-center chamfer outline, paired top slant blocks, or symmetric side midpoint folds as the identity.

## Candidate Concepts

### Candidate A: Split Horizon Carrier

- Outer contour: open top center with separated upper rails, sparse side marks, and long segmented bottom carrier.
- Corner grammar: L brackets with short chamfer joins, matching the reference but keeping the top center empty.
- Top/bottom rhythm: top is quiet and split; bottom is the dominant long spine with a small center break.
- Side logic: only short mid-height rails, no full vertical frame.
- Responsive model: live-size source-coordinate mapping.
- Content safe-area implication: generous top and side corners, deeper bottom allowance.
- Motion idea: eight fixed endpoint sparkle dots blink gently at selected source rail terminals and bottom breakpoints without directional travel or line animation.
- Why keep/reject: keep; it is the requested reference geometry without line-layout changes.

### Candidate B: Corner Step Lattice

- Outer contour: four corner brackets connected by small stepped hatches.
- Corner grammar: more diagonal corner cuts and short step ladders.
- Top/bottom rhythm: many small repeats around corners.
- Side logic: side ticks mirrored around midpoint.
- Responsive model: fixed modules plus extension strips.
- Content safe-area implication: still generous but denser at corners.
- Motion idea: node blink at each step.
- Why keep/reject: reject; it risks becoming repeated tick ornament and would overwork a simple line reference.

### Candidate C: Baseline Monitor Rail

- Outer contour: almost no top frame; emphasis on a technical bottom rail and four corner anchors.
- Corner grammar: bottom corners stronger than top corners.
- Top/bottom rhythm: top too quiet, bottom dominant.
- Side logic: side rails reduced to small alignment marks.
- Responsive model: live-size source-coordinate mapping.
- Content safe-area implication: very safe but may not read as a complete border at thumbnail size.
- Motion idea: one scanning segment along bottom only.
- Why keep/reject: reject; too close to a decoration rail and weaker as a content container.

## Selected Concept

- Selected candidate: Candidate A, Split Horizon Carrier.
- Selection reason: it preserves the provided SVG structure while cropping away source whitespace that prevented the border from reading as a border.
- Structural differences from nearest border: open top-center instead of a closed chamfer outline, bottom carrier spine instead of a uniform bottom edge, sparse side rails instead of side folds, and fixed endpoint sparkles instead of block blinking.
- Why it remains a usable dashboard border: the content safe area stays rectangular and the frame never forces content into a symbolic shape.

## Geometry Difference Score

Nearest existing border: `dvk-border-box-12`

| Dimension | Different? | Major? | Evidence |
| --- | --- | --- | --- |
| Outer contour | yes | yes | Open top center and non-closed frame versus closed chamfer outline. |
| Corner grammar | yes | no | L brackets with short chamfer joins instead of continuous chamfer corners. |
| Major module placement | yes | yes | Bottom carrier and center break replace top slant blocks. |
| Top/bottom rhythm | yes | yes | Top is split and quiet; bottom is the primary rhythm. |
| Side logic | yes | yes | Mid-height short side rails instead of folded outline segments. |
| Responsive model | no | no | Both use live-size source mapping. |
| Ornament rhythm | yes | yes | No repeated top blocks; only sparse inner bottom details. |
| Motion grammar | yes | yes | Fixed endpoint sparkle dots instead of blinking polygons, animated line segments, or moving flow. |
| Content safe-area shape | yes | no | Rectangular but bottom-biased inset. |

Pass threshold: at least 5 dimensions different and at least 2 major structural differences.

## Content Safe Area

- Reference canvas: tightly cropped source viewBox `x=66, y=83, width=1788, height=901` around the 1920 x 1080 source endpoints.
- Deepest top inward reach: content starts at source `y=118`, 35 px below the cropped viewBox top.
- Deepest right inward reach: content ends at source `x=1819`, 35 px before the cropped viewBox right.
- Deepest bottom inward reach: content ends at source `y=949`, 35 px before the cropped viewBox bottom.
- Deepest left inward reach: content starts at source `x=101`, 35 px after the cropped viewBox left.
- Glow/motion allowance: 12 source px beyond the visible line bounding box before cropping to host size.
- Final `contentRect`: `x=101, y=118, width=1718, height=831`.
- Padding expectations at source-ratio, wide, tall, small: all four CSS padding values use the top source inset as the single baseline, with a 16px minimum, so right/bottom/left match the visually reasonable top padding.
- Corner usability conclusion: top corners are shallow, bottom corners are outside the main content rectangle, and side rails do not squeeze legends or labels.

## Responsive Model

- Model: live-size exception.
- Fixed modules: none; all 25 static line paths keep the exact source endpoints and map them through the cropped source viewBox.
- Extension strips: none; straight source paths scale with the host through affine x/y mapping.
- Cross-slice rails: none because the component renders as one SVG.
- Slice continuity contract: not applicable.
- What may stretch: the cropped source coordinate system scales to host width and height.
- What must never stretch: no individual line may be re-authored, re-centered, repeated, or reordered independently of the source SVG.

## Live-Size Exception

- Why live-size is appropriate: the source SVG is a sparse straight-line frame, so source endpoint mapping preserves the geometry more faithfully than slicing.
- Why slicing is not better: slicing would add complexity and duplicate simple line segments without improving visual stability.
- Stable identity checks: source-ratio, wide, tall, and small hosts retain the same 25 source paths, line order, and relative rail layout.
- Inward reach calculation: content padding comes from the documented source `contentRect` and cropped source viewBox through `createBorderBoxContentPadding`.

## Visual Language

- Line-weight hierarchy: source-faithful 3px glowing main rail, 1.2px bright core, and small 2.2px radius endpoint sparkle dots.
- Color roles: primary blue for structural rail, secondary cyan for core line, accent pale blue for endpoint sparkles.
- Glow hierarchy: source-faithful two-stage blue glow around main rails and radial anchor glints; core lines remain crisp.
- Density: low; no repeated ticks beyond two bottom inner short verticals and the center break.
- Depth layers: source black background, glowing rail, bright core, fixed animated endpoint sparkles on a few line terminals and breakpoints.

## Motion Budget

- Motion: subtle endpoint sparkle.
- Purpose: make the live rail state visible at a few structural endpoints without implying flow, scan direction, or line activation.
- Animated element count: 8 fixed endpoint sparkle dots.
- Animated properties: opacity and radius on fixed source-coordinate dots only.
- Reduced-motion behavior: CSS disables SVG animations.
- Pause behavior: `paused` omits the `<animate>` nodes.
- Performance risk: low; no animated filters, no moving dash offsets, and no repeated tile loops.

## Public API Contract

- Standard border props used: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, `animated`, `paused`.
- New props: none.
- User value for each new prop: not applicable.
- Internal details not exposed: source canvas, viewBox, path coordinates, and endpoint sparkle geometry.
- Docs/tests coverage: docs table lists standard props; tests assert no internal public props and pause behavior.

## Implementation Contract

- Component files: `element.ts`, `metadata.ts`, `register.ts`, `index.ts`, `design-brief.md`.
- Aggregate exports: update `packages/elements/src/index.ts`.
- Aggregate metadata: update `packages/elements/src/metadata.ts`.
- Aggregate registration: update `packages/elements/src/register.ts`.
- Docs page: `docs/components/borders/border-box-13.md`.
- Docs index/sidebar: update `docs/.vitepress/config.ts`.
- Tests: update `packages/elements/test/register.test.ts`.
- Family inventory update: add `dvk-border-box-13`.

## Aesthetic Gate

| Gate | Status | Evidence |
| --- | --- | --- |
| First-read promise is clear | pass | Border is open at top center and does not compete with central content. |
| Dashboard content is more important than border detail | pass | Low node count and motion stays on frame rails. |
| Top rail has one readable primary rhythm | pass | Two quiet horizon rails, no center dock. |
| Bottom rail has one readable primary rhythm | pass | Long carrier spine with one center break. |
| Corners do not squeeze content | pass | Content rect starts well inside glow reach. |
| Line-weight hierarchy is visible | pass | Shadow, main, core, and endpoint sparkle layers are separated. |
| Glow clarifies structure instead of hiding disorder | pass | One tight glow filter and crisp core lines. |
| Thumbnail reads as a border, not a symbolic object | pass | Sparse rails and brackets remain frame-like. |

Pass threshold: all entries are `pass`.

## Validation Evidence

Do not link or commit screenshot files. Record manual checks only.

- Realistic dashboard content used: docs `BorderChartDemo` with title, subtitle, KPI/chart-like content.
- Source-ratio check: browser docs demo at 559 x 430 renders the first rail at `M 3.75 5.73 L 21.57 5.73`, preserving 25 primary paths, 25 core paths, 8 fixed endpoint sparkles, 6 gradient stops, and 16 `animate` nodes; automatic padding is `16.7px` on all four sides.
- Wide check: browser docs demo at 638 x 430 keeps rail bounds at about `4.28px` left/right and `5.73px` top/bottom, with no full-canvas whitespace returning.
- Tall check: unit geometry at 320 x 360 keeps short side rails centered and moves the top rail to about `y=9.99`, avoiding the previous visibly large vertical margin.
- Small check: browser docs demo at 297 x 680 keeps rail bounds at about `1.99px` left/right and `9.06px` top/bottom; content padding is `26.42px` on all four sides.
- Safe-area overlay/manual inspection: source-ratio automatic padding now hits the intended compact minimum `16px` on all four sides at 300 x 180; right/bottom/left no longer diverge from the top baseline.
- Motion DOM check: browser docs demo renders 0 signal rail overlays, 8 endpoint sparkle dots, 16 fixed-position animations, 0 `stroke-dashoffset` animations, 0 `stroke-width` animations, all signal marks use `data-motion="endpoint-sparkle"`, sparkle opacity values `0.12;0.72;0.18;0.46;0.12`, and radius values `1.6;3.4;1.9;2.7;1.6`.
- Cross-slice continuity check: not applicable; single SVG live-size rendering.
- Issues found: full-canvas source mapping preserved `78px` horizontal, `95px` top, and `108px` bottom source whitespace, so the visible border sat too far from the component edge.
- Rework completed: kept exact source endpoints, changed the internal source viewBox to `66 83 1788 901`, equalized automatic padding from the top source inset, and replaced line/node breathing plus anchor-lock line overlays with eight endpoint sparkle dots at top corners, side marks, bottom outer anchors, and bottom center breakpoints.
- Final manual conclusion: accepted; browser validation confirms the rails now read near the component edge while keeping content inside the measured safe area.
