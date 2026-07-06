import type { DatavElementMetadata } from '@datav-kit/core'

export const loadingEnergyMetadata = {
  tagName: 'dvk-loading-energy',
  className: 'LoadingEnergyElement',
  description: 'A restrained enterprise loading indicator with a compact status panel, data lanes, and subtle progress motion.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Status light, lane marker, and progress highlight color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Panel frame, header line, divider, and track color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated status and panel colors.',
    },
    size: {
      type: 'number',
      default: 72,
      attribute: true,
      description: 'Rendered SVG size in CSS pixels.',
    },
    strokeWidth: {
      type: 'number',
      default: 2,
      attribute: 'stroke-width',
      description: 'Panel frame and internal rule stroke width in SVG units.',
    },
    dur: {
      type: 'number',
      default: 1.9,
      attribute: true,
      description: 'Progress cycle duration in seconds. Lane and status-dot motion derive from this value.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Enables lane progress and status-dot animation.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Stops animation while keeping the static status panel visible.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: [
    'root',
    'graphic',
    'panel',
    'frame',
    'header-line',
    'divider',
    'status-dot',
    'data-lane',
    'lane-marker',
    'lane-track',
    'lane-progress',
    'tip',
  ],
} satisfies DatavElementMetadata
