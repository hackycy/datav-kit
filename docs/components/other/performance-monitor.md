---
description: Runtime diagnostics overlay for datav-kit dashboards.
---

# Performance Monitor

`dvk-performance-monitor` renders a compact runtime diagnostics panel that is fixed to the bottom-right corner of the viewport. It is a development-time tool: the docs site mounts one globally, so the panel you see in the corner of this page is this component.

```html
<dvk-performance-monitor></dvk-performance-monitor>
```

## Diagnostics

The header shows the current FPS and a pressure score. Pressure is the sum of two measurements, clamped to 0-100: the share of dropped frames in the last sample window, and the share of that window spent in long tasks. The pressure block turns amber at 38 and red at 70.

Expanding the panel reveals seven rows:

| Row | Meaning |
| --- | --- |
| `long tasks` | Count and total milliseconds reported by the `longtask` PerformanceObserver. |
| `heap` | Used and total JS heap from `performance.memory`, with the used percentage. Chrome-only; shows `n/a` elsewhere. |
| `nodes` | Elements found under `document.body`, including elements inside shadow roots. |
| `dvk` | Elements whose tag name starts with `dvk-`, excluding `dvk-performance-monitor` itself. |
| `svg / anim` | SVG elements and their `<animate>` / `<animateTransform>` descendants. |
| `video` | Playing videos, and how many of the total are inside the viewport. |
| `canvas` | Canvas elements. |

Samples are collected once per second.

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `collapsed` | `boolean` | `false` | Shows only the FPS and pressure summary when true. The collapsed state is persisted to `localStorage` under `datav-kit-performance-monitor-collapsed` and restored on connect. |

Setting the `collapsed` attribute in markup takes precedence over the persisted state.

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-performance-monitor-bg` | Panel background. |
| `--dvk-performance-monitor-color` | Base text color. |
| `--dvk-performance-monitor-font-family` | Panel font family. |
| `--dvk-performance-monitor-border-color` | Panel and button border color. |
| `--dvk-performance-monitor-muted-color` | Label and muted text color. |
| `--dvk-performance-monitor-ok-color` | OK pressure color. |
| `--dvk-performance-monitor-warn-color` | Warning pressure color. |
| `--dvk-performance-monitor-danger-color` | Danger pressure color. |
| `--dvk-performance-monitor-offset` | Distance from the viewport edges. Defaults to 14px, or 10px below 640px wide. |
| `--dvk-performance-monitor-z-index` | Panel z-index. |

## Parts

| Part | Description |
| --- | --- |
| `root` | Panel wrapper. |
| `header` | Runtime header. |
| `toggle` | Collapse toggle button. |
| `pressure` | Pressure summary block. |
| `grid` | Expanded metrics grid. |
| `metric` | Metric row. |
| `metric-label` | Metric label. |
| `metric-value` | Metric value. |
