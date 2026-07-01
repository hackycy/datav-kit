# Border Box 14 Design Brief

## User Constraints

- Request: learn `dvk-border-box-8`, then design `dvk-border-box-14` as a similar four-corner border family.
- Explicit direction: four-corner border type only, animated, electronic circuit / signal node / data interface feeling, precise dashboard mood, weak motion; after first implementation, strengthen the electronic-circuit precision read.
- Explicitly allowed risky motifs: circuit and data-port language, but only as shallow border rails and nodes.

## Task Type

- Type: variant
- Candidate count required: 2
- Candidate count provided: 2

## Design Goal

- Concept name in structure language: Orthogonal Signal Port Corner Frame
- Aesthetic thesis: four shallow equal-weight corner ports use 90-degree trace turns, short pin contacts, and small pads to read as a precise data interface without adding a second inner outline.
- Dashboard value: adds precise live-status framing while keeping KPI, chart, and map content visually dominant.

## Dashboard Story

- Story type: operations nerve center
- Target panel content: status title, KPI row, topology/chart area, and small incident list.
- Focal zone: the slotted dashboard content inside a quiet technical frame.

## First-Read Promise

At dashboard distance, the viewer first sees the panel content, then the four orthogonal signal-port corners, then the quiet node pulse atmosphere.

## Rejected Patterns

- Existing patterns not to repeat: Border 8's filled animated corner ornaments and live polygon plate; Border 10's rounded glow corners; Border 13's bottom carrier spine.
- Symbol/object motifs not allowed: shield, badge, cockpit, portal, armor, crown, or logo-like port object.
- Safe-area or motion risks rejected: no double-line inner frame, no long inward traces, no animated sweep crossing content, no fast fill flashing.

## Existing Border Inventory

- Inventory date: 2026-07-01
- Nearest existing border: `dvk-border-box-8`
- Similarity reason: both use live host geometry with fixed four-corner identity and optional corner motion.
- Do-not-repeat notes: avoid four identical filled corner blocks, rapid fill-swap animation, and polygon panel background as the primary identity.

## Candidate Concepts

### Candidate A: Orthogonal Signal Port Corner Frame

- Outer contour: rectangular edge rails with shallow 90-degree trace turns.
- Corner grammar: one equal-weight L trace per corner, a square elbow, two short pin contacts on each edge, four static pads, and two small signal nodes placed on the trace.
- Top/bottom rhythm: short edge rails near each corner only; the middle stays open for content.
- Side logic: shallow vertical edge rails near each corner, no side stacks.
- Responsive model: live-size geometry with fixed corner reach and stretch-free rail endpoints.
- Content safe-area implication: deepest structure stays within 14 px plus glow allowance.
- Motion idea: slow opacity/radius pulse on the fixed nodes only; contact pads stay static.
- Why keep/reject: keep because it meets the four-corner direction while avoiding filled ornaments and inward extensions.

### Candidate B: Data Socket Corner Ticks

- Outer contour: four isolated bracket ticks with tiny square socket marks.
- Corner grammar: short top/side rails with a square endpoint at each corner.
- Top/bottom rhythm: extremely sparse; no continuous edge read.
- Side logic: no connected side rail.
- Responsive model: live-size geometry with fixed ticks.
- Content safe-area implication: very generous, but may look more like decoration marks than a border.
- Motion idea: alternating socket blink.
- Why keep/reject: reject because the thumbnail read is too weak as a usable border.

## Selected Concept

- Selected candidate: Candidate A, Orthogonal Signal Port Corner Frame.
- Selection reason: it preserves Border 8's four-corner family idea but changes fill blocks into single-line circuit traces with pin contacts, fixed pads, fixed nodes, and weak motion.
- Structural differences from nearest border: line-first instead of fill-first, no polygon plate, no mirrored filled corner patch, no diagonal chamfer ornament, slower node pulse, smaller content inset.
- Why it remains a usable dashboard border: the short edge rails frame the host at a glance while leaving the center and all corners generous for dashboard content.

## Geometry Difference Score

