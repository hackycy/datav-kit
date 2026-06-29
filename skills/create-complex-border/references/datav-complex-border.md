# Datav Complex Border Creation Guide

## Purpose

Create original high-density HUD/cyber border boxes that feel native to `datav-kit`. The goal is not "draw a border", but to design a responsive SVG frame with fixed visual identity modules, stretch-safe edge strips, neon lighting, and safe content geometry.

Original means newly designed. Existing borders teach implementation discipline, density, and slicing strategy; they must not become a repeated shape library where every result keeps the same outline and only changes color.

The skill succeeds only when a new border has a recognizable new large shape. Changing tick marks, colors, glow filters, module names, or animation timing while keeping the same silhouette and slice topology is not enough.

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
- All existing `packages/elements/src/border-box-*` components and matching `docs/components/borders/border-box-*.md` files, especially the newest two borders.
- `packages/elements/src/border-box-2/element.ts`: layered cyber frame with fixed corners, center energy bars, side details, nodes, and glow filters.
- `packages/elements/src/border-box-3/element.ts`: symbols, mirrored corners, restrained gradients, side ticks, and center modules.
- `packages/elements/src/border-box-6/element.ts`: many clipped source layers, asymmetric modules, and multiple clean extension strips.
- `packages/elements/src/border-box-content-padding.ts`: content safe-area padding helper.
- `docs/components/borders/border-box-2.md`, `border-box-3.md`, and `border-box-6.md`: public docs tone and prop tables.

## Existing Border Shape Inventory

Before designing, make a short inventory of the existing family. Keep it compact, but identify the shape, not only the component names.

Use these dimensions:

- Silhouette: rounded rectangle, chamfered rectangle, stepped polygon, broken rails, source-clipped ornate frame, open frame, side-heavy frame, or other.
- Symmetry: full mirror, mirrored corners only, asymmetric sides, asymmetric top/bottom, or intentionally irregular.
- Module topology: four corners only, corners plus centered top/bottom docks, side racks, bottom hatch, left beacon, right spine, circular nodes, diagonal braces, or source path layers.
- Slice topology: live-size drawing, simple fixed corners, 3x3 tiling, eight-slice rails, many clipped source modules, asymmetric strips, or custom.
- Complexity: simple, medium, complex, or extreme.
- Motion: none, corner fill animation, moving edge highlight, scan light, pulse beacon, or other.

The inventory should lead to a "do not repeat" list for the new component. For example, if the latest two borders both use a `1600 x 900` canvas, four mirrored armor corners, centered top and bottom docks, left/right mid-side modules, and eight extension strips, the next border should change several of those at once.

## Divergence Protocol

Do this before writing code:

1. Identify the nearest existing border by shape family, not by color.
2. Generate at least three candidate design directions.
3. Score each candidate against the nearest existing border using the geometry dimensions below.
4. Implement only the candidate that wins by structural difference and still fits the user's requested style.

Geometry dimensions:

- Outer contour and negative-space shape.
- Corner construction and whether corners are mirrored.
- Major fixed module count, size, and placement.
- Top/bottom rhythm, especially whether there are centered docks or off-axis modules.
- Side logic: beacon, spine, rack, clamps, broken rails, arcs, or no side module.
- Slice map: number of fixed modules, extension strips, strip positions, and scaling rules.
- Ornament rhythm: dense one-sided machinery, sparse rails, radial nodes, barcode clusters, hatch marks, plates, or diagonal shards.
- Motion grammar: edge runner, radar sweep, beacon pulse, rail charge, node twinkle, or no animation.

Pass condition:

- At least five geometry dimensions differ from the nearest existing border.
- At least two differences must be major structural changes, such as a new silhouette, asymmetric massing, non-centered primary module, radial/arc element, different slice topology, or non-mirrored corner family.
- If a small thumbnail of the new border can be confused with an existing border, redesign before coding.

## Originality Gate

Before writing code, describe the new border in a short design brief. The brief must answer:

- What is the new silhouette, and how does it differ from the nearest existing border?
- Which modules are fixed, and why are they visually unique to this design?
- Which strips stretch, and why are those strips free of ornaments that would smear?
- What is the dominant visual rhythm: heavy top command rail, asymmetric side spine, bottom dock, broken corner armor, radial node system, diagonal shard lattice, industrial clamp, floating beacon field, or another clear idea?
- What new light behavior appears beyond a color swap: traveling glint, split halo, layered underglow, isolated white-hot nodes, scan ticks, pulsing hatch marks, radar sweep, rail charging, or beacon breathing?
- Which exact existing motifs are banned for this design?

Reject these "new" designs even if they pass the complexity script:

