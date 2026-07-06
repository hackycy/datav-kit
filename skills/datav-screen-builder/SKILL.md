---
name: datav-screen-builder
description: Build, design, implement, redesign, or fix datav-kit large-screen dashboards and data screens with @datav-kit/elements. Use when users ask for datav-kit dashboard implementation, large-screen visualization pages, data screens, 大屏, 数据大屏, 可视化大屏, 大屏设计器, layout, color, decoration, border pairing, ECharts/3D visualization states, or framework integration for datav-kit. Do not use for generic dashboards that do not use datav-kit, or for developing new datav-kit library components.
---

# Datav Screen Builder

Use this skill to deliver working large-screen dashboard UI with datav-kit Web Components. Optimize for production-ready frontend implementation: follow the host project's stack, read current public datav-kit docs, design the screen hierarchy, implement the page/component, and report validation.

This skill is for external users. Do not assume the `datav-kit` source repository exists locally. Do not rely on relative paths such as `docs/...` or `packages/...` unless the user explicitly says the current workspace is the source repository.

## Required Public Docs

Before any datav-kit implementation, read:

1. `https://hackycy.github.io/datav-kit/llms.txt`

Use it as the live navigation index. When details are needed, read the linked public Markdown page for the selected guide, component, or reference page.

Use these fallbacks:

- Read `https://hackycy.github.io/datav-kit/llms-full.txt` when global context is needed or navigation is insufficient.
- Use `https://github.com/hackycy/datav-kit` only when public docs are insufficient, the user asks for source-level confirmation, or latest implementation behavior must be verified.
- If public docs cannot be reached, try the fallback source. If no current source can be reached, state that current datav-kit APIs were not verified and avoid inventing component names, props, events, CSS variables, or parts.

## Task Routing

Classify the request before editing:

- `new-screen`: create a new large-screen page or app.
- `adapt-existing`: transform an existing page into a datav-kit large-screen dashboard.
- `visual-redesign`: improve layout, color, border/decor pairing, and visual hierarchy without rewriting data logic.
- `integration-fix`: fix datav-kit install, registration, theme import, custom element recognition, or framework integration.
- `chart-scene-build`: build or improve ECharts, 3D, map, or visual scene areas inside a datav-kit screen.
- `advisory-only`: provide plan, component selection, or copyable examples without modifying local files.

For new library components inside `datav-kit`, use a component-development workflow instead of this skill. For a complex new `border-box-N` component in this repository, hand off to the existing border creation workflow when available.

## Read References As Needed

Load only the references that match the task:

- Read `references/design-tree.md` for new screens, redesigns, layout, color, information hierarchy, border/decor pairing, or interaction design.
- Read `references/project-integration.md` for project detection, dependency installation, existing datav-kit integration, framework-specific fixes, routing, and styling-system reuse.
- Read `references/visualization-states.md` for ECharts, 3D, maps, loading/empty/error states, resize/dispose behavior, and performance budgets.
- Read `references/delivery-validation.md` before final delivery, and whenever validation strategy, summaries, anti-patterns, or example prompts matter.

## Core Workflow

1. Read current public datav-kit docs.
2. Determine task type.
3. Inspect the user project when files are available:
   - Detect framework, package manager, routing, styles, existing datav-kit usage, and existing visualization wrappers.
   - If no frontend stack is detectable, ask once. If the user has no preference, default to Vite + TypeScript + datav-kit Web Components.
4. Decide the design tree:
   - business scenario;
   - first, second, and third visual read;
   - canvas and fit behavior;
   - title-area complexity gate;
   - layout zones;
   - content density and sizing;
   - color system;
   - border/decor pairing;
   - visualization states;
   - interaction and motion budget.
5. Implement by following the existing project stack and conventions.
6. Validate with project-appropriate static checks. For any complete runnable large-screen page, also run a browser/preview check with screenshot or DOM size inspection unless impossible.
7. Final response: summarize files changed, design decisions, datav-kit components used, visualization-state handling, dependency/integration changes, and validation results.

## Defaults

Use these defaults only when the user did not specify and the project does not imply a better answer:

- Follow the existing project stack and styling approach.
- Default canvas target: `1920 x 1080`.
- Default visual mode: dark, restrained, data-first large-screen style, adjusted to the business scenario.
- Default fit behavior: use datav-kit fit-screen for full-screen fixed-canvas dashboards when current docs confirm the API.
- Default language: follow the user's request language or the existing project UI language.
- Default data: create believable mock data with units, statuses, trends, and empty/loading/error branches.
- Default title area: one lightweight symmetric decoration pair plus one centered colorized title; optionally add one weak lower divider that is not another symmetric title ornament.
- Default hierarchy: one clear first-read visual dominates; borders and decorations are third-read support, never filler.

## Concise Example Prompts

- `Use $datav-screen-builder to build an energy operations screen in this Vue project.`
- `用 $datav-screen-builder 做一个智慧城市数据大屏，跟随当前项目技术栈。`
- `Use $datav-screen-builder to redesign this monitoring page with datav-kit borders, decorations, and ECharts empty states.`
