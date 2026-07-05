# Visualization States

Use this reference for ECharts, 3D, maps, visual scenes, loading/empty/error handling, resize, cleanup, and performance.

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
- States: `Loading`, `Empty`, `ErrorState`, `Result`, `Skeleton`.

## ECharts Rules

When implementing or modifying ECharts:

- Ensure the chart container has stable non-zero width and height.
- Reuse project wrappers before calling `echarts.init` directly.
- Initialize after the container is mounted and sized.
- Resize on window changes and, when possible, through `ResizeObserver` or the project wrapper.
- Dispose instances on unmount or route teardown.
- Show loading with project UI or ECharts `showLoading`; keep the panel visually intentional.
- Show empty state when series data is empty. Do not leave a blank border box.
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

## Maps And Geographic Screens

Confirm data and licensing before using real map tiles or geographic services. If unavailable, use abstract topology, region silhouettes, route lines, or placeholder geometry and make the replacement path clear.

## State Design Checklist

Every important data region should have:

- data state with believable sample values;
- loading state;
- empty state;
- error state;
- refresh/update behavior when relevant.

Mock data should include units, timestamps, status levels, trend direction, and domain-specific labels. Avoid `Item 1` and meaningless numeric filler.

## Performance Budget

Keep performance practical:

- Concentrate complex motion in the main visual or a few status accents.
- Do not animate every border, chart, and decoration at once.
- Throttle data refresh and update chart options incrementally.
- Avoid heavy chart shadows, gradients, labels, and animations across many panels.
- Keep 3D effects and particles bounded.
- Prefer static or low-motion decorations for repeated secondary panels.
- Do not run profiling by default unless the user asks or the page is obviously complex.
