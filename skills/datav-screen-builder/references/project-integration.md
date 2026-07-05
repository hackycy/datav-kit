# Project Integration

Use this reference when modifying a project, fixing integration, or choosing implementation shape.

## Detect The Host Project

Inspect available files before choosing an approach:

- package manager: lockfile first, then `packageManager`;
- framework: dependencies, scripts, source folders, route files, config files;
- styling: CSS Modules, Sass/Less, Tailwind, UnoCSS, styled-components, plain CSS, design tokens;
- routing/page structure: existing route conventions, page directories, app entry, layout shell;
- datav-kit usage: package dependencies, imports, registration calls, theme imports, and `dvk-*` tags;
- visualization wrappers: chart components, hooks, composables, `BaseChart`, `useECharts`, `ThreeScene`, `MapView`, loading/empty components.

Follow the project stack. If no frontend stack is detectable, ask once. If the user has no preference, create or describe a Vite + TypeScript implementation with datav-kit Web Components.

## Dependency And Package Manager Rules

Use the existing package manager:

- `pnpm-lock.yaml` -> pnpm
- `yarn.lock` -> yarn
- `package-lock.json` -> npm
- `bun.lock` or `bun.lockb` -> bun
- `packageManager` field -> follow it when no lockfile exists

Before installing, check whether datav-kit is already integrated. If `@datav-kit/elements`, `@datav-kit/themes`, registration code, theme imports, or `dvk-*` tags already exist, reuse the current integration and avoid duplicate install/register work.

Install or update dependencies only when needed and after reading current installation docs. Usually this means `@datav-kit/elements` and optionally `@datav-kit/themes`, but trust the current docs over memory.

## Datav-Kit Integration

Read current installation and framework integration docs before adding code.

Rules:

- Reuse the existing registration strategy. Do not mix full registration with repeated per-element registration unless the project already does so deliberately.
- Reuse existing theme imports and CSS variable strategy.
- Add only the elements needed for the page when the project uses on-demand registration.
- Do not assume SSR-specific behavior. This skill targets client-rendered large-screen projects. If the project is clearly SSR-based, only give a basic client-boundary reminder and follow existing project patterns.
- Do not invent component APIs. Confirm tags, attributes, properties, events, parts, and CSS variables from public docs.

## Page And Route Placement

Prefer minimal, project-shaped changes:

- If the project has clear page/route conventions, create the large-screen page there and wire a straightforward route when safe.
- If routing is unclear, create the page/component and report where it lives instead of rewriting navigation.
- If the project is a simple single-page demo and the user asked to build the screen, updating the main entry is acceptable.
- Do not replace unrelated pages or global layouts unless requested.

## Styling Rules

Follow existing styling:

- Use existing tokens, CSS variables, breakpoints, utilities, naming, and file organization.
- If no design system exists, create local screen-scoped CSS variables.
- Avoid global style pollution. Scope styles to the screen root unless the project convention says otherwise.
- Keep stable dimensions for dashboard panels, charts, toolbars, counters, and visual cells.
- Do not scale font size directly with viewport width. Use fit-screen/canvas scaling or explicit responsive breakpoints instead.

## Advisory Or Copyable Example Mode

When the user asks only for an example, snippet, or plan, do not edit local files. Provide a complete, copyable implementation shape based on current docs, including install/register notes, layout, styles, mock data, and visualization states.
