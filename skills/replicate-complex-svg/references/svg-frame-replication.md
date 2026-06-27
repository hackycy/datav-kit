# SVG Frame Replication Checklist

## Source Analysis

- Start from the original SVG file, not a screenshot of the result.
- Read the root dimensions and viewBox.
- Locate frame bounds and content safe area in source coordinates.
- Extract visual crops by changing the root viewBox; this preserves source geometry and avoids raster-coordinate guessing.
- Keep a note of candidate rectangles as `x y width height`.

Suggested crop set:

- Full frame bounds.
- Four corners.
- Top, bottom, left, and right full sides.
- Every detail cluster: circles, nodes, ticks, bright blocks, notches, diagonal pieces.
- Candidate straight strips for each side extension.

## Classification Rules

Fixed modules:

- Corners.
- Diagonal joins.
- Circles, nodes, glowing points.
- Tick clusters or dense ornament groups.
- Any region where line direction, thickness, or glow changes.
- Any source segment that visually identifies the design.

Extension candidates:

- Clean straight linework.
- Stable thickness and glow along the stretch axis.
- No nodes, diagonals, ticks, gaps, or ornamental blocks inside the crop.
- Enough surrounding glow margin to avoid clipping.
- Aligned with the same source edge as the side it continues.

For complex SVGs, a repeated tile is often wrong. If adjacent tiles visibly break rhythm, stop tiling and use a single source-clipped straight strip with dynamic length.

## Implementation Guardrails

- Never stretch the complete SVG to the host rectangle.
- Fixed modules must preserve aspect ratio.
- Extension strips may use one-axis stretching only when the crop is visually pure.
- If the strip includes a diagonal transition, split it: fixed diagonal module plus separate clean straight extension.
- Do not approximate source linework with new strokes when fidelity is required; use the source paths clipped to measured rectangles.
- Do not place a right-side extension using an internal line if it must continue the outer right border. Align by `sourceRight(sourceX + width)`.
- Do not infer correctness from a single source-ratio screenshot. Test taller and wider sizes.

## Layout Notes

- Position fixed modules using source-coordinate offsets mapped into the host.
- Use the gap between fixed modules for extension length.
- Clip undersized or negative gaps to zero.
- Keep decorative rendering independent from slotted content.
- Derive default padding from the content safe area and reference scale.
- Avoid height-based padding growth in free-size mode; content can make the host taller without pushing padding outward forever.

## Tests To Add

- Metadata does not expose internal geometry: width, height, viewBox, slice coordinates, auto-height toggles.
- Default rendering is sliced/free-size, not a single full-frame SVG.
- Full-frame source viewBox is absent from normal render output.
- Fixed modules do not use `preserveAspectRatio="none"`.
- Extension strips use expected source viewBoxes.
- Colors and glow intensity still affect the source paths/filters.
- Padding matches the computed safe area and respects CSS variable overrides.
- Content growth or a taller host produces additional extension length without stretching fixed corners/details.

## Browser Verification

Inspect both DOM and screenshots:

- Source-ratio size: rendered structure should match source crops closely.
- Taller size: only clean vertical strips grow.
- Wider size: only clean horizontal strips grow.
- Corners do not distort.
- Nodes, circles, diagonals, tick clusters, and bright blocks stay fixed.
- No duplicate full artwork appears under the slices.
- Right and bottom edges stay aligned with their source-side boundaries.

## Failure Patterns From Real Work

- Old tests can keep asserting obsolete viewBoxes; update tests after remeasuring source coordinates.
- A side can look close while still using the wrong line: inspect x/y alignment and viewBox, not just visual presence.
- A lower side extension cropped too near the corner will include diagonal transition pixels; stretching it smears the corner.
- A right-side extension cropped from an inner vertical line creates a thinner-looking border and leaves the main border disconnected.
- Replacing complex source details with hand-drawn dynamic strokes usually loses line-weight and glow nuance.
- `preserveAspectRatio="none"` is acceptable for a clean straight strip but not for a fixed module or the whole artwork.
