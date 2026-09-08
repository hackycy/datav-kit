# datav-kit-skill Implementation Plan

## Source Decisions

- [`map.md`](map.md): destination, scope, terminology, and the resolved route through the effort.
- [`spec.md`](spec.md): locked deliverable tree, per-file contracts, workflow gates, verification expectations, and handoff checklist.
- [`issues/01-design-conventions-baseline.md`](issues/01-design-conventions-baseline.md): cited industry facts and self-defined thresholds.
- [`issues/02-echarts-theming.md`](issues/02-echarts-theming.md): ECharts token bridge, theme switching, renderer, and state rules.
- [`issues/03-composition-patterns.md`](issues/03-composition-patterns.md): reusable pattern inventory and Demo exclusions.
- [`issues/04-design-rules-and-rubric.md`](issues/04-design-rules-and-rubric.md): six design-rule groups and rubric derivation.
- [`issues/05-design-tokens.md`](issues/05-design-tokens.md): screen token names, scope, values, and calibration.
- [`issues/06-customization-boundary.md`](issues/06-customization-boundary.md): customization layers, deviation policy, and prototype return boundary.
- [`issues/07-grid-and-degradation.md`](issues/07-grid-and-degradation.md): canvas, grid, scaling, and degradation policy.
- [`issues/08-prototype-templates.md`](issues/08-prototype-templates.md): four prototype skeletons and file/runtime constraints.
- [`issues/09-knowledge-base-routing.md`](issues/09-knowledge-base-routing.md): three-layer knowledge base, routing path, and availability rules.
- [`issues/10-echarts-templates.md`](issues/10-echarts-templates.md): chart guidance split and seven-template contract.
- [`issues/11-workflow-checkpoints.md`](issues/11-workflow-checkpoints.md): six-step workflow, artifacts, and hard gates.
- [`issues/12-skill-file-tree.md`](issues/12-skill-file-tree.md): skill structure, progressive disclosure, and release checklist.
- [`issues/13-spec-assembly.md`](issues/13-spec-assembly.md): spec lock and implementation handoff.
- [`issues/14-title-bar-adjudication.md`](issues/14-title-bar-adjudication.md): title feature detection and P3 fallback.
- [`issues/15-project-theme-generation.md`](issues/15-project-theme-generation.md): project theme template and contrast utility.
- [`issues/16-one-theme-per-screen.md`](issues/16-one-theme-per-screen.md): one-theme-per-screen constraint.
- [`issues/17-minimal-example.md`](issues/17-minimal-example.md): minimal example boundary.
- [`issues/18-border-box-selection.md`](issues/18-border-box-selection.md): P6 capability-first border-box matrix and fallback chains.
- [`assets/r1-design-conventions.md`](assets/r1-design-conventions.md), [`assets/r2-echarts.md`](assets/r2-echarts.md), and [`assets/r3-composition-patterns.md`](assets/r3-composition-patterns.md): local fact and extraction baselines used by the decisions.
- [`../../docs/reference/architecture-contracts.md`](../../docs/reference/architecture-contracts.md): content-area, theme precedence, and component contracts.
- [`../../CLAUDE.md`](../../CLAUDE.md): repository working constraints.

## Outcome

The repository contains a publishable `skills/datav-kit/` skill that routes large-screen dashboard work through the locked design rules and knowledge base, provides four runnable prototypes, seven reusable ECharts templates, a project-theme and contrast utility, and a minimal example. The artifacts use real datav-kit elements, remain usable from a `file://` URL, expose deterministic availability fallbacks, and can be listed by the Skills CLI without changing the existing component library.

## Non-Negotiable Rules

- The locked `spec.md` and resolved decisions are the only product contract; the runbook is the only execution-state source.
- The screen token layer uses `--dvk-screen-*` under `.dvk-screen`; colors come only from the library/theme `--dvk-color-*` values. No second color source is introduced.
- Knowledge-base details are online-first, fetched on demand, and fall back to the documented `main` raw URL with an explicit not-yet-published warning. Runtime availability is checked with `customElements.get(tag)`.
- Border-box selection follows P6's capability-first matrix. `contentRect`, default-slot content, one theme per screen, and the `title-4` prohibition remain intact.
- Prototypes are plain single-file HTML with real component imports; no component library or chart wrapper is added to the repository.
- Unrelated source code, existing demos, and user worktree changes remain untouched. No remote push is part of this effort.

