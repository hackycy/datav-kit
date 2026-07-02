# Border Box 2 Design Brief

## User Constraints

- Request: Fix free scaling where top/bottom middle edge dots stretch with the extension strips.
- Explicit direction: Keep left/right free scaling unchanged; check the SVG and prevent circular light nodes from stretching.
- Explicitly allowed risky motifs: none.

## Task Type

- Type: repair/redesign
- Candidate count required: not applicable; user requested a specific SVG slicing repair, not a new visual direction.
- Candidate count provided: not applicable.

## Failure Diagnosis

- Failed behavior: Bottom middle extension strips include circular light nodes inside `preserveAspectRatio="none"` SVGs, so the nodes become horizontally stretched.
- Failed design layer: responsive model
- Old modules allowed to remain: existing chamfered frame, energy bars, fixed corners, side details, colors, glow, content geometry, public API.
- Old modules rejected: circular fixed detail nodes rendered inside free-stretch extension strips.

## Compatibility Contract

- Preserve tag name: `dvk-border-box-2`
- Preserve class/export names: `BorderBox2Element`, `borderBox2Metadata`, `defineBorderBox2`
- Preserve standard props: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`
- Preserve CSS variables: existing color, glow opacity, padding variables.
- Preserve parts: `frame`, `graphic`, `content`
- Preserve events: `dvk-ready`
- Allowed internal changes: split non-stretch circular nodes out of stretch strips into fixed-ratio overlay slices.

## Design Goal

- Concept name in structure language: Layered chamfer rail frame.
- Aesthetic thesis: Keep the accepted cyber rail frame intact while making extension strips mechanically clean.
- Dashboard value: Wide and narrow dashboard panels can resize without distorting detail nodes.

## Dashboard Story

- Story type: command-center hero
- Target panel content: KPI header, chart/map body, and side status metrics.
- Focal zone: central data content inside the measured safe area.

## First-Read Promise

At dashboard distance, the viewer first sees central dashboard content, then the chamfered rail frame, then small glow nodes and hatches.

## Rejected Patterns

- Existing patterns not to repeat: no new topology, dock, or corner module is introduced.
- Symbol/object motifs not allowed: crown, shield, badge, crest, portal, scanner, armor object.
- Safe-area or motion risks rejected: stretching circular detail nodes inside free extension strips.

## Existing Border Inventory

- Inventory date: 2026-07-03
- Nearest existing border: `dvk-border-box-2`
- Similarity reason: this is a repair of the existing component.
- Do-not-repeat notes: keep the existing accepted silhouette; avoid redesigning unrelated modules.

## Candidate Concepts

### Candidate A: Node Overlay Repair

- Outer contour: unchanged.
- Corner grammar: unchanged.
- Top/bottom rhythm: line extension strips stay stretchable; nodes render as fixed-ratio overlays.
- Side logic: unchanged.
- Responsive model: source-coordinate fixed slices plus clean extension strips plus fixed node overlays.
- Content safe-area implication: unchanged.
- Motion idea: none.
- Why keep/reject: kept because it fixes distortion with minimal visual and API change.

## Selected Concept

- Selected candidate: Node Overlay Repair
- Selection reason: It preserves the intended free line extension while preventing circular nodes from scaling non-uniformly.
- Structural differences from nearest border: none beyond internal slice ownership for non-stretch nodes.
- Why it remains a usable dashboard border: the frame keeps the same measured safe area and visual hierarchy.

## Geometry Difference Score

Nearest existing border: `dvk-border-box-2`

| Dimension | Different? | Major? | Evidence |
| --- | --- | --- | --- |
| Outer contour | no | no | Existing paths preserved. |
| Corner grammar | no | no | Existing fixed corner modules preserved. |
| Major module placement | no | no | Existing positions preserved. |
| Top/bottom rhythm | no | no | Existing rails preserved. |
| Side logic | no | no | Existing side slices preserved. |
| Responsive model | yes | no | Bottom extension nodes split into fixed overlays. |
| Ornament rhythm | no | no | Existing node count and source positions preserved. |
| Motion grammar | no | no | Component remains static. |
| Content safe-area shape | no | no | Existing content rectangle preserved. |

Pass threshold: not applicable to this targeted repair.

## Content Safe Area

- Reference canvas: 1600 x 900 source, active `contentViewBox` 1504 x 804 at x=48 y=48.
- Deepest top inward reach: unchanged.
- Deepest right inward reach: unchanged.
- Deepest bottom inward reach: unchanged.
- Deepest left inward reach: unchanged.
- Glow/motion allowance: unchanged.
- Final `contentRect`: x=158 y=145 width=1284 height=610.
- Padding expectations at source-ratio, wide, tall, small: unchanged from existing component.
- Corner usability conclusion: unchanged.

## Responsive Model

- Model: source-coordinate slices
- Fixed modules: existing top/center/bottom/corner/detail slices plus bottom extension node overlays.
- Extension strips: top/bottom leading/trailing and side upper/lower strips.
- Cross-slice rails: horizontal top/bottom line rails and side rail continuations.
- Slice continuity contract: extension strips may stretch only simple rail linework; circular light nodes must render in fixed-ratio overlays.
- What may stretch: clean straight line strips.
- What must never stretch: circles, corner modules, hatches, side nodes, energy bars, glow-node geometry.

## Visual Language

- Line-weight hierarchy: unchanged.
- Color roles: unchanged.
- Glow hierarchy: unchanged, with circular nodes still using strong glow.
- Density: unchanged.
- Depth layers: stretch strips below fixed tiles and fixed node overlays.

## Motion Budget

- Motion: none
- Purpose: not applicable.
- Animated element count: 0.
- Animated properties: none.
- Reduced-motion behavior: existing filter fallback remains.
- Pause behavior: not applicable.
- Performance risk: low; two fixed node overlays are bounded.

## Public API Contract

- Standard border props used: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`
- New props: none.
- User value for each new prop: not applicable.
- Internal details not exposed: source canvas, slice coordinates, viewBox, module names, and debug overlays.
- Docs/tests coverage: regression test covers fixed node overlays and clean extension SVGs.

