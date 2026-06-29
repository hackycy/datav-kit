---
name: create-complex-border
description: Create original complex Datav-style SVG border components and assets with cyber/HUD/neon visual density. Use when Codex must design or implement a new futuristic border box rather than faithfully copying an existing SVG, including datav-kit Web Components, responsive sliced SVG frames, fixed ornate corner/detail modules, clean extension strips, glow/gradient/neon effects, content safe-area padding, metadata/docs/exports, and visual validation that prioritizes beautiful, cool, coherent large-screen aesthetics and prevents simple-line, cluttered-edge, distorted, broken-edge, intrusive-semicircle, or non-border generated styles.
---

# Create Complex Border

## Overview

Use this skill to create a new complex technology-style border with the same implementation rigor as the existing ornate `border-box-2`, `border-box-3`, and `border-box-6` components. Treat the border as an engineered responsive SVG system, not a single decorative outline.

The existing components are engineering references, not shape templates. A new border must have its own silhouette, module topology, ornament rhythm, slice strategy, complexity level, and light behavior. A border that keeps the same large outline and module layout while changing colors, labels, small ticks, or glow details is a failed use of this skill.

Before implementing, read `references/datav-complex-border.md`. If the task starts from a source SVG that must be preserved exactly, also use the sibling `replicate-complex-svg` skill first.

## Border Acceptability Gate

Pass this gate before coding and again after screenshots:

- Aesthetic quality is the primary goal. A border that is technically usable but visually ugly, cluttered, cheap, or incoherent is a failed result.
- The result must read first as a dashboard content frame, not as a decorative side emblem, chart widget, portal, badge, or circular instrument panel.
- Top, bottom, left, and right edges must form an intentional, attractive frame system. Broken rails are allowed, but their interruptions must be mirrored by connector modules, anchors, or terminals; accidental-looking top/bottom misalignment or messy linework is a failure.
- The top and bottom edges need clean composition: clear primary rail, secondary hairlines, deliberate gaps, aligned terminals, and restrained detail density. Random stacked strokes, tangled rails, visually noisy docks, or unbalanced top/bottom outlines must be redesigned.
- Large arcs, circles, lenses, and semicircles may appear only as subordinate border modules. They must not dominate one side, invade the content safe area, or make the border read as a half-round object attached to a rectangle.
- Fixed ornaments may sit above extension strips, but the visual hierarchy must remain clear: dim structure below, rails and plates in the middle, bright glints above, and content above the non-interactive frame.
- Reject any concept where one side has a large unexplained semicircle, a pasted-on scanner, or a module that is not connected to the frame grammar.

## Workflow

1. Read the project context.
   - Read `docs/architecture.md`, especially the SVG-first rendering model, side-effect-free registration boundary, content safe-area rule, and theme value rules.
   - Inspect all existing numbered border components and docs, especially `packages/elements/src/border-box-1` through the latest `border-box-N` and `docs/components/borders/`.
   - Build a quick shape inventory of existing borders: silhouette type, symmetry, dominant modules, slice topology, complexity level, and animation behavior.
   - Preserve Custom Elements, Lit, metadata, registration, SSR, and docs conventions.

2. Choose a creative direction before coding.
   - If the user specifies type, complexity, animation, or density, follow it.
   - If the user asks for options, offer several substantially different directions such as asymmetric dock, diagonal shard frame, circular radar aperture, industrial clamp, split-screen rail, circuit trench, floating corner constellation, or ultra-minimal pulse frame.
   - If the user does not specify, choose one direction yourself and state it briefly; do not block implementation just to ask.
   - Pick a complexity tier: simple, medium, complex, or extreme. Complex and extreme borders must change structure, not only add detail.

3. Generate divergent concepts before coding.
   - Produce at least three candidate concepts internally or in the visible design brief when useful.
   - Each candidate must differ in at least four of these dimensions: outer silhouette, corner grammar, side-module logic, top/bottom module placement, symmetry, slice topology, content safe-area shape, ornament rhythm, and animation type.
   - Select the candidate with the greatest geometric distance from the nearest existing border.
   - Select only among candidates that are genuinely good-looking at thumbnail size: strong silhouette, balanced negative space, clear edge rhythm, and polished neon hierarchy.
   - Discard any candidate whose thumbnail could be described as "another chamfered rectangle with four mirrored corner armor blocks and centered top/bottom docks."

