---
name: create-complex-border
description: Create original polished Datav-style SVG border components and assets with large-screen technology aesthetics, strong focal hierarchy, eye-catching data-screen presence, measured content safe areas, and performance-first motion. Use when Codex must design or implement a new futuristic border box rather than faithfully copying an existing SVG, including datav-kit Web Components, responsive SVG frames or sliced frames, fixed identity modules, clean extension strips, painted glow/gradient effects, metadata/docs/exports, and visual validation that prioritizes beautiful, memorable, dashboard-native large-screen aesthetics while preventing simple-line, cluttered-edge, over-thick mecha, decorative-only, distorted, broken-edge, intrusive-semicircle, or non-border generated styles.
---

# Create Complex Border

## Overview

Use this skill to create a new technology-style border with the same engineering rigor as the existing `border-box-*` components. Treat the border as an engineered responsive SVG system that helps a large-screen dashboard feel focused, premium, and memorable, not a standalone decorative outline. Complexity means visual intelligence, structure, rhythm, focal hierarchy, and polish; it does not mean thick armor, dense machinery, or expensive animation.

The existing components are engineering references, not shape templates. A new border must have its own silhouette, module topology, ornament rhythm, slice strategy, complexity level, and light behavior. A border that keeps the same large outline and module layout while changing colors, labels, small ticks, or glow details is a failed use of this skill.

Before implementing, read `references/large-screen-aesthetic.md` and `references/datav-complex-border.md`. If the task starts from a source SVG that must be preserved exactly, also use the sibling `replicate-complex-svg` skill first.

## Border Acceptability Gate

Pass this gate before coding and again after screenshots:

- Aesthetic quality is the primary goal. A border that is technically usable but visually ugly, cluttered, cheap, or incoherent is a failed result.
- The border must support a strong dashboard first read. Within three seconds, the viewer should know where to look, what content is important, and why the frame exists. A border that looks like a pretty empty frame but does not strengthen the displayed data is a failed result.
- The result must read first as a dashboard content frame, not as a decorative side emblem, chart widget, portal, badge, or circular instrument panel.
- Decoration must never become the visual lead over the data. The most eye-catching element should be a dashboard focal zone, KPI, map, chart, or title system; the border should amplify that focal zone through light direction, framing, rhythm, and spatial depth.
- Top, bottom, left, and right edges must form an intentional, attractive frame system. Broken rails are allowed, but their interruptions must be mirrored by connector modules, anchors, or terminals; accidental-looking top/bottom misalignment or messy linework is a failure.
- The top and bottom edges need clean composition: clear primary rail, secondary hairlines, deliberate gaps, aligned terminals, and restrained detail density. Random stacked strokes, tangled rails, visually noisy docks, or unbalanced top/bottom outlines must be redesigned.
- Large arcs, circles, lenses, and semicircles may appear only as subordinate border modules. They must not dominate one side, invade the content safe area, or make the border read as a half-round object attached to a rectangle.
- Corners and side modules must protect the content area, not consume it. A design where many corner diagonals, plates, nodes, or rails grow inward and squeeze all four content corners is a failed border, even if the visual frame remains technically responsive.
- The content safe area must be designed before decoration. Padding derived from a small fixed inset while ornaments extend farther inward is a failed implementation; resize math must prove that the slotted content never crosses or visually fights the fixed frame modules.
- Fixed ornaments may sit above extension strips, but the visual hierarchy must remain clear: dim structure below, rails and plates in the middle, bright glints above, and content above the non-interactive frame.
- Reject any concept where one side has a large unexplained semicircle, a pasted-on scanner, or a module that is not connected to the frame grammar.
- Reject any concept whose best description is "the corners reach into the panel." Inward notches may exist only when they are rare, shallow, attractive, and accounted for by the contentRect.
- Motion must support the dashboard instead of stealing runtime budget. Any animated border that causes visible jank, constant layout work, excessive paint, high CPU/GPU usage, or a busy full-frame redraw loop is a failed result even if it looks visually impressive.
- Do not equate "technology" with mecha armor. Over-thick rails, bulky corner plates, heavy bevel stacks, loud glow blocks, and weapon/robot-like silhouettes are failed large-screen dashboard aesthetics unless explicitly requested by the user.
- Prefer thin primary rails, hairline secondary traces, restrained painted halos, and generous negative space. If the border looks heavy at thumbnail size, reduce mass before adding detail.

## Workflow

1. Read the project context.
   - Read `docs/architecture.md`, especially the SVG-first rendering model, side-effect-free registration boundary, content safe-area rule, and theme value rules.
   - Read `references/large-screen-aesthetic.md`; apply its focal hierarchy, visual drama, palette, and dashboard-story gates before sketching the border.
   - Inspect all existing numbered border components and docs, especially `packages/elements/src/border-box-1` through the latest `border-box-N` and `docs/components/borders/`.
   - Build a quick shape inventory of existing borders: silhouette type, symmetry, dominant modules, slice topology, complexity level, and animation behavior.
   - Preserve Custom Elements, Lit, metadata, registration, SSR, and docs conventions.