Nearest existing border: `dvk-border-box-8`

| Dimension | Different? | Major? | Evidence |
| --- | --- | --- | --- |
| Outer contour | yes | yes | 14 uses open line rails; 8 uses a polygon panel fill. |
| Corner grammar | yes | yes | 14 uses shallow orthogonal traces, pins, pads, and nodes; 8 uses filled corner polygons. |
| Major module placement | yes | no | both are four-corner systems, but 14 has no filled block module. |
| Top/bottom rhythm | yes | yes | 14 leaves center open with short edge rails; 8 has polygon edge notches. |
| Side logic | yes | no | 14 has only shallow corner-side rails; 8 has live polygon sides. |
| Responsive model | no | no | both use live host geometry with fixed corner identity. |
| Ornament rhythm | yes | yes | 14 is sparse trace/pin/node grammar; 8 is filled geometric corner ornament. |
| Motion grammar | yes | yes | 14 slow node pulse; 8 fast fill swap. |
| Content safe-area shape | yes | no | 14 uses smaller uniform inset and no deep corner bite. |

Pass threshold: 8 dimensions different and 4 major structural differences.

## Content Safe Area

- Reference canvas: live host viewBox `0 0 width height`.
- Deepest top inward reach: 12 px trace/pad center plus 1.7 px pad radius; content padding starts at 14 px.
- Deepest right inward reach: 12 px trace/pad center plus 1.7 px pad radius; content padding starts at 14 px.
- Deepest bottom inward reach: 12 px trace/pad center plus 1.7 px pad radius; content padding starts at 14 px.
- Deepest left inward reach: 12 px trace/pad center plus 1.7 px pad radius; content padding starts at 14 px.
- Glow/motion allowance: node pulse stays on rail endpoints; radius never exceeds 3.2 px.
- Final `contentRect`: `{ x: 14, y: 14, width: width - 28, height: height - 28 }`.
- Padding expectations at source-ratio, wide, tall, small: uniform 14 px unless the host is too small, then min padding remains 12 px.
- Corner usability conclusion: no rail extends far enough inward to remove a practical content corner.

## Responsive Model

- Model: live-size exception
- Fixed modules: four corner port modules with 138 px maximum horizontal/vertical reach, clamped on small hosts.
- Extension strips: short edge traces grow only by endpoint placement, not by scaling complex ornaments.
- Cross-slice rails: none.
- Slice continuity contract: not applicable because all rails are drawn in one SVG coordinate system.
- What may stretch: distance between the opposite corner modules.
- What must never stretch: stroke width, node radius hierarchy, and corner bend grammar.

## Live-Size Exception

- Why live-size is appropriate: the concept is thin-line, host-relative, and has no source artwork or complex fixed ornament to preserve through slicing.
- Why slicing is not better: slicing would add unnecessary boundary contracts for a design whose rails are simple host-edge segments.
- Stable identity checks: at wide, tall, and small sizes the visible identity remains four shallow orthogonal data-port corners with bounded pin contacts.
- Inward reach calculation: all rail and node coordinates are clamped from the host edge, with a documented 14 px content inset.

## Visual Language

- Line-weight hierarchy: one uniform 2.6 px structural stroke for traces and pins, small filled nodes/pads, and a tight filter halo on the same rail layer.
- Color roles: primary and secondary blend on the same structural rail, accent marks live nodes.
- Glow hierarchy: one tight SVG glow controlled by `glow-intensity`; no stacked double-line glow.
- Density: sparse but more precise than the first pass: four corners only, 48 same-layer trace/pin segments, 16 static pads, no center dock or side rack.
- Depth layers: quiet edge halo under crisp single-line rails, then nodes.

## Motion Budget

- Motion: node blink
- Purpose: communicate live signal endpoints without drawing attention into the content.
- Animated element count: 8 nodes; 16 contact pads are static.
- Animated properties: opacity and radius only.
- Reduced-motion behavior: SVG `animate` elements are hidden by media query.
- Pause behavior: `paused` prevents animation nodes from rendering.
- Performance risk: low; one SVG, one small filter, eight animated circles.

