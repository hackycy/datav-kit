import type { DatavElementMetadata } from '@datav-kit/core'

export const decoration1Metadata = {
  tagName: 'dvk-decoration-1',
  className: 'Decoration1Element',
  description: 'Animated bar decoration inspired by DataV Decoration6.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary bar color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary bar color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and secondary colors.',
    },
    barWidth: {
      type: 'number',
      default: 7,
      attribute: 'bar-width',
      description: 'Base SVG width for each animated bar.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Enables bar height animation.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Pauses the bar height animation.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['graphic', 'bar'],
} satisfies DatavElementMetadata