## Gate Overview

| Gate | Name | Unlock condition | Outcome |
| --- | --- | --- | --- |
| G0 | Token and design-rule foundation | Start | Screen tokens and the six-group design contract exist. |
| G1 | Knowledge-base routing | G0 Exit conditions all satisfied | Pattern and component references provide the canonical route and availability model. |
| G2 | Skill entrypoint | G1 Exit conditions all satisfied | `SKILL.md` routes the workflow and enforces the hard gates. |
| G3 | Prototype skeletons | G2 Exit conditions all satisfied | Four real-component, theme-switchable prototype files run from `file://`. |
| G4 | Chart guidance and templates | G3 Exit conditions all satisfied | Library-neutral guidance and seven ECharts reference templates exist. |
| G5 | Project theme and contrast utility | G4 Exit conditions all satisfied | Theme generation scaffold and four-group contrast checker are usable. |
| G6 | Minimal example and release acceptance | G5 Exit conditions all satisfied | Minimal example, README, install listing, repository checks, and Leo handoff are complete. |

## G0: Token and Design-Rule Foundation

### Purpose

Establish the stable screen token vocabulary and the mechanical design/rubric rules before any route or visual artifact depends on them.

### Inputs

- `CLAUDE.md`
- `.scratch/datav-kit-skill/map.md`
- `.scratch/datav-kit-skill/spec.md` sections 1, 3.3, 3.6, 3.8, and 5
- `.scratch/datav-kit-skill/issues/01-design-conventions-baseline.md`
- `.scratch/datav-kit-skill/issues/04-design-rules-and-rubric.md`
- `.scratch/datav-kit-skill/issues/05-design-tokens.md`
- `.scratch/datav-kit-skill/issues/07-grid-and-degradation.md`
- `.scratch/datav-kit-skill/issues/15-project-theme-generation.md`

### Objective

Create `skills/datav-kit/assets/tokens.css`, `skills/datav-kit/references/tokens.md`, and `skills/datav-kit/references/design-rules.md` so every screen token, redline, threshold, and source attribution in the locked spec is represented once and is mechanically checkable where specified.

### Scope boundary

This Gate may add or revise only the three foundation files under `skills/datav-kit/`. Routing, prototypes, charts, themes, examples, and README content belong to later Gates.

### Constraints

- Declare screen tokens on `.dvk-screen`, never `:root`.
- Do not declare new color tokens; reference `--dvk-color-*` only.
- Preserve the five token groups, calibrated type formula, six design-rule groups, accessibility cross-rules, one-theme-per-screen rule, and redline/advisory-value distinction.
- Record cited and self-defined thresholds with their source level.

### Slice policy

1. Write `assets/tokens.css` as the single reference implementation of the five token groups.
2. Write `references/tokens.md` as the matching documentation and calibration contract.
3. Write `references/design-rules.md` as the six-group rule set and derived rubric contract.

### Verification

#### Directed

- Compare every token name and default value against `spec.md` section 5; verify no color declaration is introduced in either token file.
- Verify the design rules contain all six groups, the accessibility cross-rules, the redline/advisory-value labels, and the no-rounding contrast rule.
- Verify the token scope and priority statements are `.dvk-screen` and project override > skill default > component fallback.

#### Repository

1. `pnpm lint` after all three foundation slices.
2. `git diff --check` before closing the Gate.

#### Manual acceptance

- 无

### Evidence rule

The token-name/value comparison, rule-group checklist, `pnpm lint`, and `git diff --check` must all be recorded before each Exit condition is considered satisfied.

### Stop conditions

- A cited threshold or token value conflicts between the map, issue decisions, and spec.
- A requested color or screen token cannot be represented without creating a second color source.
- Repository lint exposes a pre-existing failure whose ownership cannot be separated from this Gate.

### Rollback

Revert only the three foundation files from this Gate's isolated change boundary; preserve all unrelated worktree changes.

### Exit conditions

1. `assets/tokens.css` contains the complete five-group `--dvk-screen-*` reference implementation under `.dvk-screen`.
2. `references/tokens.md` and `assets/tokens.css` agree on names, values, scope, precedence, and calibration formula.
3. `references/design-rules.md` contains the six groups, accessibility cross-rules, thresholds, source labels, and rubric derivation without a second color source.
4. Directed checks, `pnpm lint`, and `git diff --check` provide clean evidence.

