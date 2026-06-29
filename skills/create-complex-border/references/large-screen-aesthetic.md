# Large-Screen Dashboard Aesthetic Guide

## Contents

- [Purpose](#purpose)
- [Design Anchors](#design-anchors)
- [First-Read Strategy](#first-read-strategy)
- [Technology Style Directions](#technology-style-directions)
- [Visual Drama Without Clutter](#visual-drama-without-clutter)
- [Border-Specific Rules](#border-specific-rules)
- [Validation Gates](#validation-gates)
- [Failure Patterns](#failure-patterns)
- [External Design Anchors](#external-design-anchors)

## Purpose

Use this reference before designing any new Datav border. The border must be judged as part of a large-screen dashboard composition, not as an isolated SVG ornament.

Large-screen data design should help viewers quickly understand the current situation, notice anomalies, and remember the screen. The goal is a strong first read: one dominant focal zone, supporting panels, clear hierarchy, and a technology atmosphere with space and light.

## Design Anchors

Use these principles as non-negotiable design anchors:

- Design serves data; details serve the whole. The chart, map, KPI, title, or status story must be more important than decoration.
- Great dashboards are single-screen, at-a-glance communication surfaces. Remove anything that makes the viewer search before understanding the priority.
- Organize summary first, then supporting filters/details. Important data usually belongs high, central, or top-left depending on the story type.
- Use visual hierarchy through scale, contrast, color, grouping, spacing, and common regions. If everything is bright or detailed, nothing is important.
- Use color intentionally. Limit the screen to a dominant base, a supporting chroma, and one or two accents. Use bright/warm accents for priority, anomaly, live status, or active energy.
- Prefer charts that communicate quickly through length and 2D position. Avoid making radial shapes, gauges, 3D forms, and decorative circles the main data language unless the user asks for that style.
- For large-screen "coolness", combine technology, space, and light: dark depth, perspective or atmospheric layering, luminous focus, and precise structural lines.

## First-Read Strategy

Before drawing the border, define the screen's attention order:

1. **First**: the hero information. This may be a central map/topology, a large KPI number, a status title, or an off-axis command module.
2. **Second**: the supporting comparison or trend. This is often a line/bar chart, ranking list, or grouped KPI strip.
3. **Third**: ambient context, such as grid, labels, minor ticks, borders, decorative traces, and motion.

The border must reinforce this sequence. Use brighter corners, directional rails, split lines, or glow gradients to pull attention toward the focal zone. Do not decorate all four sides equally unless the content itself is already strong and centered.

Use a "3-second promise" in the design brief:

```txt
At dashboard distance, the viewer first sees <focal zone>, then <supporting data>, then <frame atmosphere>.
```

If that sentence is weak, redesign the composition before coding.

## Technology Style Directions

Choose one style direction and commit to it. Mixing many styles makes the screen look cheap.

- **Command-center hero**: central title/KPI or status map, strong top header, left/right support panels, controlled cyan/blue light, precise grid.
- **Geo/city cockpit**: center map or topology silhouette, side data rails, orbital or route accents, depth haze, restrained gold or magenta alerts.
- **Operations nerve center**: dense but orderly status lanes, alert rail, timeline or queue rhythm, sharp contrast between normal and abnormal states.
- **Energy/grid monitor**: current flow, node network, directional light trails, green/cyan primary, amber warning accents, strong horizontal rhythm.
- **Financial pulse board**: ticker-like top/bottom rails, high-contrast number typography, trend lines, sparse red/green accents, low decorative mass.
- **Industrial digital twin**: equipment outline, technical callouts, depth panels, steel-blue base, small orange warning nodes, no mecha armor unless requested.
- **Abstract cyber showcase**: most suitable for decorative demos. Use a bold geometric focal form, but keep content zones believable.

## Visual Drama Without Clutter

Eye-catching does not mean noisy. Use one or two dramatic moves:

- A luminous title rail that feels like a command system.
- A central aperture, map frame, or topology anchor that gives the screen a memorable silhouette.
- A strong diagonal or asymmetric cut that creates motion and direction.
- A single accent color used only where the viewer should look.
- Depth layers: far background grid, mid structural panels, near bright glints.
- Motion that suggests live data: slow pulse, short rail charge, node heartbeat, or status sweep.

Avoid spreading drama everywhere. A border with every edge equally bright, every corner equally detailed, and every node animated will look amateur and will steal attention from the data.

Use a rough 3-6-1 color weight:

- 60% dark base and deep atmosphere.
- 30% structural blue/cyan/green/purple family.
- 10% highlight accent for live state, warning, or focal emphasis.

This is not a strict formula, but if accents exceed the focal data, reduce them.

## Border-Specific Rules

The border must be a framing system for data, not the hero by itself.

- Design the demo content while designing the border: title, KPI cluster, chart/map placeholder, and background grid. A border that only looks acceptable around empty content is not finished.
- Reserve the strongest glow for the side of the border that supports the focal zone. Do not use identical intensity on all four sides by default.
- Let the frame create depth: outer atmospheric glow, middle structural rails, inner quiet content boundary, then data above.
- Use asymmetry with purpose: one heavy rail needs a visual counterweight such as a title, KPI cluster, or alert node.
- Keep corners generous. Large-screen dashboards often put labels, cards, or legends near edges; corner decorations must not bite into them.
- Make the border silhouette memorable at thumbnail size. It should not look like another generic cyan rectangle.
- Keep the content shape believable. Avoid forcing content into an awkward octagon, portal, cockpit window, or mechanical cavity unless the whole dashboard story supports it.
- If the component is only a border box, use docs/demo content to prove how it behaves in a real large-screen composition.

## Validation Gates

Pass these gates before finishing:

- **3-second gate**: Can a viewer describe the intended first, second, and third read without explanation?
- **Squint gate**: Blur or squint at the screenshot. One focal zone should dominate, supporting groups should remain clear, and the border should not become the loudest element.
- **Distance gate**: At a small thumbnail, the silhouette and focal direction should remain memorable.
- **Data-first gate**: The chart/KPI/map area must look more important than decorative rails, unless the user explicitly requested a decorative showcase.
- **Color gate**: The screen should not become a one-note blue/cyan/purple field. Accent color must signal priority, not fill empty space.
- **Motion gate**: Motion should imply live data or status. If motion is only ornamental sparkle, remove or reduce it.
- **Professional gate**: The result should look like it belongs on a command-center wall, executive operations screen, or product demo, not a game HUD sticker.

## Failure Patterns

- The border is technically clean but visually boring because it has no focal strategy.
- The border is "cool" in isolation but weak around actual dashboard content.
- All sides have equal brightness, equal density, and equal animation, so there is no visual hierarchy.
- The design uses sci-fi decoration but no data story: random ticks, nodes, grids, labels, or rails.
- The main shape reads as cockpit glass, portal, weapon UI, mecha armor, or game interface instead of a data dashboard frame.
- The palette is just cyan-on-dark with no depth, warmth, contrast, or focal accent.
- The demo screenshot has no believable dashboard content, so aesthetic judgment is impossible.
- The design chases novelty with circles, arcs, and diagonal cuts that compete with data readability.

## External Design Anchors

These sources informed the rules above. Do not browse them during normal skill use unless the user asks for current research.

- Microsoft Power BI dashboard guidance: dashboards should tell a story on one page, show important information at a glance, avoid clutter, and use full-screen presentation for dashboard viewing. Source: https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips
- NN/g dashboard guidance: dashboards should provide single-page, at-a-glance information that users can act on quickly; visual hierarchy guides attention through contrast, scale, color, and grouping. Source: https://www.nngroup.com/articles/dashboards-preattentive/
- Tableau guidance: dashboard layouts should be logical and simplified, and too many views can make visual clarity and the big picture get lost. Sources: https://help.tableau.com/current/blueprint/en-us/bp_visual_best_practices.htm and https://help.tableau.com/current/pro/desktop/en-us/dashboards_best_practices.htm
- Alibaba DataV docs: DataV is for building visualization applications that make data and its value clear, including chart widgets and 2D/3D spatio-temporal geographic widgets. Source: https://help.aliyun.com/en/datav/product-overview-datav
- Ant Design visualization guidance: data expression should fit user psychology and support business-specific visual solutions. Source: https://ant.design/docs/spec/visual/
