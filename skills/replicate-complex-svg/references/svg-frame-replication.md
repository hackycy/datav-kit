# SVG Frame Replication Checklist

## Source Analysis

- Start from the original SVG file, not a screenshot of the result.
- Read the root dimensions and viewBox.
- Locate frame bounds and content safe area in source coordinates.
- Extract visual crops by changing the root viewBox; this preserves source geometry and avoids raster-coordinate guessing.
- Keep a note of candidate rectangles as `x y width height`.
- Record both the decorative frame bounds and the content safe area. The source canvas/viewBox can include transparent margins that should not be treated as the real frame edge.

Suggested crop set:

- Full frame bounds.
- Four corners.
- Top, bottom, left, and right full sides.
- Fixed center/special module for every side that has one.
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
- Side center modules, center plates, side marker clusters, hatch groups, and node runs.

Extension candidates:

- Clean straight linework.
- Stable thickness and glow along the stretch axis.
- No nodes, diagonals, ticks, gaps, or ornamental blocks inside the crop.
- Enough surrounding glow margin to avoid clipping.
- Aligned with the same source edge as the side it continues.
- On sides with a fixed center module, only the plain segment from corner-to-center and center-to-corner may stretch.

For complex SVGs, a repeated tile is often wrong. If adjacent tiles visibly break rhythm, stop tiling and use a single source-clipped straight strip with dynamic length.

## Side Center Module Pattern

Many HUD frames are not "corner + one middle repeat" systems. A side may be:

```txt
corner module | clean extension | fixed center/special module | clean extension | corner module
```

Use this model when a side contains a center plate, marker stack, tick cluster, node pair, notch group, or any ornamental line break. Do not merge the center module into an extension crop.

For horizontal sides:

- Keep the top/bottom center plate or notch group fixed.
- Stretch only the plain left/right edge segments between that center module and the corner modules.
- Mirror the same source intervals for top and bottom only when the artwork actually mirrors.

For vertical sides:

- Keep side marker clusters fixed, including their circles, ticks, hatch groups, and grouped short line breaks.
- Stretch only the plain vertical segments above and below the marker cluster.
- When the host is taller than the source ratio, distribute extra height into those two clean vertical extension gaps, not into the side marker cluster.
- Align right-side vertical extensions by the right source edge, not by a visually similar inner line.

If the source-ratio render already has zero gap between a corner and a side marker, the corresponding extension may legitimately have zero rendered length at that size. It should appear only when the host grows in that axis.

## Implementation Guardrails

- Never stretch the complete SVG to the host rectangle.
- Fixed modules must preserve aspect ratio.
- Extension strips may use one-axis stretching only when the crop is visually pure.
- If the strip includes a diagonal transition, split it: fixed diagonal module plus separate clean straight extension.
- Do not approximate source linework with new strokes when fidelity is required; use the source paths clipped to measured rectangles.
- Do not place a right-side extension using an internal line if it must continue the outer right border. Align by `sourceRight(sourceX + width)`.
- Do not infer correctness from a single source-ratio screenshot. Test taller and wider sizes.
- If docs or demos consume a built package, rebuild before browser verification; otherwise layout fixes may appear unchanged.

## Layout Notes

- Position fixed modules using source-coordinate offsets mapped into the host.
- Use the gap between fixed modules for extension length.
- When a side has two extension gaps around a fixed center module, compute the center module position first, then assign the available extra length to the two adjacent gaps.
- Clip undersized or negative gaps to zero.
- Keep decorative rendering independent from slotted content.
- Derive default padding from the content safe area and reference scale.
- Map padding on the same axis as the CSS edge: left/right from host width, top/bottom from host height, unless the component deliberately preserves a uniform source scale. Wide fixed-height demos expose this mistake quickly.
- Constrain the content wrapper to the host box. Use `height: 100%`, `box-sizing: border-box`, and `min-height: 0` when slotted content may use `height: 100%` or grid/flex children. Otherwise parent padding can increase the wrapper's actual height and push content below the frame.
- Treat minimum padding values as fallback clamps only. Check representative desktop/mobile sizes to ensure `Math.max(...)` or CSS fallbacks are not hiding the measured safe-area padding.
- When moving one content safe-area edge, preserve any edge that is already correct by changing both `y` and `height`, or both `x` and `width`, as needed.
- Avoid height-based padding growth in free-size mode; content can make the host taller without pushing padding outward forever.
- The free-size sliced border should be the default component behavior. Do not require an `auto-height`, "free mode", or similar opt-in just to make normal host/content sizing work.