## G1: Knowledge-Base Routing

### Purpose

Turn the resolved component and composition decisions into the canonical knowledge-base route that later skill instructions and prototypes can consume.

### Inputs

- `.scratch/datav-kit-skill/spec.md` sections 3.4 and 3.5
- `.scratch/datav-kit-skill/issues/03-composition-patterns.md`
- `.scratch/datav-kit-skill/issues/09-knowledge-base-routing.md`
- `.scratch/datav-kit-skill/issues/14-title-bar-adjudication.md`
- `.scratch/datav-kit-skill/issues/18-border-box-selection.md`
- `.scratch/datav-kit-skill/assets/r3-composition-patterns.md`
- `docs/reference/architecture-contracts.md`
- The local component documentation referenced by the resolved issues

### Objective

Create `skills/datav-kit/references/patterns.md` and `skills/datav-kit/references/components.md` with 19 patterns, the complete P6 role/fallback matrix, component capability fields, publication status, online-detail routing, and the main-branch fallback warning.

### Scope boundary

This Gate may add or revise only `references/patterns.md` and `references/components.md`. It does not create the skill entrypoint, charts, prototypes, or implementation code.

### Constraints

- P6 is the sole operational border-box selection matrix; do not copy the matrix into a second reference authority.
- Preserve `surface → scene role → motion semantics → visual proximity`, fixed fallback chains, `contentRect`, default-slot title handling, and `customElements.get(tag)` checks.
- Mark border-box 1–15 as published, border-box-16 as main-only, and `title-4` as nonexistent and forbidden.
- Component details are online-first; a raw `main` fallback must be labelled as possibly unpublished.

### Slice policy

1. Write the 19-pattern route table, including P6 and its fixed matrix, in `references/patterns.md`.
2. Write the component availability/capability table and fetch/fallback protocol in `references/components.md`.

### Verification

#### Directed

- Check that P1–P19 are present and each has purpose, construction, parameters, grid position, replacement options, and cautions.
- Compare P6 role entries and fallback chains byte-for-byte in meaning with the locked snapshot in `spec.md` and decision ticket 18.
- Check component capability fields for `background-color`, `animated/paused`, `auto-height`, default `glow-intensity`, content-area source, and publication state.
- Check that no pattern or component entry references `title-4` as usable.

#### Repository

1. `pnpm lint` after both reference slices.
2. `git diff --check` before closing the Gate.

#### Manual acceptance

- 无

### Evidence rule

The pattern-count check, P6 matrix comparison, capability/publication checklist, `pnpm lint`, and `git diff --check` jointly prove the reference contract.

### Stop conditions

- A component property or publication fact cannot be established from the resolved local facts or the documented online/fallback source.
- The P6 matrix would need a new product decision or a change to a resolved ticket.
- Online detail and the required fallback source disagree on a prop, event, or part.

### Rollback

Revert only the two reference files from this Gate's isolated change boundary.

### Exit conditions

1. The 19-pattern route table is complete and routes `brief → template → pattern → component`.
2. P6 contains the locked role entries, fallback chains, surface/HUD boundary, motion rule, `contentRect` rule, and default-slot title rule.
3. The component table contains the runtime availability method, published/main-only/nonexistent statuses, capability fields, and documented online fallback.
4. Directed checks, `pnpm lint`, and `git diff --check` provide clean evidence.

## G2: Skill Entrypoint

### Purpose

Expose the route and workflow as the model-invoked skill contract without binding it to an implementation Gate.

### Inputs

- `.scratch/datav-kit-skill/spec.md` sections 1, 3.1, 3.3–3.6, and 4
- `skills/datav-kit/references/design-rules.md`
- `skills/datav-kit/references/patterns.md`
- `skills/datav-kit/references/components.md`
- `skills/datav-kit/references/tokens.md`
- `skills/datav-kit/assets/tokens.css`
- `.scratch/datav-kit-skill/issues/06-customization-boundary.md`
- `.scratch/datav-kit-skill/issues/11-workflow-checkpoints.md`
- `.scratch/datav-kit-skill/issues/12-skill-file-tree.md`
- `.scratch/datav-kit-skill/issues/14-title-bar-adjudication.md`

