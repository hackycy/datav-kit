# Datav Border Design Brief Template

Create this file at `packages/elements/src/border-box-N/design-brief.md` before writing component render code. Keep it concise and specific.

```md
# Border Box N Design Brief

## User Constraints

- Request:
- Explicit direction:
- Explicitly allowed risky motifs:

## Task Type

- Type: original | variant | repair/redesign | replica handoff
- Candidate count required:
- Candidate count provided:

## Failure Diagnosis

Required only for repair/redesign.

- Failed behavior:
- Failed design layer: concept | geometry | safe area | responsive model | visual language | motion | API/docs/tests
- Old modules allowed to remain:
- Old modules rejected:

## Compatibility Contract

Required only for repair/redesign.

- Preserve tag name:
- Preserve class/export names:
- Preserve standard props:
- Preserve CSS variables:
- Preserve parts:
- Preserve events:
- Allowed internal changes:

## Design Goal

- Concept name in structure language:
- Aesthetic thesis:
- Dashboard value:

## Dashboard Story

- Story type:
- Target panel content:
- Focal zone:

## First-Read Promise

At dashboard distance, the viewer first sees <focal zone>, then <supporting data>, then <frame atmosphere>.

## Rejected Patterns

- Existing patterns not to repeat:
- Symbol/object motifs not allowed:
- Safe-area or motion risks rejected:

## Existing Border Inventory

- Inventory date:
- Nearest existing border:
- Similarity reason:
- Do-not-repeat notes:

## Candidate Concepts

### Candidate A: <structure-language name>

- Outer contour:
- Corner grammar:
- Top/bottom rhythm:
- Side logic:
- Responsive model:
- Content safe-area implication:
- Motion idea:
- Why keep/reject:

### Candidate B: <structure-language name>

- Outer contour:
- Corner grammar:
- Top/bottom rhythm:
- Side logic:
- Responsive model:
- Content safe-area implication:
- Motion idea:
- Why keep/reject:

### Candidate C: <structure-language name>

Required for original and repair/redesign unless user direction is explicit.

- Outer contour:
- Corner grammar:
- Top/bottom rhythm:
- Side logic:
- Responsive model:
- Content safe-area implication:
- Motion idea:
- Why keep/reject:

## Selected Concept

- Selected candidate:
- Selection reason:
- Structural differences from nearest border:
- Why it remains a usable dashboard border:

## Geometry Difference Score

Nearest existing border: `dvk-border-box-X`

| Dimension | Different? | Major? | Evidence |
| --- | --- | --- | --- |
| Outer contour | yes/no | yes/no |  |
| Corner grammar | yes/no | yes/no |  |
| Major module placement | yes/no | yes/no |  |
| Top/bottom rhythm | yes/no | yes/no |  |
| Side logic | yes/no | yes/no |  |
| Responsive model | yes/no | yes/no |  |
| Ornament rhythm | yes/no | yes/no |  |
| Motion grammar | yes/no | yes/no |  |
| Content safe-area shape | yes/no | yes/no |  |

Pass threshold: at least 5 dimensions different and at least 2 major structural differences.

## Content Safe Area

- Reference canvas:
- Deepest top inward reach:
- Deepest right inward reach:
- Deepest bottom inward reach:
- Deepest left inward reach:
- Glow/motion allowance:
- Final `contentRect`:
- Padding expectations at source-ratio, wide, tall, small:
- Corner usability conclusion:

## Responsive Model

- Model: source-coordinate slices | live-size exception | hybrid
- Fixed modules:
- Extension strips:
- Cross-slice rails:
- Slice continuity contract:
- What may stretch:
- What must never stretch:

## Live-Size Exception

Required only when using live-size geometry.

- Why live-size is appropriate:
- Why slicing is not better:
- Stable identity checks:
- Inward reach calculation:

## Visual Language

- Line-weight hierarchy:
- Color roles:
- Glow hierarchy:
- Density:
- Depth layers:

## Motion Budget

- Motion: none | subtle pulse | rail charge | node blink | other
- Purpose:
- Animated element count:
- Animated properties:
- Reduced-motion behavior:
- Pause behavior:
- Performance risk:

## Public API Contract

- Standard border props used:
- New props:
- User value for each new prop:
- Internal details not exposed:
- Docs/tests coverage:

## Implementation Contract

- Component files:
- Aggregate exports:
- Aggregate metadata:
- Aggregate registration:
- Docs page:
- Docs index/sidebar:
- Tests:
- Family inventory update:

## Aesthetic Gate

| Gate | pass/revise | Evidence |
| --- | --- | --- |
| First-read promise is clear |  |  |
| Dashboard content is more important than border detail |  |  |
| Top rail has one readable primary rhythm |  |  |
| Bottom rail has one readable primary rhythm |  |  |
| Corners do not squeeze content |  |  |
| Line-weight hierarchy is visible |  |  |
| Glow clarifies structure instead of hiding disorder |  |  |
| Thumbnail reads as a border, not a symbolic object |  |  |

Pass threshold: no `revise` entries.

## Validation Evidence

Do not link or commit screenshot files. Record manual checks only.

- Realistic dashboard content used:
- Source-ratio check:
- Wide check:
- Tall check:
- Small check:
- Safe-area overlay/manual inspection:
- Cross-slice continuity check:
- Issues found:
- Rework completed:
- Final manual conclusion:
```