2. Choose a creative direction before coding.
   - If the user specifies type, complexity, animation, or density, follow it.
   - First choose the dashboard story type: command-center hero, geo/city cockpit, operations nerve center, energy/grid monitor, financial pulse board, industrial digital twin, or abstract cyber showcase.
   - Then choose the border direction. If the user asks for options, offer several substantially different directions such as asymmetric dock, diagonal shard frame, circular radar aperture, industrial clamp, split-screen rail, circuit trench, floating corner constellation, or ultra-minimal pulse frame.
   - If the user does not specify, choose one direction yourself and state it briefly; do not block implementation just to ask.
   - Pick a complexity tier: simple, medium, complex, or extreme. Prefer medium or complex for default work. Complex and extreme borders must change structure, not only add detail, and must still feel light enough for dashboard content.

3. Generate divergent concepts before coding.
   - Produce at least three candidate concepts internally or in the visible design brief when useful.
   - Each candidate must differ in at least four of these dimensions: outer silhouette, corner grammar, side-module logic, top/bottom module placement, symmetry, slice topology, content safe-area shape, ornament rhythm, and animation type.
   - Select the candidate with the greatest geometric distance from the nearest existing border.
   - Select only among candidates that are genuinely good-looking at thumbnail size: strong silhouette, balanced negative space, clear edge rhythm, restrained line weight, and polished glow hierarchy.
   - Discard any candidate whose thumbnail could be described as "another chamfered rectangle with four mirrored corner armor blocks and centered top/bottom docks."

4. Define the final design brief.
   - Define the first-read promise: what should the viewer notice first, second, and third at dashboard distance.
   - Define the focal zone: central map/chart/title/KPI cluster, off-axis hero module, or top-left executive summary. The border must point toward it instead of competing with it.
   - Choose a reference canvas intentionally. Avoid defaulting to `1600 x 900` or `1672 x 941` when a different ratio better supports the concept.
   - Name the concept in concrete visual terms: e.g. "left-heavy orbital scanner frame with a circular beacon and broken bottom rail".
   - Define `frameViewBox` or `contentViewBox`, `contentRect`, fixed modules, extension strips, and animation paths before writing render code.
   - Define the deepest inward reach of every fixed corner, side module, center dock, arc, and glow before approving the `contentRect`. If the required `contentRect` would squeeze normal dashboard content at the corners, redesign the frame outward or simplify the modules instead of accepting a large padding penalty.
   - Include at least five visual systems: silhouette, layered linework, fixed identity marks, light/glow behavior, and optional motion or interaction state.
   - Define the aesthetic thesis: why the border is beautiful, cool, memorable, and suitable for a technology large-screen dashboard. Mention first-read focal hierarchy, top/bottom rail rhythm, focal modules, negative space, depth, and glow hierarchy.
   - State why the shape still reads as a usable technology dashboard border and not a side illustration. Name any large arc or circular module and explain how it connects to adjacent rails.
   - Pass the originality gate against the nearest existing border, not only `border-box-2`. State differences in outline, corner construction, side modules, center modules, slice topology, asymmetry, and animation. If the meaningful difference is only color, stroke weight, labels, or small ticks, stop and redesign.
   - Define an animation performance budget when motion is requested. Prefer sparse, low-frequency SVG/CSS animations such as opacity, stroke dash offset, small transforms, or isolated highlight movement. Avoid `animateMotion` across long paths, animating large filters, many independent nodes, layout-affecting attributes, full-frame masks, huge blur regions, or JavaScript-driven render loops. Decide which motion can be disabled or reduced.

5. Compose the SVG as layered machinery.
   - Build from paths, symbols, intentionally mirrored or intentionally non-mirrored modules, gradients, painted halo strokes, ticks, nodes, hatches, plates, notches, short line breaks, and dim structural layers.
   - Keep corners, center plates, side marker stacks, circles, dense tick clusters, and diagonal joins fixed.
   - Invent new fixed modules instead of reusing the same corner bracket, side node, and center energy-bar motif from a previous border.
   - Change large forms first: if the frame still has the same visual massing as a prior border, redesign the silhouette before adding small decoration.
   - Keep inward-reaching geometry sparse and purposeful. Prefer ornament mass outside the content rectangle or along the immediate border band; avoid stacking diagonal corner rails, nodes, tabs, and glows that all point into the content area.
   - Stretch only clean straight strips along one axis.
   - Avoid one-note simple rectangles, single `polyline` frames, or generic rounded panels unless the user explicitly asks for a simple border.
   - Keep animation cheap by limiting the number of animated elements, sharing animation definitions, and animating only small foreground accents or short rail segments. Prefer painted halos over blur filters. Heavy glow should be static; if glow moves, keep the region tight and the animated area small.

