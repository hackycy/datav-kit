# Design Tree

Use this reference for screen design, layout, color, decoration, border pairing, and interaction decisions.

## Decision Order

Resolve design decisions in this order:

1. Business scenario: city, energy, industry, finance, security, operations, product demo, or user-defined domain.
2. Audience and viewing mode: wall screen, command center, demo screen, embedded monitor, or interactive cockpit.
3. Information priority:
   - First read: the main situation, map, topology, KPI, status, or trend.
   - Second read: supporting comparison, ranking, trend, alerts, or breakdown.
   - Third read: frame atmosphere, separators, ambient status, weak motion, and decorative rhythm.
4. Canvas and composition: fixed large-screen canvas, embedded host, ultra-wide, vertical, or responsive content area.
5. Layout zones: title/status rail, main visual, side panels, KPI bands, alerts, timelines, legends, and detail areas.
6. Color system: base, structure, accent, alert, success, and muted text.
7. Border/decor pairing: choose content containers and decorative guidance from current docs.
8. Visualization states: data, loading, empty, error, and refresh.
9. Interaction and motion budget.

Ask one key question only when the top-level direction is unknown, usually: "What scenario does this large screen serve?" Use sensible defaults for low-risk details.

## Layout Principles

Do not use fixed templates or fixed panel counts. Let the user's data and business goal determine grouping and density.

Guide composition with hierarchy:

- Make one main visual or status group dominant.
- Use side panels for explanation, ranking, alerts, or secondary trends.
- Use top/bottom rails for title, time, filters, global status, and summarized indicators.
- Keep repeated panels quieter than the focal zone.
- Avoid turning every metric into a card; group related metrics into readable bands.
- Preserve distance readability: stronger type, fewer tiny labels, clear contrast, and generous internal spacing.

## Border And Decoration Pairing

Read `llms.txt` first, then read candidate component pages before using any tag or prop.

Use principles, not fixed component numbers:

- Use fit-screen or the current documented equivalent for full-screen fixed-canvas scaling.
- Use border components to carry content zones, not every small item.
- Use decoration components for title wings, section separators, directional emphasis, status rhythm, and focal support.
- Put stronger borders around fewer important zones.
- Use simpler borders for repeated secondary panels.
- Avoid complex borders around dense tables, long labels, tiny KPI cells, or controls.
- Use decorative components only when they separate, guide attention, signal state, or support a focal area.
- Build two or three complexity levels across the screen; do not let every zone compete.

## Color And Visual Language

Default to dark, restrained, data-first large-screen visuals, then adapt by domain.

- Energy: cyan/green structure, amber warning accents.
- Finance: high-contrast dark base, restrained red/green or gold accents.
- Industry: steel blue, cyan structure, orange warning.
- City/security: blue/purple depth, gold or red highlights for key areas.
- Operations: neutral dark base, clear status colors, strong alert hierarchy.

Rules:

- Do not make the whole screen one blue, cyan, or purple glow.
- Reserve bright accents for priority, anomaly, live status, or the focal zone.
- Keep charts and data more readable than decoration.
- Align chart colors, border colors, and state colors through CSS variables or local design tokens.
- Avoid game-HUD styling unless the user explicitly requests a showcase style.

## Interaction Strategy

Keep large-screen interaction restrained:

- Default to display-first, interaction-second.
- Prefer only necessary controls: fullscreen, time range, region switch, metric switch, alert detail, or drilldown.
- Avoid CRUD, dense forms, multi-page admin flows, and heavy filter panels unless requested.
- Tooltips must support reading and avoid blocking the main visual.
- Dialogs/drawers should reveal details without destroying the screen's situational overview.
- Avoid automatic carousel behavior for core data unless the user asks for rotation.
- Consider scaled hit areas when fit-screen changes visual size.

## UI Text And Data Language

Follow the user's request language or the existing project UI language. Keep titles, labels, mock data, loading, empty, and error text consistent. Keep datav-kit technical terms such as `fit-screen`, `border-box`, and `decoration` as documented.
