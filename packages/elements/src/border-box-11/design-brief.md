# Border Box 11 Design Brief

## User Constraints

- Request: add `border 11` for `packages/elements`, keep it minimal, enterprise data-middle-platform oriented, include dynamic border effects, and show it in docs.
- Explicit direction: simple enterprise dashboard border with subtle motion.
- Explicitly allowed risky motifs: none.

## Task Type

- Type: original
- Candidate count required: 3
- Candidate count provided: 3

## Design Goal

- Concept name in structure language: status rail lattice
- Aesthetic thesis: a restrained operations panel frame with thin rails, sparse status nodes, and short data-charge motion.
- Dashboard value: frames KPI and trend content without looking like game HUD armor or a replica DataV rounded panel.

## Dashboard Story

- Story type: operations nerve center
- Target panel content: service health title, KPI row, throughput chart, and live status badge.
- Focal zone: upper-left title/KPI area, supported by a quiet right-side rail and bottom baseline.

## First-Read Promise

At dashboard distance, the viewer first sees the upper-left status/KPI zone, then the chart trend, then a quiet animated frame atmosphere.

## Rejected Patterns

- Existing patterns not to repeat: centered top/bottom docks, four heavy mirrored corner armor blocks, rounded glow-only panels, dense source-SVG HUD ornament, and identical animated corner ornaments.
- Symbol/object motifs not allowed: crown, shield, badge, crest, portal, cockpit, scanner, and armor-object silhouettes.
- Safe-area or motion risks rejected: large corner bite-in, full-frame sweep, animated blur, and many independent blinking nodes.

## Existing Border Inventory

- Inventory date: 2026-06-29
- Nearest existing border: `dvk-border-box-10`
- Similarity reason: both are lightweight enterprise-friendly panel borders with live animation and modest content padding.
- Do-not-repeat notes: avoid rounded rectangle identity, four equal glowing corners, and live host outline as the only structure.

## Candidate Concepts

### Candidate A: status rail lattice

- Outer contour: shallow chamfered rectangle on a 1200 x 640 source canvas.
- Corner grammar: clipped corner rails with tiny outward caps, not block ornaments.
- Top/bottom rhythm: left-biased title rail and long clean extension strip; bottom has a quiet baseline with two short status ticks.
- Side logic: right rail carries a sparse vertical node stack as counterweight; left side remains mostly quiet.
- Responsive model: source-coordinate fixed modules plus clean horizontal/vertical extension strips.
- Content safe-area implication: modest measured inset; largest inward reach is the top-left rail and right node stack.
- Motion idea: one short rail-charge dash travels along top and right rails; two nodes pulse slowly.
- Why keep/reject: keep; best balance of enterprise restraint, focal hierarchy, and distance from existing rounded/corner-glow panels.

### Candidate B: dual baseline strip

- Outer contour: rectangular rails with emphasized top and bottom strips.
- Corner grammar: almost square corners with small calibration ticks.
- Top/bottom rhythm: top and bottom are equal-weight data baselines.
- Side logic: sides are minimal hairlines.
- Responsive model: source-coordinate fixed endcaps plus long extension strips.
- Content safe-area implication: very safe, but visually close to a simple line frame.
- Motion idea: horizontal charge only.
- Why keep/reject: reject; too close to `dvk-border-box-1` in silhouette and too generic for a new numbered border.

### Candidate C: offset service spine

- Outer contour: asymmetric left/top rail system with open lower-right detail.
- Corner grammar: top-left service spine and smaller opposite anchors.
- Top/bottom rhythm: strong top-left module with staggered short rails.
- Side logic: left vertical trace becomes a visual anchor.
- Responsive model: fixed left/top modules and extension strips.
- Content safe-area implication: left/top padding grows and may crowd labels.
- Motion idea: node heartbeat along left spine.
- Why keep/reject: reject; risks the failed asymmetric split-bus trace family and overstates the frame identity.

## Selected Concept

