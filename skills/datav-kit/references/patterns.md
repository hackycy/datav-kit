# Composition Guidance

Start with the question the audience must answer at a glance. The primary data visual
determines composition; component selection follows through official documentation.

| Business question | Primary visual | Supporting information |
| --- | --- | --- |
| Where is the incident and what is affected? | Geographic map with traceable data | Regional metrics, incident queue, update status |
| Which asset needs attention? | Plant scene or stable equipment topology | Asset health, throughput, alarms |
| Are we on track and why? | Trend with target and comparison | Output, gap to target, contribution ranking |
| Where does the resource go? | Directed flow or process diagram | Supply, demand, loss, storage, time profile |
| What must an executive know now? | Prioritized metrics with context | Comparisons, exceptions, explanatory trend |
| What is happening across a physical area? | Full-bleed spatial map | Floating filters, zone totals, event rail |
| Which connection is unhealthy? | Device topology graph | Node detail, link status, dependency counts |

## Compose around the primary visual

| Archetype | Spatial organization | Use when |
| --- | --- | --- |
| KPI-led | Vertical metric rail, large comparison, lower contribution band | A few outcomes need priority |
| Map-led | Full-area map, edge overlays and layer controls | Location and area coverage drive decisions |
| Topology-led | Stable layered graph, alert rail, selected-node detail below | Dependencies explain faults |
| Flow-led | Horizontal source-to-destination flow, balance and time profile | Inputs and outputs must reconcile |
| Scene-led | Recognizable 3D asset field with adjacent inspection controls | Physical equipment needs identification |
| Event-led | Urgency-ranked queue alongside aligned status rows and timeline | Operators prioritize incident response |

These are starting compositions. The six examples cover the first five; event-led is a
guidance pattern for future briefs, not a seventh shipped example.

Give the main visual enough room to identify its subject before reading fine labels.
Supporting information can use side bands, a lower strip, an asymmetric split or a shared
axis. A KPI row and centered decorative title are choices, not mandatory regions.

Use stable grid tracks, `minmax(0, 1fr)` and explicit visual-container dimensions so dynamic
values cannot resize the layout. Keep the business title at screen scale and supporting
headings at panel scale. Repeated measurements usually read better as aligned rows than
as individually framed subsections.

For map-first screens let the map own most of the canvas and float only decision-critical
controls above it. For topology-first screens reserve space for links and labels before
adding metrics. Event queues should put urgency and recency before decorative charts.

Select a documented border or decoration for a framing or hierarchy need. Preserve its
documented content area. Verify capabilities and size rather than treating components as
interchangeable based on numeric suffixes.

## Make directions visibly different

Develop spatial hierarchy, theme roles, typography, framing and motion together. Analytical
screens can use sparse rules; command screens can use selected technical frames. Keep
motion subordinate to the data and provide pause controls for persistent animation.

An industrial scene needs recognizable buildings and equipment. A map needs geographic
data and attribution. A topology needs stable node positions, explicit link direction and
a selected-node detail. A financial trend needs totals and comparisons that reconcile.

The standalone examples in `assets/examples/` demonstrate different compositions. Inspect
their rendered previews, then adapt data and structure to the current brief. Their CDN
versions are executable examples, not a version policy for consuming projects.
