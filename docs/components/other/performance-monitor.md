---
description: Runtime diagnostics overlay for datav-kit dashboards.
---

# Performance Monitor

`dvk-performance-monitor` provides a compact runtime diagnostics panel for large-screen dashboards. It is designed as a local and development-time tool, but production dashboards can opt in by explicitly rendering the element.

<div class="datav-demo">
  <div style="display: grid; gap: 12px;">
    <dvk-performance-monitor mode="inline" persist="false"></dvk-performance-monitor>
  </div>
</div>

```html
<dvk-performance-monitor></dvk-performance-monitor>
<dvk-performance-monitor mode="inline" persist="false"></dvk-performance-monitor>
```

## Diagnostics

The compact summary shows FPS and a 0-100 pressure score. Expanding the panel shows frame history, long tasks, heap usage, DOM inventory, `dvk-*` hotspots, SVG complexity candidates, Canvas pixel risk, animation counts, and video counts.

The monitor scans `document.body` by default and skips all `dvk-performance-monitor` instances. Use `target` or the `targetElement` property to scope DOM inventory to a specific dashboard region.

```html
<dvk-performance-monitor target="#screen-root"></dvk-performance-monitor>
```

```ts
const monitor = document.querySelector('dvk-performance-monitor')
monitor.targetElement = document.querySelector('#screen-root')
```

## Methods

| Name | Description |
| --- | --- |
| `getSnapshot()` | Returns the latest JSON-serializable diagnostics snapshot. |
| `refresh()` | Immediately refreshes DOM, SVG, Canvas, video, and animation inventory. |
| `reset()` | Clears frame history, long-task windows, pressure contributors, and alert cooldown state. |
| `resetPosition()` | Restores overlay placement after the panel has been dragged. |

## Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| `mode` | `string` | `overlay` | Display mode: `overlay` or `inline`. |
| `placement` | `string` | `bottom-right` | Overlay placement: `top-left`, `top-right`, `bottom-left`, or `bottom-right`. Ignored by built-in inline layout. |
| `enabled` | `boolean` | `true` | Starts or stops sampling while keeping the panel mounted. String values such as `enabled="false"` are supported. |
| `collapsed` | `boolean` | `false` | Shows only the compact summary when true. |
| `persist` | `boolean` | auto | Persists collapsed state. Defaults to true in overlay mode and false in inline mode. |
| `persist-key` | `string` | `datav-kit-performance-monitor-collapsed` | localStorage key used for collapsed state. |
| `emit-samples` | `boolean` | `true` | Emits `dvk-performance-sample` after each sample window. |
| `drag-enabled` | `boolean` | `true` | Allows dragging the overlay panel by its header. Inline mode ignores dragging. |
| `sample-interval` | `number` | `1000` | Frame and long-task sample interval in milliseconds. |
| `scan-interval` | `number` | `3000` | DOM, SVG, Canvas, video, and animation scan interval in milliseconds. |
| `target` | `string` | empty | CSS selector for the scan scope. Falls back to `document.body`. |
| `targetElement` | `Element \| null` | `null` | Property-only scan scope. Takes precedence over `target`. |
| `danger-threshold` | `number` | `70` | Pressure threshold that triggers danger tone and alerts. |
| `min-fps-threshold` | `number` | `30` | FPS threshold used by `dvk-performance-alert`. |
| `long-task-threshold` | `number` | `200` | Long-task milliseconds threshold used by `dvk-performance-alert`. |
| `alert-cooldown` | `number` | `10000` | Minimum milliseconds between alert events. |
| `offset` | `number` | `14` | Overlay edge offset in CSS pixels. |
| `z-index` | `number` | `2147483000` | Overlay z-index. |

## Events

| Name | Detail |
| --- | --- |
| `dvk-performance-sample` | `PerformanceMonitorSnapshot` |
| `dvk-performance-alert` | `PerformanceMonitorAlertDetail` |
| `dvk-collapse-change` | `{ collapsed }` |
| `dvk-enabled-change` | `{ enabled }` |

## CSS Variables

| Name | Meaning |
| --- | --- |
| `--dvk-performance-monitor-bg` | Panel background. |
| `--dvk-performance-monitor-color` | Base text color. |
| `--dvk-performance-monitor-border-color` | Panel and button border color. |
| `--dvk-performance-monitor-muted-color` | Label and muted text color. |
| `--dvk-performance-monitor-ok-color` | OK pressure color. |
| `--dvk-performance-monitor-warn-color` | Warning pressure color. |
| `--dvk-performance-monitor-danger-color` | Danger pressure color. |
| `--dvk-performance-monitor-offset` | Overlay edge offset. |
| `--dvk-performance-monitor-z-index` | Overlay z-index. |

## Parts

| Part | Description |
| --- | --- |
| `root` | Panel wrapper. |
| `header` | Runtime header. |
| `toggle` | Collapse toggle button. |
| `pressure` | Pressure summary block. |
| `details` | Expanded diagnostics wrapper. |
| `section` | Diagnostics section. |
| `section-title` | Section title. |
| `metric` | Metric row or item. |
| `metric-label` | Metric label. |
| `metric-value` | Metric value. |