### Objective

Create `skills/datav-kit/SKILL.md` (no more than 250 lines) with the locked description, applicability boundary, runtime preflight, six-step workflow, five hard gates, seven brief questions, four redline classes, and progressive-disclosure references.

### Scope boundary

This Gate may add or revise only `skills/datav-kit/SKILL.md`. README, assets, and project implementation guidance belong to later Gates.

### Constraints

- Keep body guidance in English while allowing Chinese business copy; do not set `disable-model-invocation`.
- Do not add ordinary-backend guidance, component-library wrappers, or a second color system.
- Keep the workflow and hard-gate language aligned with the resolved prototype-return and deviation rules.
- The entrypoint may reference workflow concepts but must not embed the fixed Goal prompt or any execution-state ledger.

### Slice policy

1. Write the front matter/description and applicability/preflight sections.
2. Write the workflow, hard gates, brief questions, redline quick reference, and reference index.
3. Check the final file length and cross-links.

### Verification

#### Directed

- Verify the exact or semantically equivalent description from the spec.
- Verify all six workflow steps have their artifacts/exit conditions, all five hard gates are present, and the seven brief questions are complete.
- Verify the four redline classes and runtime `customElements.get(tag)` preflight are present.

#### Repository

1. `wc -l skills/datav-kit/SKILL.md` and confirm the result is at most 250.
2. `pnpm lint` after the entrypoint slices.
3. `git diff --check` before closing the Gate.

#### Manual acceptance

- 无

### Evidence rule

The section checklist, line-count output, `pnpm lint`, and `git diff --check` must be recorded for the four Exit conditions.

### Stop conditions

- The entrypoint cannot fit the required workflow and gates within 250 lines without dropping a locked contract.
- A reference path or applicability boundary conflicts with G0/G1 outputs.
- The implementation would require implicit product or acceptance policy decisions.

### Rollback

Revert only `skills/datav-kit/SKILL.md` from this Gate's isolated change boundary.

### Exit conditions

1. `SKILL.md` is no longer than 250 lines and contains the locked description and applicability boundary.
2. The six-step workflow, five hard gates, seven brief questions, four redline classes, and runtime preflight are complete.
3. Progressive-disclosure links resolve to the G0/G1 artifacts without duplicating their contracts.
4. Directed checks, `pnpm lint`, and `git diff --check` provide clean evidence.

## G3: Prototype Skeletons

### Purpose

Provide the four fixed visual-contract skeletons as runnable, real-component single-file HTML artifacts.

### Inputs

- `.scratch/datav-kit-skill/spec.md` sections 3.10, 4.4, and 5
- `.scratch/datav-kit-skill/issues/08-prototype-templates.md`
- `.scratch/datav-kit-skill/issues/14-title-bar-adjudication.md`
- `.scratch/datav-kit-skill/issues/16-one-theme-per-screen.md`
- `skills/datav-kit/assets/tokens.css`
- `skills/datav-kit/references/patterns.md`
- `skills/datav-kit/references/components.md`

### Objective

Create `assets/prototypes/t1-three-column.html`, `t2-two-column.html`, `t3-single-column.html`, and `t4-kpi-led.html` as file-openable prototypes with the specified skeleton rows/columns, pattern references, real datav-kit imports, minimal chart slots, placeholder data, theme switching, and title feature detection.

### Scope boundary

This Gate may add or revise only the four prototype HTML files. It may not alter the token/reference files or add chart/template modules.

### Constraints

- Use plain HTML and native JavaScript; map `@datav-kit/elements@0.0.5` to jsDelivr `+esm` first and esm.sh as the documented backup.
- Include `assets/tokens.css`, one theme per screen, 1920×1080 `contain` layout, 12-column/24px-gutter/48px-margin guidance, and flowing `minmax(0,1fr)` rows.
- Use `customElements.get('dvk-title-1')` feature detection; use P3 hand-built rails when unavailable; never reference `title-4`.
- Keep chart slots non-empty, use real components, put panel headings in the default slot, and expose the three permission tiers.

### Slice policy

1. Implement and smoke-check T1.
2. Implement and smoke-check T2.
3. Implement and smoke-check T3.
4. Implement and smoke-check T4.

### Verification

#### Directed

