# Border Box 16 Design Brief

## User Constraints

- Request: design a simple CPU-like border as `border-box-16` and improve documentation; redesign because the first pass felt too ordinary.
- Explicit direction: inner edge must be very thin, not thick; keep the current thickness; try the floating chip layer direction.
- Explicitly allowed risky motifs: CPU/chip references are allowed only as thin rail-connected pins and micro-bus marks, not a literal processor badge.

## Task Type

- Type: repair/redesign
- Candidate count required: 1 because the user selected the floating chip layer direction.
- Candidate count provided: 3

## Failure Diagnosis

- Failed behavior: first implementation was too ordinary and evenly distributed despite having the right thinness.
- Failed design layer: concept and visual language.
- Old modules allowed to remain: standard props, live-size SVG model, content safe area, thin stroke weights, subtle opacity-only motion.
- Old modules rejected: continuous closed inner rectangle, plain full-perimeter CPU pin rhythm, and evenly weighted chip pads.

## Compatibility Contract

- Preserve tag name: `dvk-border-box-16`.
- Preserve class/export names: `BorderBox16Element`, `borderBox16Metadata`, `defineBorderBox16`.
- Preserve standard props: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, `animated`, `paused`.
- Preserve CSS variables: `--dvk-color-primary`, `--dvk-color-secondary`, `--dvk-color-accent`, `--dvk-border-box-padding`, `--dvk-border-box-16-padding`.
- Preserve parts: `frame`, `graphic`, `content`.
- Preserve events: `dvk-ready`.
- Allowed internal changes: rail geometry, pin rhythm, pad placement, render layer names, and visual descriptions.

## Design Goal

- Concept name in structure language: floating chip laminate rail
- Aesthetic thesis: two very thin offset border layers create a suspended chip substrate, with the inner rail opening at the corners instead of becoming a heavy rim.
- Dashboard value: frames compact KPI, topology, or device-health panels with more depth and identity while preserving the thin border thickness.

## Dashboard Story

- Story type: industrial digital twin
- Target panel content: equipment status title, KPI value, small trend chart, and interface node list.
- Focal zone: center content with thin chip-like edge activity around it.

## First-Read Promise

At dashboard distance, the viewer first sees the center status content, then the floating two-layer chip edge, then the small pins and offset underlay.

## Rejected Patterns

- Existing patterns not to repeat: centered top/bottom docks, four heavy corner armor blocks, open-bottom spine frames, and four-corner-only signal-port traces.
- Symbol/object motifs not allowed: literal CPU package, shield, crest, portal, cockpit, scanner, or badge silhouette.
- Safe-area or motion risks rejected: thick inner rim, continuous heavy inner rectangle, large corner blocks, broad fills, animated full-edge sweeps, or pin density that crowds content.

## Existing Border Inventory

- Inventory date: 2026-07-08
- Nearest existing border: `dvk-border-box-14`
- Similarity reason: both use circuit-adjacent visual language and light node motion.
- Do-not-repeat notes: do not reuse four-corner-only signal-port construction, equal-weight corner traces, or corner-port pins as the entire identity.

## Candidate Concepts

### Candidate A: floating chip laminate rail

- Outer contour: broken thin outer rail plus a faint offset underlay.
- Corner grammar: clipped outer corners with inner hairline rails that retreat from the corners.
- Top/bottom rhythm: separated left/right rails, tiny center bridges, and a light underlay offset.
- Side logic: upper/lower side rails with open middle gaps and sparse laminate pins.
- Responsive model: live-size geometry because all modules are shallow, computed, and hairline.
- Content safe-area implication: small uniform inset; inner rail sits near the edge, opens at corners, and stays thin.
- Motion idea: very subtle pin opacity pulse on a few pins only.
- Why keep/reject: keep; it answers the selected floating layer direction while preserving the accepted thinness.

### Candidate B: socket bracket strip

- Outer contour: rectangular frame with four short socket brackets and open side gaps.
- Corner grammar: L-shaped socket rails with tiny solder pads.
- Top/bottom rhythm: socket brackets at thirds, no continuous edge pins.
- Side logic: two vertical bus strips with short inward tabs.
- Responsive model: source-coordinate fixed modules plus extension strips.
- Content safe-area implication: safe but visually close to signal-port corner frames.
- Motion idea: one node blink per side.
- Why keep/reject: reject; too close to `border-box-14` corner-port grammar.

