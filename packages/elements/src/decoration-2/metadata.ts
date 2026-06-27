import type { DatavElementMetadata } from '@datav-kit/core'

export const decoration2Metadata = {
  tagName: 'dv-decoration-2',
  className: 'Decoration2Element',
  description: 'Animated dotted line decoration inspired by DataV Vue3 Decoration3.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary point color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Animated point color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and animated point colors.',
    },
    pointSize: {
      type: 'number',
      default: 7,
      attribute: 'point-size',
      description: 'Base SVG size for each decoration point.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Enables point fill animation.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Pauses the point fill animation.',
    },
  },
  events: [
    {
      name: 'dv-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['graphic', 'point'],
} satisfies DatavElementMetadata
