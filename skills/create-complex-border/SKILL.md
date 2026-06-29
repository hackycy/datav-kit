---
name: create-complex-border
description: Design, implement, repair, or variant Datav-kit `border-box-N` Web Components through an audited Datav large-screen border workflow. Use only for `packages/elements/src/border-box-N` components that need original line-first SVG frame design, Datav-kit integration, safe content geometry, metadata/docs/tests, and manual dashboard validation. Do not use for generic SVG borders, ordinary web card borders, pure visual assets, or faithful source-SVG replication; hand faithful replicas to the replicate-complex-svg workflow before Datav integration.
---

# Create Complex Border

Use this skill as an execution protocol for Datav-kit border Web Components. The output is not only code; it is a component plus a maintained design record that proves the border was designed, compared, implemented, and validated through the required gates.

## Required Reading

Read these in order before design work:

1. `docs/architecture.md`
2. `references/design-brief-template.md`
3. `references/border-family-inventory.md`
4. `references/large-screen-aesthetic.md`
5. `references/datav-complex-border.md`
6. `references/failure-taxonomy.md`

Then read source files only as needed:

- Read the nearest existing border's source, docs, and tests after selecting it from the inventory.
- Read a target component's source/docs/tests for `repair/redesign`.
- Read additional existing borders only when the inventory is stale, insufficient, or inconsistent with code. Update the inventory when you learn something durable.

## Task Type Gate

Choose one task type before any implementation:

- `original`: create a new Datav border. Require at least 3 candidate concepts.
- `variant`: intentionally derive from an existing border. Require at least 2 candidate concepts and explicit reuse/change limits.
- `repair/redesign`: replace an existing border's visual design while preserving its public API by default. Require a new failure diagnosis, compatibility contract, and at least 3 candidate concepts unless the user explicitly dictates the new direction.
- `replica handoff`: if the user asks to faithfully preserve a source SVG, use the sibling replication workflow first. This skill may then handle Datav integration and quality gates.

Do not use this skill for deleting a border. Removal is repository maintenance, not a create-complex-border task type.

If the user specifies a visual direction, record it in `User Constraints`. The user may choose direction; they may not bypass inventory comparison, safe-area design, implementation contract, or validation gates.

## Hard Gates

Do not write component render code until `packages/elements/src/border-box-N/design-brief.md` exists and passes the pre-implementation parts of the template.

The design brief is a permanent maintenance artifact, not a scratchpad. Keep it concise, usually 80-160 lines.

The brief must include:

- `User Constraints`
- `Task Type`
- `Design Goal`
- `Dashboard Story`
- `First-Read Promise`
- `Rejected Patterns`
- `Existing Border Inventory`
- `Candidate Concepts`
- `Selected Concept`
- `Geometry Difference Score`
- `Content Safe Area`
- `Responsive Model`
- `Visual Language`
- `Motion Budget`
- `Public API Contract`
- `Implementation Contract`
- `Aesthetic Gate`
- `Validation Evidence`

For `repair/redesign`, also require:

- `Failure Diagnosis`
- `Compatibility Contract`

## Design Tree

Complete the branches in this order. Each branch depends on the decisions above it.

1. Define task type and user constraints.
2. Define dashboard story: command-center hero, geo/city cockpit, operations nerve center, energy/grid monitor, financial pulse board, industrial digital twin, or abstract cyber showcase.
3. Define first-read promise: first, second, and third visual read at dashboard distance.
4. Read the inventory, pick the nearest existing border by shape family, and list do-not-repeat items.
5. Generate candidate concepts: 3 for `original`, 2 for `variant`, 3 for `repair/redesign` unless user direction is explicit. Reject candidates that match the known failed style families in `failure-taxonomy.md`, especially high-density command-console armor and split-bus trace grammar.
6. Select one concept using structure, beauty, dashboard usefulness, safe area, and distance from the nearest existing border.
7. Define geometry: outer contour, corner grammar, side logic, top/bottom rhythm, fixed modules, extension strips, and source canvas.
8. Define content safe area from actual inward reach of modules, glow, and motion. Redesign geometry if padding would squeeze dashboard content.
9. Define visual language: line hierarchy, glow hierarchy, density, color roles, and motion budget.
10. Define implementation contract: files, exports, docs, tests, inventory update, and public API.
11. Implement.
12. Validate with realistic dashboard content and multiple sizes. Record conclusions in the brief; do not commit screenshot evidence.
13. Run audits and tests.

## Naming And Motifs

Use border-structure language for concepts, metadata, docs, and comments: rail, spine, bus, dock, lattice, trace, strip, node, hatch, bracket, frame.

Avoid object-first motif names unless the user explicitly asks for them. Do not make the border's identity a crown, shield, badge, crest, portal, reactor, cockpit, gate, scanner, aperture, armor object, or similar symbol. If a risky motif appears in user constraints, redraw it as bounded, shallow, rail-connected linework and record the risk in the brief.

## Responsive Model

Default to source-coordinate design with fixed modules and clean extension strips. Use live-size geometry only as an exception, and add `Live-Size Exception` to the brief proving:

- the design is thin-line and stable when recomputed;
- no complex fixed ornament would smear or drift;
- every module's inward reach can be calculated;
- wide, tall, and small containers do not change the design identity;
- live-size geometry is simpler and more stable than slicing for this concept.

## Public API

Default to the standard border controls only:

- `color`
- `secondary-color`
- `accent-color`
- `colors`
- `glow-intensity`
- `animated`
- `paused`

Do not expose `width`, `height`, `viewBox`, slice coordinates, module names, debug overlays, or internal geometry switches. Any additional public prop must be justified in `Public API Contract`, documented, and tested.

## Validation

Run the engineering checks that match the change:

```bash
python3 skills/create-complex-border/scripts/audit_border_process.py packages/elements/src/border-box-N
python3 skills/create-complex-border/scripts/audit_border_complexity.py packages/elements/src/border-box-N/element.ts --compare packages/elements/src/border-box-*/element.ts
```

Run the relevant package tests, typically:

```bash
pnpm --filter @datav-kit/elements test
```

`audit_border_complexity.py` is a structural heuristic only. It cannot approve visual quality.

`audit_border_process.py` checks process artifacts. It cannot approve visual quality.

Manual validation is required. Use realistic dashboard content, not an empty slot. Check source-ratio, wide, tall, and small sizes. Record conclusions in `Validation Evidence`. Do not commit screenshots, `visual-review/`, or other image evidence unless the user explicitly changes this policy.

## Rework Rule

Let the failure type choose the rework level:

- Concept, silhouette, nearest-border similarity, content crowding, symbolic motif, or weak first-read failures require returning to `Candidate Concepts` or `Selected Concept`.
- Top/bottom rail disorder, unsafe inward reach, or responsive identity drift require returning to `Geometry`, `Content Safe Area`, or `Responsive Model`.
- Loud motion or poor performance requires returning to `Motion Budget`.
- Color, opacity, a single node position, docs, tests, or metadata issues may be fixed locally.

Do not rescue a failed concept by only adding ticks, changing colors, or increasing glow.

## Forward Testing

After substantial skill revisions, forward-test the skill on a realistic border task. Pass the skill and a normal user-style task to an independent executor without leaking the intended fix. The test may use the next available `border-box-N` slot if the user approves. Keep the generated component only if it passes the new brief, process audit, complexity audit, tests, and manual validation.
