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
5. Title-area complexity: keep the default title rail lightweight unless the user explicitly asks for a complex showcase header.
6. Layout zones: title/status rail, main visual, side panels, KPI bands, alerts, timelines, legends, and detail areas.
7. Content density and sizing: decide readable group counts, stable chart dimensions, and overflow behavior before choosing decoration.
8. Color system: base, structure, accent, alert, success, and muted text.
9. Border/decor pairing: choose content containers and decorative guidance from current docs.
10. Visualization states: data, loading, empty, error, and refresh.
11. Interaction and motion budget.

Ask one key question only when the top-level direction is unknown, usually: "What scenario does this large screen serve?" Use sensible defaults for low-risk details.

## Layout Principles

Do not use fixed templates or fixed panel counts. Let the user's data and business goal determine grouping and density.

Guide composition with hierarchy:

- Make one main visual or status group dominant. If the user does not specify the first read, default to a central main visual. For monitoring/list-heavy domains, default to a top status/KPI band plus one dominant trend or alert area.
- Default to a stable center-axis composition for large screens: centered title/status anchor, dominant center visual, balanced left/right support panels, and restrained top/bottom rails.
- Use side panels for explanation, ranking, alerts, or secondary trends.
- Use top/bottom rails for title, time, filters, global status, and summarized indicators.
- Keep repeated panels quieter than the focal zone.
- Avoid turning every metric into a card; group related metrics into readable bands.
- Preserve distance readability: stronger type, fewer tiny labels, clear contrast, and generous internal spacing.

## Title Area

The default title area must be simple and deliberate:

- Use one title group: a centered large title plus one lightweight symmetric decoration pair.
- Keep the screen title centered on the visual axis and make it the primary anchor of the top rail.
- Balance title-adjacent content: put time, location, global status, or light controls in quiet left/right groups with similar visual weight.
- Make the title text large-screen styled with gradient color, subtle glow, outline, or highlighted business keywords.
- Optionally add one weak lower divider, baseline, or status strip below the title group. This lower element should not be another symmetric title ornament.
- Keep title height around `80-120px` on a `1920 x 1080` canvas unless the project layout requires otherwise.
- Do not wrap the entire title in a heavy border-box by default.
- Do not stack multiple decorations, corner ornaments, border boxes, subtitle blocks, time/weather/KPI clusters, and badges into the title core.
- Avoid asymmetrical, slanted, floating, novelty, or heavily fragmented title compositions by default.
- Keep close, back, fullscreen, and secondary utility actions in quiet edge zones so they remain reachable but subordinate.
- Only increase title complexity when the user explicitly asks for a complex, showcase, or highly theatrical command-center header.

If a generated title area looks like a pile of components instead of one title system, simplify it before delivery.

## Content Density

Default to fewer, clearer groups:

- Keep the main visual area visibly largest.
- A side panel should usually contain one heading, one chart/list/table, and a small number of key metrics.
- KPI numbers should be large and selective; avoid turning every number into a separate mini-card.
- Long tables default to `6-8` visible rows on a `1920 x 1080` screen. Summarize, group, scroll, or rotate non-core details instead of shrinking text.
- Do not fake richness by reducing font sizes, squeezing chart heights, or packing dense labels into bordered cells.
- Give charts, maps, counters, and list regions stable dimensions so loaded data, empty states, and labels cannot collapse or overflow the panel.

## Border And Decoration Pairing

Read `llms.txt` first, then read candidate component pages before using any tag or prop.

Use principles, not fixed component numbers:

- Use fit-screen or the current documented equivalent for full-screen fixed-canvas scaling.
- Use border components to carry content zones, not every small item.
- Use decoration components for title wings, section separators, directional emphasis, status rhythm, and focal support.
- Top title area: use lightweight decoration only by default; avoid a border-box around the whole title.
- Prefer paired or mirrored lightweight decoration for title wings and header separators.
- Main visual: use a stronger border-box only when the map, topology, or hero chart needs framing; otherwise an immersive unframed center is acceptable.
- Side panels: use simple or medium border-box components consistently across repeated panels.
- Small KPIs, tables, and long labels: prefer internal grids, thin dividers, local backgrounds, or typography over heavy border boxes.
- Put stronger borders around fewer important zones.
- Use simpler borders for repeated secondary panels.
- Avoid complex borders around dense tables, long labels, tiny KPI cells, or controls.
- Use decorative components only when they separate, guide attention, signal state, or support a focal area.
- Build two or three complexity levels across the screen; do not let every zone compete.
- Use one strong decorative focus at most unless the user explicitly asks for a showpiece.

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
- Use a dark base, a structural color family, and only one or two accent colors by default.
- Title text may use stronger color treatment, but borders, charts, and panels must not all have equal brightness.
- Alert, success, warning, muted, selected, and normal states must have clear semantic differences.
- Keep charts and data more readable than decoration.
- Align chart colors, border colors, and state colors through CSS variables or local design tokens.
- Avoid game-HUD styling unless the user explicitly requests a showcase style.

## Interaction Strategy

Keep large-screen interaction restrained:

- Default to display-first, interaction-second.
- Prefer only necessary controls: fullscreen, time range, region switch, metric switch, alert detail, or drilldown.
- Allow sparse forms only when they serve display context, such as time range, region, metric, or alert drilldown controls.
- Avoid CRUD, dense forms, multi-page admin flows, and heavy filter panels unless requested.
- Tooltips must support reading and avoid blocking the main visual.
- Dialogs/drawers should reveal details without destroying the screen's situational overview.
- Avoid automatic carousel behavior for core data unless the user asks for rotation.
- Consider scaled hit areas when fit-screen changes visual size.

## UI Text And Data Language

Follow the user's request language or the existing project UI language. Keep titles, labels, mock data, loading, empty, and error text consistent. Keep datav-kit technical terms such as `fit-screen`, `border-box`, and `decoration` as documented.