- For each file, verify the four required declaration blocks: skeleton, block list with P references, component construction, and inline placeholder-data shape.
- Open each file from `file://` after its slice, wait for custom-element registration, inspect the browser console, switch themes, and confirm the chart slot and title fallback render.
- Check no prototype mixes theme classes, relies on a missing title component, or uses fixed rows that can clip content.

#### Repository

1. `pnpm lint` after all four prototype slices.
2. `git diff --check` before closing the Gate.

#### Manual acceptance

- 无

### Evidence rule

Each prototype's directed `file://` smoke evidence plus the aggregate lint and diff checks proves the corresponding exits; a console error keeps that prototype slice open.

### Stop conditions

- CDN import, custom-element registration, or ECharts loading fails and cannot be resolved without changing the locked dependency/source policy.
- A skeleton change would alter rows, columns, main-view position, top-bar shape, or block count beyond the prototype contract.
- A browser failure indicates a component contract not covered by the local or fallback documentation.

### Rollback

Revert only the prototype file currently being changed; completed prototype files remain isolated and untouched.

### Exit conditions

1. All four prototype files exist and match their locked skeleton, blocks, components, and placeholder-data shapes.
2. Each file opens from `file://` with no console errors, renders its real components/chart slot, and supports the specified theme/title fallback behavior.
3. The prototypes preserve the geometry, default-slot, one-theme, and no-`title-4` constraints.
4. Directed browser evidence, `pnpm lint`, and `git diff --check` provide clean evidence.

## G4: Chart Guidance and Templates

### Purpose

Make chart selection and ECharts usage reproducible without turning ECharts into a datav-kit component abstraction.

### Inputs

- `.scratch/datav-kit-skill/spec.md` sections 3.7 and 3.9
- `.scratch/datav-kit-skill/issues/02-echarts-theming.md`
- `.scratch/datav-kit-skill/issues/10-echarts-templates.md`
- `.scratch/datav-kit-skill/assets/r2-echarts.md`
- `skills/datav-kit/references/tokens.md`
- `skills/datav-kit/references/design-rules.md`
- `skills/datav-kit/assets/prototypes/`

### Objective

Create `references/charts.md` and the seven modules `assets/charts/line-area.js`, `bar-rank.js`, `pie-doughnut.js`, `scatter.js`, `gauge.js`, `radar.js`, and `heatmap.js`, each exporting its named `createXxx(el, data, tokens)` factory and implementing the locked six-piece template contract.

### Scope boundary

This Gate may add or revise only `references/charts.md` and the seven chart modules. It may not wrap charts as web components or add map templates.

### Constraints

- Bridge tokens through `getComputedStyle` and `init(dom, themeObject)`; switch themes with `setTheme(themeObject)` and do not re-init.
- Keep `--dvk-motion-duration` out of chart animation mapping; prefer SVG renderer under screen scaling and retain the documented Canvas exception.
- Include explicit grid bounds, ResizeObserver/rAF resize handling, loading/empty/failure/stale states, and performance guards.
- Document what is copied unchanged versus what must be changed for data, axes, colors, and chart type; charts fill `::part(content)` without extra DOM padding.

### Slice policy

1. Write the library-neutral matrix, bridge contract, anti-patterns, and copy/adjust guidance in `references/charts.md`.
2. Implement and syntax-check each chart factory as its own slice, in the file order listed in the Objective.

### Verification

#### Directed

- Check the matrix covers time series, part-to-whole, ranking, distribution, density, geographic, relationship, single-value, multidimensional, and hierarchical data.
- For every factory, inspect the six pieces: token injection, explicit option/grid skeleton, ResizeObserver/rAF resize, `setTheme`, four states, and performance guard.
- Verify each module exports the required factory and does not include map/geoJSON assumptions.

#### Repository

1. `for f in skills/datav-kit/assets/charts/*.js; do node --check "$f"; done` after all module slices.
2. `pnpm lint` after the guidance and module slices.
3. `git diff --check` before closing the Gate.

#### Manual acceptance

- 无

### Evidence rule

The matrix checklist, per-module six-piece inspection, `node --check`, lint, and diff evidence must cover every Exit condition.

### Stop conditions

- The installed ECharts version or browser runtime contradicts the locked `setTheme`, renderer, or resize behavior.
- A chart requires a new wrapper component, map asset, or undocumented interaction policy.
- A four-state or performance guard cannot be represented without weakening the design rules.

