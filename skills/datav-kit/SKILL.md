---
name: datav-kit
description: Build and refine large-screen data dashboards with datav-kit Web Components. Use for data walls, command screens, and business cockpits using dvk-* elements, including visual composition and browser verification. Not for ordinary administration interfaces.
---

# DataV Kit Large-Screen Development

Use official documentation to discover component capabilities. This skill supplies a
development workflow and design guidance; it is not a component catalog.

## 1. Read documentation first

Start with https://hackycy.github.io/datav-kit/llms.txt. Resolve its returned links against
that URL, including the `/datav-kit/` base path. Read installation and theming for a new
project, framework integration when applicable, and details for the intended components.
Read props, events, CSS variables, slots and parts from those pages before authoring them.
Reuse pages already read in this session; fetch additional pages only as needed.

Documentation coverage is not installed-package availability. Inspect the project's
dependency version. Follow its documented registration API, complete registration, then
check `customElements.get(tag)` for the components used in the screen. Resolve missing
dependencies explicitly; a replacement needs its own verified API and suitable appearance.

If the site is unavailable or a page is missing:

1. Read the corresponding `docs/` page at a verified GitHub tag or commit matching the
   dependency: `https://raw.githubusercontent.com/hackycy/datav-kit/<ref>/docs/<path>`.
   Verify the ref exists rather than assuming a version has a same-named Git tag.
2. If only `main` has the material, label it as unreleased-source documentation and verify
   compatibility against the actual dependency before using it.
3. Offline, inspect matching local documentation and package source. State remaining
   uncertainty; do not invent an API to complete the screen.

Discover the official examples page through the same index. Its previews and downloads
come from this skill's `assets/examples/` HTML files, not a separate implementation.

## 2. Establish the brief

Extract what is already known: business question, core metrics, data source and refresh,
physical screen size and resolution and viewing distance, visual identity, interactions,
and delivery framework. Ask only for missing information that materially changes the work.

For drafts with unspecified hardware, use a 1920 x 1080 canvas and state that physical
viewing-distance calibration is pending. Production delivery requires checking readability
on the actual installation.

## 3. Choose a visual direction

Read [composition guidance](references/patterns.md) for a new composition. Choose the
primary visual from the business question, then arrange supporting information and select
documented components. Examples are design references, not mandatory layouts.

- Existing design or local change: preserve its direction and implement the change.
- New screen with a clear brief or reference: state the direction and implement it.
- New screen with materially ambiguous styling: offer a small set of different directions
  and resolve the choice before investing in the full composition.

Directions should differ in layout, data visual, typography and decoration density, as
well as palette. Use [design checks](references/design-rules.md) to evaluate the result.
Follow the project's existing decision-record convention; create `design/` artifacts only
when persistent design history benefits the task.

## 4. Implement

Coordinate backgrounds, text, status, data series and component accents through one scoped
project theme. The official theming guide owns CSS contracts. The editable
[project theme starter](assets/themes/theme-template.css) demonstrates a light palette.

Use [screen tokens](assets/tokens.css) as adjustable defaults, with
[calibration guidance](references/tokens.md). Read [chart guidance](references/charts.md)
when adding charts; `assets/charts/` contains optional ECharts starting points. Reuse an
existing project chart library when available.

For standalone delivery, adapt a single `assets/examples/*.html`: inline application
styles, scripts and required scene data, pin CDN imports, and test opening the file directly.
`assets/minimal-example.html` is the small registration-and-scaling starting point.
Verify example APIs against project dependencies before adapting them.

Represent loading, empty, failed and stale data deliberately. Retained previous values
need an update time and stale status. Keep units, totals and time ranges consistent.

## 5. Verify in a browser

Test the real delivery path at target resolution and a smaller preview viewport. Check
registration, dependency errors, chart sizes, text fit, safe content areas, interactions,
keyboard focus, data states and reduced motion. Inspect an actual screenshot for hierarchy;
passing DOM checks alone does not establish visual quality.

For 3D, inspect rendered pixels and framing, exercise selection and camera controls,
verify pause/reduced motion, and test the non-WebGL presentation with the same business data.

Report the runnable artifact, verification performed and remaining constraints. Fix delivery
defects in the project. Revise this skill only when a finding demonstrates a reusable problem
in the guidance, rather than requiring skill changes on every task.
