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

Preview, browser checks, or screenshots are optional by default. Use them when:

- the user asks for visual verification;
- a complete runnable page was changed and a dev server is easy to start;
- the work involves risky fit-screen behavior, complex layout, ECharts, 3D, or maps;
- static checks cannot catch the likely failure mode.

If preview is skipped or impossible, say so in the final response.

## Final Response Checklist

Summarize:

- files changed or files to create;
- task type;
- design decisions: first/second/third read, layout, color, border/decor strategy;
- datav-kit components used and why;
- dependency, registration, route, and styling integration changes;
- ECharts/3D/map library reuse or additions;
- loading, empty, and error state handling;
- validation commands run and results;
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
- placing decorations as filler instead of structure, direction, status, or focus;
- leaving ECharts/3D containers with no stable size, resize, cleanup, loading, empty, or error state;
- adding a new visualization library while ignoring existing wrappers;
- producing a one-note blue/cyan/purple glow screen with no information hierarchy;
- turning a large-screen display into a dense CRUD/admin dashboard.

## Compact Example Prompts

- `Use $datav-screen-builder to build a datav-kit energy command screen in this project.`
- `用 $datav-screen-builder 做一个数据大屏，跟随当前项目技术栈。`
- `Use $datav-screen-builder to fix datav-kit registration and theme integration in this React app.`
