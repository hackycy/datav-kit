# Border Box 12 Design Brief

## User Constraints

- Request: add `border 12` under `packages/elements`.
- Explicit direction: minimalist futuristic HUD frame, near full-screen rectangle, slight chamfered corners, no rounded corners, no title bar, no title box, no floating panel, no embedded frame, clean continuous top center, electric-blue thin lines with soft glow, three simple slanted parallelogram blocks near each top corner with weak looping blink, symmetric side midpoint inward fold lines, simple continuous bottom rail, empty dark content area.
- Reference correction: after first implementation direction was rejected, align the component with `/Users/qigong-it-1/Downloads/svg/minimal_hud_border.svg`.
- Explicitly allowed risky motifs: none.

## Task Type

- Type: original
- Candidate count required: 3
- Candidate count provided: 3

## Design Goal

- Concept name in structure language: fixed-fold chamfer rail outline
- Aesthetic thesis: preserve the supplied minimal HUD SVG's quiet blue rail system while adapting it to real host dimensions.
- Dashboard value: leaves the top-center title zone and the large inner content region visually clean, with only edge-hugging slant blocks and side break accents adding technology atmosphere.

## Dashboard Story

- Story type: command-center hero
- Target panel content: centered dashboard title in the reserved top region, central KPI/map/chart content, and side status summaries.
- Focal zone: the clean top-center title zone and the large dark content area.

## First-Read Promise

At dashboard distance, the viewer first sees the clean central content/title area, then the fixed-fold beveled blue frame, then the faint glow and top-corner slant blocks.

## Rejected Patterns

- Existing patterns not to repeat: rounded DataV panels, centered top/bottom docks, dense HUD source ornament, four heavy corner armor blocks, title-box frames, and status-label lattices.
- Symbol/object motifs not allowed: arrow, gear, chip, circuit board, crown, shield, badge, portal, cockpit, and mechanical armor silhouettes.
- Safe-area or motion risks rejected: top-center decoration, full-frame sweeping animation, animated blur, dense tick fields, and large inward corner modules.

## Existing Border Inventory

- Inventory date: 2026-07-01
- Nearest existing border: `dvk-border-box-6`
- Similarity reason: both use a 1672 x 941 large-screen HUD source grammar and blue precision rail styling.
- Do-not-repeat notes: avoid border-box-6's dense source-clipped details, high-precision hatch grammar, and asymmetric detail placement.

## Candidate Concepts

### Candidate A: fixed-fold chamfer rail outline

- Outer contour: use the supplied 1672 x 941 SVG rail path as fixed fold modules plus straight extension rails.
- Corner grammar: beveled rail corners with miter joins, no rounded corners or corner blocks.
- Top/bottom rhythm: top center remains open and continuous with a lowered rail segment; bottom is one clean reinforced line.
- Side logic: left and right midpoint use the reference SVG's symmetric inward break accent.
- Responsive model: live-size exception that keeps fold modules uniformly scaled and stretches only straight rails.
- Content safe-area implication: content rect follows the reference dark panel area and clamps to minimum padding on small hosts.
- Motion idea: six top parallelogram blocks blink with staggered opacity.
- Why keep/reject: keep; it follows the user's reference SVG and keeps the requested minimal HUD discipline.

### Candidate B: exact static source replica

- Outer contour: draw the supplied SVG directly with `viewBox="0 0 1672 941"` and `preserveAspectRatio="none"`.
- Corner grammar: exactly the reference path.
- Top/bottom rhythm: exactly the reference path.
- Side logic: exactly the reference side accents.
- Responsive model: single SVG scales all coordinates and blocks non-uniformly.
- Content safe-area implication: simple and close to the file, but fixed source scaling can make block geometry too tiny on narrow panels.
- Motion idea: none beyond the source.
- Why keep/reject: reject; it is too static for the requested weak looping blink and less explicit about host content padding.

### Candidate C: simplified source outline

- Outer contour: keep only the outer and inner reference paths.
- Corner grammar: same beveled rail corners.
- Top/bottom rhythm: omit slant blocks and side accent paths.
- Side logic: side midpoint folds remain only in the outline.
- Responsive model: live-size exception using source-coordinate mapping.
- Content safe-area implication: safest content area, but visually under-delivers on the user's top-corner block requirement.
- Motion idea: none.
- Why keep/reject: reject; removes the user's required three-block accents and loses the reference SVG's key point of view.

## Selected Concept