### Rollback

Revert the individual chart module or `references/charts.md` slice; do not roll back prototypes or foundation files.

### Exit conditions

1. `references/charts.md` contains the complete library-neutral matrix, bridge, anti-patterns, and copy/adjust rules.
2. All seven factories exist with the required export and six-piece contract.
3. All seven modules pass `node --check`; repository lint and diff checks are clean.
4. No map template, chart wrapper component, or second token/color source was introduced.

## G5: Project Theme and Contrast Utility

### Purpose

Provide the controlled project-theme entrypoint and a deterministic contrast check without mixing screen layout tokens into themes.

### Inputs

- `.scratch/datav-kit-skill/spec.md` sections 3.12 and 3.13
- `.scratch/datav-kit-skill/issues/15-project-theme-generation.md`
- `.scratch/datav-kit-skill/issues/06-customization-boundary.md`
- `.scratch/datav-kit-skill/issues/16-one-theme-per-screen.md`
- `skills/datav-kit/references/design-rules.md`
- `skills/datav-kit/references/tokens.md`

### Objective

Create `assets/themes/theme-template.css` with the complete eight-variable project-theme skeleton and `assets/tools/contrast-check.js` as a zero-dependency checker that reports ratio and PASS/FAIL for the four locked object groups without rounding.

### Scope boundary

This Gate may add or revise only the theme template and contrast utility. It may not add theme-specific chart or prototype code, alter library themes, or introduce new CSS colors/tokens.

### Constraints

- Declare only the eight `--dvk-*` theme variables; keep `--dvk-screen-*` out of the theme.
- Include the brand-color derivation starting points, dark-surface/no-pure-black guidance, complete declaration requirement, and coexistence-without-partial-inheritance rule.
- Check text/surface, graphic/surface, decorative-line/surface, and adjacent data markers against the non-rounded lower and advisory upper thresholds.

### Slice policy

1. Write and inspect `assets/themes/theme-template.css`.
2. Implement `assets/tools/contrast-check.js` and exercise each of the four object groups with representative inputs.

### Verification

#### Directed

- Count and inspect the eight theme variables; verify no screen token or chart/template code appears.
- Run the checker with representative passing and failing pairs for all four groups; confirm raw ratios and PASS/FAIL output are not rounded before comparison.
- Check the checker has no runtime dependency outside the standard Node.js environment.

#### Repository

1. `node --check skills/datav-kit/assets/tools/contrast-check.js` after the utility slice.
2. `pnpm lint` after both slices.
3. `git diff --check` before closing the Gate.

#### Manual acceptance

- 无

### Evidence rule

The eight-variable inspection, four-group pass/fail run, syntax check, lint, and diff evidence prove the exits.

### Stop conditions

- A requested theme value requires a second color source or partial inheritance.
- Contrast outcomes depend on rounded values or an unavailable color parser that would change the locked threshold semantics.
- A project-specific visual request would change the screen token contract.

### Rollback

Revert only the theme template or contrast utility file from its isolated slice.

### Exit conditions

1. The theme template declares the complete eight-variable project contract and its derivation/usage notes.
2. The contrast utility checks all four groups, emits raw ratios and PASS/FAIL, and uses no external dependency or rounding.
3. Syntax, lint, and diff checks are clean, with evidence for both passing and failing fixtures.

## G6: Minimal Example and Release Acceptance

### Purpose

Assemble the end-to-end entrypoint, publish the human-facing README, and prove the complete skill can be installed, opened, and reviewed against the locked rubric.

### Inputs

- `.scratch/datav-kit-skill/spec.md` sections 0, 2, 3.2, 3.11, 6, and 7
- `.scratch/datav-kit-skill/issues/11-workflow-checkpoints.md`
- `.scratch/datav-kit-skill/issues/12-skill-file-tree.md`
- `.scratch/datav-kit-skill/issues/13-spec-assembly.md`
- `.scratch/datav-kit-skill/issues/17-minimal-example.md`
- All completed files from G0–G5

### Objective

Create `skills/datav-kit/assets/minimal-example.html` and `skills/datav-kit/README.md`, then verify the complete artifact tree, Skills CLI listing, repository checks, browser smoke behavior, and two newly written real dashboard cases ready for Leo's review.

### Scope boundary

