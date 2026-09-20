import type { DatavElementMetadata } from '@datav-kit/core'

export const performanceMonitorMetadata = {
  tagName: 'dvk-performance-monitor',
  className: 'PerformanceMonitorElement',
  description: 'Development-time diagnostics overlay for FPS, pressure, long tasks, memory, and DOM inventory.',
  props: {
    collapsed: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Shows only the FPS and pressure summary when true. Persisted to localStorage.',
    },
  },
  events: [],
  parts: [
    'root',
    'header',
    'toggle',
    'pressure',
    'grid',
    'metric',
    'metric-label',
    'metric-value',
  ],
} satisfies DatavElementMetadata