- Selected candidate: Candidate A, fixed-fold chamfer rail outline.
- Selection reason: it directly follows the supplied SVG while preserving the component's standard API, content padding, and animation controls.
- Structural differences from nearest border: this is a low-density single-frame rail with an empty top-center title zone, paired top slant blocks, mirrored side break accents, and no dense clipped HUD modules.
- Why it remains a usable dashboard border: all decoration stays close to the outer rail, content padding is measured from the reference safe panel, and motion is limited to six small blocks away from the title zone.

## Geometry Difference Score

Nearest existing border: `dvk-border-box-6`

| Dimension | Different? | Major? | Evidence |
| --- | --- | --- | --- |
| Outer contour | yes | yes | Minimal supplied beveled frame instead of dense multi-module source HUD frame. |
| Corner grammar | yes | yes | Simple mitered bevels replace dense clipped corner details. |
| Major module placement | yes | yes | Only paired top slant blocks and side folds, no top joins/bottom hatch fields. |
| Top/bottom rhythm | yes | yes | Top center remains a clean lowered rail; bottom is a single reinforced line. |
| Side logic | yes | yes | Symmetric midpoint folds replace asymmetric markers. |
| Responsive model | yes | no | Both are source-aware, but this keeps fold modules uniform and extends straight rails instead of source-sliced modules. |
| Ornament rhythm | yes | yes | Six slant blocks replace dense hatches/nodes. |
| Motion grammar | yes | yes | Subtle block opacity blink instead of static source details. |
| Content safe-area shape | yes | no | Safe area follows the reference dark panel, not border-box-6's measured source content rectangle. |

Pass threshold: at least 5 dimensions different and at least 2 major structural differences.

## Content Safe Area

- Reference canvas: 1672 x 941.
- Deepest top inward reach: 92 source units to clear the lowered top rail, slant blocks, glow, and title zone.
- Deepest right inward reach: 77 source units to clear side break accents, glow, and the requested extra horizontal padding.
- Deepest bottom inward reach: 89 source units to clear the bottom rail and glow.
- Deepest left inward reach: 77 source units to clear side break accents, glow, and the requested extra horizontal padding.
- Glow/motion allowance: included in the reference safe panel; animated blocks change opacity only and do not move.
- Final `contentRect`: `{ x: 77, y: 92, width: 1518, height: 760 }` on the 1672 x 941 reference canvas.
- Padding expectations at source-ratio, wide, tall, small: source-ratio maps to about 9.8% top, 4.6% side, and 9.5% bottom; wide panels preserve the clean title zone; narrow/tall panels clamp side padding to 19 px while retaining vertical clearance.
- Corner usability conclusion: corners remain usable because the bevels and slant blocks sit near the outer frame and do not form bulky corner modules.

## Responsive Model

- Model: live-size exception
- Fixed modules: top-left/top-right corner bends, two top-center angled bends, three left slant blocks, three right slant blocks, mirrored side break accents, and bottom corner bends.
- Extension strips: top center horizontal rail, left/right vertical rail sections outside the middle side break, bottom horizontal rail, and the blank dark panel.
- Cross-slice rails: none; no slicing is used.
- Slice continuity contract: not applicable.
- What may stretch: top center horizontal rail, left/right vertical rail sections outside the middle side break, bottom horizontal rail, and the dark blank panel.
- What must never stretch conceptually: diagonal fold angles, side break angles, top-center openness, six-block count, side-fold symmetry, no title box, no rounded corners, no grid/texture.

## Live-Size Exception

- Why live-size is appropriate: the reference is a single minimal line-first SVG with no dense clipped source modules; fixed fold modules plus straight extensions keep the supplied implementation recognizable without angle distortion.
- Why slicing is not better: slicing would add unnecessary module boundaries to a simple full-frame path; the live geometry already separates fixed folds from extendable straight rails.
- Stable identity checks: source-ratio, wide, tall, small, and mobile browser checks preserve six slant blocks, two side break accents, the lowered clean top rail, continuous bottom rail, and fixed diagonal angles.
- Inward reach calculation: content padding maps `contentRect` from the 1672 x 941 reference canvas to current host size through `createBorderBoxContentPadding`.

## Visual Language

- Line-weight hierarchy: 4.7 px low-opacity glow rail, 2 px primary gradient rail, 1.4 px inner duplicate rail and bottom reinforcement.
- Color roles: primary electric blue, secondary pale blue/cyan inner line, accent pale block highlights.
- Glow hierarchy: one soft filter follows rails and blocks; no animated blur or heavy interior effects.
- Density: low, with empty top-center and blank dark interior preserved.
- Depth layers: subtle dark panel, outer glow rail, primary gradient rail, inner duplicate rail, side break accents, and blinking slant blocks.

## Motion Budget