### Candidate C: wafer trace perimeter

- Outer contour: thin rectangle with diagonal trace offsets at all sides.
- Corner grammar: angled trace crossings and small round pads.
- Top/bottom rhythm: diagonal traces move toward a center channel.
- Side logic: staggered side traces create directional flow.
- Responsive model: hybrid fixed corner modules with live rails.
- Content safe-area implication: diagonal traces risk reaching inward and making the border feel busy.
- Motion idea: no motion.
- Why keep/reject: reject; diagonal trace identity is less simple and risks becoming a symbolic chip diagram.

## Selected Concept

- Selected candidate: Candidate A, floating chip laminate rail.
- Selection reason: it keeps the accepted thinness but adds a clearer two-layer silhouette and open-corner inner rail.
- Structural differences from nearest border: broken perimeter rails instead of corner-only ports; floating underlay and open inner hairlines instead of orthogonal corner trace elbows; no four-corner trace fanout; tiny square pads instead of round pulse nodes as the main identity.
- Why it remains a usable dashboard border: the brightest marks sit outside the content safe area and the inner boundary is a hairline rather than a thick rim.

## Geometry Difference Score

Nearest existing border: `dvk-border-box-14`

| Dimension | Different? | Major? | Evidence |
| --- | --- | --- | --- |
| Outer contour | yes | yes | broken floating outer rails plus offset underlay rather than disconnected corner ports |
| Corner grammar | yes | yes | compact clipped corners and open inner hairlines, no L-shaped signal-port elbows |
| Major module placement | yes | yes | perimeter laminate rails and sparse pins rather than corner-local trace modules |
| Top/bottom rhythm | yes | yes | split rails and center bridge gaps rather than an evenly closed perimeter |
| Side logic | yes | no | upper/lower side rail gaps create a floating layer rhythm instead of standalone side traces |
| Responsive model | yes | yes | live-size computed full perimeter instead of shallow corner reach modules |
| Ornament rhythm | yes | no | small square pin/pad rhythm and underlay offsets instead of round nodes and contact pads |
| Motion grammar | yes | no | optional sparse pin pulse, no node radius animation |
| Content safe-area shape | yes | no | uniform thin chip inset with slightly larger padding than visual inner rail |

Pass threshold: at least 5 dimensions different and at least 2 major structural differences. Result: pass.

## Content Safe Area

- Reference canvas: live host SVG in `0 0 width height` coordinates.
- Deepest top inward reach: 18px visual reach, 20px safe allowance.
- Deepest right inward reach: 18px visual reach, 20px safe allowance.
- Deepest bottom inward reach: 18px visual reach, 20px safe allowance.
- Deepest left inward reach: 18px visual reach, 20px safe allowance.
- Glow/motion allowance: 2px, limited to shallow pins and hairline rails.
- Final `contentRect`: `{ x: 20, y: 20, width: width - 40, height: height - 40 }`.
- Padding expectations at source-ratio, wide, tall, small: uniform `20px` when space permits; minimum `12px` in tiny hosts.
- Corner usability conclusion: corners remain usable because pads and pins stay near the outer edge and never form blocks.

## Responsive Model

- Model: live-size exception
- Fixed modules: none; pins, broken rails, underlay rails, and open inner hairlines are generated from shallow edge geometry.
- Extension strips: straight broken rail segments and open inner hairlines.
- Cross-slice rails: none because the component is one live SVG.
- Slice continuity contract: not applicable.
- What may stretch: straight rail segment length, split gaps, and pin spacing.
- What must never stretch: stroke width, inner rail thickness, pin length, pad size, underlay offset, and corner notch depth.

## Live-Size Exception

- Why live-size is appropriate: the design is all thin lines, tiny square pads, and shallow pins computed from host size.
- Why slicing is not better: no complex source artwork or fixed ornament needs preservation; slicing would add unnecessary seams.
- Stable identity checks: wide, tall, and small hosts keep the same broken outer rail, offset underlay, open inner hairline, and chip-pin rhythm.
- Inward reach calculation: every pin reaches at most 18px inward; content padding uses 20px with a 12px minimum.

## Visual Language

