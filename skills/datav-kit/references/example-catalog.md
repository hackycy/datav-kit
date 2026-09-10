# Example Selection Catalog

Use this table to select references by the question and composition. Every example uses a
dark visual base; palettes and layouts remain intentionally distinct.

| Example | Question / scene | Primary visual | Layout archetype | Dark palette | Reusable interaction |
| --- | --- | --- | --- | --- | --- |
| `business.html` | Are we on track? | Revenue trend | Left KPI column, trend above contribution band | Navy / electric blue | Period switching, reconciled totals |
| `energy.html` | Where does power go? | Sankey flow | Flow-led split | Deep green / mint | Node selection, balance status |
| `city.html` | Where is the incident? | Geographic map | Map with right rail | Blue-black / teal | Region selection, incident queue |
| `industrial.html` | Which asset needs attention? | 3D plant | Scene-led split | Charcoal / amber | Picking, camera reset, pause |
| `spatial.html` | What is happening across the area? | Full-bleed spatial map | Map-first floating overlays | Violet-black / cyan | Layer and zone filters |
| `topology.html` | Which connection is unhealthy? | Device graph | Layered network, left alerts, bottom detail | Graphite / magenta-cyan | Node selection, status filtering |

Choose a reference by business question and primary visual first. Treat the HTML as a
composition sample; replace its content, data and labels with the user's domain.

Inspect `assets/examples/previews/<example>.png` first, then read only the relevant HTML.
Map HTML includes embedded geography and can be large. Machine-readable identity lives in
`assets/examples/catalog.json`; each page declares matching `data-scene`, `data-layout`
and `data-palette` attributes on `#screen`. These are example conventions, not component API.
