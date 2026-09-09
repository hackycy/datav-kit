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

## Compose around the primary visual

Give the main visual enough room to identify its subject before reading fine labels.
Supporting information can use side bands, a lower strip, an asymmetric split or a shared
axis. A KPI row and centered decorative title are choices, not mandatory regions.

Use stable grid tracks, `minmax(0, 1fr)` and explicit visual-container dimensions so dynamic
values cannot resize the layout. Keep the business title at screen scale and supporting
headings at panel scale. Repeated measurements usually read better as aligned rows than
as individually framed subsections.

Select a documented border or decoration for a framing or hierarchy need. Preserve its
documented content area. Verify capabilities and size rather than treating components as
interchangeable based on numeric suffixes.

## Make directions visibly different

Develop spatial hierarchy, theme roles, typography, framing and motion together. Analytical
screens can use sparse rules; command screens can use selected technical frames. Keep
motion subordinate to the data and provide pause controls for persistent animation.

An industrial scene needs recognizable buildings and equipment. A map needs geographic
data and attribution. A financial trend needs totals and comparisons that reconcile.

The standalone examples in `assets/examples/` demonstrate different compositions. Inspect
their rendered previews, then adapt data and structure to the current brief. Their CDN
versions are executable examples, not a version policy for consuming projects.