- The outer and inner paths are recognizably the `border-box-2` chamfered frame.
- The layout is still four large corners, two centered bars, and two symmetric side nodes with only colors or stroke widths changed.
- The top and bottom modules keep the same center-energy-bar proportion and placement as `border-box-2`.
- The new component copies the previous slice map, then adds small ticks or extra glow as decoration.
- The component uses the same canvas, same fixed slice names, same fixed slice counts, same centered top/bottom module rhythm, and same mirrored corner strategy as a recent border.
- The design brief cannot identify at least five geometry-level differences from the nearest existing border.

When in doubt, change structure first: silhouette, corner mass, module count, asymmetry, slice topology, and content safe area are stronger originality signals than palette.

## Creative Direction Menu

Use these as selectable design families. They are prompts for invention, not templates.

- Asymmetric docking bay: one side has heavy machinery, the opposite side is a thin rail, and the bottom or top includes a protruding hatch.
- Radial scanner frame: a partial circular lens, arc ticks, orbiting nodes, and broken linear rails that attach to the circle.
- Industrial clamp frame: thick mechanical clamps on two corners, exposed bolts, short rail segments, and recessed content space.
- Diagonal shard frame: slanted braces, fractured corners, triangular plates, and skewed extension strips.
- Circuit trench frame: printed-circuit traces, small solder nodes, offset bus bars, and dense micro ticks around one edge.
- Split-rail console: top and bottom rails are interrupted into unequal segments with command tabs and status blocks.
- Floating node constellation: corners are light anchors, sides are sparse broken rails, and fixed nodes form a non-rectangular rhythm.
- Orbital gate: large arc modules intrude at one side or two opposite corners, with straight strips only between arc anchors.
- Minimal pulse frame: very spare outline, one or two signature beacon modules, low ornament density, and subtle animated pulse.
- Extreme machinery frame: many fixed panels, separate light channels, multiple asymmetric hatches, and a high primitive count.

When the user asks for choice, present several of these with complexity and motion options. When the user does not ask, select one direction that is far from the latest existing borders.

## Complexity Tiers

Choose the tier deliberately:

- Simple: low-density frame, one signature module, minimal animation, still distinct from existing shapes.
- Medium: clear silhouette, four to six fixed modules, limited glow, one optional animation.
- Complex: eight or more fixed modules, multiple extension regions, layered neon, unique topology, and visible micro-detail.
- Extreme: twelve or more fixed modules or several custom submodules, high-density linework, asymmetric massing, multiple light systems, and strict screenshot validation.

Complexity is not decoration count alone. A complex border with the same silhouette as the previous border is still a failed design.

## Design Grammar

Use a reference canvas and design in source coordinates first. Choose the canvas for the concept, not habit. A wide command rail may use `1600 x 900`; an ornate source-style frame may use `1672 x 941`; a square-ish scanner, vertical side panel, or dashboard tile may use a different coordinate system.

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
- A repeated "four armor corners + centered top module + centered bottom dock + left/right middle rack" structure unless the user explicitly requested that family.
- Renaming modules, nudging coordinates, or adding a beacon while the large silhouette remains the same.

## Creative Reference Cases

Use these as starting prompts, not templates. A generated border may borrow one or two ideas from a case, but it should still invent its own paths, slices, proportions, and details.

### Case 6: Offset Reactor Dock

Create a frame that feels like an off-center reactor dock or launch-bay console, not a symmetric picture frame.

- Canvas: `1672 x 941`, with a generous `contentRect` such as `x: 142`, `y: 124`, `width: 1388`, `height: 690`.
- Silhouette: heavy stepped top-left armor, a long thin top command rail, a recessed right-side vertical spine, and a bottom dock that rises into the content area with two shallow trapezoid hatches.
- Fixed modules: oversized top-left control block, compact top-right antenna bracket, right-side stacked capsule lights, bottom-left diagonal brace, bottom-center reactor hatch, bottom-right small lock plate, and at least two isolated node clusters.
- Extension strips: split the top into three different rails instead of one repeated straight line; use a short left vertical strip, a long right vertical strip, and two bottom strips around the center hatch.
- Ornament rhythm: dense detail on one corner and the bottom dock, sparse hairlines elsewhere, with intentional asymmetry.
- Light behavior: dim blue structural underlay, cyan primary rails, amber or magenta accent hatch lights, and small white-hot node glints. Add one optional moving scan highlight only along a clean rail.
- Must avoid: the `border-box-2` eight-module symmetry, matching corner brackets, centered top/bottom energy bars, and identical left/right side nodes.

This case is useful when the request asks for more creativity. It gives the agent permission to change the frame's massing, not just draw another cyan rectangle.