- Line-weight hierarchy: 0.75px open inner hairline, 0.75px underlay, 1.25px broken outer rail, 1.15px accent pin strokes.
- Color roles: primary for outer rails, secondary for hairline grid/pins, accent for sparse active pads.
- Glow hierarchy: very light glow only around accent pads and selected pins.
- Density: low to medium; pins are sparse and the extra identity comes from offset layer rhythm rather than stroke weight.
- Depth layers: faint panel wash, offset underlay, open inner hairline, broken primary rail, sparse active pin/pad accents.

## Motion Budget

- Motion: subtle pulse
- Purpose: suggest low-level chip interface activity without becoming the focal point.
- Animated element count: up to 12 pin/pad elements.
- Animated properties: opacity only.
- Reduced-motion behavior: SVG animations are hidden by CSS.
- Pause behavior: `paused` prevents animation nodes from rendering.
- Performance risk: low; no animated filters or long path motion.

## Public API Contract

- Standard border props used: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, `animated`, `paused`.
- New props: none.
- User value for each new prop: not applicable.
- Internal details not exposed: host size, pin count, split rail gaps, underlay offset, corner notch size, content rectangle, and SVG ids.
- Docs/tests coverage: public props, CSS variables, parts, registration, paused animation, content padding, and internal-prop absence.

## Implementation Contract

- Component files: `packages/elements/src/border-box-16/element.ts`, `metadata.ts`, `register.ts`, `index.ts`, `design-brief.md`.
- Aggregate exports: update `packages/elements/src/index.ts`.
- Aggregate metadata: update `packages/elements/src/metadata.ts`.
- Aggregate registration: update `packages/elements/src/register.ts`.
- Docs page: add `docs/components/borders/border-box-16.md`.
- Docs index/sidebar: update VitePress component sidebar.
- Tests: update `packages/elements/test/register.test.ts`.
- Family inventory update: add `dvk-border-box-16` to `skills/create-complex-border/references/border-family-inventory.md`.

## Aesthetic Gate

| Gate | Status | Evidence |
| --- | --- | --- |
| First-read promise is clear | pass | content remains visually central; border reads as a floating two-layer chip edge |
| Dashboard content is more important than border detail | pass | no broad fills, no thick inner rim, sparse animation |
| Top rail has one readable primary rhythm | pass | broken outer rail, faint underlay, and small center bridge read as one laminate rhythm |
| Bottom rail has one readable primary rhythm | pass | mirrors the split-rail laminate cadence without a thick base |
| Corners do not squeeze content | pass | open inner hairlines retreat from corners and pads stay near the shallow border zone |
| Line-weight hierarchy is visible | pass | open inner hairline and underlay remain thinner than perimeter and accent pins |
| Glow clarifies structure instead of hiding disorder | pass | glow is limited to shallow active pads |
| Thumbnail reads as a border, not a symbolic object | pass | broken rectangular perimeter and open inner rails remain dominant |

Pass threshold: every gate is marked `pass`.

## Validation Evidence

Do not link or commit screenshot files. Record manual checks only.

- Realistic dashboard content used: docs demo content model with status title, KPI, trend chart, and interface-node list.
- Source-ratio check: `320 x 180` render keeps the broken outer rail at 5px, open inner hairline at 14px, shallow pins ending at 17px, and content padding at 20px.
- Wide check: `960 x 120` render keeps pin count bounded, preserves the open hairline inner rail, and does not thicken the floating layer rhythm.
- Tall check: `1 x 1200` stress render keeps SVG node count bounded, with only vertical laminate pins generated and no unbounded repeated loop.
- Small check: minimum dimensions clamp to a valid live SVG and keep content padding from collapsing below the documented minimum behavior.
- Safe-area overlay/manual inspection: deepest pin and micro-bus reach is 18px, while the content safe-area begins at 20px.
- Cross-slice continuity check: not applicable; live host SVG has no slices or tile seams.
- Issues found: complexity audit wanted explicit live geometry modules and more visible primitives.
- Rework completed: replaced the continuous inner rectangle with open corner-retreat hairlines and replaced the closed outer rail with broken floating laminate rails while keeping the inner boundary below 1px.
- Final manual conclusion: accepted; the component reads as a more distinctive floating CPU-like border and the inner edge remains very thin.
