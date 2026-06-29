# Border Box 12 Design Brief

## User Constraints

- Request: Add border 12 with a minimalist, enterprise-grade large-screen style, a grand visual tone, and some dynamic effects; show it in docs.
- Explicit direction: 简约、企业级数据大屏、大气、动态边框.
- Explicitly allowed risky motifs: none.

## Task Type

- Type: original
- Candidate count required: 3
- Candidate count provided: 3

## Design Goal

- Concept name in structure language: split-bus trace frame.
- Aesthetic thesis: Use a quiet outer frame, left/top information bus, sparse terminals, and a low bottom checksum strip to feel refined instead of dense.
- Dashboard value: Leaves most of the panel calm for KPIs, charts, and maps while still giving the panel a visible command-center identity.

## Dashboard Story

- Story type: operations nerve center.
- Target panel content: enterprise status title, KPI group, trend chart, and short alert queue.
- Focal zone: upper-left command label and main content area, supported by a subtle bottom status strip.

## First-Read Promise

At dashboard distance, the viewer first sees the upper-left command bus, then the calm KPI/chart content region, then the sparse animated frame atmosphere.

## Rejected Patterns

- Existing patterns not to repeat: centered top/bottom docks, four identical armor corners, dense side racks, rounded glow-only panel.
- Symbol/object motifs not allowed: crown, shield, badge, portal, scanner, cockpit, armor object.
- Safe-area or motion risks rejected: animated rails crossing the content area, equal brightness on all four sides, oversized corner blocks.

## Existing Border Inventory

- Inventory date: 2026-06-29.
- Nearest existing border: `dv-border-box-11`.
- Similarity reason: Both use a 1600 x 900 source canvas with fixed modules plus extension strips.
- Do-not-repeat notes: Do not reuse 11's heavy corner armor, centered docks, symmetric side sensor racks, or dense edge noise.

## Candidate Concepts

### Candidate A: split-bus trace frame

- Outer contour: shallow chamfered rectangle with a stronger left/top bus and quiet right return rail.
- Corner grammar: small terminals and line breaks instead of four heavy blocks.
- Top/bottom rhythm: top has a left command bus and offset status dock; bottom has a lower checksum strip.
- Side logic: left bus carries the primary vertical rhythm; right side is a calm return rail.
- Responsive model: source-coordinate fixed modules with clean extension strips.
- Content safe-area implication: left/top inset is slightly larger, corners stay generous.
- Motion idea: short rail-charge particles on top/left and a low-opacity dock pulse.
- Why keep/reject: keep; best match for enterprise simplicity and distinct from border 11.

### Candidate B: floating node rail

- Outer contour: very thin rectangular frame with isolated corner nodes and small breaks on each side.
- Corner grammar: equal corner nodes connected by hairlines.
- Top/bottom rhythm: symmetric sparse rails.
- Side logic: balanced side ticks.
- Responsive model: source-coordinate fixed modules with extension strips.
- Content safe-area implication: very safe but visually close to simple glow borders.
- Motion idea: occasional node heartbeat.
- Why keep/reject: reject; too quiet and risks reading like border 9/10 with sharper corners.

### Candidate C: diagonal lattice bracket

- Outer contour: rectangular frame with diagonal bracket modules at top-left and bottom-right.
- Corner grammar: diagonal lattice cuts.
- Top/bottom rhythm: diagonal accents counterbalance the horizontal rails.
- Side logic: mostly empty side rails.
- Responsive model: source-coordinate fixed modules with extension strips.
- Content safe-area implication: diagonal modules require larger padding near content corners.
- Motion idea: slow diagonal sweep.
- Why keep/reject: reject; more visually dramatic but less enterprise-calm and could crowd labels.

## Selected Concept

- Selected candidate: Candidate A, split-bus trace frame.
- Selection reason: It gives border 12 a new asymmetric topology while keeping the content area calm and professional.
- Structural differences from nearest border: offset top status dock instead of centered top/bottom docks, left-biased command bus instead of mirrored side racks, small terminals instead of heavy corner armor, and a sparse bottom checksum strip.
- Why it remains a usable dashboard border: The frame stays thin, leaves a large rectangular content region, and uses motion only on rails outside the content area.

## Geometry Difference Score

Nearest existing border: `dv-border-box-11`

| Dimension | Different? | Major? | Evidence |
| --- | --- | --- | --- |
| Outer contour | yes | no | Border 12 uses shallower chamfers and thinner shell lines. |
| Corner grammar | yes | yes | Small terminals replace four heavy mirrored armor blocks. |
| Major module placement | yes | yes | Primary module is upper-left/left bus, not centered docks. |
| Top/bottom rhythm | yes | yes | Offset top dock and bottom checksum strip replace mirrored center docks. |
| Side logic | yes | yes | Left bus is active; right return rail is quiet. |
| Responsive model | no | no | Both use source-coordinate fixed modules plus extension strips. |
| Ornament rhythm | yes | yes | Sparse hatches and nodes replace dense edge noise. |
| Motion grammar | yes | no | Short rail charges replace center scan glints. |
| Content safe-area shape | yes | no | Left/top emphasis uses an asymmetric measured content inset. |

Pass threshold: at least 5 dimensions different and at least 2 major structural differences.

## Content Safe Area