## Implementation Contract

- Component files: `packages/elements/src/border-box-2/element.ts`
- Aggregate exports: unchanged.
- Aggregate metadata: unchanged.
- Aggregate registration: unchanged.
- Docs page: unchanged.
- Docs index/sidebar: unchanged.
- Tests: `packages/elements/test/register.test.ts`
- Family inventory update: unchanged; no durable family-level design change.

## Aesthetic Gate

| Gate | Status | Evidence |
| --- | --- | --- |
| First-read promise is clear | pass | Existing accepted frame preserved. |
| Dashboard content is more important than border detail | pass | Content safe area unchanged. |
| Top rail has one readable primary rhythm | pass | Top slices unchanged. |
| Bottom rail has one readable primary rhythm | pass | Bottom dots keep circular form while rails stretch. |
| Corners do not squeeze content | pass | Corners unchanged. |
| Line-weight hierarchy is visible | pass | Stroke and glow hierarchy unchanged. |
| Glow clarifies structure instead of hiding disorder | pass | Node glow remains fixed instead of smeared. |
| Thumbnail reads as a border, not a symbolic object | pass | No new motif introduced. |

## Validation Evidence

- Realistic dashboard content used: not rerun visually for this code-level slice repair.
- Source-ratio check: unit test keeps original slice viewBoxes and padding behavior.
- Wide check: unit test verifies extension SVGs remain free-stretch while bottom nodes render in fixed-ratio overlays.
- Tall check: side extension logic unchanged.
- Small check: existing padding test remains unchanged.
- Safe-area overlay/manual inspection: content rectangle unchanged.
- Cross-slice continuity check: extension strip placement unchanged; only circular node ownership changes.
- Issues found: bottom extension strips contained circular nodes in stretched SVGs.
- Rework completed: circular nodes now render as bounded fixed-ratio overlays and are omitted from stretched extension SVGs.
- Final manual conclusion: targeted repair is ready for package tests; no API or content geometry change.