## Tests To Add

- Metadata does not expose internal geometry: width, height, viewBox, slice coordinates, auto-height toggles.
- Default rendering is sliced/free-size, not a single full-frame SVG.
- Full-frame source viewBox is absent from normal render output.
- Fixed modules do not use `preserveAspectRatio="none"`.
- Extension strips use expected source viewBoxes.
- Fixed center/side marker modules use fixed viewBoxes and never use `preserveAspectRatio="none"`.
- For each side with a center module, there are two extension strips around that module, unless one gap is zero at the tested size.
- Colors and glow intensity still affect the source paths/filters.
- Padding matches the computed safe area and respects CSS variable overrides.
- Padding tests include a non-source-ratio fixed-height host so width-scaled top/bottom values cannot pass accidentally.
- Content wrapper bounding rect matches the host rect in fixed-height mode, and assigned/slotted content remains inside the safe area.
- Minimum padding guards do not mask the expected safe-area values at representative demo sizes.
- Content growth or a taller host produces additional extension length without stretching fixed corners/details.

## Browser Verification

Inspect both DOM and screenshots:

- Source-ratio size: rendered structure should match source crops closely.
- Taller size: only clean vertical strips grow.
- Wider size: only clean horizontal strips grow.
- Corners do not distort.
- Nodes, circles, diagonals, tick clusters, and bright blocks stay fixed.
- Center plates and side marker clusters stay fixed while only their neighboring plain segments grow.
- No duplicate full artwork appears under the slices.
- Right and bottom edges stay aligned with their source-side boundaries.
- Computed content padding matches the expected safe area in the live browser, not only in unit tests.
- Host, content wrapper, and slotted content rectangles show `content.bottom <= host.bottom` and assigned content remains above the intended bottom padding.

## Failure Patterns From Real Work

- Old tests can keep asserting obsolete viewBoxes; update tests after remeasuring source coordinates.
- A side can look close while still using the wrong line: inspect x/y alignment and viewBox, not just visual presence.
- A bottom slice can include transparent source margin below the real frame, making the border look detached from the host bottom even when the tile is positioned at `bottom: 0`.
- A lower side extension cropped too near the corner will include diagonal transition pixels; stretching it smears the corner.
- A right-side extension cropped from an inner vertical line creates a thinner-looking border and leaves the main border disconnected.
- Treating a side marker cluster as one long vertical extension makes circles, ticks, and gaps drift or smear as height changes.
- Hiding the correct free-size behavior behind an `auto-height` attribute preserves the wrong default and creates two layout modes to test.
- Computing top/bottom padding from host width works at source ratio but fails in wide fixed-height docs and dashboards.
- Parent content wrappers without `height: 100%` can grow taller than the host when children use `height: 100%`; the visible symptom is content crossing the bottom border even though the padding value looks plausible.
- Large minimum padding clamps can make a coordinate fix appear ineffective. Inspect the raw mapped value and the clamped value separately.
- Updating only `contentRect.y` or only `contentRect.height` can accidentally move the bottom safe edge; keep the correct edge invariant while tuning the opposite edge.
- Replacing complex source details with hand-drawn dynamic strokes usually loses line-weight and glow nuance.
- `preserveAspectRatio="none"` is acceptable for a clean straight strip but not for a fixed module or the whole artwork.
