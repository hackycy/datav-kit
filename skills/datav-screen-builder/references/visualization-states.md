# Visualization States

Use this reference for all data display regions: ECharts, 3D, maps, tables, lists, counters, KPI groups, timelines, topology views, loading/empty/error handling, resize, cleanup, and performance.

## Library Selection

Follow this order:

1. Use the user's specified library or wrapper.
2. Reuse existing project dependencies and wrappers.
3. If the project already has a chart/3D/map stack, do not add a competing stack for the same purpose.
4. If no chart library exists and common charts are needed, ECharts is a reasonable default after checking current project constraints.
5. If true 3D is needed and no 3D stack exists, use Three.js or the project's framework-specific established choice.

Search for existing code before adding new wrappers:

- ECharts: `Chart`, `EChart`, `BaseChart`, `useECharts`, `useChart`, `chartOptions`.
- 3D: `ThreeScene`, `useThree`, `Scene`, `Renderer`, `MapView`, `Globe`.
- Data state components: `Loading`, `Spinner`, `Skeleton`, `Empty`, `NoData`, `ErrorState`, `Result`, `Retry`, `Alert`.

## Required Data States

Every meaningful data display region must implement four states before delivery:

- `loading`: show a deliberate loading treatment that fits the large-screen style.
- `data`: show believable content with units, timestamps, status levels, and trend direction where relevant.
- `empty`: show a designed no-data state when arrays are empty, values are null, filters remove all rows, map layers have no features, or chart series have no points.
- `error`: show a readable failure state with concise cause/retry guidance when data cannot be loaded or rendered.

This applies to ECharts, 3D scenes, maps, tables, lists, counters, KPI groups, timelines, rankings, alert feeds, topology diagrams, and custom SVG/canvas visualizations. Do not treat only the happy-path data state as complete.

Use project-provided state components first. If none exist, create a small screen-scoped state view that matches the panel style. For datav-kit screens, check current docs for documented loading components such as `dvk-loading-orbit` or `dvk-loading-energy` and prefer them when they fit the panel style. Do not invent loading tags or props.

Empty and error states must occupy the same stable panel/chart area as the data state so the layout does not collapse, resize, or leave a decorative border around blank space.

## ECharts Rules

When implementing or modifying ECharts:

- Ensure the chart container has stable non-zero width and height.
- Reuse project wrappers before calling `echarts.init` directly.
- Initialize after the container is mounted and sized.
- Resize on window changes and, when possible, through `ResizeObserver` or the project wrapper.
- Dispose instances on unmount or route teardown.
- Show loading with project UI or ECharts `showLoading`; keep the panel visually intentional.
- Show empty state when all series are empty, filtered out, hidden, null, or zero-length. Do not render empty axes, legends, grids, or a blank border box as the empty state.
- Show error state with readable text and retry guidance when appropriate.
- Derive palette from the screen CSS variables or design tokens.
- Reduce visual noise: controlled grid lines, readable labels, sparse legends, and purposeful highlights.
- Limit chart animation in dense screens. Avoid frequent full reinitialization on data refresh.

## 3D Rules

Use 3D only when it supports a true main visual: spatial topology, digital twin, map/globe, equipment scene, flow network, or domain-specific visual focus.

Rules:

- Prefer existing Three.js, React Three Fiber, Cesium, Mapbox, Babylon, or project-specific wrappers.
- Keep the 3D scene as a first-read focal area when used.
- Provide loading, empty, error, and WebGL-unavailable states.
- Use stable container size, initial camera framing, resize handling, and cleanup/dispose.
- Limit lights, particles, post-processing, model size, and draw calls.
- Pause or reduce animation when hidden when the project has such infrastructure.
- Respect reduced-motion settings when available.
- If no real model/map data exists, use abstract geometry, topology nodes, or replaceable region shapes instead of pretending real assets exist.
- If scene data is empty, render an explicit empty state overlay or placeholder scene. Do not leave an empty WebGL canvas or blank framed panel.

## Maps And Geographic Screens

Confirm data and licensing before using real map tiles or geographic services. If unavailable, use abstract topology, region silhouettes, route lines, or placeholder geometry and make the replacement path clear.

When map feature, route, point, heat, or region data is empty, show a designed empty state or placeholder geography with clear no-data messaging. When map assets or providers fail, show an error state instead of a blank map container.

## State Design Checklist

Every important data region should have:

- data state with believable sample values;
- loading state;
- empty state;
- error state;
- refresh/update behavior when relevant.

Mock data should include units, timestamps, status levels, trend direction, and domain-specific labels. Avoid `Item 1` and meaningless numeric filler.

Before delivery, inspect the code path for each data region and confirm there is an explicit branch for loading, empty, and error. If a branch is implicit, missing, or only leaves whitespace, add a real state view.

## Performance Budget

Keep performance practical:

- Concentrate complex motion in the main visual or a few status accents.
- Do not animate every border, chart, and decoration at once.
- Throttle data refresh and update chart options incrementally.
- Avoid heavy chart shadows, gradients, labels, and animations across many panels.
- Keep 3D effects and particles bounded.
- Prefer static or low-motion decorations for repeated secondary panels.
- Do not run profiling by default unless the user asks or the page is obviously complex.
