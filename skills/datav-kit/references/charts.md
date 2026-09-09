# Charts and Data Visuals

Use the project's existing chart library. ECharts is the default for these standalone
examples. `assets/charts/` modules are optional starting points, not component contracts
or code that must be copied verbatim. Verify APIs against the actual library version.

## Choose an encoding

| Question | Encoding |
| --- | --- |
| Change over time | Line or area with explicit units and time range |
| Rank or compare magnitude | Sorted bar, zero magnitude origin |
| Contribution to a whole | Stacked bar; doughnut for a few distinct categories |
| Distribution or correlation | Scatter or heatmap with meaningful axes |
| Location | Map with traceable data and attribution |
| Connectivity or flow | Stable graph or Sankey with direction and units |
| Progress against target | Value plus comparison, bullet or gauge |

Prefer direct labels. Separate incompatible units rather than using an ambiguous second
axis. Reduce crowded series and labels. Avoid 3D magnitude charts and rainbow continuous scales.

## Theme and lifecycle

Read resolved colors from the screen root rather than `document.documentElement`. Separate
text and grid from series roles. Pass concrete CSS colors to the library; use the browser
to resolve CSS expressions when necessary. Extend the project theme instead of distributing
color literals through chart options.

Keep charts transparent when a parent supplies the surface, and headings in the DOM.
Measure actual content space and set plot bounds. Official component documentation owns
the safe-area contract; do not assume uniform padding across frames.

Use ResizeObserver with animation-frame scheduling. Dispose charts, observers and pending
frames on teardown. SVG is a useful default for modest ECharts datasets under CSS scaling;
inspect pixel density when choosing canvas.

Update existing charts while preserving user selection. The optional modules target
ECharts 6.1.0; their `setTheme` usage is not a compatibility promise for older versions.
Disable transitions for reduced motion.

## Data and state

Derive totals, percentages and comparisons from the same dataset. Unknown values are not
zero. Show update time and implement loading, empty, failed and stale states. Retained old
data needs explicit stale labeling; retries must perform an actual state transition.

For standalone HTML, embed scene data and pin external libraries. The four screen examples
support `?state=loading|empty|failed|stale` for verification; normal operation defaults to ready.
This is an example convention, not a new datav-kit API.

## Performance and validation

Verify visible chart content, text fit and data selection at delivery dimensions. Apply
sampling or progressive rendering when dataset size requires it. Use stable positions for
monitoring topologies. Record performance with browser and viewport context, and verify
pause, visibility changes and reduced motion for continuously animated visuals.