6. Implement responsive slicing.
   - Use `ResizeController` and host dimensions.
   - Render fixed tiles with preserved aspect ratio.
   - Render extension strips with `preserveAspectRatio="none"` only for clean straight slices.
   - A single live-size SVG is acceptable for lightweight thin-rail borders when it is simpler and faster than repeating many sliced SVG tiles. Use slicing only when fixed ornate modules would otherwise smear.
   - Never stretch the whole artwork to the host with `preserveAspectRatio="none"`.
   - Compute content padding from `contentRect` with `createBorderBoxContentPadding` or an equivalent measured safe-area function.
   - Derive `contentRect` from the actual maximum inward reach of fixed modules and glow, not from a guessed constant such as "30px per side." The `contentRect` must preserve usable corner space at small and typical dashboard sizes.
   - Do not solve intrusive geometry by inflating padding until content fits. If the padding needed to clear ornaments makes the four content corners feel cramped, the visual design is wrong and must be redrawn.
   - Do not reuse a previous border's fixed slice names, counts, and proportions unless the user explicitly asks for a close variant. Similar slice maps produce similar borders.

7. Update public surfaces.
   - Add or update `element.ts`, `metadata.ts`, `register.ts`, `index.ts`, package exports, aggregate metadata/register files, docs, and tests as the local package requires.
   - Expose user-facing styling through `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, CSS variables, and `::part()`; do not expose internal slice coordinates as public API.

8. Validate quality, complexity, and originality.
   - Run the normal repo tests/build/lint that cover the package.
   - Run `scripts/audit_border_complexity.py <element.ts>` for quick structural checks, but do not treat primitive count as a quality score.
   - When possible, run `scripts/audit_border_complexity.py <element.ts> --compare packages/elements/src/border-box-*/element.ts` to flag designs that share too much path or slice topology with existing borders.
   - Use browser or DOM screenshots at source-ratio, wide, tall, and small sizes when available.
   - Judge screenshots as visual design, not only implementation. If the border does not look polished, futuristic, and desirable, redesign before finishing even when tests pass.
   - Validate with realistic demo content, not an empty slot. Include a title, KPI cards, a chart or map-like block, and subtle grid/background so the border can be judged as part of a large-screen composition.
   - Run a squint/blur mental test: if the screenshot does not reveal one dominant focal zone and a clear supporting frame rhythm, redesign the composition before changing colors or adding detail.
   - Confirm content stays inside the safe area and fixed ornamental modules do not smear.
   - Overlay or otherwise inspect the live content rectangle against the rendered frame. If corner decorations visually bite into the slotted content area, or if the padding is smaller than the deepest fixed ornament/glow, redesign before finishing.
   - Confirm the usable content corners remain generous. A border that forces dashboard content into an awkward rounded/octagonal inner hole because every corner reaches inward is a failed result, not a bold silhouette.
   - Confirm the four edge systems are visually coherent at source-ratio, wide, tall, and small sizes. Top/bottom rails may be split, but they must not look scrambled, layered out of order, or accidentally offset.
   - Inspect the top and bottom linework first. If those edges look cluttered, tangled, arbitrarily layered, or merely "usable", simplify the rail hierarchy and rebuild the edge modules.
   - Specifically inspect any arc, circle, or semicircle. If it reads like a large left/right half-disc attached to the frame, reduce it, break it into rail-connected arc segments, or replace it.
   - Compare the screenshot against several existing borders. If the silhouette and module positions read as the same design with cosmetic edits, revise geometry before finishing.
   - Validate animation performance when motion is present. Check that the border remains smooth while resized and while dashboard content is present; reduce animated element count, remove SVG blur filters, reduce mask complexity, or lower motion frequency if there is visible stutter or unnecessary CPU/GPU load. Respect `prefers-reduced-motion` and provide a no-motion or reduced-motion state for costly effects.

## Creative Controls

Let users steer the design without forcing a narrow template:

- Direction: asymmetric dock, radial scanner, industrial clamp, diagonal shard, circuit-board trace, glass HUD, split-rail console, floating node constellation, reactor hatch, orbital gate, minimal pulse, or custom.
- Complexity: simple, medium, complex, extreme.
- Symmetry: symmetric, mirrored corners only, asymmetric sides, asymmetric top/bottom, or fully irregular.
- Motion: none, subtle pulse, traveling scan, node blink, rail charge, rotating/radar sweep, or user-specified.
- Motion performance: static by default for dense/extreme designs unless the user asks for motion; when motion is requested, prefer subtle, composited-looking accents and cap animated detail so the border does not compete with dashboard rendering.
- Density: sparse, airy, balanced, dense, or maximal. Default to airy/balanced; never use density to hide weak composition.
- Shape: rectangular-chamfered, stepped polygon, broken rails, circular/arc modules, diagonal braces, recessed side spine, protruding dock, or custom.

If no controls are supplied, choose a direction that is visually far from the newest existing borders and say which one you chose.

## Resources

- `references/large-screen-aesthetic.md`: large-screen dashboard visual strategy, eye-catching focal hierarchy, technology style directions, and failure patterns.
- `references/datav-complex-border.md`: design grammar, implementation checklist, datav-kit integration notes, and failure patterns.
- `scripts/audit_border_complexity.py`: heuristic checker for common under-complex, distorted, or overly similar border implementations.