- Selected candidate: Candidate A, status rail lattice.
- Selection reason: it creates a memorable but quiet enterprise frame, supports realistic dashboard content, keeps corners generous, and uses motion as live status rather than sparkle.
- Structural differences from nearest border: chamfered source-coordinate contour, left-biased top rail, right-side node stack, bottom status ticks, explicit extension strips, and rail-charge motion instead of four rounded glow corners.
- Why it remains a usable dashboard border: the ornament stays outside a measured safe area, line density is low, and the content layer remains visually dominant.

## Geometry Difference Score

Nearest existing border: `dvk-border-box-10`

| Dimension | Different? | Major? | Evidence |
| --- | --- | --- | --- |
| Outer contour | yes | yes | Shallow chamfered source-canvas frame instead of rounded live rectangle. |
| Corner grammar | yes | yes | Thin clipped rail caps instead of equal rounded corner glow paths. |
| Major module placement | yes | yes | Left-biased top status rail and right node stack replace four-corner identity. |
| Top/bottom rhythm | yes | yes | Top has a focal rail; bottom is a quiet baseline with ticks. |
| Side logic | yes | yes | Right status rail has sparse nodes; left side is mostly quiet. |
| Responsive model | yes | yes | Source-coordinate fixed modules plus extension strips instead of live host outline. |
| Ornament rhythm | yes | no | Sparse ticks and nodes replace corner-only glow rhythm. |
| Motion grammar | yes | yes | Short rail charges and node pulses replace filter flood-color cycling. |
| Content safe-area shape | yes | no | Measured source rect has directional top/right allowance rather than uniform live inset. |

Pass threshold: at least 5 dimensions different and at least 2 major structural differences.

## Content Safe Area

- Reference canvas: 1200 x 640.
- Deepest top inward reach: 66 source units from the top rail and glow.
- Deepest right inward reach: 58 source units from the right rail nodes and glow.
- Deepest bottom inward reach: 52 source units from bottom ticks and glow.
- Deepest left inward reach: 56 source units from left rail caps and glow.
- Glow/motion allowance: 8 source units outside static rail reach; animated dash remains on rails.
- Final `contentRect`: `{ x: 74, y: 78, width: 1050, height: 484 }`.
- Padding expectations at source-ratio, wide, tall, small: source-ratio maps to about 6.2% left, 12.2% top, 6.3% right, 12.2% bottom; wide and tall preserve safe-area meaning through mapped source coordinates; small panels keep minimum 12 px inline and 12 px block padding.
- Corner usability conclusion: corners stay generous enough for labels and legends because all caps are thin and outside the content rectangle.

## Responsive Model

- Model: source-coordinate slices
- Fixed modules: four clipped corners, top-left status rail, right node stack, bottom ticks.
- Extension strips: top leading/trailing rails, bottom baseline segments, left and right side rails.
- What may stretch: clean straight rail strips only.
- What must never stretch: corner caps, nodes, ticks, dash geometry, and fixed status marks.

## Visual Language

- Line-weight hierarchy: 1 px hairlines for construction, 1.5 px structural rails, 2 px focal rail, 3 px tiny glints only at nodes.
- Color roles: primary steel-blue rails, secondary cyan status lines, accent green-cyan live nodes.
- Glow hierarchy: single tight glow filter for live nodes and charge marks; base rails use low-opacity strokes instead of blur.
- Density: low, with empty rail spans preserved for enterprise calm.
- Depth layers: dark translucent panel fill, dim outer construction rails, main structural rails, then bright live marks.

## Motion Budget

- Motion: rail charge and node blink.
- Purpose: imply live telemetry on the focal top rail and right status rail.
- Animated element count: two charge paths and two node pulse circles.
- Animated properties: `stroke-dashoffset`, `opacity`, and `r`.
- Reduced-motion behavior: SVG animate elements are hidden by CSS.
- Pause behavior: when `paused` is true, no animate elements are rendered.
- Performance risk: low; no animated blur, masks, canvas, or full-frame sweeping.

