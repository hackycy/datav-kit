# Delivery And Validation

Use this reference before final delivery and when deciding how much validation to run.

## Validation Strategy

Default to project-appropriate static validation:

- typecheck;
- lint;
- build;
- targeted tests;
- formatter only when the project expects it.

Run the commands that already exist in the project. Do not invent heavyweight validation for small advisory tasks.

For any complete runnable large-screen page that was created or changed, run a preview/browser check by default unless the project cannot be started. Use a screenshot, DOM measurements, or both to inspect the actual result.

Preview/browser checks should verify at least:

- the `1920 x 1080` baseline canvas or fit-screen target;
- title, main visual, side panels, and bottom/top rails do not overlap or overflow;
- border-box content is not clipped, squeezed, or hidden by decoration;
- chart, map, 3D, table, counter, loading, empty, and error containers have stable non-zero dimensions;
- every meaningful data region has explicit loading, empty, and error handling, not only a populated data state;
- no large blank regions appear because a visualization failed to size or render;
- no empty data path leaves a blank chart, blank map, empty table shell, empty KPI panel, or decorative border around whitespace;
- text fits its panels and buttons without unreadable shrinking.

Also use preview, browser checks, or screenshots when:

- the user asks for visual verification;
- the work involves risky fit-screen behavior, complex layout, ECharts, 3D, or maps;
- static checks cannot catch the likely failure mode.

For higher-risk layouts, also check `1366 x 768`, an embedded container size, or a mobile/coarse viewport if that mode is in scope.

If preview is skipped or impossible, say so in the final response.

## Must-Fix Failure Gates

If any of these appear in the generated screen, revise before delivery:

- title area has stacked decoration components, multiple competing title ornaments, or heavy border-box wrapping without explicit user request;
- no clear first-read visual or status group exists;
- every panel has similar brightness, complexity, animation, or visual weight;
- decorations are used as filler instead of structure, direction, status, or focus;
- content is clipped, hidden, squeezed, or crowded by borders and decorations;
- chart, map, 3D, table, counter, loading, empty, or error containers lack stable dimensions;
- any chart, map, 3D scene, table, list, KPI group, counter, timeline, topology, ranking, alert feed, or custom visual lacks explicit loading, empty, and error states;
- empty data renders as blank whitespace, empty axes, an empty table body, an empty map/canvas, or a border-box with no meaningful message;
- error data renders as blank whitespace, stale happy-path content, or a console-only failure;
- title, chart labels, lists, or panel content overflow at `1920 x 1080`;
- broad `--dvk-border-box-padding` overrides are applied to root, app, screen, dashboard, or theme selectors;
- the screen reads as one blue/cyan/purple glow field with unclear semantic color.

## Final Response Checklist

Summarize:

- files changed or files to create;
- task type;
- design decisions: first/second/third read, layout, color, border/decor strategy;
- datav-kit components used and why;
- dependency, registration, route, and styling integration changes;
- ECharts/3D/map library reuse or additions;
- loading, empty, and error state handling;
- validation commands, preview/browser checks, and results;
- any unverified assumptions or docs access failures.

Keep the final response concise and implementation-focused.

## Anti-Patterns

Avoid these:

- using datav-kit from memory without reading current public docs;
- inventing `dvk-*` tags, props, events, parts, or CSS variables;
- forcing a new tech stack into an existing project;
- reinstalling or re-registering datav-kit when it is already integrated;
- making every panel equally bright, complex, and animated;
- wrapping every small metric in a heavy border;
- overcomplicating the title area when the user did not request a showcase header;
- placing decorations as filler instead of structure, direction, status, or focus;
- using broad `--dvk-border-box-padding` where a component-specific padding variable or better layout would solve the issue;
- leaving ECharts/3D containers with no stable size, resize, cleanup, loading, empty, or error state;
- building only the happy-path data view while empty or error data leaves the panel blank;
- adding a new visualization library while ignoring existing wrappers;
- producing a one-note blue/cyan/purple glow screen with no information hierarchy;
- turning a large-screen display into a dense CRUD/admin dashboard.

## Compact Example Prompts

- `Use $datav-screen-builder to build a datav-kit energy command screen in this project.`
- `用 $datav-screen-builder 做一个数据大屏，跟随当前项目技术栈。`
- `Use $datav-screen-builder to fix datav-kit registration and theme integration in this React app.`