## Public API Contract

- Standard border props used: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, `animated`, `paused`.
- New props: none.
- User value for each new prop: not applicable.
- Internal details not exposed: viewBox, width, height, corner reach, node positions, and debug geometry.
- Docs/tests coverage: metadata/docs list all standard props; tests cover registration, internal prop absence, geometry, padding, and paused animation.

## Implementation Contract

- Component files: `packages/elements/src/border-box-14/element.ts`, `metadata.ts`, `register.ts`, `index.ts`, `design-brief.md`.
- Aggregate exports: update `packages/elements/src/index.ts`.
- Aggregate metadata: update `packages/elements/src/metadata.ts`.
- Aggregate registration: update `packages/elements/src/register.ts`.
- Docs page: add `docs/components/borders/border-box-14.md`.
- Docs index/sidebar: update `docs/.vitepress/config.ts`.
- Tests: update `packages/elements/test/register.test.ts`.
- Family inventory update: update `skills/create-complex-border/references/border-family-inventory.md`.

## Aesthetic Gate

| Gate | Status | Evidence |
| --- | --- | --- |
| First-read promise is clear | pass | Content remains central; frame reads after content. |
| Dashboard content is more important than border detail | pass | No filled panels, center docks, or sweeping motion. |
| Top rail has one readable primary rhythm | pass | Two shallow corner rails with an open center. |
| Bottom rail has one readable primary rhythm | pass | Mirrors top rhythm without adding a carrier spine. |
| Corners do not squeeze content | pass | Deepest trace/pad center is 12 px and automatic content padding starts at 14 px. |
| Line-weight hierarchy is visible | pass | Single equal-weight trace/pin layer plus small nodes and pads. |
| Glow clarifies structure instead of hiding disorder | pass | One tight glow filter, no layered line structure. |
| Thumbnail reads as a border, not a symbolic object | pass | Four corner ports form a rectangular frame. |

Pass threshold: all entries are `pass`.

## Validation Evidence

- Realistic dashboard content used: docs `BorderChartDemo` with title, subtitle, KPI/card content, and dark grid background.
- Source-ratio check: unit DOM check at 320 x 180 renders 48 same-layer trace/pin segments, 8 fixed signal nodes, 16 static contact pads, 16 node `animate` elements, first twelve left-top segments from `M 8 80 L 8 59.2` through `M 62.4 8 L 62.4 12`, one uniform `2.6` stroke width, and automatic padding `14px 14px 14px 14px`.
- Wide check: unit DOM check at 640 x 180 kept the left-top first segment fixed while only opposite edge coordinates moved outward; the final mirrored pin segment becomes `M 577.6 172 L 577.6 167`.
- Tall check: unit DOM check at 320 x 420 kept the first rail at `M 8 138 L 8 96.32`, proving the corner reach is capped and does not stretch down the side.
- Small check: unit DOM check at 1 x 1200 still kept bounded node counts: 48 trace/pin segments, 8 signal nodes, and 16 contact pads.
- Safe-area overlay/manual inspection: docs screenshot inspection showed the trace/pin layer remains outside the chart/card content; automatic safe-area padding stays at the documented 14px and no corner line extends inward past the 12 px trace/pad centers plus pad radius.
- Cross-slice continuity check: not applicable; single SVG coordinate system.
- Issues found: first accepted implementation was too close to generic shallow corner lines; user feedback correctly noted that the electronic-circuit precision was not visually legible enough.
- Rework completed: replaced diagonal corner joins with 90-degree trace elbows, extended corner reach along the outer edges, added two shallow pin contacts per edge and static contact pads, raised same-layer trace width to `2.6`, and preserved the 14 px content inset.
- Final manual conclusion: accepted after final browser refresh; browser check confirmed 48 trace/pin segments, 16 pads, glow enabled, `2.6` uniform stroke, and 14 px padding, while unit checks confirm the border is bounded, animated weakly, safe-area aware, and free of double-line or inward-reaching corner structure.
