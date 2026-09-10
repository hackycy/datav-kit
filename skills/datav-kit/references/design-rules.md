# Screen Design Checks

Use these checks on the delivered screen. Layout counts and stylistic preferences are
not universal correctness rules; adjust them to the business and viewing conditions.

## Required delivery checks

- Scale the canvas proportionally. Keep text and data inside the viewport and documented
  component content areas; inspect the rendered result for clipping.
- Make primary metrics visible without hover. Calibrate text for the intended hardware
  and viewing distance; check long labels, large values and alternate datasets.
- Check contrast against the composited background: WCAG AA uses 4.5:1 for normal text,
  3:1 for large text and 3:1 for meaningful non-text indicators, unless an equivalent
  non-color cue supplies the information. Decorative linework is not a data indicator.
- Provide accessible names, keyboard access and visible focus. Honor reduced motion,
  offer pause for ongoing animation, and avoid flashing.
- Distinguish loading, empty, failed and stale data. Show units and update time; reconcile
  aggregate metrics with plotted datasets.
- Keep stable dimensions during updates. Verify chart/scene pixels, not just the existence
  of a canvas or SVG node.

`assets/tools/contrast-check.js` can check numerical contrast. Screenshots are still needed
to evaluate layering and text over geographic or 3D content.

## Design review

For new directions, compare thumbnails with the labels hidden: the primary visual's
placement, reading order and region proportions should remain distinguishable. For this
example collection, keep all six bases dark and at least three perceptibly different
dark palette families. Metadata describes intent; inspect screenshots to verify it.

- Establish a primary visual and reading order. Supporting regions should answer the same
  business question rather than occupy arbitrary grid cells.
- Use one project theme with distinct roles for neutral text, surfaces, data, selection
  and warnings. Add labels or shape cues to status colors. Official theming docs own CSS API.
- Match decoration to the scene. Static rails can establish hierarchy; motion should
  explain updates or selection without competing with the information.
- Choose module count, spacing and type hierarchy by content and viewing conditions.
  Avoid excessive framing, small legends and repeated oversized headings.
- Reveal the subject through maps, images and models. Record external asset provenance.
- Use accurate chart encodings: zero origin for magnitude bars, explicit units and ranges,
  direct labels where practical, and perceptually ordered continuous scales.

## Verification record

Record viewport, delivery path, screenshots, tested interactions, data states and remaining
issues. Fix required-check failures before handoff. Explain material style tradeoffs briefly.
For unattended screens verify pause, visibility changes and cleanup. Mobile preview preserves
the large-screen composition; a mobile product redesign is a separate requirement.