### Case: Radial Side Scanner

Create a frame where the dominant identity is a partial circular scanner mounted on one side, not corner armor.

- Canvas: any ratio that leaves room for the arc, such as `1500 x 920`.
- Silhouette: mostly open rectangular rails interrupted by a large left or right circular arc that protrudes into the border zone.
- Fixed modules: arc lens, orbit tick cluster, two small opposite corner anchors, one off-axis status tab, and several isolated node caps.
- Extension strips: straight rail segments above and below the arc; never stretch the arc or orbit ticks.
- Ornament rhythm: radial density around the scanner, sparse linear rails elsewhere.
- Light behavior: slow radar sweep or pulsing arc nodes, gated by `animated`, `paused`, and reduced motion.
- Must avoid: centered top/bottom energy bars and four mirrored corner armor blocks.

### Case: Diagonal Shard Lattice

Create a frame built from diagonal braces and fractured plates.

- Canvas: wide or medium ratio, with a contentRect that accounts for slanted corner intrusion.
- Silhouette: broken polygon outline with long diagonal cuts, offset top-left and bottom-right mass, and visibly different corner geometries.
- Fixed modules: slanted corner plates, diagonal cross braces, short shard ticks, two asymmetric side clamps, and a non-centered bottom status tray.
- Extension strips: straight rail portions between diagonal anchors; the diagonal modules remain fixed.
- Ornament rhythm: angular, sharp, and layered with short parallel slashes rather than circular nodes.
- Light behavior: traveling charge along one diagonal brace or short pulse on shard tips.
- Must avoid: rounded or symmetric command-console proportions.

### Case: Circuit Trench

Create a frame that reads as a circuit board carved around dashboard content.

- Canvas: choose a ratio that supports many small trace turns.
- Silhouette: thin broken rails with occasional rectangular pads and stepped trace corners.
- Fixed modules: solder-pad clusters, trace forks, chip-like side block, offset bottom bus, and small square nodes.
- Extension strips: repeated-looking straight trace segments only; keep pads and forks fixed.
- Ornament rhythm: many tiny right-angle trace turns and pads, not large armor plates.
- Light behavior: one or two rail-charge animations that move through trace paths.
- Must avoid: large chamfered corner armor and centered glowing bars.

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

Use a model that fits the chosen shape. A common model is:

```txt
fixed corner/detail module | clean extension strip | fixed center/detail module | clean extension strip | fixed corner/detail module
```

This is not the only valid model. New borders may use:

- Asymmetric fixed side module plus two vertical extension strips.
- Arc or radial fixed module plus adjacent straight rails.
- Split top rails with no centered module.
- Top-heavy or bottom-heavy layouts with different strip counts per side.
- Sparse fixed anchors connected by long clean strips.

For each axis:

- Compute a stable scale from the host and reference canvas.
- Preserve fixed module aspect ratio.
- Allocate extra width or height only to clean straight strips.
- Clip undersized or negative extension lengths to zero.
- Align right-side modules from the right edge and bottom modules from the bottom edge when that preserves source geometry.
- Keep top/bottom padding scaled from host height and left/right padding scaled from host width.

Do not use `preserveAspectRatio="none"` on fixed modules. Only use it for extension strips whose crop contains straight, stable linework and enough glow margin.

Avoid copying an existing slice map. If the new `fixedSlices` and `extensionSlices` look like a previous border with renamed keys, redesign the topology.

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
- The new screenshot remains identifiable if converted to a black-and-white silhouette.
- The new screenshot differs from the nearest existing border in at least five geometry dimensions from the Divergence Protocol.
- If available, run the audit script with `--compare` against existing `border-box-*` element files and review any similarity warnings.

## Failure Patterns

- The output looks "technology-like" but too simple: add fixed modules, center plates, side marker stacks, hairlines, glints, and multiple light layers.
- The border looks good at one size only: you probably stretched the full drawing or included ornaments inside an extension strip.
- Neon looks flat: separate halo, body, and core layers instead of one bright stroke.
- Details disappear after slicing: the tile viewBox may be too tight and clipping filter blur.
- Right or bottom edges drift: align those slices from the corresponding host edge rather than reusing left/top placement math blindly.
- Content overlaps the frame: recalculate `contentRect`, then inspect live host/content rectangles before changing visual paths.
- Two consecutive generated borders look like siblings with the same body shape: stop adding decoration and change the large topology.
- The component passes primitive-count checks but fails the thumbnail test: primitive count is not originality.
- The border depends on a centered dock because the previous one did: move the major module off-center, remove it, replace it with radial/side logic, or change the slice model.