4. Define the final design brief.
   - Choose a reference canvas intentionally. Avoid defaulting to `1600 x 900` or `1672 x 941` when a different ratio better supports the concept.
   - Name the concept in concrete visual terms: e.g. "left-heavy orbital scanner frame with a circular beacon and broken bottom rail".
   - Define `frameViewBox` or `contentViewBox`, `contentRect`, fixed modules, extension strips, and animation paths before writing render code.
   - Include at least five visual systems: silhouette, layered linework, fixed ornaments, light/glow behavior, and motion or interaction state.
   - Define the aesthetic thesis: why the border is beautiful, cool, and suitable for a technology large-screen dashboard. Mention top/bottom rail rhythm, focal modules, negative space, and glow hierarchy.
   - State why the shape still reads as a usable technology dashboard border and not a side illustration. Name any large arc or circular module and explain how it connects to adjacent rails.
   - Pass the originality gate against the nearest existing border, not only `border-box-2`. State differences in outline, corner construction, side modules, center modules, slice topology, asymmetry, and animation. If the meaningful difference is only color, stroke weight, labels, or small ticks, stop and redesign.

5. Compose the SVG as layered machinery.
   - Build from paths, symbols, intentionally mirrored or intentionally non-mirrored modules, gradients, filters, ticks, nodes, hatches, plates, notches, short line breaks, and dim structural layers.
   - Keep corners, center plates, side marker stacks, circles, dense tick clusters, and diagonal joins fixed.
   - Invent new fixed modules instead of reusing the same corner bracket, side node, and center energy-bar motif from a previous border.
   - Change large forms first: if the frame still has the same visual massing as a prior border, redesign the silhouette before adding small decoration.
   - Stretch only clean straight strips along one axis.
   - Avoid one-note simple rectangles, single `polyline` frames, or generic rounded panels unless the user explicitly asks for a simple border.

6. Implement responsive slicing.
   - Use `ResizeController` and host dimensions.
   - Render fixed tiles with preserved aspect ratio.
   - Render extension strips with `preserveAspectRatio="none"` only for clean straight slices.
   - Never stretch the whole artwork to the host with `preserveAspectRatio="none"`.
   - Compute content padding from `contentRect` with `createBorderBoxContentPadding` or an equivalent measured safe-area function.
   - Do not reuse a previous border's fixed slice names, counts, and proportions unless the user explicitly asks for a close variant. Similar slice maps produce similar borders.

7. Update public surfaces.
   - Add or update `element.ts`, `metadata.ts`, `register.ts`, `index.ts`, package exports, aggregate metadata/register files, docs, and tests as the local package requires.
   - Expose user-facing styling through `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, CSS variables, and `::part()`; do not expose internal slice coordinates as public API.

8. Validate quality, complexity, and originality.
   - Run the normal repo tests/build/lint that cover the package.
   - Run `scripts/audit_border_complexity.py <element.ts>` for quick structural checks.
   - When possible, run `scripts/audit_border_complexity.py <element.ts> --compare packages/elements/src/border-box-*/element.ts` to flag designs that share too much path or slice topology with existing borders.
   - Use browser or DOM screenshots at source-ratio, wide, tall, and small sizes when available.
   - Judge screenshots as visual design, not only implementation. If the border does not look polished, futuristic, and desirable, redesign before finishing even when tests pass.
   - Confirm content stays inside the safe area and fixed ornamental modules do not smear.
   - Confirm the four edge systems are visually coherent at source-ratio, wide, tall, and small sizes. Top/bottom rails may be split, but they must not look scrambled, layered out of order, or accidentally offset.
   - Inspect the top and bottom linework first. If those edges look cluttered, tangled, arbitrarily layered, or merely "usable", simplify the rail hierarchy and rebuild the edge modules.
   - Specifically inspect any arc, circle, or semicircle. If it reads like a large left/right half-disc attached to the frame, reduce it, break it into rail-connected arc segments, or replace it.
   - Compare the screenshot against several existing borders. If the silhouette and module positions read as the same design with cosmetic edits, revise geometry before finishing.

## Creative Controls

Let users steer the design without forcing a narrow template:

- Direction: asymmetric dock, radial scanner, industrial clamp, diagonal shard, circuit-board trace, glass HUD, split-rail console, floating node constellation, reactor hatch, orbital gate, minimal pulse, or custom.
- Complexity: simple, medium, complex, extreme.
- Symmetry: symmetric, mirrored corners only, asymmetric sides, asymmetric top/bottom, or fully irregular.
- Motion: none, subtle pulse, traveling scan, node blink, rail charge, rotating/radar sweep, or user-specified.
- Density: sparse, balanced, dense, or maximal.
- Shape: rectangular-chamfered, stepped polygon, broken rails, circular/arc modules, diagonal braces, recessed side spine, protruding dock, or custom.

If no controls are supplied, choose a direction that is visually far from the newest existing borders and say which one you chose.

## Resources

- `references/datav-complex-border.md`: design grammar, implementation checklist, datav-kit integration notes, and failure patterns.
- `scripts/audit_border_complexity.py`: heuristic checker for common under-complex, distorted, or overly similar border implementations.