## Public API Contract

- Standard border props used: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, `animated`, `paused`.
- New props: none.
- User value for each new prop: none.
- Internal details not exposed: source canvas, slice coordinates, viewBox, module names, and debug overlays.
- Docs/tests coverage: docs list standard props and tests cover registration, metadata, color resolution, padding, fixed modules, extension strips, pause behavior, and unique SVG IDs.

## Implementation Contract

- Component files: `element.ts`, `metadata.ts`, `register.ts`, `index.ts`, and this `design-brief.md`.
- Aggregate exports: update `packages/elements/src/index.ts`.
- Aggregate metadata: update `packages/elements/src/metadata.ts`.
- Aggregate registration: update `packages/elements/src/register.ts`.
- Docs page: add `docs/components/borders/border-box-11.md`.
- Docs index/sidebar: update `docs/.vitepress/config.ts` and `docs/index.md`.
- Tests: update `packages/elements/test/register.test.ts`.
- Family inventory update: update `skills/create-complex-border/references/border-family-inventory.md`.

## Aesthetic Gate

| Gate | status | Evidence |
| --- | --- | --- |
| First-read promise is clear | pass | The strongest detail lives near top-left status/KPI content. |
| Dashboard content is more important than border detail | pass | Rails are thin and sparse, with motion limited to two charges and two nodes. |
| Top rail has one readable primary rhythm | pass | Left-biased status rail leads into long clean strips. |
| Bottom rail has one readable primary rhythm | pass | Quiet baseline and two small ticks avoid a second focal dock. |
| Corners do not squeeze content | pass | Corner caps are shallow and content rect is generous. |
| Line-weight hierarchy is visible | pass | Hairlines, structural rails, and rare glints have distinct weights. |
| Glow clarifies structure instead of hiding disorder | pass | Only live nodes/charges use the glow filter. |
| Thumbnail reads as a border, not a symbolic object | pass | No object silhouette or badge-like centerpiece. |

Pass threshold: all gates recorded as pass.

## Validation Evidence

Do not link or commit screenshot files. Record manual checks only.

- Realistic dashboard content used: docs `BorderChartDemo` service health/KPI/chart content.
- Source-ratio check: 1200 x 640 source-ratio geometry keeps the top-left rail crisp, the right node stack outside content, and the chart area dominant.
- Wide check: 1440 x 520 stretches only clean top/bottom rails and side extension strips; fixed nodes and clipped caps keep identity.
- Tall check: 520 x 760 stretches vertical rails without moving the right node stack into the content safe area.
- Small check: 300 x 180 keeps the minimum 12 px padding and the first-read status rail remains visible without crowding demo KPI text.
- Safe-area overlay/manual inspection: measured `contentRect` maps to padding that clears all fixed modules, glow, and animated rail-charge paths.
- Cross-slice continuity check: right-side upper, stack, and lower slices use compatible 90-unit source bands; browser measurement showed source `x=1140` maps to the same screen x across all three slices with 0 px alignment delta and 0 px vertical boundary gaps.
- Issues found: complexity audit wanted more visible primitives for a numbered complex border; browser validation also showed sliced SVG animation tags were duplicated before slice-specific gating; follow-up visual inspection found the right rail still appeared broken because right extension slices used a 60-unit viewBox while the right status slice used a 90-unit viewBox.
- Rework completed: added low-opacity quiet tick marks, raised content z-index above fixed tiles, gated motion so only the visible top-rail and right-stack slices render animation, and normalized right-side slice viewBoxes to 90 source units so `x=1140` maps to the same screen coordinate across upper, stack, and lower slices.
- Final manual conclusion: accepted for an enterprise operations panel because it reads as a calm status rail frame at source-ratio, wide, tall, and small sizes; browser checks showed 10 slices, 6 animation tags, visible chart content, content inside the host, right-side `x=1140` alignment delta of 0 px, and 0 px vertical gaps between right rail slices.
