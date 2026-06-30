---
name: replicate-complex-svg
description: Recreate complex SVG artwork as faithful responsive UI components or assets. Use when Codex must analyze a source SVG, vectorized HUD frame, ornate border, panel frame, decorative corner system, or similar line-art material and rebuild it without losing details, including slicing fixed corners/details, identifying safe stretch regions, avoiding whole-SVG distortion, preserving source line weights, computing content padding, and validating with DOM/browser screenshots.
---

# Replicate Complex SVG

## Overview

Use this skill to turn complex SVG linework into a responsive implementation while preserving the source geometry. Prefer source-clipped slices and measured coordinates over intuition, hand-redrawn approximations, or whole-SVG stretching.

Before implementing, read `references/svg-frame-replication.md`.

## Workflow

1. Read local project constraints first.
   - For components, read architecture docs, component conventions, registration patterns, metadata, docs, and tests.
   - Confirm whether imports must be side-effect free.

2. Analyze the source SVG before coding.
   - Record root `width`, `height`, and `viewBox`.
   - Identify the real frame bounds and content safe area from coordinates, not visual guesses.
   - For each side, identify whether it has a fixed center/special module before choosing extension strips.
   - Use `scripts/crop_svg_viewbox.py` or equivalent root-viewBox crops to inspect candidate regions.
   - Create crops for each corner, each side, each side center module, each detail module, and each possible extension strip.

3. Classify geometry.
   - Treat corners, diagonal joints, nodes, circles, bright blocks, tick clusters, notches, and complex ornaments as fixed modules.
   - Treat side center modules and side marker clusters as fixed unless the source proves they are plain straight linework.
   - Use extension/stretch only on clean straight source regions whose linework is stable along the stretch axis.
   - If a side has a fixed center module, stretch only the plain strip between the corner and center module on each side of that module.
   - Reject tile repetition when the source is not visually periodic; prefer dynamic-length straight extension strips.
   - If a strip contains a diagonal transition or node, it is not an extension strip.
   - If tile repetition is necessary, define a minimum rendered tile length and maximum tile count before coding. Do not allow repeat counts to grow unbounded when a host dimension is tiny.
   - Treat large blur/filter stacks as desktop-only unless mobile validation proves they are safe.

4. Implement with source-clipped modules.
   - Render fixed modules at fixed aspect ratio.
   - Render extension strips from the source SVG and stretch only along their clean axis.
   - Never stretch the full artwork with `preserveAspectRatio="none"`.
   - Avoid hand-drawn replacement strokes unless the task explicitly asks for abstraction.
   - Align extensions by the same source edge they are continuing; do not let a right-side strip drift inward from the right border.
   - Cap repeated tile generation and let the final tile absorb any remaining length after the cap; size that SVG to the final tile so it does not clip.
   - For mobile/coarse-pointer/reduced-motion states, disable or simplify expensive SVG filters while preserving the visible frame silhouette.

5. Compute responsive layout from geometry.
   - Let host CSS/content determine size.
   - Make the sliced/free-size behavior the component default; do not hide correct behavior behind an auto-height or special escape attribute.
   - Scale decorative fixed modules conservatively from the stable reference dimension used by the project.
   - Fill extra width/height only in measured clean gaps between fixed modules.
   - Compute default padding from the source content safe area; map inline padding from host width and block padding from host height unless the project explicitly uses a uniform scale model.
   - Ensure the content wrapper itself is constrained to the host box (`height: 100%`, `box-sizing: border-box`, and `min-height: 0` where applicable) before judging padding. A slotted child with `height: 100%` plus parent padding can otherwise push content past the bottom border even when the padding numbers look reasonable.
   - Do not let minimum padding guards override the measured safe area in common responsive sizes; use them only as small fallback clamps for undersized hosts.
   - When remeasuring a side, update the opposite coordinate/size together so the intended safe-area edge stays fixed.
   - Do not let padding grow unbounded with container height.
   - Keep component-level CSS variable overrides for padding when the project provides them.

6. Validate visually and structurally.
   - Compare source crops against rendered modules at source-ratio size and stretched/taller/wider sizes.
   - Inspect DOM viewBoxes, element positions, and `preserveAspectRatio` values.
   - Use browser screenshots and computed DOM rectangles for corners, side extensions, content-growth cases, and fixed-height non-source-ratio demos.
   - Measure host, content wrapper, and slotted content bounding boxes; verify content wrapper overflow is zero and assigned content remains inside the intended safe area.
   - Confirm no full-frame SVG leaks underneath sliced modules.
   - Test at a mobile viewport such as `390 x 844` and one pathological narrow/tall host when repetition is used.
   - Inspect SVG/tile counts, computed filter styles, and browser console logs; mobile fallback filters should be `none` or otherwise clearly cheaper when the source uses repeated heavy blur filters.

7. Update public surfaces.
   - Keep metadata, docs, registration exports, and tests in sync.
   - Do not expose internal geometry such as width, height, viewBox, slice coordinates, or auto-height escape hatches unless they are intentional public API.

## Common Failure Signals

- Details look thinner or thicker after resizing: the extension strip likely uses the wrong source x/y range or is aligned to the wrong edge.
- A side appears disconnected near a corner: a fixed module boundary or extension start/end is off by source-coordinate scale.
- A diagonal or node looks smeared: a complex detail was included in a stretched strip.
- The result looks correct only at one height: the layout still depends on a special-case mode instead of normal host sizing.
- Padding changes appear to have no effect: a minimum padding clamp may be masking the measured value, or the docs/demo may be loading a built artifact that needs rebuilding.
- Content crosses the bottom border even though padding looks correct: the content wrapper may be auto-height instead of host-height, so slotted `height: 100%` content plus padding expands beyond the frame.
- Top/bottom spacing is wrong only in wide or short containers: block padding may be incorrectly scaled from width instead of height.
- Bottom frame has a large blank gap: the bottom slice/viewBox may include transparent source margin beyond the real frame bounds.
- Mobile load appears stuck or blank: repeated tiles may be unbounded, or every slice may duplicate expensive SVG blur/filter stacks without a mobile fallback.
- Tests pass but visual fidelity is wrong: add DOM assertions for source viewBoxes and run browser screenshot checks against source crops.

## Resources

- `scripts/crop_svg_viewbox.py`: create source SVG crops by replacing the root viewBox, useful for measuring candidate fixed and extension regions.
- `references/svg-frame-replication.md`: detailed checklist, pitfalls, and validation notes for ornate SVG frames.
