---
name: create-complex-border
description: Create original complex Datav-style SVG border components and assets with cyber/HUD/neon visual density. Use when Codex must design or implement a new futuristic border box rather than faithfully copying an existing SVG, including datav-kit Web Components, responsive sliced SVG frames, fixed ornate corner/detail modules, clean extension strips, glow/gradient/neon effects, content safe-area padding, metadata/docs/exports, and visual validation that prevents simple-line or distorted generated styles.
---

# Create Complex Border

## Overview

Use this skill to create a new complex technology-style border with the same implementation rigor as the existing ornate `border-box-2`, `border-box-3`, and `border-box-6` components. Treat the border as an engineered responsive SVG system, not a single decorative outline.

The existing components are engineering references, not shape templates. A new border must have its own silhouette, module topology, ornament rhythm, and light behavior. Do not recreate the `border-box-2` outer/inner path, eight-slice layout, centered energy-bar composition, or corner geometry with only color changes.

Before implementing, read `references/datav-complex-border.md`. If the task starts from a source SVG that must be preserved exactly, also use the sibling `replicate-complex-svg` skill first.

## Workflow

1. Read the project context.
   - Read `docs/architecture.md`, especially the SVG-first rendering model, side-effect-free registration boundary, content safe-area rule, and theme value rules.
   - Inspect nearby border components and docs: `packages/elements/src/border-box-2`, `border-box-3`, `border-box-6`, and `docs/components/borders/`.
   - Preserve Custom Elements, Lit, metadata, registration, SSR, and docs conventions.

2. Define the design brief before coding.
   - Choose a reference canvas such as `1600 x 900` or `1672 x 941`.
   - Name the concept in concrete visual terms: e.g. "asymmetric cyan command-console frame with side marker stacks and bottom reactor hatch".
   - Define `frameViewBox` or `contentViewBox`, `contentRect`, fixed modules, and extension strips before writing render code.
   - Include at least four visual systems: silhouette, layered linework, fixed ornaments, and light/glow behavior.
   - Pass the originality gate: state how the new frame differs from `border-box-2` in outline, corner construction, side modules, center modules, and slice topology. If the only meaningful difference is color, stop and redesign.

3. Compose the SVG as layered machinery.
   - Build from paths, symbols, mirrored modules, gradients, filters, ticks, nodes, hatches, plates, notches, short line breaks, and dim structural layers.
   - Keep corners, center plates, side marker stacks, circles, dense tick clusters, and diagonal joins fixed.
   - Invent new fixed modules instead of reusing the same corner bracket, side node, and center energy-bar motif from a previous border.
   - Stretch only clean straight strips along one axis.
   - Avoid one-note simple rectangles, single `polyline` frames, or generic rounded panels unless the user explicitly asks for a simple border.

4. Implement responsive slicing.
   - Use `ResizeController` and host dimensions.
   - Render fixed tiles with preserved aspect ratio.
   - Render extension strips with `preserveAspectRatio="none"` only for clean straight slices.
   - Never stretch the whole artwork to the host with `preserveAspectRatio="none"`.
   - Compute content padding from `contentRect` with `createBorderBoxContentPadding` or an equivalent measured safe-area function.

5. Update public surfaces.
   - Add or update `element.ts`, `metadata.ts`, `register.ts`, `index.ts`, package exports, aggregate metadata/register files, docs, and tests as the local package requires.
   - Expose user-facing styling through `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, CSS variables, and `::part()`; do not expose internal slice coordinates as public API.

6. Validate quality and complexity.
   - Run the normal repo tests/build/lint that cover the package.
   - Run `scripts/audit_border_complexity.py <element.ts>` for quick structural checks.
   - Use browser or DOM screenshots at source-ratio, wide, tall, and small sizes when available.
   - Confirm content stays inside the safe area and fixed ornamental modules do not smear.
   - Compare the screenshot against `border-box-2`: if the silhouette and module positions read as the same design, revise geometry before finishing.

## Resources

- `references/datav-complex-border.md`: design grammar, implementation checklist, datav-kit integration notes, and failure patterns.
- `scripts/audit_border_complexity.py`: heuristic checker for common under-complex or distorted border implementations.