- Motion: subtle block blink.
- Purpose: gives the top-corner blocks a live HUD feel while preserving the empty title zone.
- Animated element count: six parallelogram blocks.
- Animated properties: SVG `opacity`.
- Reduced-motion behavior: SVG animate elements are hidden by CSS.
- Pause behavior: when `paused` is true, no animate elements are rendered.
- Performance risk: low; no animated blur, masks, long sweeps, or repeated slice SVGs.

## Public API Contract

- Standard border props used: `color`, `secondary-color`, `accent-color`, `colors`, `glow-intensity`, `animated`, `paused`.
- New props: none.
- User value for each new prop: none.
- Internal details not exposed: source canvas, host size, source coordinates, block geometry, side fold geometry, and filter/gradient IDs.
- Docs/tests coverage: docs list standard props and tests cover registration, metadata, color resolution, padding, reference-mapped geometry, pause behavior, and unique SVG IDs.

## Implementation Contract

- Component files: `element.ts`, `metadata.ts`, `register.ts`, `index.ts`, and this `design-brief.md`.
- Aggregate exports: update `packages/elements/src/index.ts`.
- Aggregate metadata: update `packages/elements/src/metadata.ts`.
- Aggregate registration: update `packages/elements/src/register.ts`.
- Docs page: add `docs/components/borders/border-box-12.md`.
- Docs index/sidebar: update `docs/.vitepress/config.ts` and `docs/index.md`.
- Tests: update `packages/elements/test/register.test.ts`.
- Family inventory update: update `skills/create-complex-border/references/border-family-inventory.md`.

## Aesthetic Gate

| Gate | status | Evidence |
| --- | --- | --- |
| First-read promise is clear | pass | The top-center and interior are left empty and dominant. |
| Dashboard content is more important than border detail | pass | The frame uses one main rail system, one inner line, side folds, and six small blocks. |
| Top rail has one readable primary rhythm | pass | The supplied lowered top rail stays continuous and clean through the center. |
| Bottom rail has one readable primary rhythm | pass | One reinforced bottom line with no dock or title box. |
| Corners do not squeeze content | pass | Bevels are shallow and the content rect clears them. |
| Line-weight hierarchy is visible | pass | Glow rail, primary rail, and inner rail have distinct weights. |
| Glow clarifies structure instead of hiding disorder | pass | Glow is applied to already-simple rail paths and blocks. |
| Thumbnail reads as a border, not a symbolic object | pass | It remains a stable beveled rectangle, not an arrow, chip, or badge. |

Pass threshold: all gates recorded as pass.

## Validation Evidence

Do not link or commit screenshot files. Record manual checks only.

- Realistic dashboard content used: docs `BorderChartDemo` title, KPI/chart, and status content.
- Source-ratio check: unit tests at 320 x 180 verified the fixed-fold outer path, inner path, side break paths, bottom reinforcement, six top blocks, gradient stops, six animation tags, and safe-area padding.
- Wide check: browser validation at a wide viewport showed the docs component at 638 x 430 with 6 blocks, 2 side folds, 6 animations, `viewBox="0 0 638 430"`, and no title panel or `foreignObject`.
- Tall check: browser validation at a taller viewport kept the same docs component geometry constraints with 6 blocks, 2 side folds, 6 animations, and the clean top-center rail.
- Small check: browser validation at a narrow/mobile viewport showed a 297 x 680 component with 6 blocks, 2 side folds, 6 animations, side padding clamped to 19 px, and vertical safe-area padding preserved.
- Safe-area overlay/manual inspection: content padding maps the 1672 x 941 reference `contentRect` and clears the top slant blocks, side folds, bottom rail, and glow; no title box, grid, text, or pattern is rendered inside the SVG.
- Cross-slice continuity check: not applicable because this is one live-size SVG with no slices.
- Issues found: first implementation drifted away from the supplied SVG by using a too-plain freeform rectangle and extra calibration ticks; follow-up review found the top block groups overlapped the two angled ends of the lowered top rail, the outer rail was too heavy, and independent x/y coordinate mapping deformed fold angles during free adaptation.
- Rework completed: replaced the freeform geometry with fixed fold modules from `minimal_hud_border.svg`, removed calibration ticks, shifted the left block group outward-left and the right block group outward-right to clear the top rail折线, reduced the outer glow/main rail stroke widths by about one third, changed adaptation so only the top center rail, side straight rails outside the middle fold, and bottom rail extend, increased side content padding, and updated tests.
- Final manual conclusion: accepted as a reference-aligned minimal HUD border because the top center stays clean, side folds are symmetric, bottom rail is continuous, animation is limited to six small blocks, and the large dark interior remains blank.
