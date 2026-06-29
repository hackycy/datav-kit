# Datav Border Failure Taxonomy

Use this reference to decide where to rework a failed border. Keep failures abstract; do not preserve removed components as failure case studies.

## Known Failed Style Families

Treat these style families as failed design directions. They may appear in the current component inventory for compatibility, but they must not be used as positive examples, aesthetic targets, or shortcut sources for future original borders.

- `dv-border-box-11` style: high-density mirrored cyber command-console armor. Failure signals include heavy corner armor, centered top/bottom docks, symmetric side sensor racks, hatch and node saturation, every edge competing for attention, and a large content inset caused by bulky fixed modules. This is a concept/aesthetic/safe-area failure family.
- `dv-border-box-12` style: asymmetric split-bus trace frame. Failure signals include a left/top command spine becoming the whole identity, offset status docks and checksum strips functioning as decorative labels, sparse traces that read as layout gimmicks instead of border structure, and asymmetry that still depends on the same source-sliced HUD grammar. This is a concept/geometry/aesthetic failure family.

Required treatment: reject candidates that copy either family at `Candidate Concepts`. If a generated border drifts into either family during implementation, return to `Selected Concept` and redesign the topology rather than changing colors, glow, density, or animation.

## Concept Failures

- The concept reads as a symbolic object before it reads as a dashboard border.
- The concept has no dashboard story or first-read promise.
- The border is attractive in isolation but weak around realistic dashboard content.
- The selected concept is only a color, glow, label, or tick-mark variant of an existing border.

Required rework: return to `Candidate Concepts` and choose or create a different structure.

## Geometry Failures

- Thumbnail silhouette is confusable with the nearest existing border.
- Top and bottom rails look accidental, tangled, crossed, or from unrelated frames.
- A side module is a pasted-on object instead of rail-connected structure.
- Corners, side modules, and center docks lack a clear hierarchy.

Required rework: return to `Selected Concept`, `Geometry Difference Score`, and `Responsive Model`.

## Safe-Area Failures

- Fixed modules or glow reach farther inward than the documented safe area.
- Padding technically prevents overlap but leaves dashboard content cramped.
- All four corners bite into the usable content area.
- Animated highlights cross or compete with the content area.

Required rework: return to `Content Safe Area`; redesign geometry outward if needed.

## Responsive Model Failures

- Complex ornaments stretch, smear, drift, or reorder at wide/tall/small sizes.
- Live-size geometry changes the design identity across aspect ratios.
- Fixed slices and extension strips stack in a confusing order.
- The slice map is effectively copied from an existing border.

Required rework: return to `Responsive Model`; change slicing, module placement, or concept.

## Aesthetic Failures

- The border is technically valid but visually dull, cheap, heavy, or noisy.
- Every edge is equally bright or dense, leaving no focal hierarchy.
- Glow hides disordered linework instead of clarifying structure.
- Line weight reads as bulky hardware instead of refined dashboard technology.

Required rework: return to `Visual Language`; if silhouette is weak, return to `Candidate Concepts`.

## Motion Failures

- Motion is ornamental sparkle with no data or focus purpose.
- Motion steals attention from dashboard content.
- Animation uses long paths, animated blur, full-frame masks, or too many independent nodes.
- Reduced-motion or pause behavior is missing.

Required rework: return to `Motion Budget` and tests.

## Documentation/API Failures

- Public docs repeat internal design audit content.
- Metadata over-promises visual quality not proven by the brief.
- Public props expose `width`, `height`, `viewBox`, slice coordinates, module toggles, or debug overlays.
- Tests assert visual taste instead of engineering contract.

Required rework: update `Public API Contract`, docs, metadata, and tests.