- Reference canvas: 1600 x 900.
- Deepest top inward reach: 82 source units, plus glow/motion allowance.
- Deepest right inward reach: 72 source units, plus glow allowance.
- Deepest bottom inward reach: 82 source units, plus glow allowance.
- Deepest left inward reach: 102 source units, plus glow/motion allowance.
- Glow/motion allowance: 10 source units on active rails and terminals.
- Final `contentRect`: `{ x: 112, y: 98, width: 1396, height: 704 }`.
- Padding expectations at source-ratio, wide, tall, small: source-ratio gives 98px top/bottom, 92px right, 112px left; wide increases inline padding proportionally; tall increases block padding proportionally; small panels clamp to minimum block/inline padding.
- Corner usability conclusion: The content rectangle remains a normal dashboard rectangle and does not force charts into an odd shape.

## Responsive Model

- Model: source-coordinate slices.
- Fixed modules: upper-left command terminal, offset top status dock, upper-right terminal, left bus, bottom-left terminal, bottom checksum strip, bottom-right terminal.
- Extension strips: top rail, bottom leading/trailing rails, left upper/lower rails, right return rail.
- What may stretch: straight hairline rails and quiet filled strips.
- What must never stretch: terminals, status dock, checksum strip, nodes, hatches, and motion markers.

## Visual Language

- Line-weight hierarchy: dim halo strokes, 1px structural hairlines, 1.6-2px main rails, rare 5-7px soft core glints.
- Color roles: cyan/teal primary rails, deep blue secondary structure, warm pale accent for live status.
- Glow hierarchy: strongest at upper-left command bus, medium at bottom checksum strip, quiet on the right return rail.
- Density: sparse, with modules concentrated at left/top and bottom status points.
- Depth layers: dim base contour, translucent rails, bright core lines, small status nodes, optional moving rail charges.

## Motion Budget

- Motion: rail charge and subtle dock pulse.
- Purpose: imply live operations status and guide attention along the upper-left command bus.
- Animated element count: 3.
- Animated properties: `animateMotion` on two small nodes and `opacity` on one top status line.
- Reduced-motion behavior: SVG animation nodes are hidden under `prefers-reduced-motion: reduce`.
- Pause behavior: `paused` suppresses animation nodes.
- Performance risk: low; no animated blur, masks, or full-frame transforms.

## Public API Contract

- Standard border props used: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, `animated`, `paused`.
- New props: none.
- User value for each new prop: none.
- Internal details not exposed: source canvas, slice coordinates, module names, debug overlays.
- Docs/tests coverage: docs list standard props; tests cover registration, metadata, colors, animation pause, sliced modules, and auto padding.

## Implementation Contract

- Component files: `packages/elements/src/border-box-12/element.ts`, `metadata.ts`, `register.ts`, `index.ts`, `design-brief.md`.
- Aggregate exports: update `packages/elements/src/index.ts`.
- Aggregate metadata: update `packages/elements/src/metadata.ts`.
- Aggregate registration: update `packages/elements/src/register.ts`.
- Docs page: `docs/components/borders/border-box-12.md`.
- Docs index/sidebar: update `docs/index.md` and `docs/.vitepress/config.ts`.
- Tests: update `packages/elements/test/register.test.ts`.
- Family inventory update: keep `border-family-inventory.md` aligned with the implemented split-bus trace frame.

## Aesthetic Gate

| Gate | result | Evidence |
| --- | --- | --- |
| First-read promise is clear | pass | Primary brightness and motion sit on the upper-left command bus. |
| Dashboard content is more important than border detail | pass | Content area is large and rectangular with sparse frame modules. |
| Top rail has one readable primary rhythm | pass | Left command rail flows into an offset status dock. |
| Bottom rail has one readable primary rhythm | pass | Low checksum strip is secondary and does not mirror the top. |
| Corners do not squeeze content | pass | Terminals stay outside the documented content rectangle. |
| Line-weight hierarchy is visible | pass | Main rails, hairlines, and glints use distinct stroke weights. |
| Glow clarifies structure instead of hiding disorder | pass | Glow is concentrated on active rails and sparse nodes. |
| Thumbnail reads as a border, not a symbolic object | pass | Shape is a line-first panel frame without object motifs. |

Pass threshold: every gate is marked `pass`.

## Validation Evidence

Do not link or commit screenshot files. Record manual checks only.

- Realistic dashboard content used: docs `BorderChartDemo` with title, subtitle, KPI/chart-like content, and dark dashboard surface.
- Source-ratio check: 1600 x 900 source geometry keeps left/top bus readable and content safe.
- Wide check: straight extension strips stretch while fixed modules stay stable.
- Tall check: vertical rails extend without moving the left bus into content.
- Small check: minimum padding preserves content readability and fixed modules still read as terminals.
- Safe-area overlay/manual inspection: `contentRect` clears the deepest modules plus glow/motion allowance.
- Issues found: initial sliced rendering duplicated animation nodes in clipped, non-visible slices.
- Rework completed: animation output was limited to `top-rail`, `top-status`, and `left-bus` slices only.
- Final manual conclusion: Browser verification on the docs page found the demo rendered with 13 slices, measured content padding, 1 status pulse, and 2 rail-charge motions. The design meets the minimalist enterprise dashboard direction while adding controlled dynamic frame behavior.