This Gate may add or revise only the minimal example and README, plus test/run evidence. It may not revise resolved design decisions, existing component code, existing demos, or add a full reference dashboard.

### Constraints

- The minimal example is one screen with 2–3 panels and one chart; it does not become a fifth full prototype.
- README is Chinese and must state the published/main-only/nonexistent component coverage, installation command, scope, minimal-example entrypoint, design choices, progressive-disclosure reading guide, and the six-item release checklist.
- All explicit skill paths from the locked spec must exist; the final artifact must remain compatible with the Skills CLI and file-openable browser flow.
- The two acceptance cases are newly written, not either existing repository Demo, and Leo evaluates them from the rules-derived checklist without a total score.

### Slice policy

1. Implement and smoke-check `assets/minimal-example.html`.
2. Write and cross-check `README.md` against the final tree and coverage rules.
3. Run the complete repository/CLI/browser verification set.
4. Prepare the two real dashboard cases and the Leo manual-acceptance handoff; do not alter the skill after handoff without a new Goal.

### Verification

#### Directed

- Open the minimal example from `file://`; confirm a complete visual result within the stated five-minute use case, 2–3 panels, one chart, theme behavior, and no console errors.
- Open all four prototypes and the minimal example again after the final tree is assembled; confirm no cross-file path or CDN regressions.
- Check README coverage, installation command, entrypoint, progressive-disclosure list, and six release-checklist items against the locked spec.
- Verify the two new dashboard cases contain the six workflow artifacts and that each self-check is mechanically derived from the design-rule entries, including a hardcoded-value check.

#### Repository

1. `npx skills add hackycy/datav-kit --list` after the complete tree is present.
2. `pnpm lint`.
3. `pnpm typecheck`.
4. `pnpm test`.
5. `pnpm build`.
6. `git diff --check`.

#### Manual acceptance

- Leo reviews the two newly written real dashboard cases and the opened minimal example/prototypes using the rules-derived checklist. The handoff entrypoint is the local case directory and its `design/review.md`; the minimum checklist is every redline item plus each advisory-value deviation, with no total score. Leo replies exactly `通过` or `未通过：<case/path> <item> <evidence>`.

### Evidence rule

The file-open smoke logs, README/tree checklist, Skills CLI output, all repository command outputs, and Leo's explicit review response must be appended to the runbook before the effort can be marked complete. The manual response is the only human acceptance evidence and is not inferred from automated checks.

### Stop conditions

- Any required CDN/package source is unavailable or the Skills CLI cannot list the skill.
- Any prototype/example has a browser console error, missing component, clipped content, or broken theme/title fallback.
- Repository checks fail without a fix that stays inside this Gate's scope.
- Leo has not supplied the explicit acceptance response; the Goal ends at handoff and does not change the Gate state.

### Rollback

Revert only the minimal example and README files from this Gate's isolated change boundary. Preserve all evidence and the completed earlier Gates.

### Exit conditions

1. The minimal example and README satisfy their locked content/runtime contracts.
2. The complete explicit skill tree is present, and `npx skills add hackycy/datav-kit --list` lists `datav-kit`.
3. All four prototypes and the minimal example open from `file://` without console errors and show the intended components/charts/theme behavior.
4. `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and `git diff --check` complete successfully.
5. Two new real dashboard cases have complete workflow artifacts and Leo has provided the explicit acceptance response.

## Definition Of Done

- Every path enumerated in `spec.md` section 2 exists under `skills/datav-kit/` and follows its per-file contract.
- G0–G5 automated and directed evidence is complete; G6 browser, CLI, repository, and Leo evidence is recorded.
- The P6 border-box matrix, runtime availability/fallback behavior, token separation, title fallback, four-state chart behavior, and contrast semantics are consistent across the artifacts.
- The skill is install-listable, file-openable, and documented as large-screen-only with the correct published/main-only coverage.
- Leo's two-case review is explicit; any findings are written as skill revision items in the review artifacts rather than silently ignored.

## Explicitly Out Of Scope

- Border-box/component implementation changes, `title-4`, and repairs to the online documentation/site.
- Offline knowledge-base packaging, a full reference dashboard, multi-language skill variants, and CI automation for the skill artifacts.
- Ordinary backend-page component guidance, map/geoJSON chart templates, and the technical details of physical display seam compensation.
- Existing repository Demo files as acceptance baselines.
