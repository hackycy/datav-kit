---
description: Six dark dashboard compositions with downloadable HTML, screenshots, maps, equipment topology, interactive Three.js assets and linked business metrics.
---

# Dashboard Examples

<script setup>
import { withBase } from 'vitepress'
</script>

Six complete screens demonstrate different compositions with datav-kit Web Components.
Each preview and download uses the same HTML maintained in the datav-kit skill. Open the
downloaded file in a browser while connected to the internet; pinned libraries load from
CDNs, while application code and scene data are embedded in the file.

## Choose a Composition

Match the decision and primary visual first. The industry labels are illustrative; adapt
content to the user's brief while choosing the layout deliberately. All examples use dark
bases, with navy, green, charcoal, violet and graphite palettes.

| Decision | Reference | Layout | Palette |
| --- | --- | --- | --- |
| Are we meeting our targets? | Business | Left KPI column, trend and contribution band | Navy / electric blue |
| Where does power go? | Energy | Source-to-load flow with balance and history | Deep green / mint |
| Where is the incident? | City | Map with regional event rail | Ink / teal |
| Which physical asset needs attention? | Industrial | 3D plant with equipment side rail | Charcoal / amber |
| What is happening across the area? | Spatial | Full-area map with edge overlays and layers | Violet-black / cyan |
| Which dependency explains the fault? | Topology | Layered graph with alerts and bottom device detail | Graphite / magenta-cyan |

For an ambiguous request, the skill asks 3-5 relevant questions about audience, decisions,
metrics, viewing conditions, interactions and visual constraints. It then produces one
HTML with 2-3 layout variants, accessible tabs and direct `?variant=a|b|c` links. Compare
the proportions and reading order before selecting a direction for full implementation.
These variants are generated for the current brief; the finished examples below are not
variant-switching prototypes.

## City Operations

A map-led Shanghai riverfront screen with linked regional metrics, pedestrian counts and
incident queues. Streets and buildings are derived from OpenStreetMap; operational figures
are deterministic demonstration data.

<img :src="withBase('/examples/city.png')" alt="City operations dashboard" />

[Open preview](/examples/city.html) · <a :href="withBase('/examples/city.html')" download="city.html">Download HTML</a>

## Industrial Monitoring

An original procedural Three.js plant with assembly buildings, machining, utilities and
logistics. Select equipment in the scene or the equipment list, reset the camera, and pause
the conveyor animation. A non-WebGL browser displays the same assets and metrics in 2D.

<img :src="withBase('/examples/industrial.png')" alt="Industrial monitoring dashboard" />

[Open preview](/examples/industrial.html) · <a :href="withBase('/examples/industrial.html')" download="industrial.html">Download HTML</a>

## Business Performance

A navy analytical composition with a vertical KPI rail, revenue trend and a lower channel
contribution band. Period selection updates reconciled revenue totals, target comparisons,
orders and channel contributions.

<img :src="withBase('/examples/business.png')" alt="Business performance dashboard" />

[Open preview](/examples/business.html) · <a :href="withBase('/examples/business.html')" download="business.html">Download HTML</a>

## Energy Dispatch

A deep-green source-grid-load-storage composition. Generation and grid input reconcile with industrial,
building and transport demand plus battery charging. Select flow nodes or use the node controls.

<img :src="withBase('/examples/energy.png')" alt="Energy dispatch dashboard" />

[Open preview](/examples/energy.html) · <a :href="withBase('/examples/energy.html')" download="energy.html">Download HTML</a>

## Spatial Situation

A full-area Shanghai riverfront map with an edge-mounted regional summary, independent
building/road/monitoring layers, zone selection and zoom controls. The violet-black base
and cyan data layer keep geographic context visible behind the overlays. A lower event
band and hourly flow follow the selected zone; markers also support keyboard selection.

<img :src="withBase('/examples/spatial.png')" alt="Spatial map dashboard with edge overlays" />

[Open preview](/examples/spatial.html) · <a :href="withBase('/examples/spatial.html')" download="spatial.html">Download HTML</a>

## Device Topology

A graphite network operations screen with a stable gateway-to-terminal graph, directional
link throughput, a left alert rail and a bottom device inspection band. Select a node, an
alert or a device from the accessible selector. The abnormal-relationship filter dims
unrelated connections without moving nodes. Offline metrics remain unknown rather than zero.

<img :src="withBase('/examples/topology.png')" alt="Device topology dashboard with selected-node detail" />

[Open preview](/examples/topology.html) · <a :href="withBase('/examples/topology.html')" download="topology.html">Download HTML</a>

## Adapting an Example

Read [Installation](/guide/installation), [Theming](/guide/theming) and the detail pages for
the components you intend to use. Check the installed package API before adapting an example;
the examples' pinned CDN versions are not a requirement for your project.

The [minimal HTML starter](/examples/minimal.html) shows registration, proportional scaling,
a border and a numeric metric. Layout and screen-token defaults are application conventions,
not additional component API.

For state verification, append `?state=loading`, `?state=empty`, `?state=failed` or
`?state=stale` to a preview. Normal operation defaults to ready. Empty and failed states
provide a retry using the deterministic local dataset. The industrial example also accepts
`?webgl=off` to exercise its 2D fallback. A mobile viewport shows a proportional preview of
the 1920 x 1080 canvas.

## Map Provenance

The city and spatial examples embed the same filtered GeoJSON derivative of
[OpenStreetMap API map data](https://api.openstreetmap.org/api/0.6/map?bbox=121.486,31.228,121.509,31.246)
for the Shanghai riverfront. The embedded GeoJSON is available in each HTML's `geography`
JSON block, with its source URL, ODbL license identifier and attribution. Geometry is
filtered by feature type and polygon winding is adjusted for the renderer.

Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available
under the [Open Database License](https://opendatacommons.org/licenses/odbl/1-0/).
The plant geometry is authored in the industrial example itself. All operational datasets
and spatial monitoring point positions are illustrative and do not represent a live installation.

## Maintaining the Examples

Edit `skills/datav-kit/assets/examples/*.html`. The development server and documentation
build copy those sources automatically; `docs/public/examples/` is generated and ignored
by Git. Keep previews in `assets/examples/previews/` as actual browser screenshots.
Keep `assets/examples/catalog.json` aligned with each screen's `data-scene`, `data-layout`
and `data-palette`. The catalog is checked against the HTML and skill reference catalog;
screen metadata is an example convention, not a component API.

From the repository root, build the packages and docs, then run `pnpm docs:check` and
`pnpm examples:test`. Install Chromium once with `pnpm exec playwright install chromium`.
Set `VITEPRESS_BASE=/datav-kit/` consistently when checking a GitHub Pages build.

After changing a visual, run `pnpm examples:previews` against the updated docs build,
inspect the screenshots and rebuild the docs to include them. Browser reports and all
four viewport captures are saved in `.cache/`; CI uploads them for review. An existing
Chrome installation can be used locally with `PLAYWRIGHT_CHANNEL=chrome`.
